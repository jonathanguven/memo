import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { supabase } from '../supabase.js';

const secret = process.env.JWT_SECRET;

const router = express.Router();

router.post('/login', express.json(), async (req, res) => {
    const { username, password, remember } = req.body;

    try {
        const login = await handleLogin(username, password, remember);

        if (login.error) 
            return res.status(401).json({ message: login.error });
        
        const maxAge = req.body.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        res.cookie('jwt', login.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'None',
            maxAge: maxAge,
        })
        res.json({ message: 'Login successful!', username });
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

export async function handleLogin(username, password, remember) {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, password')
        .eq('username', username)
        .single();

    if (error || !data) {
        return { error: 'Invalid username or password' };
    }

    const valid = await bcrypt.compare(password, data.password);

    if (valid) {
        const expire = remember ? '7d' : '1d';
        const token = jwt.sign(
            { id: data.id, username: username }, 
            secret, 
            { expiresIn: expire }
        );

        return { token };
    } else {
        return { error: 'Invalid username or password' };
    }
}

export default router;