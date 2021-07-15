const config = require('config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/user');
const auth = require('./routes/auth');
const creditCard = require('./routes/creditCard');
const qoob = require('./routes/qoob');
require('./startup/prod')(app);

if (!config.get('jwtPrivateKey')) {
    console.log('jwtPrivateKey is not set in environment variables!');
    process.exit(1);
}

// Middleware
mongoose.connect('mongodb://localhost/qoob')
    .then(() => console.log('Connected to the database....'))
    .catch((err) => console.log('Connection error!', err));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/creditcard', creditCard);
app.use('/api/qoob', qoob);

// Endpoints
app.get('/', (req, res) => {
    res.send('Qoob backend is running and live!');
})

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
