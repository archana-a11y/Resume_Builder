import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let systemPrompt = "You are a professional resume writer and career coach.";

        if (type === 'summary') {
            systemPrompt += " Create a powerful 3-4 sentence professional summary based on the provided experience and skills. Keep it concise, high-impact, and tailored for a modern industry.";
        } else if (type === 'experience') {
            systemPrompt += " Enhance the following job experience entry. Use strong action verbs, quantify achievements where possible, and ensure it sounds professional and results-oriented. Provide 3-4 bullet points.";
        } else if (type === 'full') {
            systemPrompt += " Generate a complete resume structure based on the provided details. Output in JSON format with sections: summary, experience (array of objects), skills (array), and education (array).";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if preferred
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
    }
}
