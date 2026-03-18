const express = require('express');
const router = express.Router();
const Terms = require('../models/Terms');

// Get Terms
router.get('/', async (req, res) => {
    try {
        let terms = await Terms.findOne();
        if (!terms) {
            terms = await Terms.create({ content: 'Welcome to Cricket Pro. These are the default terms and conditions.' });
        }
        res.json(terms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Terms
router.put('/', async (req, res) => {
    try {
        let terms = await Terms.findOne();
        if (terms) {
            terms.content = req.body.content;
            terms.updatedAt = Date.now();
            await terms.save();
        } else {
            terms = await Terms.create({ content: req.body.content });
        }
        res.json({ success: true, message: 'Terms updated successfully!', terms });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;