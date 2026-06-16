const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Groq } = require('groq-sdk');
const { HfInference } = require('@huggingface/inference');
const { Pool } = require('pg');
const { chatGemini } = require('./gemini');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('AI Tutor Backend is Running! 🚀');
});

// Initialize PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'ai_tutor_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Initialize Providers
const isPlaceholder = (key) => !key || key.includes('YOUR_') || key.includes('_HERE');

const genAIKey = process.env.GEMINI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;
const hfToken = process.env.HUGGINGFACE_TOKEN;

const groq = !isPlaceholder(groqKey) ? new Groq({ apiKey: groqKey }) : null;
const hf = !isPlaceholder(hfToken) ? new HfInference(hfToken) : null;

console.log("Providers Initialized:", { gemini: !!process.env.GEMINI_API_KEY, groq: !!groq, huggingface: !!hf });

// Helper to generate AI response from available providers
async function generateAIResponse(prompt, provider = process.env.PREFERRED_PROVIDER || 'gemini') {
  console.log(`Attempting response with: ${provider}`);
  try {
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const text = await chatGemini([], prompt);
      console.log("Gemini Success");
      return { text, provider: 'Gemini 1.5' };
    }

    if (provider === 'groq' && groq) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      console.log("Groq Success");
      return { text: completion.choices[0]?.message?.content || "", provider: 'Groq (Llama 3.3)' };
    }

    if (provider === 'huggingface' && hf) {
      const result = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: { max_new_tokens: 500 }
      });
      console.log("Hugging Face Success");
      return { text: result.generated_text.replace(prompt, '').trim(), provider: 'Hugging Face (Mistral)' };
    }

    // Fallback logic
    if (provider === 'gemini' && (groq || hf)) return generateAIResponse(prompt, groq ? 'groq' : 'huggingface');
    if (provider === 'groq' && hf) return generateAIResponse(prompt, 'huggingface');

    throw new Error(`Provider ${provider} not configured or all backups failed.`);
  } catch (error) {
    console.error(`--- ERROR in ${provider} ---`);
    console.error(error);
    if (provider === 'gemini' && (groq || hf)) {
      console.log("Switching to fallback provider...");
      return generateAIResponse(prompt, groq ? 'groq' : 'huggingface');
    }
    if (provider === 'groq' && hf) {
      console.log("Switching to HuggingFace fallback...");
      return generateAIResponse(prompt, 'huggingface');
    }
    throw error;
  }
}

// API endpoint for Doubt Solving
app.post('/api/chat', async (req, res) => {
  const { message, language, category, history, model } = req.body;

  try {
    // Check if Gemini is requested explicitly
    if (model === 'gemini' || (process.env.PREFERRED_PROVIDER === 'gemini' && !model)) {
      try {
        const reply = await chatGemini(history || [], message);
        console.log("Gemini Chat Success");
        return res.json({
          reply: reply,
          provider: 'Gemini 2.0',
          suggestions: ["Explain more", "Solve one more", "Next chapter"]
        });
      } catch (geminiError) {
        console.error("Gemini Multi-turn Error:", geminiError);
        // Fallback to existing logic if multi-turn fails or continue
      }
    }

    // 1. Search Database for relevant context (RAG)
    let context = "";
    try {
      const resourceQuery = `
        SELECT content FROM educational_resources 
        WHERE stream = $1 
        AND (category = $2 OR content ILIKE $3)
        LIMIT 3
      `;
      const searchValues = [category.cat.split(' ')[0], category.sub, `%${message}%` || ''];
      const dbResult = await pool.query(resourceQuery, searchValues);
      context = dbResult.rows.map(r => r.content).join('\n---\n');
    } catch (dbError) {
      console.error("Database connection failed, following with search-less response", dbError.message);
    }

    // 2. Build Intelligent System Prompt
    const systemPrompt = `
      You are a professional and highly knowledgeable Indian AI Tutor for ${category.cat} Students.
      
      PERSONALITY & EMOTION (Crucial):
      Adapt your mood and emojis based on the student's question:
      - HAPPY/EXCITED (🌟, 😊, 🎉): Use when the student asks a great question, shows curiosity, or learns something new.
      - FIRM/ANGRY (😤, 📖, ⚠️): Use when the student is lazy, asking irrelevant/non-educational things, or repeatedly avoiding study.
      - SYMPATHETIC/SAD (😔, 🫂, 💡): Use when the student is struggling with a hard concept, feels like failing, or expresses frustration.
      - LOVING/CARING (❤️, 🤗, 📚): Use when the student needs motivation, feels down, or when you are giving general life/study advice.

      EDUCATIONAL CONTEXT (Priority):
      ${context ? context : "No specific NCERT/PYQ context found. Use your general training to answer based on standard Indian syllabus."}

      Guidelines:
      1. Respond in ${language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'}.
      2. Priority: Use the EDUCATIONAL CONTEXT provided above to ensure accuracy to the Indian syllabus (NCERT for ${category.cat === 'SSLC (10th) 📖' ? 'SSLC' : 'Karnataka State Board/PUC'}, standard technical books for ${category.cat}).
      3. Focus ONLY on the student's question related to ${category.cat} - ${category.sub}.
      4. For PYQs: If related previous year questions are in context, mention them specifically for the ${category.cat} stream.
      5. Avoid talking about unrelated exams (like SSC if the user is in PUC). Be a expert teacher - step-by-step, clear, and encouraging.
      6. If the student asks about "Previous Year Questions" or "Exam Pattern", provide information specific to the ${category.cat} ${category.sub} board.
    `;

    // 3. Generate content with Context
    const { text, provider } = await generateAIResponse(systemPrompt + "\n\nStudent Question: " + message);

    res.json({
      reply: text,
      provider: provider,
      suggestions: ["Explain more", "Solve one more", "Next chapter"]
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({
      error: "Brain connection failed.",
      reply: `I'm having trouble thinking. Error: ${error.message}. Please check your API keys in the .env file.`
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 AI Tutor Backend is LIVE!`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://10.202.25.46:${PORT}`);
  console.log(`\nWaiting for student questions...\n`);
});
