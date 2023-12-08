import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config';
import passport from './auth.js';
import cookieParser from 'cookie-parser';

import message from './api/message.js'
import image from './api/image.js'
import create from './api/createAccount.js'
import login from './api/login.js'
import check from './auth/check.js'
import logout from './api/logout.js'
import user from './api/user.js'
import self from './api/self.js'

const app = express();
const port = 3000; 

// express tools
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(morgan('dev'))
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// api endpoints
app.use('/api', message);
app.use('/api', image);
app.use(create);
app.use(login);
app.use(logout);
app.use('/auth', check);
app.use(self);
app.use(user);

app.get('/', (req, res) => {
    res.send('Home URL')
})

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});