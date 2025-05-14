let speech = new SpeechSynthesisUtterance();
speech.lang = 'id-ID';
speech.rate = 1.0;
speech.pitch = 1.0;

let voices = []
let voiceSelect = document.querySelector('select');

function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
        return setTimeout(populateVoiceList, 10);
    }

    voiceSelect.innerHTML = '';
    
    voices.forEach((voice, i) => {
        const option = new Option(voice.name, i);
        voiceSelect.appendChild(option);
    });

    speech.voice = voices[0];
}

window.speechSynthesis.onvoiceschanged = populateVoiceList;

populateVoiceList();

window.onbeforeunload = () => {
    window.speechSynthesis.cancel();
}

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices()
    speech.voice = voices[0]
    voices.forEach((voice, i) => (voiceSelect.options[i]) = new Option(voice.name, i))
}

voiceSelect.addEventListener('change', () => {
    speech.voice = voices[voiceSelect.value]
})

document.querySelector('button').addEventListener('click', () => {
    speech.text = document.querySelector('textarea').value;

    try {
        window.speechSynthesis.speak(speech);
    } catch (error) {
        console.error('Speech synthesis error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
})
