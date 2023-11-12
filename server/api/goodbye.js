import express from 'express';
const router = express.Router();

router.get('/goodbye', (req, res) => {
    res.json({ message: 'Goodbye from Express!' });
});
  
export default router;