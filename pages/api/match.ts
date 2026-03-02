import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Debug: Check if API key is available
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("[DEBUG] API Key available:", !!apiKey);
    console.log("[DEBUG] API Key length:", (apiKey && apiKey.length) || 0);
    
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "GOOGLE_API_KEY not found in environment variables. Please check your .env.local file." });
    }

    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const resumeFile = files.resume && files.resume[0];
    const jobDescription = fields.jobDescription && fields.jobDescription[0];

    if (!resumeFile) {
      return res.status(400).json({ success: false, error: "No resume file provided." });
    }
    
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ success: false, error: "Job description is too short." });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(fs.readFileSync(resumeFile.filepath));
    const resumeText = pdfData.text.trim();

    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({ success: false, error: "Could not extract text from PDF." });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert technical recruiter. Analyze this resume against the job description and provide a structured JSON response with the following format:

{
  "match_score": number between 0-100,
  "matching_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "verdict": "brief assessment",
  "experience_alignment": "Strong" or "Moderate" or "Weak",
  "recommendation": "Strong Hire" or "Consider" or "Pass"
}

=== RESUME ===
${resumeText.slice(0, 10000)} 

=== JOB DESCRIPTION ===
${jobDescription.slice(0, 5000)}

Please analyze and provide ONLY the JSON response, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let data;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      data = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to parse AI response. Please try again.",
        rawResponse: text
      });
    }

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error("[matchResumeAction error]", err);
    
    // More specific error handling
    const errorMessage = (err && err.message) || String(err);
    
    if (errorMessage.includes('API key')) {
      return res.status(500).json({ success: false, error: `API Key Error: ${errorMessage}` });
    }
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return res.status(500).json({ success: false, error: `API Quota Error: ${errorMessage}` });
    }
    if (errorMessage.includes('model')) {
      return res.status(500).json({ success: false, error: `Model Error: ${errorMessage}` });
    }
    
    res.status(500).json({ success: false, error: `AI Error: ${errorMessage}` });
  }
}
