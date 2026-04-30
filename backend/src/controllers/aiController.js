import Groq from "groq-sdk";
import con from "../config/connect.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ═══════════════════════════════════════════════
// FUNCTION CALLING TOOLS
// ═══════════════════════════════════════════════

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
  // ── NEW: List tasks ────────────────────────────────────────────
  {
    type: "function",
    function: {
      name: "list_tasks",
      description: "Liệt kê danh sách task của người dùng. Có thể lọc theo space, status, priority, hoặc assignee.",
      parameters: {
        type: "object",
        properties: {
          space_name: { type: "string", description: "Tên Space cần lọc (nếu có)." },
          status: { type: "string", description: "Lọc theo trạng thái: TO DO, IN PROGRESS, DONE, v.v." },
          priority: { type: "string", description: "Lọc theo mức ưu tiên: High, Medium, Low, Normal." },
          limit: { type: "number", description: "Số lượng task tối đa trả về, mặc định 20." },
        },
        required: [],
      },
    },
  },
  // ── NEW: Count tasks by status ─────────────────────────────────
  {
    type: "function",
    function: {
      name: "count_tasks_by_status",
      description: "Đếm số lượng task theo từng trạng thái (status) trong workspace hoặc một space cụ thể.",
      parameters: {
        type: "object",
        properties: {
          space_name: { type: "string", description: "Tên Space cần đếm (nếu trống sẽ đếm tất cả)." },
        },
        required: [],
      },
    },
  },
  // ── NEW: Find overdue tasks ────────────────────────────────────
  {
    type: "function",
    function: {
      name: "find_overdue_tasks",
      description: "Tìm các task đã quá hạn (due_date < hôm nay) mà chưa hoàn thành.",
      parameters: {
        type: "object",
        properties: {
          space_name: { type: "string", description: "Tên Space cần tìm (nếu trống sẽ tìm tất cả)." },
        },
        required: [],
      },
    },
  },
];

// ═══════════════════════════════════════════════
// TOOL HANDLERS
// ═══════════════════════════════════════════════

async function handleListTasks(userId, args) {
  let query = `
    SELECT t.task_id, t.name, t.due_date, t.completed_at,
           ts.status_name AS status, tp.priority_name AS priority,
           s.name AS space_name
    FROM tasks t
    JOIN lists l ON t.list_id = l.list_id
    JOIN spaces s ON l.space_id = s.space_id
    JOIN space_members sm ON s.space_id = sm.space_id AND sm.user_id = $1
    LEFT JOIN task_statuses ts ON t.status_id = ts.status_id
    LEFT JOIN task_priorities tp ON t.priority_id = tp.priority_id
    WHERE t.deleted_at IS NULL
  `;
  const params = [userId];
  let idx = 2;

  if (args.space_name) {
    query += ` AND LOWER(s.name) LIKE LOWER($${idx})`;
    params.push(`%${args.space_name}%`);
    idx++;
  }
  if (args.status) {
    query += ` AND LOWER(ts.status_name) = LOWER($${idx})`;
    params.push(args.status);
    idx++;
  }
  if (args.priority) {
    query += ` AND LOWER(tp.priority_name) = LOWER($${idx})`;
    params.push(args.priority);
    idx++;
  }

  query += ` ORDER BY t.created_at DESC LIMIT $${idx}`;
  params.push(args.limit || 20);

  const result = await con.query(query, params);
  return result.rows;
}

async function handleCountByStatus(userId, args) {
  let query = `
    SELECT COALESCE(ts.status_name, 'Không có trạng thái') AS status, COUNT(*)::int AS count
    FROM tasks t
    JOIN lists l ON t.list_id = l.list_id
    JOIN spaces s ON l.space_id = s.space_id
    JOIN space_members sm ON s.space_id = sm.space_id AND sm.user_id = $1
    LEFT JOIN task_statuses ts ON t.status_id = ts.status_id
    WHERE t.deleted_at IS NULL
  `;
  const params = [userId];
  let idx = 2;

  if (args.space_name) {
    query += ` AND LOWER(s.name) LIKE LOWER($${idx})`;
    params.push(`%${args.space_name}%`);
    idx++;
  }

  query += ` GROUP BY ts.status_name ORDER BY count DESC`;
  const result = await con.query(query, params);
  return result.rows;
}

