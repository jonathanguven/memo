import express from 'express';
import { supabase } from '../supabase.js';
import 'dotenv/config'

const router = express.Router();

router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select('username, created_at')
            .eq('username', username)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;