const express = require('express');
const path = require('path');
require('dotenv').config();
const { summarizeText } = require('./services/summarizerService');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// SINGLE POST ROUTE: Using the service we tested
app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text || text.length < 10) {
        return res.status(400).json({ error: "Please provide longer text." });
    }

    try {
        const result = await summarizeText(text);
        // Note: Your frontend expects { summary: "..." }
        // Ensure your service returns exactly what the frontend needs
        res.json(result);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to analyze text." });
    }
});

app.listen(port, () => {
    console.log(`ClearClause is running at http://localhost:${port}`);
});
