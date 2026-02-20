import express from 'express';
import { supabase } from '../supabaseClient';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get('/', async (req, res) => {
    const status = {
        backend: 'ok',
        database: 'unknown',
        llm: 'unknown'
    };

    // Check Database
    try {
        const { error } = await supabase.from('reviews').select('count', { count: 'exact', head: true });
        if (!error) {
            status.database = 'ok';
        } else {
            status.database = `error: ${error.message}`;
        }
    } catch (e: any) {
        status.database = `error: ${e.message}`;
    }

    // Check LLM
    try {
        await groq.models.list(); // Simple lightweight call
        status.llm = 'ok';
    } catch (e: any) {
        status.llm = `error: ${e.message}`;
    }

    res.json(status);
});

export default router;
