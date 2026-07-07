import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { SecureAPIHandler } from '@/lib/SecureAPIHandler';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Limit chat to 10 requests per minute per IP
const chatSecurityHandler = new SecureAPIHandler('CHAT_API', 10, 60000);

export async function POST(request) {
  return chatSecurityHandler.execute(request, ['message', 'history'], async (payload) => {
    const { message, history } = payload;
    
    const systemInstruction = `You are an intelligent, friendly, and helpful AI tutor for GenZ Tuition Center. 
Your goal is to assist students with their studies, homework, exam preparation, and general knowledge.
Be polite, concise, and highly encouraging. Do not use overly complex vocabulary unless necessary.
Format your responses using markdown (bolding, lists) for better readability.
If a student asks something completely unrelated to education, kindly guide them back to learning.`;

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return { text: response.text };
  });
}
