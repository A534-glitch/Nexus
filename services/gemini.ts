
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeProductImage = async (base64Image: string) => {
  const ai = getAIClient();
  const prompt = "Analyze this image of a student product (gadget or notebook). Suggest a professional product title, a detailed description highlighting its features, and a reasonable price in Indian Rupees (INR) for a student marketplace. Return JSON.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER }
          },
          required: ["title", "description", "suggestedPrice"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return null;
  }
};

export const getBargainAdvice = async (productTitle: string, originalPrice: number, userOffer: number) => {
  const ai = getAIClient();
  const prompt = `A student wants to buy "${productTitle}" originally priced at ₹${originalPrice}. Their offer is ₹${userOffer}. Provide 3 short, professional bargaining points or a counter-offer suggestion to help them negotiate fairly.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Bargain Error:", error);
    return "The AI assistant is currently unavailable. Try a friendly negotiation based on the condition of the item!";
  }
};

export const getChatResponse = async (context: string, lastMessage: string, senderName: string) => {
  const ai = getAIClient();
  const prompt = `You are ${senderName}, a university student selling an item on Nexus. A peer sent you this message: "${lastMessage}".
  The context of the chat is: ${context}.
  Respond as a friendly, professional student. Keep it short (max 2 sentences) and helpful.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sure! Let me check and get back to you.";
  }
};
