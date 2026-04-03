const express = require('express');
const path = require('path');
require('dotenv').config();
const { summarizeText } = require('./services/summarizerService');

const app = express(); // This is the "app" that was missing!
const port = 3000;

// 1. Middleware: Crucial for reading JSON from your frontend
app.use(express.json());

// 2. Serve your frontend files from the 'public' folder
app.use(express.static('public'));

// 3. Your Summarize Route
app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text || text.length < 10) {
        return res.status(400).json({ error: "Please provide longer text." });
    }

    try {
        const result = await summarizeText(text);
        console.log("Server received from Gemini:", result);
        res.json(result); 
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "Analysis failed." });
    }
});

// 4. Start the engine
app.listen(port, () => {
    console.log(`ClearClause running at http://localhost:${port}`);
});