import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { resumeData, jobDescription, companyName, roleTitle } = await req.json();

        if (!resumeData || !jobDescription) {
            return NextResponse.json({ error: 'Missing requirements' }, { status: 400 });
        }

        const prompt = `
            You are a world-class executive interview coach. 
            Analyze the following job description and the candidate's resume.
            Generate a list of 6 highly relevant interview questions tailored to THIS SPECIFIC CANDIDATE for THIS SPECIFIC ROLE.
            
            Structure the response as a JSON array of objects. Each object must have:
            - "question": The interview question.
            - "type": One of "Behavioral", "Technical", or "Cultural Fit".
            - "coaching": A brief tip on why this is being asked.
            - "star_outline": A suggested answer outline using the STAR method (Situation, Task, Action, Result) specifically citing experiences from the candidate's resume where possible.

            Job: ${roleTitle} at ${companyName}
            Description: ${jobDescription}
            
            Candidate Resume Data:
            ${JSON.stringify(resumeData)}

            Return ONLY the valid JSON array.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert recruitment coach. Provide answers in valid JSON format only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{"questions": []}'));
    } catch (error: any) {
        console.error('Interview generation error:', error);
        return NextResponse.json({ error: 'Failed to generate interview prep' }, { status: 500 });
    }
}
