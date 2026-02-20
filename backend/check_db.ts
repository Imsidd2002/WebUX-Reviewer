
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

console.log("Checking Supabase connection...");

async function runCheck() {
    try {
        const { data, error } = await supabase.from('reviews').select('*').limit(1);
        if (error) {
            console.error("Supabase Error:", JSON.stringify(error, null, 2));
        } else {
            console.log("Supabase Connection OK. Reviews Count:", data?.length);
        }
    } catch (e: any) {
        console.error("Exception:", e);
    }
}

runCheck();
