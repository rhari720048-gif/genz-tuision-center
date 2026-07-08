import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { SecureAPIHandler } from '@/lib/SecureAPIHandler';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const quizSecurityHandler = new SecureAPIHandler('QUIZ_GEN_API', 30, 60000); // 30 per minute for Admin bulk tasks

export async function POST(request) {
  return quizSecurityHandler.execute(request, ['topic', 'count'], async (payload) => {
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

    let retries = 3;
    let delay = 2000;
    while (retries > 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        });
        const quizData = JSON.parse(response.text);
        return quizData;
      } catch (error) {
        if (error.message && error.message.includes("429") && retries > 1) {
          console.warn(`Gemini 429 hit. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          retries--;
          continue;
        }
        console.error("Gemini Error:", error);
        throw new Error(error.message || "Failed to generate quiz properly. Please try again.");
      }
    }
  });
}
