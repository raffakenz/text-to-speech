if ('speechSynthesis' in window) {
    let speech = new SpeechSynthesisUtterance();
    let voices = [];
    let voiceSelect = document.querySelector('select');
    let isVoicesLoaded = false;

    function filterAndSortVoices(voiceList) {
        return voiceList
            .filter(voice => voice.lang)
            .sort((a, b) => {
                if (a.lang.includes('id-ID')) return -1;
                if (b.lang.includes('id-ID')) return 1;
                return a.name.localeCompare(b.name);
            });
    }

    function populateVoiceList() {
        document.getElementById('loadingVoices').style.display = 'block';

        voices = window.speechSynthesis.getVoices();
        
        if (voices.length === 0) {
            return setTimeout(populateVoiceList, 100);
        }

        
        voiceSelect.innerHTML = '';
        const filteredVoices = filterAndSortVoices(voices);
        
        filteredVoices.forEach((voice, i) => {
            const option = new Option(`${voice.name} (${voice.lang})`, i);
            voiceSelect.appendChild(option);
            
            if (voice.lang.includes('id-ID')) {
                speech.voice = voice;
                voiceSelect.value = i;
            }
        });

        if (!speech.voice) {
            speech.voice = filteredVoices[0];
        }

        isVoicesLoaded = true;

        document.getElementById('loadingVoices').style.display = 'none';
    }

    speech.lang = 'id-ID';
    speech.rate = 1.0;
    speech.pitch = 1.0;

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    populateVoiceList();

    voiceSelect.addEventListener('change', () => {
        const selectedVoice = voices[voiceSelect.value];
        if (selectedVoice) {
            speech.voice = selectedVoice;
            speech.lang = selectedVoice.lang;
        }
    });

    document.querySelector('button').addEventListener('click', () => {
        const text = document.querySelector('textarea').value;
        if (!text) return;

        speech.text = text;
        
        window.speechSynthesis.cancel();
        
        try {
            window.speechSynthesis.speak(speech);
        } catch (error) {
            console.error('Speech synthesis error:', error);
            alert('Terjadi kesalahan. Pastikan perangkat Anda mendukung fitur ini.');
        }
    });

    window.onbeforeunload = () => {
        window.speechSynthesis.cancel();
    };
} else {
    alert('Maaf, browser Anda tidak mendukung Text-to-Speech API');
    voiceSelect.disabled = true;
    document.querySelector('button').disabled = true;
}
