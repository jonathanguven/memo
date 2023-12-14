import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authenticate = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.id;
        // console.log("Request made by user " + decoded.id + ", " + decoded.username);
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};