# Professional Setup Guide: AI Tutor India Knowledge Base

I have designed a architecture that makes your AI "search inside" NCERT and Previous Year Questions (PYQs) while acting as a "Meta-AI" aggregator.

## 1. How to create the Database in pgAdmin
1.  **Open pgAdmin** and connect to your PostgreSQL server.
2.  Right-click on **Databases** > **Create** > **Database...** and name it `ai_tutor_db`.
3.  Right-click on `ai_tutor_db` > **Query Tool**.
4.  Copy the content of [database_setup.sql](file:///c:/Users/ASUS/AIforEngineers/ai-edu-agent/backend/database_setup.sql) into the tool and click **Execute (F5)**.
    *   This creates 4 tables: `users`, `chats`, `educational_resources`, and `messages`.

## 2. How to store 10 Year PYQs and Syllabus
You should use the `educational_resources` table. Here is how to insert data:


### Example: Storing a 2023 SSLC Math Question
```sql
INSERT INTO educational_resources (stream, category, resource_type, year, content, language)
VALUES (
    'SSLC', 
    'Mathematics', 
    'PYQ', 
    2023, 
    'Question: Find the roots of x^2 + 5x + 6 = 0. Solution: (x+2)(x+3)=0, x=-2,-3.', 
    'kn' -- Set to 'kn' for Kannada
);
```

### Strategic Recommendation for PDFs:
Don't copy the whole PDF. Instead, convert the PDF to text, and for each chapter or question, create one row in the table. This makes it easier for the AI to find the right part.

## 3. The "Meta-AI" Aggregator Logic
To give the "best answer" from multiple AI models (Gemini, ChatGPT, Claude) without paying for 5 different subscriptions:
1.  We use **Gemini 1.5 Pro** as the "Master Brain".
2.  We give it a **System Prompt** that tells it: *"Search these databases first, and only give as answer if it matches NCERT / Syllabus standards."*
3.  I have already updated your [server.js](file:///c:/Users/ASUS/AIforEngineers/ai-edu-agent/backend/server.js) with this professional prompt.

## 4. Merging Multiple Tables
In the `educational_resources` table, the `stream` column acts as the "merger". When a student selects "NEET", the backend only searches for rows where `stream = 'NEET'`. This keeps the data clean and accurate for each student.

**Ready to connect your Code to PostgreSQL?** I can implement the `pg` connection logic now if you approve the [implementation_plan.md](file:///C:/Users/ASUS/.gemini/antigravity/brain/789371e7-550f-43d9-96f4-aac5d9339afb/implementation_plan.md).
