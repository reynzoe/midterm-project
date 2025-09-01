import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const StartScreen = () => {
    const [playerName, setPlayerName] = useState('');
    const { startGame } = useGame();

    const handleStartGame = () => {
        if (playerName.trim()) {
            startGame(playerName.trim());
        } else {
            startGame('Hunter');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleStartGame();
        }
    };

    return (
        <div className="container-fluid bg-dark text-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="row w-100 justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card bg-secondary border-warning">
                        <div className="card-body text-center p-5">
                            <h1 className="card-title mb-4 text-warning">
                                🦇 San Gubat 🦇
                            </h1>
                            <p className="card-text mb-4 text-light">
                                Enter the dark world of Filipino folklore and face the creatures of the night.
                                Your choices will determine your fate.
                            </p>
                            <div className="mb-3">
                                <label htmlFor="playerName" className="form-label">
                                    Enter your name, brave hunter:
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-warning"
                                    id="playerName"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Your Name (optional)"
                                    maxLength={20}
                                />
                            </div>
                            <button onClick={handleStartGame} className="btn btn-warning btn-lg">
                                BEGIN YOUR HUNT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;