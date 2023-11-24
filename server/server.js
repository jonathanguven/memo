import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import message from './api/message.js'
import image from './api/image.js'
import form from './api/formSubmit.js'

const app = express();
const port = 3001; 

// express tools
app.use(cors());
app.use(morgan('dev'))

// api endpoints
app.use('/api', message);
app.use('/api', image);
app.use(form)

app.get('/', (req, res) => {
    res.send('Home URL')
})

app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    res.send(`User ID is: ${userId}`);
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});