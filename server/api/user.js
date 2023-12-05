import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
import { supabase } from '../supabase.js';
import 'dotenv/config'

const router = express.Router();

const secret = process.env.SECRET_KEY

router.get('/user', cookieParser(), async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, secret);
        const { data, error } = await supabase
            .from('users')
            .select('username, created_at')
            .eq('id', decoded.id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;