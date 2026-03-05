import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  console.log("AI Engine initialized. API Key present:", !!process.env.GEMINI_API_KEY);

  app.use(express.json());

  // Diagnosis API Endpoint
  app.post("/api/analyze", async (req, res) => {
    const { symptoms } = req.body;
    console.log("Received diagnosis request for symptoms:", symptoms);

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    try {
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not defined in the environment");
        return res.status(500).json({ error: "API Key is missing. Please set it in the Secrets panel." });
      }

      const model = "gemini-3-flash-preview";
      console.log("Calling Gemini API with model:", model);
      const systemInstruction = `You are a professional medical assistant AI. 
      Your task is to analyze user-reported symptoms and provide a structured assessment.
      
      CRITICAL RULES:
      1. ALWAYS include a disclaimer that you are an AI and not a doctor.
      2. If symptoms suggest a life-threatening emergency (e.g., chest pain, severe difficulty breathing, stroke symptoms), set urgency to "Emergency" and advise immediate ER visit.
      3. Provide possible conditions with likelihoods.
      4. Suggest basic precautions and advice.
      5. Use a professional, calm, and empathetic tone.
      
      Output MUST be in JSON format matching the provided schema.`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Analyze these symptoms: ${symptoms}` }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              possibleConditions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    likelihood: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "likelihood", "description"]
                }
              },
              precautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              advice: { type: Type.STRING },
              urgency: { type: Type.STRING, enum: ["Routine", "Urgent", "Emergency"] }
            },
            required: ["possibleConditions", "precautions", "advice", "urgency"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      console.log("Successfully analyzed symptoms. Urgency:", result.urgency);
      res.json(result);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ error: "Failed to analyze symptoms. Please try again later." });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      api_key_present: !!process.env.GEMINI_API_KEY
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
