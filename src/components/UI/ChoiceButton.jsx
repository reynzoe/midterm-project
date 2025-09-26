import React from 'react';
import { useGame } from '../../contexts/GameContext';

const ChoiceButton = ({ choice, onChoiceClick, disabled = false }) => {
    const { hasItem, hasAllItems } = useGame();

    /**
     * Check if choice should be hidden or shown based on requirements
     */
    const isChoiceVisible = () => {
        // --- Hide if any "hideIf" item is present ---
        if (choice.hideIf) {
            if (Array.isArray(choice.hideIf)) {
                const shouldHide = choice.hideIf.some(item => hasItem(item));
                if (shouldHide) return false;
            } else if (hasItem(choice.hideIf)) {
                return false;
            }
        }

        // --- Hide if any "hideIfHas" item is present ---
        if (choice.hideIfHas) {
            if (Array.isArray(choice.hideIfHas)) {
                const shouldHide = choice.hideIfHas.some(item => hasItem(item));
                if (shouldHide) return false;
            } else if (hasItem(choice.hideIfHas)) {
                return false;
            }
        }

        // --- Requires: Show only if you have at least one required item ---
        if (choice.requires) {
            if (Array.isArray(choice.requires)) {
                const hasRequired = choice.requires.some(item => hasItem(item));
                if (!hasRequired) return false;
            } else if (!hasItem(choice.requires)) {
                return false;
            }
        }

        // --- RequiresAll: Show only if ALL items are present ---
        if (choice.requiresAll) {
            if (Array.isArray(choice.requiresAll)) {
                if (!hasAllItems(choice.requiresAll)) return false;
            } else if (!hasItem(choice.requiresAll)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Get button style based on choice type
     */
    const getButtonClass = () => {
        return "choice-button";
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
