import express from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.get('/image', async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: 'Log in to use endpoint 2' });
    }

    let img;
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        img = await response.json();
    } catch (error) {
        return res.status(500).send({ error: 'Error fetching cat picture' });
    }

    res.json({
        image: img[0].url
    });
});
  
export default router;