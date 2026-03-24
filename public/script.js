const btn = document.getElementById('summarizeBtn');

btn.addEventListener('click',async()=>{
    const text = document.getElementById('termsInput').value;
    const output = document.getElementById('summaryOutput');
    const resultArea = document.getElementById('resultArea');

    if(!text) return alert("Please paste some text first!");

    btn.innerText = "Analyzing...🔍";
    btn.disabled = true;
    try{
        const response = await fetch('/summarize',{
            method : 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ text})
        });

        const data = await response.json();
        output.innerText = data.summary;
        resultArea.classList.remove('hidden');
    } catch(err){
        output.innerText = "Error connecting to server.";
    } finally{
        btn.innerText = "Summarize with Gemini";
        btn.disabled = false;
    }
});
let speech = new SpeechSynthesisUtterance();
document.getElementById('readBtn').addEventListener('click', ()=>{
    const textToRead = document.getElementById('summaryOutput').innerText;

    if(textToRead){
        speech.text  =textToRead;
        speech.rate = 0.9;
        speech.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const saVoice = voices.find(v=>v.lang.includes('en-ZA'));
        if(saVoice) speech.voice = saVoice;

        window.speechSynthesis.speak(speech);
    }
});
document.getElementById('stopBtn').addEventListener('click',()=>{
    window.speechSynthesis.cancel();
});