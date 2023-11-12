import express from 'express'
import cors from 'cors'

import hello from './api/hello.js'
import goodbye from './api/goodbye.js'

const app = express();
const port = 3000; 

app.use(cors());

app.use('/api', hello);
app.use('/api', goodbye);

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});