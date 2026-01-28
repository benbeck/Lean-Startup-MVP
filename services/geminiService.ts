
import { GoogleGenAI, Type } from "@google/genai";
import { CanvasData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const canvasSchema = {
  type: Type.OBJECT,
  properties: {
    tam: { type: Type.STRING },
    hypothesis: { type: Type.STRING },
    problems: { type: Type.STRING },
    alternatives: { type: Type.STRING },
    solution: { type: Type.STRING },
    metrics: { type: Type.STRING },
    uvp: { type: Type.STRING },
    concept: { type: Type.STRING },
    advantage: { type: Type.STRING },
    channels: { type: Type.STRING },
    segments: { type: Type.STRING },
    adopters: { type: Type.STRING },
    costs: { type: Type.STRING },
    revenue: { type: Type.STRING }
  },
  required: [
    'tam', 'hypothesis', 'problems', 'alternatives', 'solution', 'metrics', 'uvp', 'concept', 
    'advantage', 'channels', 'segments', 'adopters', 'costs', 'revenue'
  ]
};

export const generateCanvasSuggestions = async (prompt: string): Promise<Partial<CanvasData>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a complete Lean Startup MVP Roadmap strategy for: ${prompt}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: canvasSchema,
        systemInstruction: `You are a world-class startup strategist. 
        
        FORMATTING RULES:
        1. Every numbered list item MUST be on its own new line. Use a clean "1. ", "2. " format.
        2. Do NOT group multiple points into a single paragraph. 
        
        RESEARCH & SOURCES:
        1. For 'Total Addressable Market', 'Problems', and 'Existing Alternatives', you MUST include specific facts or data points.
        2. You MUST include at least one source for these sections.
        3. SOURCES MUST BE FULL VISIBLE URLs (e.g., https://www.statista.com/...). This allows users to click the link directly in the PDF or on the site.
        
        TONE:
        Professional, data-backed, and high-impact.`
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
