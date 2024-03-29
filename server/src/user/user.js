// grabs all flashcard sets of a user
import express from 'express';
import { supabase } from '../supabase.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const router = express.Router();

router.get('/user/:username', cookieParser(), async (req, res) => {
    try {
        const { username } = req.params;
        let self = false;
        let userId;

        const token = req.cookies.jwt;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
                if (decoded.username === username) {
                    self = true;
                }
            } catch (error) {
                console.error('Token verification error:', error.message);
            }
        }

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
                    is_private,
                    flashcards (
                        id,
                        front,
                        back,
                        parent
                    )
                )
            `)
            .eq('username', username)
            .single();

        if (!self) {
            query = query.filter('flashcard_sets.is_private', 'eq', false);
        }

        const { data, error } = await query;

        if (error) throw error;

        const response = { user: data, self };
        res.json(response);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
});

export default router;