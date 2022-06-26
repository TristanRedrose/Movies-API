const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/verifyToken');

app.use(express.json());


app.use('/api', require('./routes/api/auth'));



app.listen(3000, () => {
    console.log('Server listening on port 3000');
})