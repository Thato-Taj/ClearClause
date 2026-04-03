// tests/summarzer.test.js
const { summarizeText } = require('../services/summarizerService');

describe('ClearClause MVP Summarizer', () => {
  test('should flag a Total Indemnity clause as "High Risk"', async () => {
    const rawTerms = `10. INDEMNITY: The User hereby indemnifies the Organisation against all claims, losses, and legal costs, including those arising from the Organisation's own negligence.`;

    const result = await summarizeText(rawTerms);

    const highRiskFound = result.risks.some(risk => {
      // 1. Normalize the AI's clause (remove newlines/extra spaces)
      const cleanAiClause = risk.clause.replace(/\s+/g, ' ').trim().toLowerCase();
      
      // 2. Normalize our target word
      const targetWord = 'indemnifies'; 

      // 3. Check level (case-insensitive) and presence of the keyword
      return (
        risk.level.toLowerCase() === 'high' && 
        cleanAiClause.includes(targetWord)
      );
    });

    expect(highRiskFound).toBe(true);
  }, 15000);
});
