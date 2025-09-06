import { GoogleGenAI, Type } from "@google/genai";
import type { ReviewResult, ReviewerPersona } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "A score from 0 to 10.0, can have one decimal place." },
    verdict: { type: Type.STRING, description: "A final verdict like 'Accept with Minor Revisions', 'Major Revisions Required', etc." },
    originality: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Originality score from 0 to 10." },
        comment: { type: Type.STRING, description: "Brief comment on the paper's novelty." },
      },
    },
    plagiarism: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ['Clear', 'Possible Issues', 'High Similarity'], description: "Plagiarism status." },
        details: { type: Type.STRING, description: "Details about any potential plagiarism found." },
      },
    },
    citations: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ['Good', 'Needs Improvement'], description: "Citation quality status." },
        comment: { type: Type.STRING, description: "Comments on citation quality, missing citations, or formatting." },
      },
    },
    aiContentPercentage: { type: Type.NUMBER, description: "Estimated percentage of AI-generated content (0-100)." },
    sectionReviews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectionName: { type: Type.STRING, description: "Name of the paper section (e.g., 'Abstract', 'Introduction')." },
          clarity: { type: Type.STRING, description: "Feedback on the clarity of this section." },
          originality: { type: Type.STRING, description: "Feedback on the originality of this section." },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable suggestions for improvement for this section."
          },
        },
      },
    },
  },
};

const getPersonaInstruction = (persona: ReviewerPersona): string => {
    switch (persona) {
        case 'Strict':
            return "You are a highly critical and strict academic reviewer. Your feedback should be direct, pointing out flaws and demanding rigorous improvements. Your standards are exceptionally high.";
        case 'Friendly':
            return "You are a friendly and encouraging peer reviewer. Your feedback should be constructive and supportive, aiming to help the author improve their work while highlighting strengths.";
        case 'Expert':
        default:
            return "You are an expert academic reviewer in the paper's field. Your feedback should be balanced, insightful, and professional, focusing on the scientific merit, structure, and clarity of the work.";
    }
}


export const analyzePaper = async (paperText: string, persona: ReviewerPersona): Promise<ReviewResult> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `
    ${getPersonaInstruction(persona)}
    Your task is to analyze the provided research paper text.
    Evaluate each major section (Abstract, Introduction, Methods, Results, Conclusion, etc.).
    Provide a detailed review based on the following criteria: clarity, coherence, originality, and citation quality.
    Also, perform a plagiarism check against public knowledge and estimate the percentage of AI-generated content.
    You must provide your entire response in the JSON format defined by the provided schema. Do not include any markdown formatting like \`\`\`json.
  `;
  
  const prompt = `
    Please review the following research paper content:
    ---
    ${paperText}
    ---
    Provide your full analysis in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation to ensure the result matches the expected structure
    if (!result.overallScore || !result.sectionReviews) {
        throw new Error("Received an invalid or incomplete review from the AI.");
    }

    return result as ReviewResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI. The model may be overloaded or the input content is too long. Please try again later.");
  }
};
