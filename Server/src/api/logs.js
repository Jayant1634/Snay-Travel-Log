require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const LogEntry = require('../models/LogEntry');
const router = express.Router();

const {
    API_KEY,
    DATABASE_URL,
} = process.env;

var rateLimitDelay = 10 * 1000; // 10 second delay

const limiter = rateLimit({
  store: new MongoStore({
    uri: DATABASE_URL,
    collectionName: 'rateLimits', // Name of the collection to store rate limit data
    expireTimeMs: rateLimitDelay,
    errorHandler: (err) => {
      console.error('Rate limit store error:', err);
    }
  }),
  max: 1, // Limit each IP to 1 request per windowMs
  windowMs: rateLimitDelay, // 10 seconds
});

// Apply the rate limiter middleware to routes
// router.use(limiter);

// Simple GET route for testing
router.get('/', async (req, res, next) => {
    try {
        const entries = await LogEntry.find();
        res.json(entries);
    } catch (error) {
        next(error);
    }
});

// POST route for creating a new log entry
router.post('/', async (req, res, next) => {
    try {
        const logEntry = new LogEntry(req.body);
        const createdEntry = await logEntry.save();
        res.status(201).json(createdEntry); // Added status 201 for resource creation
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Send a response with status code 422 for validation errors
            return res.status(422).json({
                message: 'Validation Error',
                errors: error.errors
            });
        }
        // Pass non-validation errors to the global error handler
        next(error);
    }
});

module.exports = router;
