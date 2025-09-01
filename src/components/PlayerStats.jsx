import React from 'react';
import { useGame } from '../contexts/GameContext';

const PlayerStats = () => {
    const { gameState } = useGame();

    const getHpColor = () => {
        if (gameState.hp > 70) return 'success';
        if (gameState.hp > 30) return 'warning';
        return 'danger';
    };

    return (
        <div className="card bg-secondary border-warning mb-3">
            <div className="card-body">
                <h5 className="card-title text-warning">
                    {gameState.playerName} - Hunter Stats
                </h5>
                <div className="mb-2">
                    <span className="text-light">Health: </span>
                    <div className="progress" style={{ height: '20px' }}>
                        <div
                            className={`progress-bar bg-${getHpColor()}`}
                            role="progressbar"
                            style={{ width: `${gameState.hp}%` }}
                        >
                            {gameState.hp}/100 HP
                        </div>
                    </div>
                </div>
                <div>
                    <span className="text-light">Inventory: </span>
                    {gameState.inventory.length > 0 ? (
                        <span className="text-success">
              {gameState.inventory.join(', ')}
            </span>
                    ) : (
                        <span className="text-muted">Empty</span>
                    )}
                </div>
                {/* Debug info - remove in production */}
                <small className="text-muted">
                    Current Node: {gameState.currentNode} |
                    Effects Applied: {gameState.appliedEffects.length}
                </small>
            </div>
        </div>
    );
};

export default PlayerStats;