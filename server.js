const express = require('express');
const { GoogleGenerativeAI} = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();


const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static('public'));

app.post('/summarize', async(req,res)=>{
    const {text} = req.body;
    if(!text || text.length < 10){
        return res.status(400).json({ error: "Please provide a longer text to analyze"});
    }
    try{
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview"});

        const prompt = `You are an expert in South African Consumer Law.
        Summarise the following Terms and Conditions into simple bullet points.
        Highlight any 'Red Flags' regarding data privacy or hidden costs.
        
        Text: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ summary: response.text()});
    }
    catch(error){
        console.error("Gemini Error:",error);
        res.status(500).json({ error: "Failed to analyze text."});
    }
});
app.listen(port,()=>{
    console.log(`ClearClause is running at http://localhost:${port}`);
});