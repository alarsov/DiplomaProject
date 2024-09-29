import { useState, useEffect, useCallback } from 'react';

const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState('');
    const [listening, setListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('Speech Recognition API not supported in this browser.');
            return;
        }

        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => prev + finalTranscript);
        };

        recognizer.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        setRecognition(recognizer);
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !listening) {
            recognition.start();
            setListening(true);
        }
    }, [recognition, listening]);

    const stopListening = useCallback(() => {
        if (recognition && listening) {
            recognition.stop();
            setListening(false);
        }
    }, [recognition, listening]);

    return { transcript, listening, startListening, stopListening };
};

export default useSpeechRecognition;
