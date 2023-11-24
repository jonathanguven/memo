import express from 'express'
const router = express.Router()

router.post('/formSubmit', express.json(), (req, res) => {
    let match = false;
    const { name, password, confirm } = req.body

    if (password === confirm) {
        match = true;
    } 
    console.log(`\nReceived Form Data\nusername: ${name}\nPasswords match: ${match}\n`)

    res.json({
        message: 'Post Request Received!'
    });
});
  
export default router;