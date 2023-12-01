import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { supabase } from '../supabase.js';
import { handleLogin } from './login.js';

const router = express.Router()

router.post('/create-account', express.json(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const { data: exists, error: existError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();
        
        if (exists) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };

        // send to db
        const { error } = await supabase.from('users').insert([user]);
        if (error) throw error;
        
        const login = await handleLogin(username, password, false);
        if (login.error) throw new Error(login.error);

        const maxAge = 24 * 60 * 60 * 1000; 
        res.cookie('jwt', login.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: maxAge,
        });

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
  
export default router;