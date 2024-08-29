const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const middlewares = require('./middlewares');
const logs = require('./api/logs');

require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware setup
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Defaulting to localhost if not set in .env
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'hello world',
    });
});

app.use('/api/logs', logs);

// Middleware for handling 404 and errors
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Start the server
const port = process.env.PORT || 7860; // Correct casing for PORT
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

