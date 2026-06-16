const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple single message
async function askGemini(message) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(message);
    return result.response.text();
}

// Multi-turn chat with history
async function chatGemini(history, newMessage) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
        history: history.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }))
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
}

module.exports = { askGemini, chatGemini };
