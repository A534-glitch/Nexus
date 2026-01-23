
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generate Smart Comment
 * Analyzes the product context to suggest a witty or helpful comment.
 */
export const generateSmartComment = async (title: string, description: string) => {
  const prompt = `Act as a curious college student on a campus marketplace. 
  The item is "${title}" described as "${description}". 
  Generate ONE very short (max 10 words) comment or question about this item. 
  Make it sound natural and student-like. Use an emoji.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text?.replace(/"/g, '') || "Is this still available? 😊";
  } catch (e) {
    return "Looks great! Is the price negotiable? 🙌";
  }
};

/**
 * Generate Quick Replies
 * Provides 3 short one-tap reply options.
 */
export const generateQuickReplies = async (title: string, description: string) => {
  const prompt = `Item: "${title}". Description: "${description}". 
  Generate exactly 3 very short student-style quick reply options (max 3 words each).
  Format as a JSON array of strings. Example: ["Is it available?", "Final price?", "Check DM"]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '["Available?", "Negotiable?", "Condition?"]');
  } catch (e) {
    return ["Available?", "Negotiable?", "Condition?"];
  }
};

/**
 * Peer-to-Peer Negotiation Simulation
 */
export const streamPeerResponse = async (
  peerName: string,
  userMessage: string, 
  history: {role: string, text: string}[], 
  onChunk: (text: string) => void
) => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview', 
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.text }] 
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: `You are ${peerName}, a student on the Nexus campus marketplace. You are currently negotiating a deal. 
        Behave like a real student: use casual language, occasional emojis, and be polite but firm about your price.`,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) onChunk(chunk.text);
    }
  } catch (error) {
    onChunk("Hey, my campus WiFi just cut out. Can you repeat that? 📡");
  }
};

/**
 * Standard AI Assistant Streaming
 */
export const streamChatResponse = async (
  userMessage: string, 
  history: {role: string, text: string}[], 
  onChunk: (text: string) => void
) => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview', 
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.text }] 
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: "You are the Nexus Assistant. Help students with notebooks and gadgets. Fast, friendly, concise.",
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) onChunk(chunk.text);
    }
  } catch (error) {
    onChunk("Signal lost. Reconnecting... 📡");
  }
};

export const analyzeProductImage = async (base64Image: string) => {
  const prompt = "Generate title, description, and fair INR price for this student item. Return JSON.";
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
  } catch (e) { return null; }
};

export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) { return null; }
};

export const decodeAudio = async (base64: string): Promise<AudioBuffer> => {
  const ctx = new AudioContext({ sampleRate: 24000 });
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const i16 = new Int16Array(bytes.buffer);
  const buf = ctx.createBuffer(1, i16.length, 24000);
  const data = buf.getChannelData(0);
  for (let i = 0; i < i16.length; i++) data[i] = i16[i] / 32768.0;
  return buf;
};
