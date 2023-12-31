import express from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { authenticate } from '../middleware/authenticate.js'

const router = express.Router();

router.get('/image', authenticate, async (req, res) => {
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