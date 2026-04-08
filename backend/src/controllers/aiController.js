import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) return res.status(400).json({ message: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Contextual prompt to act like Flowise Brain
        const systemPrompt = "You are Flowise Brain, a powerful workspace assistant. You help users manage their projects, tasks, and spaces efficiently. Keep your responses professional and helpful.";
        
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ 
            response: text,
            suggestions: ["How can I create a task?", "Summarize my projects", "What are my deadlines?"]
        });
    } catch (error) {
        console.error("Gemini Error:", error);
        return res.status(500).json({ message: "AI services are currently unavailable", error: error.message });
    }
};
