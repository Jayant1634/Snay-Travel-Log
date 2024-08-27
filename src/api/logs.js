const express = require('express');
const LogEntry = require('../models/LogEntry');
const router = express.Router();

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
