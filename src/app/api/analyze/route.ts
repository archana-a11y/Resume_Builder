import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { resumeContent, jobDescription } = await req.json();

        if (!resumeContent || !jobDescription) {
            return NextResponse.json({ error: 'Resume content and job description are required' }, { status: 400 });
        }

        const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter. 
        Your task is to analyze a candidate's resume against a specific job description.
        
        Provide a detailed analysis in raw JSON format (no markdown, no code blocks) with the following structure:
        {
          "score": number (0-100),
          "matchAnalysis": "A brief overall summary of the match",
          "missingKeywords": ["keyword1", "keyword2", ...],
          "criticalFixes": ["fix1", "fix2", ...],
          "optimizationSuggestions": ["suggestion1", "suggestion2", ...],
          "highlightedSkills": ["skill1", "skill2", ...] 
        }
        
        Guidelines:
        - Be objective and critical.
        - Focus on keywords, formatting potential issues, and experience alignment.
        - High scores (85+) should only be given to near-perfect matches.
        - Critical fixes should address missing requirements or poor phrasing.`;

        const userPrompt = `
        RESUME CONTENT:
        ${JSON.stringify(resumeContent)}

        JOB DESCRIPTION:
        ${jobDescription}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        const content = response.choices[0].message.content;

        return NextResponse.json(JSON.parse(content || "{}"));
    } catch (error: any) {
        console.error('ATS Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to analyze resume' }, { status: 500 });
    }
}
