import React, { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import PlayerStats from './PlayerStats';
import storyData from '../data/story.json';

const GameScreen = () => {
    const {
        gameState,
        navigateToNode,
        applyNodeEffects,
        endGame,
        hasItem,
        hasAllItems,
        resetGame
    } = useGame();

    const [effectMessage, setEffectMessage] = useState('');
    const [showEffect, setShowEffect] = useState(false);

    const currentStory = storyData[gameState.currentNode];

    // Check for HP-based game over
    useEffect(() => {
        if (gameState.hp <= 0 && !gameState.gameEnded && gameState.currentNode !== 'gameOver_hp') {
            navigateToNode('gameOver_hp');
            endGame();
        }
    }, [gameState.hp, gameState.gameEnded, gameState.currentNode, navigateToNode, endGame]);

    // Handle node effects when arriving at a new node
    useEffect(() => {
        if (currentStory && currentStory.onArrive) {
            const effects = currentStory.onArrive;
            let message = '';

            if (effects.addItem) {
                message = `✨ You gained: ${effects.addItem}`;
            } else if (effects.takeDamage) {
                message = `💔 You lost ${effects.takeDamage} HP`;
            }

            if (message) {
                setEffectMessage(message);
                setShowEffect(true);
                setTimeout(() => setShowEffect(false), 3000); // Hide after 3 seconds
            }

            // Apply effects using the new method that prevents duplicates
            applyNodeEffects(gameState.currentNode, currentStory.onArrive);
        }

        // Check if this is an ending node
        if (currentStory && currentStory.isEnding) {
            endGame();
        }
    }, [gameState.currentNode, currentStory, applyNodeEffects, endGame]);

    const handleChoice = (choice) => {
        // Double-check requirements before allowing choice
        if (choice.requires && !hasItem(choice.requires)) {
            console.log(`Choice blocked: Missing required item ${choice.requires}`);
            return;
        }

        if (choice.requiresAll && !hasAllItems(choice.requiresAll)) {
            console.log(`Choice blocked: Missing required items ${choice.requiresAll.join(', ')}`);
            return;
        }

        // Hide the effect message when making a choice
        setShowEffect(false);
        navigateToNode(choice.to);
    };

    const isChoiceAvailable = (choice) => {
        // Hide choices based on hideIf condition
        if (choice.hideIf && hasItem(choice.hideIf)) {
            return false;
        }

        // Show choices that have requirements only if requirements are met
        if (choice.requires && !hasItem(choice.requires)) {
            return false;
        }

        if (choice.requiresAll && !hasAllItems(choice.requiresAll)) {
            return false;
        }

        return true;
    };

    const getChoiceButtonClass = (choice) => {
        if (choice.requires || choice.requiresAll) {
            return 'btn btn-success btn-lg mb-2 w-100';
        }
        return 'btn btn-warning btn-lg mb-2 w-100';
    };

    if (!currentStory) {
        return (
            <div className="container-fluid bg-dark text-light min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h2 className="text-danger">Error: Story node not found</h2>
                    <button onClick={resetGame} className="btn btn-warning">
                        Return to Start
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-dark text-light min-vh-100 py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        {showEffect && (
                            <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
                                <strong>{effectMessage}</strong>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEffect(false)}
                                ></button>
                            </div>
                        )}

                        <PlayerStats />

                        <div className="card bg-secondary border-warning mb-4">
                            <div className="card-body">
                                <div className="story-text mb-4">
                                    {currentStory.text.split('\n').map((paragraph, index) => (
                                        <p key={index} className="text-light mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {!gameState.gameEnded && currentStory.choices && (
                                    <div className="choices">
                                        <h5 className="text-warning mb-3">What do you do?</h5>
                                        {currentStory.choices
                                            .filter(isChoiceAvailable)
                                            .map((choice, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleChoice(choice)}
                                                    className={getChoiceButtonClass(choice)}
                                                    disabled={gameState.hp <= 0}
                                                >
                                                    {choice.text}
                                                    {choice.requires && (
                                                        <span className="badge bg-light text-dark ms-2">
                              Requires: {choice.requires}
                            </span>
                                                    )}
                                                    {choice.requiresAll && (
                                                        <span className="badge bg-light text-dark ms-2">
                              Requires All: {choice.requiresAll.join(', ')}
                            </span>
                                                    )}
                                                </button>
                                            ))}
                                    </div>
                                )}

                                {gameState.gameEnded && (
                                    <div className="text-center mt-4">
                                        <h3 className="text-warning mb-3">
                                            {currentStory.text.includes('LEGENDARY') ? '🌟 LEGENDARY VICTORY! 🌟' :
                                                currentStory.text.includes('GAME OVER') ? '💀 GAME OVER 💀' :
                                                    currentStory.text.includes('CORRUPTED') ? '👹 CORRUPTED 👹' :
                                                        currentStory.text.includes('COWARD') ? '🏃 COWARD\'S END 🏃' :
                                                            '🎭 THE END 🎭'}
                                        </h3>
                                        <button
                                            onClick={resetGame}
                                            className="btn btn-warning btn-lg"
                                        >
                                            🔄 PLAY AGAIN
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;