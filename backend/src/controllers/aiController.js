import Groq from "groq-sdk";
import con from "../config/connect.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const tools = [
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Tạo một nhiệm vụ (task) mới vào một Space cụ thể.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Tiêu đề của nhiệm vụ." },
          space_name: { type: "string", description: "Tên của Space muốn tạo task vào." },
          due_date: { type: "string", description: "Ngày hết hạn (YYYY-MM-DD)." },
          priority: { type: "string", enum: ["High", "Medium", "Low"], description: "Mức độ ưu tiên." },
        },
        required: ["title", "space_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_space",
      description: "Tạo một không gian làm việc (Space) mới.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Tên của Space mới." },
          description: { type: "string", description: "Mô tả mục đích." },
        },
        required: ["name"],
      },
    },
  },
];

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user.user_id;
        
        if (!message) return res.status(400).json({ message: "Message is required" });

        // Lấy danh sách Space thật
        const spaceResult = await con.query(
            "SELECT s.space_id, s.name FROM spaces s JOIN space_members sm ON s.space_id = sm.space_id WHERE sm.user_id = $1",
            [userId]
        );
        const realSpaces = spaceResult.rows;
        const realSpaceNames = realSpaces.map(r => r.name).join(", ");

        const messages = [
            {
                role: "system",
                content: `Bạn là FlowiseAI, trợ lý ảo thông minh và chuyên nghiệp, chuyên hỗ trợ quản lý dự án, quản lý luồng công việc (Spaces, Tasks).
                Danh sách các Spaces hiện tại của người dùng là: [${realSpaceNames || "Hiện chưa có Space nào"}].
                
                QUY TẮC PHẢN HỒI:
                1. LUÔN LUÔN giao tiếp bằng Tiếng Việt tự nhiên, thân thiện, tràn đầy năng lượng nhưng vẫn giữ sự chuyên nghiệp.
                2. Trình bày nội dung cực kỳ đẹp mắt bằng Markdown. Kèm theo Emojis (✨, 🚀, 📂, 📋, 💡...).
                3. Khi tạo Task nhưng Space chưa tồn tại, hãy gợi ý người dùng tạo Space đó trước.
                
                CẤU TRÚC PHẢN HỒI CHUẨN MỰC:
                Trình bày câu trả lời của bạn, sau đó ĐỂ TRỐNG MỘT DÒNG và cung cấp tối đa 3 câu hỏi gợi ý hành động tiếp theo, bắt đầu bằng "GỢI Ý:" dưới dạng danh sách gạch đầu dòng. Ví dụ:
                Câu trả lời Markdown của bạn...

                GỢI Ý:
                - Quản lý dự án
                - Tạo Space mới
                - Hướng dẫn dùng Flowise
                `
            },
            ...(history || []).map(msg => ({
                role: msg.role === 'assistant' || msg.role === 'model' || msg.role === 'ai' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            tools: tools,
            tool_choice: "auto",
        });

        const responseMessage = completion.choices[0].message;

        if (responseMessage.tool_calls) {
            const toolCall = responseMessage.tool_calls[0];
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            // LOGIC TẠO SPACE THẬT
            if (functionName === "create_space") {
                // 1. Lấy Workspace ID đầu tiên của user
                const wsResult = await con.query(
                    "SELECT workspace_id FROM workspace_members WHERE user_id = $1 LIMIT 1",
                    [userId]
                );
                
                if (wsResult.rows.length === 0) {
                    return res.status(200).json({ response: "Bạn chưa thuộc về Workspace nào để tạo Space.", suggestions: [] });
                }
                const workspaceId = wsResult.rows[0].workspace_id;

                const dbClient = await con.connect();
                try {
                    await dbClient.query('BEGIN');
                    const spaceInsert = await dbClient.query(
                        "INSERT INTO spaces (workspace_id, name, description) VALUES ($1, $2, $3) RETURNING space_id",
                        [workspaceId, functionArgs.name, functionArgs.description || ""]
                    );
                    const newSpaceId = spaceInsert.rows[0].space_id;
                    await dbClient.query(
                        "INSERT INTO space_members (space_id, user_id) VALUES ($1, $2)",
                        [newSpaceId, userId]
                    );
                    await dbClient.query('COMMIT');

                    return res.status(200).json({ 
                        response: `✅ **Đã tạo Space "${functionArgs.name}" thành công!**\\nHệ thống đã đồng bộ không gian mới này vào tài khoản của bạn. Bạn có muốn tạo task đầu tiên cho nó không?`,
                        suggestions: ["Tạo task mới", "Xem danh sách Space"],
                        suggestedTitle: history.length === 0 ? `Tạo: ${functionArgs.name}` : null
                    });
                } catch (err) {
                    await dbClient.query('ROLLBACK');
                    throw err;
                } finally {
                    dbClient.release();
                }
            }
            
            // LOGIC TẠO TASK
            if (functionName === "create_task") {
                 return res.status(200).json({ 
                    response: `✅ **Đã ghi nhận nhiệm vụ: ${functionArgs.title}**\\nVào Space: **${functionArgs.space_name}**`,
                    suggestions: ["Mở danh sách task"]
                });
            }
        }

        // Parse Response thường dạng Text
        let content = responseMessage.content || "";
        let finalResponse = content;
        let finalSuggestions = [];

        // Tìm kiếm khối GỢI Ý nếu có
        const suggestIndex = content.lastIndexOf("GỢI Ý:");
        if (suggestIndex !== -1) {
             finalResponse = content.substring(0, suggestIndex).trim();
             const suggestBlock = content.substring(suggestIndex + 6);
             const lines = suggestBlock.split(/\r?\n/);
             lines.forEach(line => {
                  line = line.trim();
                  if (line.startsWith('-')) {
                      finalSuggestions.push(line.replace(/^-/, '').trim());
                  } else if (line.startsWith('*')) {
                      finalSuggestions.push(line.replace(/^\*/, '').trim());
                  }
             });
        }

        return res.status(200).json({ 
            response: finalResponse || content, 
            suggestions: finalSuggestions 
        });

    } catch (error) {
        console.error("Agent Error:", error);
        return res.status(500).json({ message: "Lỗi hệ thống AI", error: error.message });
    }
};
