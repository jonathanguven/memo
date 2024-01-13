import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'None',
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logout successful' });
});

export default router;