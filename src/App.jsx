import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameProvider, useGame } from './contexts/GameContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';

// Main content component that uses game state
const GameContent = () => {
    const { gameState } = useGame();

    if (!gameState.gameStarted) {
        return <StartScreen />;
    }

    return <GameScreen />;
};

// Main App component
const App = () => {
    return (
        <GameProvider>
            <GameContent />
        </GameProvider>
    );
};

export default App;