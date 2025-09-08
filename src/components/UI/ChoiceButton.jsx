import React from 'react';
import { useGame } from '../../contexts/GameContext';

const ChoiceButton = ({ choice, onChoiceClick, disabled = false }) => {
    const { hasItem, hasAllItems } = useGame();

    /**
     * Check if choice should be hidden based on requirements
     */
    const isChoiceVisible = () => {
        // Hide if hideIf condition is met
        if (choice.hideIf && hasItem(choice.hideIf)) {
            return false;
        }

        // Show only if requirements are met
        if (choice.requires && !hasItem(choice.requires)) {
            return false;
        }

        if (choice.requiresAll && !hasAllItems(choice.requiresAll)) {
            return false;
        }

        return true;
    };

    /**
     * Get button style based on choice type
     */
    const getButtonClass = () => {
        return "choice-button"; // force your retro style
    };

    // Don't render if choice should be hidden
    if (!isChoiceVisible()) {
        return null;
    }

    return (
        <button
            onClick={() => onChoiceClick(choice)}
            className={getButtonClass()}
            disabled={disabled}
        >
            {choice.text}
        </button>
    );
};

export default ChoiceButton;
