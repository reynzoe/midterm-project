// src/contexts/GameContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        playerName: '',
        hp: 100,
        maxHp: 100,
        inventory: ["Bolo"],
        currentNode: 'start',
        gameStarted: false, // Initial state: not started
        gameEnded: false,   // Initial state: not ended
        appliedEffects: []
    });

    // Load game state from localStorage only once on component mount
    useEffect(() => {
        const savedState = localStorage.getItem('aswangHunterSave');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                // If the game was saved in an 'ended' state, we still load it,
                // but ensure gameStarted remains true so GameScreen can display the ending.
                setGameState(parsedState);
            } catch (error) {
                console.error('Error loading saved game:', error);
                // If there's an error loading, clear the corrupted save
                localStorage.removeItem('aswangHunterSave');
            }
        }
    }, []);

    // Save game state to localStorage whenever it changes
    useEffect(() => {
        // Only save if the game has started and is NOT ended
        // This means we save ongoing games.
        if (gameState.gameStarted && !gameState.gameEnded) {
            localStorage.setItem('aswangHunterSave', JSON.stringify(gameState));
        }
        // IMPORTANT: We no longer remove the save when gameEnded is true here.
        // Removal will happen explicitly on startGame or resetGame.
    }, [gameState]); // Depend on the entire gameState object for changes

    /**
     * Start new game with player name
     */
    const startGame = useCallback((playerName) => {
        // Always clear previous save when starting a new game
        localStorage.removeItem('aswangHunterSave');
        setGameState({
            playerName: playerName || 'Hunter',
            hp: 100,
            maxHp: 100,
            inventory: ["Bolo"],
            currentNode: 'start',
            gameStarted: true,
            gameEnded: false,
            appliedEffects: []
        });
    }, []);

    /**
     * Reset game to initial state (e.g., after clicking "PLAY AGAIN")
     */
    const resetGame = useCallback(() => {
        // Always clear previous save when resetting the game
        localStorage.removeItem('aswangHunterSave');
        setGameState({
            playerName: '',
            hp: 100,
            maxHp: 100,
            inventory: ["Bolo"],
            currentNode: 'start',
            gameStarted: false, // Back to start screen state
            gameEnded: false,
            appliedEffects: []
        });
    }, []);

    /**
     * Navigate to story node
     */
    const navigateToNode = useCallback((nodeId) => {
        setGameState(prev => ({
            ...prev,
            currentNode: nodeId
        }));
    }, []);

    /**
     * Apply node effects (items, damage)
     */
    const applyNodeEffects = useCallback((nodeId, effects) => {
        const effectKey = `${nodeId}_effects`;

        setGameState(prev => {
            // Prevent duplicate effects
            if (prev.appliedEffects.includes(effectKey)) {
                return prev;
            }

            let newState = {
                ...prev,
                appliedEffects: [...prev.appliedEffects, effectKey]
            };

            // Add item if not already in inventory
            if (effects.addItem && !prev.inventory.includes(effects.addItem)) {
                newState.inventory = [...newState.inventory, effects.addItem];
            }

            // Apply damage
            if (effects.takeDamage) {
                newState.hp = Math.max(0, newState.hp - effects.takeDamage);
            }

            return newState;
        });
    }, []);

    /**
     * End current game
     */
    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameEnded: true,
            // IMPORTANT: gameStarted remains TRUE here.
            // This allows the App.js to still render GameScreen to show the ending.
            // localStorage will *not* be cleared until startGame or resetGame is called.
        }));
    }, []);

    /**
     * Check if player has item
     */
    const hasItem = useCallback((item) => {
        if (!item) return false;
        // Convert both to lowercase for consistent checking
        return gameState.inventory.some(invItem => invItem.toLowerCase() === item.toLowerCase());
    }, [gameState.inventory]);

    const hasAllItems = useCallback((items) => {
        if (!items || !Array.isArray(items)) return false;
        return items.every(item =>
            gameState.inventory.some(invItem => invItem.toLowerCase() === item.toLowerCase())
        );
    }, [gameState.inventory]);

    return (
        <GameContext.Provider value={{
            gameState,
            startGame,
            resetGame,
            navigateToNode,
            applyNodeEffects,
            endGame,
            hasItem,
            hasAllItems
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};