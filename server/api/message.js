import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.get('/message', cookieParser(), (req, res) => {
    if (req.cookies.jwt) {
        res.json({ message: 'Request received' });
    } else {
        res.status(401).json({ message: 'Log in to use endpoint 1' }); 
    }
});

export default router;