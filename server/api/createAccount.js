import express from 'express'
import bcrypt from 'bcrypt'
import 'dotenv/config';
import { supabase } from '../supabase.js';

const router = express.Router()

router.post('/create-account', express.json(), async (req, res) => {
    try {
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // create user object
        const user = {
            username: req.body.username,
            password: hashedPassword,
        }

        // send to db
        const { data, error } = await supabase
            .from('users')
            .insert([user]);
        
            if (error) throw error;
            
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
  
export default router;