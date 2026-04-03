const btn = document.getElementById('summarizeBtn');

btn.addEventListener('click', async () => {
    const text = document.getElementById('termsInput').value;
    const output = document.getElementById('summaryOutput');
    const riskArea = document.getElementById('riskArea');
    const resultArea = document.getElementById('resultArea');

    // 1. Basic Validation
    if (!text || text.length < 10) return alert("Please paste the terms first!");

    // 2. Set Loading UI
    btn.innerText = "Analyzing...🔍";
    btn.disabled = true;
    output.innerText = "Processing legal text...";
    riskArea.innerHTML = "";

    try {
        // 3. The API Handshake
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error("Server communication failed.");

        const data = await response.json();
        
        // DEBUG: Press F12 in your browser and check the 'Console' tab
        console.log("--- FRONTEND DATA RECEIVED ---", data);

        // 4. Update the Summary Text
        output.innerText = data.summary || "Summary unavailable.";

        // 5. Extract and Render Risks
        // We handle cases where data might be nested (e.g., data.risks or data.data.risks)
        const risksArray = data.risks || (data.data && data.data.risks) || [];

        if (risksArray.length > 0) {
            riskArea.innerHTML = "<h2>🚩 Key Risks Identified</h2>";
            
            risksArray.forEach(risk => {
                const card = document.createElement('div');
                const level = (risk.level || "medium").toLowerCase();
                card.className = `risk-card ${level}`;
                
                /**
                 * THE UNIVERSAL KEY HUNTER
                 * This checks for common key names, and as a final fallback, 
                 * finds the longest string in the object that isn't the original clause.
                 */
                const findMeaning = (obj) => {
                    return obj.meaning || 
                           obj.Meaning || 
                           obj.explanation || 
                           obj.simple_english || 
                           Object.values(obj).find(v => typeof v === 'string' && v.length > 30 && v !== obj.clause) ||
                           "This clause likely limits your rights or adds hidden costs.";
                };

                const explanation = findMeaning(risk);

                card.innerHTML = `
                    <div class="card-header">
                        <strong>${risk.category || "Legal Clause"}</strong>
                        <span class="badge">${risk.level || "Medium"} Risk</span>
                    </div>
                    <div class="translation-box">
                        <h4>In Plain English:</h4>
                        <p class="translation-text">${explanation}</p>
                    </div>
                    <div class="clause-snippet">
                        <small>Original Clause:</small>
                        <p>"${risk.clause || "Check original document."}"</p>
                    </div>
                `;
                riskArea.appendChild(card);
            });
        }

        // Reveal the hidden results container
        resultArea.classList.remove('hidden');

    } catch (err) {
        console.error("Critical Frontend Error:", err);
        output.innerText = "Error: Could not reach the summarizer service.";
    } finally {
        // 6. Reset Button State
        btn.innerText = "Summarize with Gemini";
        btn.disabled = false;
    }
});

// --- Speech Synthesis (Text-to-Speech) ---
let speech = new SpeechSynthesisUtterance();

document.getElementById('readBtn').addEventListener('click', () => {
    const textToRead = document.getElementById('summaryOutput').innerText;
    if (textToRead) {
        window.speechSynthesis.cancel(); // Stop any current speech
        speech.text = textToRead;
        
        // Load voices and try to pick a natural English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-ZA')) || voices[0];
        
        speech.voice = preferredVoice;
        window.speechSynthesis.speak(speech);
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    window.speechSynthesis.cancel();
});