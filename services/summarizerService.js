const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const summarizeText = async (text) => {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Analyze these Terms & Conditions for a South African student audience. 
    You MUST provide a 'meaning' field for every risk that explains it in simple, Grade 10 English.
    
    STRICT JSON STRUCTURE:
    {
      "summary": "overview of the document",
      "risks": [
        {
          "level": "High/Medium/Low",
          "category": "e.g., Privacy",
          "clause": "the original legal text",
          "meaning": "The plain English translation of what this actually means for the user."
        }
      ]
    }

    TEXT TO ANALYZE: ${text}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const data = JSON.parse(response.text());
        
        // Log this to your VS Code terminal
        console.log("--- AI RESPONSE START ---");
        console.log(JSON.stringify(data, null, 2));
        console.log("--- AI RESPONSE END ---");
        
        return data;
    } catch (error) {
        console.error("Backend Error:", error);
        return { summary: "Error parsing JSON.", risks: [] };
    }
};

module.exports = { summarizeText };