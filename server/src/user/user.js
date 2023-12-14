import express from 'express';
import { supabase } from '../supabase.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const router = express.Router();

router.get('/user/:username', cookieParser(), async (req, res) => {
    let self = false;
    try {
        const { username } = req.params;

        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        let query = supabase
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
            .single();

        if (decoded && decoded.username === username) {
            query = query;
            self = true;
        } else {
            query = query.filter('flashcard_sets.is_private', 'eq', false)
        }

        const { data: user, error } = await query;
        console.log(user.flashcard_sets)

        if (error) throw error;

        res.json({ user, self });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
});

export default router;