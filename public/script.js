document.getElementById('summarizeBtn').addEventListener('click', async()=>{
    const text = document.getElementById('termsInput').value;
    const resultArea =document.getElementById('resultArea');
    const output = document.getElementById('summaryOutput');

    if(!text){
        alert("Please paste some text first!");
        return;
    }
    output.innerHTML = "Processing with Gemini AI...";
    resultArea.classList.remove('hidden');

    console.log("Text captured:", text.substring(0,50) + "...");
});