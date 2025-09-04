import { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import storyData from '../data/story.json'; // ✅ Import the JSON file directly

/**
 * Custom hook to handle game effects and state changes
 */
export const useGameEffects = () => {
    const { gameState, navigateToNode, applyNodeEffects, endGame } = useGame();
    const [effectMessage, setEffectMessage] = useState('');
    const [showEffect, setShowEffect] = useState(false);

    const currentStory = storyData[gameState.currentNode];

    // Handle HP-based game over
    useEffect(() => {
        if (gameState.hp <= 0 && !gameState.gameEnded && gameState.currentNode !== 'gameOver_hp') {
            navigateToNode('gameOver_hp');
            endGame();
        }
    }, [gameState.hp, gameState.gameEnded, gameState.currentNode, navigateToNode, endGame]);

    // Handle node effects when arriving at new node
    useEffect(() => {
        if (currentStory && currentStory.onArrive) {
            const effects = currentStory.onArrive;
            let message = '';

            if (effects.addItem) {
                message = `✨ Found: ${effects.addItem}`;
            } else if (effects.takeDamage) {
                message = `💔 Lost ${effects.takeDamage} HP`;
            }

            if (message) {
                setEffectMessage(message);
                setShowEffect(true);
                // Auto-hide after 3 seconds
            }

            applyNodeEffects(gameState.currentNode, effects);
        }

        // Check if this is an ending node
        if (currentStory && currentStory.isEnding) {
            endGame();
        }
    }, [gameState.currentNode, currentStory, applyNodeEffects, endGame]);

    return {
        currentStory,
        effectMessage,
        showEffect,
        hideEffect: () => setShowEffect(false)
    };
};