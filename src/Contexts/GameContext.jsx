import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the Game Context
const GameContext = createContext();

// Game Provider Component
export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        playerName: '',
        hp: 100,
        inventory: [],
        currentNode: 'start',
        gameStarted: false,
        gameEnded: false,
        visitedNodes: [], // Track visited nodes to prevent duplicate effects
        appliedEffects: [] // Track which node effects have been applied
    });

    // Load game state from localStorage on mount
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

    // Game actions
    const startGame = useCallback((playerName) => {
        setGameState({
            playerName: playerName || 'Hunter',
            hp: 100,
            inventory: [],
            currentNode: 'start',
            gameStarted: true,
            gameEnded: false,
            visitedNodes: [],
            appliedEffects: []
        });
    }, []);

    const resetGame = useCallback(() => {
        localStorage.removeItem('aswangHunterSave');
        setGameState({
            playerName: '',
            hp: 100,
            inventory: [],
            currentNode: 'start',
            gameStarted: false,
            gameEnded: false,
            visitedNodes: [],
            appliedEffects: []
        });
    }, []);

    const addItem = useCallback((item) => {
        setGameState(prev => ({
            ...prev,
            inventory: [...prev.inventory, item]
        }));
    }, []);

    const takeDamage = useCallback((damage) => {
        setGameState(prev => ({
            ...prev,
            hp: Math.max(0, prev.hp - damage)
        }));
    }, []);

    const navigateToNode = useCallback((nodeId) => {
        setGameState(prev => ({
            ...prev,
            currentNode: nodeId,
            visitedNodes: [...prev.visitedNodes, prev.currentNode] // Track previous node
        }));
    }, []);

    const applyNodeEffects = useCallback((nodeId, effects) => {
        const effectKey = `${nodeId}_effects`;

        setGameState(prev => {
            // Don't apply effects if already applied for this node
            if (prev.appliedEffects.includes(effectKey)) {
                return prev;
            }

            let newState = {
                ...prev,
                appliedEffects: [...prev.appliedEffects, effectKey]
            };

            // Apply effects
            if (effects.addItem && !prev.inventory.includes(effects.addItem)) {
                newState.inventory = [...newState.inventory, effects.addItem];
            }

            if (effects.takeDamage) {
                newState.hp = Math.max(0, newState.hp - effects.takeDamage);
            }

            return newState;
        });
    }, []);

    const endGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameEnded: true
        }));
    }, []);

    const hasItem = useCallback((item) => {
        return gameState.inventory.includes(item);
    }, [gameState.inventory]);

    const hasAllItems = useCallback((items) => {
        return items.every(item => gameState.inventory.includes(item));
    }, [gameState.inventory]);

    return (
        <GameContext.Provider value={{
            gameState,
            startGame,
            resetGame,
            addItem,
            takeDamage,
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

// Custom hook to use game context
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};