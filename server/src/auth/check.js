import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { supabase } from '../supabase.js';

const router = express.Router();
const secret = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        console.log('no token')
        return res.status(401).json({ isAuthenticated: false });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log('bad token')
            return res.status(401).json({ isAuthenticated: false });
        }
        req.user = decoded; 
        next();
    });
};

router.get('/check', verifyJWT, async (req, res) => {
    try {
        const id = req.user.id;
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single(); 

        if (!user || error) {
            return res.status(404).json({ message: "User not found" });
        }

        delete user.password;
        res.json({ isAuthenticated: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;