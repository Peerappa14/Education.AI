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
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        console.log("Incoming History:");
        console.log(JSON.stringify(history, null, 2));

        const safeHistory = (history || [])
            .filter(msg => msg && msg.content)
            .filter(msg => msg.role === "user");

        const chat = model.startChat({
            history: safeHistory.map(msg => ({
                role: "user",
                parts: [{ text: msg.content }]
            }))
        });

        const result = await chat.sendMessage(newMessage);

        return result.response.text();

    } catch (error) {
        console.error("========== GEMINI ERROR ==========");
        console.error(error);
        console.error(error.stack);
        throw error;
    }
}
// async function chatGemini(history, newMessage) {
//     try {
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.0-flash"
//         });

//         const chat = model.startChat({
//             history: history.map(msg => ({
//                 role: msg.role === "assistant" ? "model" : "user",
//                 parts: [{ text: msg.content }]
//             }))
//         });

//         const result = await chat.sendMessage(newMessage);
//         return result.response.text();

//     } catch (error) {
//         console.error("Gemini Error:", error);
//         throw error;
//     }
// }

module.exports = { askGemini, chatGemini };
