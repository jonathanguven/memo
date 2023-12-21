// retrieve all public flashcard sets// grabs all flashcard sets of a user
import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.get('/flashcards', async (req, res) => {
    try {
        const { data: flashcardSets, error } = await supabase
            .from('flashcard_sets')
            .select(`*, users (id, username)`)
            .order('id', {ascending: true})
            .eq('is_private', false)

        if (error) throw error;
        // console.log(flashcardSets)
        res.json({ flashcardSets });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

export default router;