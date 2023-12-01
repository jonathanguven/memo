import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = express.Router();
const secret = process.env.SECRET_KEY;

const verifyJWT = (req, res, next) => {
    console.log(req.cookies)
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

router.get('/check', verifyJWT, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

export default router;