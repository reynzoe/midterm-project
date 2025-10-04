// components/GameScreen.js
import React, { useState } from "react";
import { useGame } from "../../Contexts/GameContext";
import { useGameEffects } from "../../hooks/useGameEffects";
import useTypingEffect from "../../hooks/useTypingEffect";
import PlayerHUD from "../HUD/PlayerHUD";
import ChoiceButton from "../UI/ChoiceButton";
import "../../styles/gameScreen.css";
import "../../styles/dialogueBox.css";

const GameScreen = () => {
    const { gameState, navigateToNode, resetGame } = useGame();
    const { currentStory, effectMessage, showEffect, hideEffect } = useGameEffects();

    const [fade, setFade] = useState(false);

    const fullStoryText = currentStory ? currentStory.text.split("\n").join(" ") : "";
    const { displayedText, isTypingComplete, skipTyping } = useTypingEffect(fullStoryText, 45);

    const getEndingClass = () => {
        if (!currentStory) return "ending-default";

        const text = currentStory.text.toLowerCase();

        if (text.includes("legend")) return "ending-legend";
        if (text.includes("game over")) return "ending-gameover";
        if (text.includes("coward")) return "ending-coward";
        if (text.includes("corrupted")) return "ending-corrupted";

        return "ending-default";
    };

    const handleChoice = (choice) => {
        setFade(true); // start fade-out

        // Wait until fade-out is done before navigating
        setTimeout(() => {
            hideEffect();
            navigateToNode(choice.to);

            // Wait one animation frame before fading back in
            requestAnimationFrame(() => {
                setFade(false);
            });
        }, 600); // match your fade-out duration (make sure CSS matches this)
    };


    const getEndingTitle = () => {
        if (!currentStory) return " THE END ";

        const text = currentStory.text.toLowerCase();

        if (text.includes("legend")) return " LEGENDARY VICTORY! ";
        if (text.includes("game over")) return " GAME OVER ";
        if (text.includes("coward")) return " COWARD'S END ";

        return " THE END ";
    };

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

    // Apply ending background class when game is ended
    const gameScreenClass = gameState.gameEnded
        ? `game-screen ${getEndingClass()}`
        : "game-screen";

    const backgroundStyle = currentStory.image
        ? {
            backgroundImage: `url(${currentStory.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }
        : {};

    return (
        <div className={gameScreenClass} style={backgroundStyle}>
            {/* HUD */}
            <div className="hud">
                <PlayerHUD />
            </div>

            {/* Effect message */}
            {showEffect && (
                <div className="effect-box">
                    <strong>{effectMessage}</strong>
                    <button onClick={hideEffect} className="hp-notif">
                        ✖ Close
                    </button>
                </div>
            )}

            {/* Story content */}
            <div className={`story-card ${fade ? "fade-out" : "fade-in"}`}>
                <div className="story-text">
                    <p>{displayedText}</p>
                    {/* Skip Button - Only show when typing is not complete */}
                    {!isTypingComplete && (
                        <button onClick={skipTyping} className="skip-button">
                            ▶️ Skip
                        </button>
                    )}
                </div>

                {/* Game Choices - only show when typing is complete and game not ended */}
                {!gameState.gameEnded && currentStory.choices && isTypingComplete && (
                    <>
                        <h6 className="choices-title text-warning mb-3">⚔️ What do you do?</h6>
                        <div className="choices-container fade-in">
                            {currentStory.choices.map((choice, index) => (
                                <ChoiceButton
                                    key={index}
                                    choice={choice}
                                    onChoiceClick={handleChoice}
                                    disabled={gameState.hp <= 0}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Game Over / Ending - only show when typing is complete */}
                {gameState.gameEnded && isTypingComplete && (
                    <div className="ending-screen">
                        <h3 className="ending-title">{getEndingTitle()}</h3>
                        <button onClick={resetGame} className="playagain-btn">
                            PLAY AGAIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameScreen;
