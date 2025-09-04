
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Do NOT hardcode the API key in the code.
// The key MUST be provided via the `process.env.API_KEY` environment variable.
// The build environment is responsible for setting this variable.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("Gemini API key not found in environment variables (process.env.API_KEY). Gemini features will be disabled.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. Please provide an API key.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
        topK: 32,
        topP: 1,
      }
    });
    
    return response.text;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Could not get a response from Gemini AI.");
  }
};
