import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config';
import passport from './auth.js';
import cookieParser from 'cookie-parser';

import createUser from './user/createAccount.js'
import login from './user/login.js'
import check from './auth/check.js'
import logout from './user/logout.js'
import getUser from './user/user.js'
import self from './user/self.js'
import flashcards from './cards/flashcardSet.js'
import flashcardSets from './cards/publicSets.js'
import card from './cards/card.js'

const app = express();
const port = process.env.PORT || 3000; 

// express tools
app.use(cors({
    origin: process.env.DEPLOYMENT_URL, 
    credentials: true,
}));
app.use(morgan('dev'))
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// api endpoints
app.use('/user', createUser);
app.use('/user', login);
app.use('/user', logout);
app.use(self);
app.use(getUser);

app.use('/auth', check);

app.use('/api', flashcards);
app.use('/api', flashcardSets);
app.use('/api', card);


app.get('/', (req, res) => {
    res.send('Home URL')
})

app.listen(port, () => {
    console.log(process.env.PORT)
    console.log(`Express server listening on port: ${port}`);
});