
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function check() {
    console.log("Checking Groq...");
    try {
        const models = await groq.models.list();
        console.log("Groq OK. Models:", models.data.length);
    } catch (e: any) {
        console.error("Groq Failed:", e.message);
    }
}

check();
