import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { SecureAPIHandler } from '@/lib/SecureAPIHandler';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const quizSecurityHandler = new SecureAPIHandler('QUIZ_GEN_API', 5, 60000); // 5 per minute

export async function POST(request) {
  return quizSecurityHandler.execute(request, ['topic', 'context', 'count'], async (payload) => {
    const { topic, context, count } = payload;
    
    const systemInstruction = `You are an expert educational content creator.
Your task is to generate multiple-choice questions (MCQs) for a quiz.
The user will provide a 'topic', an optional 'context' (like notes or a paragraph), and the 'count' of questions needed.

You MUST respond strictly in the following JSON format. Do not add markdown blocks like \`\`\`json. Just the raw JSON object.
{
  "title": "A catchy title for the quiz based on the topic",
  "questions": [
    {
      "question": "The question text",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct": "A" // or B, C, D
    }
  ]
}
`;

    const prompt = `Topic: ${topic}\nNumber of Questions: ${count}\nContext (optional): ${context}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    });

    try {
      const quizData = JSON.parse(response.text);
      return quizData;
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", e);
      throw new Error("Failed to generate quiz properly. Please try again.");
    }
  });
}
