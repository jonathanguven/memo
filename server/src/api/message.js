import express from 'express';
import cookieParser from 'cookie-parser';
import { authenticate } from '../middleware/authenticate.js'

const router = express.Router();

router.get('/message', authenticate, (req, res) => {
    return res.json({ message: 'Request received' });
});

export default router;