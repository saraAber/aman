const express = require('express');
const app = express();
const cors = require('cors');


const callers = require('./data')
app.use(cors());
app.use(express.json());
app.use('/callers', callers);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));