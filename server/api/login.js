import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY
const secret = process.env.SECRET_KEY

const supabase = createClient(url, key);
const router = express.Router();

router.post('/login', express.json(), async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('password')
            .eq('username', username)
            .single();
        
        if (error || !data) {
            return res.status(401).json({ message: 'Invalid username or password' });                 
        }

        const valid = await bcrypt.compare(password, data.password);

        if (valid) {
            const expire = req.body.remember ? '7d' : '1d';
            const token = jwt.sign(
                { userId: data.id, username: username }, 
                secret, 
                { expiresIn: expire }
            );

            const maxAge = req.body.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
            res.cookie('jwt', token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV !== 'development',
                maxAge: maxAge,
            })
            res.json({ message: 'Login successful!' });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

export default router;