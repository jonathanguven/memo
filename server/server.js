import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config';
import passport from './auth.js';

import message from './api/message.js'
import image from './api/image.js'
import create from './api/createAccount.js'
import login from './api/login.js'

const app = express();
const port = 3000; 

// express tools
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(passport.initialize());

// api endpoints
app.use('/api', message);
app.use('/api', image);
app.use(create)
app.use(login);

app.get('/', (req, res) => {
    res.send('Home URL')
})

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});