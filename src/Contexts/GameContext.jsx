import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';


const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        playerName: '',
        hp: 100,
        maxHp: 100,
        inventory: [],
        currentNode: 'start',
        gameStarted: false,
        gameEnded: false,
        appliedEffects: []
    });

    useEffect(() => {
        const savedState = localStorage.getItem('aswangHunterSave');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                setGameState(parsedState);
            } catch (error) {
                console.error('Error loading saved game:', error);
            }
        }
    }, []);

    // Save game state to localStorage whenever it changes
    useEffect(() => {
        if (gameState.gameStarted) {
            localStorage.setItem('aswangHunterSave', JSON.stringify(gameState));
        }
    }, [gameState]);

    /**
     * Start new game with player name
     */
    const startGame = useCallback((playerName) => {
        setGameState({
            playerName: playerName || 'Hunter',
            hp: 100,
            maxHp: 100,
            inventory: [],
            currentNode: 'start',
            gameStarted: true,
            gameEnded: false,
            appliedEffects: []
        });
    }, []);

    /**
     * Reset game to initial state
     */
    const resetGame = useCallback(() => {
        setGameState({
            playerName: '',
            hp: 100,
            maxHp: 100,
            inventory: [],
            currentNode: 'start',
            gameStarted: false,
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
            gameEnded: true
        }));
    }, []);

    /**
     * Check if player has item
     */
    const hasItem = useCallback((item) => {
        return gameState.inventory.includes(item);
    }, [gameState.inventory]);

    /**
     * Check if player has all items
     */
    const hasAllItems = useCallback((items) => {
        return items.every(item => gameState.inventory.includes(item));
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