async function handleFindOverdue(userId, args) {
  let query = `
    SELECT t.task_id, t.name, t.due_date,
           ts.status_name AS status, tp.priority_name AS priority,
           s.name AS space_name
    FROM tasks t
    JOIN lists l ON t.list_id = l.list_id
    JOIN spaces s ON l.space_id = s.space_id
    JOIN space_members sm ON s.space_id = sm.space_id AND sm.user_id = $1
    LEFT JOIN task_statuses ts ON t.status_id = ts.status_id
    LEFT JOIN task_priorities tp ON t.priority_id = tp.priority_id
    WHERE t.deleted_at IS NULL
      AND t.completed_at IS NULL
      AND t.due_date < NOW()
  `;
  const params = [userId];
  let idx = 2;

  if (args.space_name) {
    query += ` AND LOWER(s.name) LIKE LOWER($${idx})`;
    params.push(`%${args.space_name}%`);
    idx++;
  }

  query += ` ORDER BY t.due_date ASC LIMIT 30`;
  const result = await con.query(query, params);
  return result.rows;
}

// ═══════════════════════════════════════════════
// MAIN CHAT ENDPOINT
// ═══════════════════════════════════════════════

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
                4. Khi liệt kê task, hiển thị bảng Markdown với các cột: Tên task, Trạng thái, Ưu tiên, Hạn.
                5. Khi đếm task, trình bày số liệu rõ ràng, dễ hiểu.
                6. Khi tìm task quá hạn, cảnh báo và gợi ý hành động.
                
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

            // ── HANDLER: create_space ─────────────────────────────
            if (functionName === "create_space") {
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
            
            // ── HANDLER: create_task ──────────────────────────────
            if (functionName === "create_task") {
                 return res.status(200).json({ 
                    response: `✅ **Đã ghi nhận nhiệm vụ: ${functionArgs.title}**\\nVào Space: **${functionArgs.space_name}**`,
                    suggestions: ["Mở danh sách task"]
                });
            }

            // ── HANDLER: list_tasks ──────────────────────────────
            if (functionName === "list_tasks") {
                const tasks = await handleListTasks(userId, functionArgs);
                
                if (tasks.length === 0) {
                    const filterDesc = functionArgs.space_name ? ` trong Space "${functionArgs.space_name}"` : '';
                    return res.status(200).json({
                        response: `📋 Không tìm thấy task nào${filterDesc}. Bạn có muốn tạo task mới?`,
                        suggestions: ["Tạo task mới", "Xem tất cả Space"]
                    });
                }

                // Build Markdown table
                let table = `📋 **Danh sách ${tasks.length} task${functionArgs.space_name ? ` trong "${functionArgs.space_name}"` : ''}:**\n\n`;
                table += `| # | Tên task | Trạng thái | Ưu tiên | Hạn |\n`;
                table += `|---|---------|-----------|---------|-----|\n`;
                tasks.forEach((t, i) => {
                    const due = t.due_date ? new Date(t.due_date).toLocaleDateString('vi-VN') : '—';
                    table += `| ${i + 1} | ${t.name} | ${t.status || 'N/A'} | ${t.priority || 'Normal'} | ${due} |\n`;
                });

                return res.status(200).json({
                    response: table,
                    suggestions: ["Tìm task quá hạn", "Đếm task theo trạng thái", "Tạo task mới"]
                });
            }

            // ── HANDLER: count_tasks_by_status ───────────────────
            if (functionName === "count_tasks_by_status") {
                const counts = await handleCountByStatus(userId, functionArgs);
                
                if (counts.length === 0) {
                    return res.status(200).json({
                        response: `📊 Chưa có task nào${functionArgs.space_name ? ` trong Space "${functionArgs.space_name}"` : ''}.`,
                        suggestions: ["Tạo task mới", "Tạo Space mới"]
                    });
                }

                const total = counts.reduce((sum, c) => sum + c.count, 0);
                let report = `📊 **Thống kê ${total} task${functionArgs.space_name ? ` trong "${functionArgs.space_name}"` : ''}:**\n\n`;
                counts.forEach(c => {
                    const emoji = c.status === 'DONE' ? '✅' : c.status === 'IN PROGRESS' ? '🔄' : '📌';
                    const pct = ((c.count / total) * 100).toFixed(0);
                    report += `${emoji} **${c.status}**: ${c.count} task (${pct}%)\n`;
                });

                return res.status(200).json({
                    response: report,
                    suggestions: ["Xem danh sách task", "Tìm task quá hạn", "Tạo task mới"]
                });
            }

            // ── HANDLER: find_overdue_tasks ──────────────────────
            if (functionName === "find_overdue_tasks") {
                const overdue = await handleFindOverdue(userId, functionArgs);
                
                if (overdue.length === 0) {
                    return res.status(200).json({
                        response: `🎉 **Tuyệt vời!** Không có task nào quá hạn${functionArgs.space_name ? ` trong "${functionArgs.space_name}"` : ''}. Tiếp tục phát huy! 💪`,
                        suggestions: ["Xem danh sách task", "Đếm task theo trạng thái"]
                    });
                }

                let alert = `⚠️ **Cảnh báo: ${overdue.length} task quá hạn${functionArgs.space_name ? ` trong "${functionArgs.space_name}"` : ''}:**\n\n`;
                alert += `| # | Tên task | Trạng thái | Ưu tiên | Quá hạn từ |\n`;
                alert += `|---|---------|-----------|---------|----------|\n`;
                overdue.forEach((t, i) => {
                    const dueDate = new Date(t.due_date);
                    const daysOverdue = Math.ceil((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                    alert += `| ${i + 1} | ${t.name} | ${t.status || 'N/A'} | ${t.priority || 'Normal'} | ${daysOverdue} ngày |\n`;
                });
                alert += `\n🔥 Nên ưu tiên xử lý những task này ngay!`;

                return res.status(200).json({
                    response: alert,
                    suggestions: ["Xem tất cả task", "Đếm task theo trạng thái"]
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

// ═══════════════════════════════════════════════
// AI ASSIST ENDPOINTS (Phase 1)
// ═══════════════════════════════════════════════

/**
 * POST /api/v1/ai/generate-description
 * Body: { taskName: string }
 * Generates a task description based on the task name
 */
export const generateDescription = async (req, res) => {
    try {
        const { taskName } = req.body;
        if (!taskName) return res.status(400).json({ message: "taskName is required" });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Bạn là trợ lý AI chuyên viết mô tả task ngắn gọn, chuyên nghiệp cho ứng dụng quản lý dự án.
                    
QUY TẮC:
- Viết bằng tiếng Việt
- Mô tả ngắn gọn 2-4 câu
- Bao gồm: Mục tiêu chính, các bước cần làm (bullet points), tiêu chí hoàn thành
- Sử dụng format Markdown nhẹ (bold, bullet points)
- KHÔNG dùng heading (#), KHÔNG viết quá dài
- CHỈNH trả về mô tả, KHÔNG giải thích thêm`
                },
                {
                    role: "user",
                    content: `Viết mô tả task cho: "${taskName}"`
                }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 300,
            temperature: 0.7,
        });

        const description = completion.choices[0].message.content?.trim() || "";
        return res.status(200).json({ description });
    } catch (error) {
        console.error("AI Generate Description Error:", error);
        return res.status(500).json({ message: "Lỗi AI", error: error.message });
    }
};

/**
 * POST /api/v1/ai/suggest-priority
 * Body: { taskName: string, description?: string }
 * Suggests a priority level for the task
 */
export const suggestPriority = async (req, res) => {
    try {
        const { taskName, description } = req.body;
        if (!taskName) return res.status(400).json({ message: "taskName is required" });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Bạn là AI phân tích mức độ ưu tiên task. Dựa trên tiêu đề và mô tả task, trả về JSON với format:
{"priority": "High" | "Medium" | "Low" | "Normal", "reason": "Lý do ngắn gọn bằng tiếng Việt (1 câu)"}

Hướng dẫn phân tích:
- **High**: Lỗi nghiêm trọng (bug, crash, security), deadline gấp, ảnh hưởng nhiều người, từ khóa: urgent, critical, fix, khẩn cấp, quan trọng, lỗi
- **Medium**: Tính năng mới quan trọng, cải tiến hiệu suất, từ khóa: cải thiện, thêm, update, nâng cấp
- **Low**: Nice-to-have, UI tweaks, docs, từ khóa: chỉnh sửa nhỏ, cập nhật text, refactor
- **Normal**: Các task thông thường khác

CHỈ trả về JSON, KHÔNG giải thích thêm.`
                },
                {
                    role: "user",
                    content: `Task: "${taskName}"${description ? `\nMô tả: "${description}"` : ''}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 100,
            temperature: 0.3,
        });

        const raw = completion.choices[0].message.content?.trim() || '{}';
        
        // Parse JSON safely
        let parsed;
        try {
            // Try to extract JSON from the response
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
        } catch {
            parsed = { priority: "Normal", reason: "Không thể phân tích" };
        }

        return res.status(200).json({
            priority: parsed.priority || "Normal",
            reason: parsed.reason || ""
        });
    } catch (error) {
        console.error("AI Suggest Priority Error:", error);
        return res.status(500).json({ message: "Lỗi AI", error: error.message });
    }
};
