const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());


app.use('/api/auth', require('./routes/api/auth'));

app.use('/api/movies', require('./routes/api/wishlist'));

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})