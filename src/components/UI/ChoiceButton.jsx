import React from 'react';
import { useGame } from '../../contexts/GameContext';

const ChoiceButton = ({ choice, onChoiceClick, disabled = false }) => {
    const { hasItem, hasAllItems, gameState } = useGame();

    /**
     * Check if choice should be hidden or shown based on requirements
     */
    const isChoiceVisible = () => {
        // Add debugging logs
        console.log('=== CHOICE DEBUG ===');
        console.log('Choice text:', choice.text);
        console.log('Current inventory:', gameState.inventory);
        console.log('Choice hideIf:', choice.hideIf);
        console.log('Choice hideIfHas:', choice.hideIfHas);
        console.log('Choice requires:', choice.requires);
        console.log('Choice requiresAll:', choice.requiresAll);

        // --- Hide if any "hideIf" item is present ---
        if (choice.hideIf) {
            if (Array.isArray(choice.hideIf)) {
                const shouldHide = choice.hideIf.some(item => {
                    const hasThisItem = hasItem(item);
                    console.log(`Checking hideIf item "${item}": ${hasThisItem}`);
                    return hasThisItem;
                });
                if (shouldHide) {
                    console.log('Choice HIDDEN due to hideIf array');
                    return false;
                }
            } else if (hasItem(choice.hideIf)) {
                console.log(`Choice HIDDEN due to hideIf item "${choice.hideIf}"`);
                return false;
            }
        }

        // --- NEW: Hide if any "hideIfHas" item is present ---
        // This is more intuitive - hide the choice when you DO have the item
        if (choice.hideIfHas) {
            if (Array.isArray(choice.hideIfHas)) {
                const shouldHide = choice.hideIfHas.some(item => {
                    const hasThisItem = hasItem(item);
                    console.log(`Checking hideIfHas item "${item}": ${hasThisItem}`);
                    return hasThisItem;
                });
                if (shouldHide) {
                    console.log('Choice HIDDEN due to hideIfHas array');
                    return false;
                }
            } else if (hasItem(choice.hideIfHas)) {
                console.log(`Choice HIDDEN due to hideIfHas item "${choice.hideIfHas}"`);
                return false;
            }
        }

        // --- Requires: Show only if you have at least one required item ---
        if (choice.requires) {
            if (Array.isArray(choice.requires)) {
                const hasRequired = choice.requires.some(item => {
                    const hasThisItem = hasItem(item);
                    console.log(`Checking requires item "${item}": ${hasThisItem}`);
                    return hasThisItem;
                });
                if (!hasRequired) {
                    console.log('Choice HIDDEN due to missing requires array');
                    return false;
                }
            } else if (!hasItem(choice.requires)) {
                console.log(`Choice HIDDEN due to missing requires item "${choice.requires}"`);
                return false;
            }
        }

        // --- RequiresAll: Show only if ALL items are present ---
        if (choice.requiresAll) {
            if (Array.isArray(choice.requiresAll)) {
                const hasAllRequired = hasAllItems(choice.requiresAll);
                console.log(`Checking requiresAll array: ${hasAllRequired}`);
                if (!hasAllRequired) {
                    console.log('Choice HIDDEN due to missing requiresAll array');
                    return false;
                }
            } else if (!hasItem(choice.requiresAll)) {
                console.log(`Choice HIDDEN due to missing requiresAll item "${choice.requiresAll}"`);
                return false;
            }
        }

        console.log('Choice VISIBLE');
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
        console.log('Choice not rendered (hidden)');
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