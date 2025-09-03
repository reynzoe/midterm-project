import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import '../../styles/startScreen.css';

const StartScreen = () => {
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const [started, setStarted] = useState(false); // 👈 NEW: controls screen flow
    const { startGame } = useGame();

    const handleStartGame = () => {
        if (!playerName.trim()) {
            setError('⚠️ You need to enter a name before starting!');
            return;
        }
        setError('');
        startGame(playerName.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleStartGame();
        }
    };

    return (
        <div className="start-screen">
            <div className="start-card">
                {/* Game Title */}
                <h1 className="start-title">San Gubat</h1>

                {/* First screen: just Start button */}
                {!started ? (
                    <button
                        onClick={() => setStarted(true)}
                        className="start-button"
                    >
                        ▶ Start
                    </button>
                ) : (
                    <>
                        {/* Name Input */}
                        <div className="mb-3">
                            <label className="start-label">
                                Enter your hunter name:
                            </label>
                            <input
                                type="text"
                                className="start-input"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ex: Dante"
                                maxLength={20}
                            />
                            {error && (
                                <small className="text-danger mt-2 d-block">
                                    {error}
                                </small>
                            )}
                        </div>

                        {/* Begin Hunt Button */}
                        <button
                            onClick={handleStartGame}
                            className="start-button"
                        >
                            🗡️ BEGIN HUNT
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StartScreen;
