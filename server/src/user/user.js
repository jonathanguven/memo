import express from 'express';
import { supabase } from '../supabase.js';
import 'dotenv/config'

const router = express.Router();

router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const { data: user, error } = await supabase
            .from('users')
            .select(`
                id, 
                username, 
                created_at,
                flashcard_sets (
                    id,
                    title,
                    description,
                    created_at,
                    is_private
                )
            `)
            .eq('username', username)
            .single()
            .filter('flashcard_sets.is_private', 'eq', false);

            console.log(user.flashcard_sets)

        if (error) throw error;

        res.json({user});
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;