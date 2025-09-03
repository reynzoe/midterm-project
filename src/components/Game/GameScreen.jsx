// components/GameScreen.js
import React, { useEffect } from "react"; // <-- Add useEffect here
import { useGame } from "../../contexts/GameContext";
import { useGameEffects } from "../../hooks/useGameEffects";
import useTypingEffect from "../../hooks/useTypingEffect"; // <-- Import the new hook
import PlayerHUD from "../HUD/PlayerHUD";
import ChoiceButton from "../UI/ChoiceButton";
import "../../styles/gameScreen.css";

const GameScreen = () => {
    const { gameState, navigateToNode, resetGame } = useGame();
    const { currentStory, effectMessage, showEffect, hideEffect } = useGameEffects();

    // Use the typing effect for the current story text
    // Combine all paragraphs into a single string for the typing effect
    const fullStoryText = currentStory ? currentStory.text.split("\n").join(" ") : '';
    const { displayedText, isTypingComplete } = useTypingEffect(fullStoryText, 30); // Adjust speed as needed (e.g., 30ms per char)

    const handleChoice = (choice) => {
        hideEffect();
        navigateToNode(choice.to);
    };

    const getEndingTitle = () => {
        if (!currentStory) return "🎭 THE END 🎭";

        const text = currentStory.text.toLowerCase();

        if (text.includes("legend")) return "🌟 LEGENDARY VICTORY! 🌟";
        if (text.includes("game over")) return "💀 GAME OVER 💀";
        if (text.includes("coward")) return "🏃 COWARD'S END 🏃";

        return "🎭 THE END 🎭";
    };

    // Error screen if story node not found
    if (!currentStory) {
        return (
            <div className="game-screen flex items-center justify-center">
                <div className="story-card text-center">
                    <h2 className="ending-title">❌ Story Error</h2>
                    <p>Could not find story node: {gameState.currentNode}</p>
                    <button onClick={resetGame} className="choice-button">
                        🔄 Restart Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-screen">
            {/* HUD */}
            <div className="hud">
                <PlayerHUD />
            </div>

            {/* Effect message */}
            {showEffect && (
                <div className="story-card">
                    <strong>{effectMessage}</strong>
                    <button onClick={hideEffect} className="choice-button">
                        ✖ Close
                    </button>
                </div>
            )}

            {/* Story content */}
            <div className="story-card">
                <div className="story-text">
                    {/* Display the typing text */}
                    <p>{displayedText}</p>
                </div>

                {/* Game Choices - only show when typing is complete and game not ended */}
                {!gameState.gameEnded && currentStory.choices && isTypingComplete && ( // <-- Add isTypingComplete check
                    <div>
                        <h6 className="text-warning mb-3">⚔️ What do you do?</h6>
                        {currentStory.choices.map((choice, index) => (
                            <ChoiceButton
                                key={index}
                                choice={choice}
                                onChoiceClick={handleChoice}
                                disabled={gameState.hp <= 0}
                            />
                        ))}
                    </div>
                )}

                {/* Game Over / Ending - only show when typing is complete */}
                {gameState.gameEnded && isTypingComplete && ( // <-- Add isTypingComplete check
                    <div className="text-center">
                        <h3 className="ending-title">{getEndingTitle()}</h3>
                        <button onClick={resetGame} className="choice-button">
                            🔄 PLAY AGAIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameScreen;