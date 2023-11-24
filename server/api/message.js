import express from 'express';
const router = express.Router();

router.get('/message', (req, res) => {
    res.json({ message: 'Request to backend received' });
});

export default router;