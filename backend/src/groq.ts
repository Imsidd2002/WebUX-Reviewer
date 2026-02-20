import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const listModels = async () => {
    try {
        const models = await groq.models.list();
        return models;
    } catch (error) {
        console.error("Error listing models:", error);
        return null;
    }
};

export const generateReview = async (websiteContent: any) => {
    const prompt = `
  You are an expert UX Reviewer. Analyze the following website content extracted via scraping.
  
  Content:
  Title: ${websiteContent.title}
  Headings: ${websiteContent.headings.join(', ')}
  Buttons: ${websiteContent.buttons.join(', ')}
  Main Text: ${websiteContent.mainText.substring(0, 4000)}

  Generate a UX review in JSON format with:
  1. uxScore (0-100)
  2. issues: Array of 8-12 objects { title, category, description, proof, suggestionBefore, suggestionAfter }
     Categories: Clarity, Layout, Navigation, Accessibility, Trust.
     Top 3 issues MUST have suggestionBefore and suggestionAfter. Others can be empty string.
  
  Strict JSON output only. No markdown.
  Structure:
  {
    "uxScore": 85,
    "issues": [
      {
        "title": "Low Contrast Text",
        "category": "Accessibility",
        "description": "The grey text on white background is hard to read.",
        "proof": "Footer text 'Copyright 2023'",
        "suggestionBefore": "color: #ccc;",
        "suggestionAfter": "color: #333;"
      }
    ]
  }
  `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful UX analysis assistant that outputs strictly valid JSON.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (!content) throw new Error('No content returned from Groq');

        return JSON.parse(content);
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
};
