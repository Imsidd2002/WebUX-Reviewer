import express from 'express';
import { scrapeWebsite } from '../scraper';
import { generateReview } from '../groq';
import { supabase } from '../supabaseClient';

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // 1. Scrape
        const scrapedData = await scrapeWebsite(url);

        // 2. Generate Review
        const uxReview = await generateReview(scrapedData);

        // 3. Store in DB
        const { data: insertData, error: insertError } = await supabase
            .from('reviews')
            .insert([
                {
                    url,
                    extracted_content: scrapedData,
                    ux_review: uxReview
                }
            ])
            .select();

        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            // We still return the review even if save fails, but log it.
        }

        // 4. Cleanup old reviews (Keep last 5)
        // First, get count or list, then delete older.
        const { data: reviews, error: fetchError } = await supabase
            .from('reviews')
            .select('id, created_at')
            .order('created_at', { ascending: false });

        if (reviews && reviews.length > 5) {
            const idsToDelete = reviews.slice(5).map((r: any) => r.id);
            if (idsToDelete.length > 0) {
                await supabase.from('reviews').delete().in('id', idsToDelete);
            }
        }

        res.json({
            ...scrapedData,
            review: uxReview,
            id: insertData ? insertData[0]?.id : null
        });

    } catch (error: any) {
        console.error('Review Process Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// GET recent reviews
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Review not found' });

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
