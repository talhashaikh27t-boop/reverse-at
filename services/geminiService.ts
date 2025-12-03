import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Using 'gemini-2.5-flash-image' ("nano banana") as requested
const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Helper to strip the data URI prefix if present
 */
const stripBase64Header = (base64Str: string): string => {
  return base64Str.replace(/^data:image\/\w+;base64,/, "");
};

/**
 * Sends an image and a prompt to the model to generate a transformed image.
 */
export const transformImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const cleanBase64 = stripBase64Header(base64Image);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, works with PNG input usually
              data: cleanBase64,
            },
          },
        ],
      },
    });

    // Check for inlineData (image) in the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
      
      // Fallback: if only text is returned (sometimes happens on error or refusal)
      for (const part of parts) {
        if (part.text) {
          console.warn("Model returned text instead of image:", part.text);
          throw new Error("The model declined to generate an image. It might have violated safety policies.");
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
