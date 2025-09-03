import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameProvider, useGame } from './contexts/GameContext';
import StartScreen from './components/Game/StartScreen';
import GameScreen from './components/Game/GameScreen';

/**
 * Game content component that renders based on game state
 */
const GameContent = () => {
    const { gameState } = useGame();

    // Show start screen if game hasn't started
    if (!gameState.gameStarted) {
        return <StartScreen />;
    }

    // Show main game screen
    return <GameScreen />;
};

/**
 * Main App component with game provider
 */
const App = () => {
    return (
        <GameProvider>
            <GameContent />
        </GameProvider>
    );
};

export default App;