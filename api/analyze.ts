// Import from CDN as Vercel Edge functions support ES modules.
// This avoids needing a package.json for this dependency.
import { GoogleGenAI, Type } from "https://aistudiocdn.com/@google/genai@^1.17.0";

// Import types from the existing file in the project root.
import type { ReviewResult, ReviewerPersona } from '../types';

export const config = {
  runtime: 'edge',
};

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
        required: ['score', 'comment'],
      },
      plagiarism: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['Clear', 'Possible Issues', 'High Similarity'], description: "Plagiarism status." },
          details: { type: Type.STRING, description: "Details about any potential plagiarism found." },
        },
        required: ['status', 'details'],
      },
      citations: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['Good', 'Needs Improvement'], description: "Citation quality status." },
          comment: { type: Type.STRING, description: "Comments on citation quality, missing citations, or formatting." },
        },
        required: ['status', 'comment'],
      },
      aiContentAnalysis: {
        type: Type.OBJECT,
        properties: {
            estimatedPercentage: { type: Type.NUMBER, description: "Overall estimated percentage of AI-generated content (0-100)." },
            flaggedPassages: {
                type: Type.ARRAY,
                description: "A list of passages that are potentially AI-generated.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        passage: { type: Type.STRING, description: "The specific text passage suspected of being AI-generated." },
                        reason: { type: Type.STRING, description: "A brief explanation for why this passage was flagged." },
                        confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "The confidence level of the detection." }
                    },
                    required: ['passage', 'reason', 'confidence']
                }
            }
        },
        required: ['estimatedPercentage', 'flaggedPassages']
      },
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
          required: ['sectionName', 'clarity', 'originality', 'suggestions'],
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

// Vercel Edge Function handler
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { paperText, persona } = await req.json();

    if (!paperText || !persona) {
        return new Response(JSON.stringify({ error: 'Missing paperText or persona in request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      console.error("API_KEY environment variable is not set.");
      return new Response(JSON.stringify({ error: 'Server configuration error: API key not found.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.5-flash';

    const systemInstruction = `
      ${getPersonaInstruction(persona)}
      Your task is to analyze the provided research paper text.
      Evaluate each major section (Abstract, Introduction, Methods, Results, Conclusion, etc.).
      Provide a detailed review based on the following criteria: clarity, coherence, originality, and citation quality.
      Also, perform a plagiarism check against public knowledge.
      Crucially, conduct a detailed analysis to detect AI-generated content. Instead of just a percentage, identify specific sentences or passages that exhibit AI-like patterns (e.g., generic phrasing, lack of depth, overly complex vocabulary, unnatural flow). For each passage you flag, provide the text, a reason for suspicion, and a confidence level (High, Medium, Low). Based on these findings, calculate an overall estimated percentage of AI-generated content.
      You must provide your entire response in the JSON format defined by the provided schema. Do not include any markdown formatting like \`\`\`json.
    `;
    
    const prompt = `
      Please review the following research paper content:
      ---
      ${paperText}
      ---
      Provide your full analysis in the specified JSON format.
    `;

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
    
    if (!result.overallScore || !result.sectionReviews || result.aiContentAnalysis === undefined) {
        throw new Error("Received an invalid or incomplete review from the AI.");
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: `Failed to get a valid response from the AI: ${message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}