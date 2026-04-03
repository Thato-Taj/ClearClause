// services/summarizerService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const summarizeText = async (text) => {
    // Sticking with your preferred preview model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite-preview" 
    });

    const prompt = `
        Analyze these South African Terms and Conditions. 
        Focus: Identify "High Risk" indemnity clauses.
        
        Return ONLY a raw JSON object with this exact structure:
        {
          "summary": "Short overview",
          "risks": [
            { "level": "High", "category": "Indemnity", "clause": "exact snippet" }
          ]
        }

        Text: ${text}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();

        // CLEANING LOGIC: Finds the first '{' and last '}' to strip markdown
        const jsonStart = rawText.indexOf('{');
        const jsonEnd = rawText.lastIndexOf('}') + 1;
        const jsonString = rawText.slice(jsonStart, jsonEnd);

        const data = JSON.parse(jsonString);
        return data;
    } catch (error) {
        console.error("Gemini Service Error:", error);
        // Return a default object so the test doesn't crash on undefined
        return { summary: "Error parsing AI response", risks: [] };
    }
};

module.exports = { summarizeText };
