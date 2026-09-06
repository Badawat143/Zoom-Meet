import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate intelligent member speech answer
  app.post("/api/member-answer", async (req, res) => {
    try {
      const { 
        memberName, 
        memberRole, 
        memberGender, 
        meetingTopic, 
        question, 
        isHindi 
      } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.json({ 
          fallback: true,
          answer: null,
          message: "Gemini API key not configured, will use smart built-in responses." 
        });
      }

      const systemPrompt = `You are roleplaying as "${memberName}", an attendee in an online video meeting (Zoom / Google Meet).
Role: ${memberRole || 'Team Member'}
Gender: ${memberGender || 'neutral'}
Meeting Topic: "${meetingTopic || 'Team Collaboration'}"

Instructions:
1. Respond directly and accurately to the user's question as ${memberName}.
2. Keep your answer conversational, realistic, concise, and professional (1 to 2 sentences maximum, suitable for speaking out loud in a live video call).
3. If the user asks in Hindi or Hinglish, answer in fluent, natural Hindi (Devanagari script or conversational Hindi).
4. If the user asks in English, answer in natural fluent English.
5. Sound like a real colleague or executive in this meeting (no markdown formatting, no emojis in spoken text, no bullet points).`;

      // Resilient model cascade: try primary, then fallback if experiencing high demand (503)
      const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const modelName of candidateModels) {
        // Attempt with short retry on 503/429
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: `Question from colleague in meeting: "${question}"`,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
              },
            });

            const replyText = response.text?.trim() || "";
            if (replyText) {
              return res.json({ 
                success: true, 
                answer: replyText,
                speaker: memberName,
                model: modelName
              });
            }
          } catch (modelErr: any) {
            lastError = modelErr;
            const errMsg = String(modelErr?.message || "");
            const isDemandOrRateLimit = errMsg.includes("503") || 
                                       errMsg.includes("UNAVAILABLE") || 
                                       errMsg.includes("high demand") || 
                                       errMsg.includes("429");
            if (isDemandOrRateLimit && attempt === 0) {
              // Wait briefly before 2nd attempt or switching model
              await new Promise((r) => setTimeout(r, 400));
              continue;
            }
            // Move to next candidate model
            break;
          }
        }
      }

      console.warn("All Gemini models temporarily busy, defaulting to smart conversational engine:", lastError?.message || "unavailable");
      return res.json({ 
        fallback: true, 
        error: lastError?.message || "High demand", 
        answer: null 
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.json({ 
        fallback: true, 
        error: err.message, 
        answer: null 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
