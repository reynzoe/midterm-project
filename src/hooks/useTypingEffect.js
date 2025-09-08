// hooks/useTypingEffect.js
import { useState, useEffect, useCallback } from 'react'; // <-- Add useCallback

const useTypingEffect = (text, speed = 30) => {
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

    // New function to skip the typing animation
    const skipTyping = useCallback(() => {
        setDisplayedText(text);
        setIsTypingComplete(true);
        setCurrentIndex(text.length); // Ensure currentIndex is also updated
    }, [text]);

    return { displayedText, isTypingComplete, skipTyping }; // <-- Return skipTyping
};

export default useTypingEffect;