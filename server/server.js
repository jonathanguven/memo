import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import message from './api/message.js'
import image from './api/image.js'

const app = express();
const port = 3000; 

// express tools
app.use(cors());
app.use(morgan('dev'))

// api endpoints
app.use('/api', message);
app.use('/api', image);

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});