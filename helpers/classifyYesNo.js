import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function classifyYesNo(text) {
  const res = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Does this WhatsApp message mean "yes" or "no"? Reply with exactly one word: yes or no.\n\nMessage: "${text}"`,
  });
  return res.text.trim().toLowerCase().startsWith('yes') ? 'yes' : 'no';
}
