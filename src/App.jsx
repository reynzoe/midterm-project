import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameProvider, useGame } from './contexts/GameContext';
import StartScreen from './components/Game/StartScreen';
import GameScreen from './components/Game/GameScreen';
import ThemeMusic from './components/Music/ThemeMusic'; // 👈 import here

const GameContent = () => {
    const { gameState } = useGame();

    if (!gameState.gameStarted) {
        return <StartScreen />;
    }

    return <GameScreen />;
};

const App = () => {
    return (
        <GameProvider>
            {/* 🎵 Music runs for the whole app */}
            <ThemeMusic />

            <GameContent />
        </GameProvider>
    );
};

export default App;
