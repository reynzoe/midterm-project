// hooks/useTypingEffect.js
import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 50) => { // Default speed: 50ms per character
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        setDisplayedText(''); // Reset when text changes
        setCurrentIndex(0);
        setIsTypingComplete(false);
    }, [text]);

    useEffect(() => {
        if (!text || isTypingComplete) return;

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prev) => prev + text.charAt(currentIndex));
                setCurrentIndex((prev) => prev + 1);
            } else {
                clearInterval(interval);
                setIsTypingComplete(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, currentIndex, speed, isTypingComplete]);

    return { displayedText, isTypingComplete };
};

export default useTypingEffect;