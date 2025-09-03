import React from "react";
import { useGame } from "../../contexts/GameContext";
import InventoryDisplay from "./InventoryDisplay";
import "../../styles/hud.css";

const PlayerHUD = () => {
    const { gameState } = useGame();

    /**
     * Get HP bar color based on health percentage
     */
    const getHpColor = () => {
        const percentage = (gameState.hp / gameState.maxHp) * 100;
        if (percentage > 70) return "success";
        if (percentage > 30) return "warning";
        return "danger";
    };

    return (
        <div className="hud-container">
            {/* Player Info */}
            <div className="hud-player">
                <h5 className="hud-name">👤 {gameState.playerName}</h5>

                {/* HP Bar */}
                <div className="hud-hp">
                    <div className="d-flex justify-content-between small mb-1">
                        <span>❤️ Health</span>
                        <span>
                            {gameState.hp}/{gameState.maxHp}
                        </span>
                    </div>
                    <div className="progress" style={{ height: "16px" }}>
                        <div
                            className={`progress-bar bg-${getHpColor()}`}
                            style={{
                                width: `${(gameState.hp / gameState.maxHp) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Inventory */}
            <InventoryDisplay inventory={gameState.inventory} />
        </div>
    );
};

export default PlayerHUD;
