import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { resumeData, jobDescription } = await req.json();

        if (!resumeData || !jobDescription) {
            return NextResponse.json({ error: 'Resume data and job description are required' }, { status: 400 });
        }

        const systemPrompt = `You are a professional career coach and expert cover letter writer. 
        Your goal is to write a highly persuasive, professional, and tailored cover letter.
        
        Guidelines:
        1. Use the provided resume data to highlight relevant skills and experiences.
        2. Tailor the content specifically to the job description provided.
        3. Keep it to 3-4 paragraphs.
        4. Tone should be professional yet enthusiastic.
        5. Use a modern, high-impact writing style.
        6. Do NOT use generic placeholders like [Company Name] if the information is available or can be inferred, but use them if it's missing.
        7. Focus on the value the candidate brings to the specific role.`;

        const userPrompt = `
        RESUME DATA:
        ${JSON.stringify(resumeData)}

        JOB DESCRIPTION:
        ${jobDescription}

        Please generate the cover letter now.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error('OpenAI Cover Letter Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate cover letter' }, { status: 500 });
    }
}
