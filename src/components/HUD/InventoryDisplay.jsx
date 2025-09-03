import React from "react";

const getItemIcon = (item) => {
    const icons = {
        Asin: "🧂",
        Bawang: "🧄",
        Agimat: "✨",
        Bolo: "🔪",
    };
    return icons[item] || "📦";
};

const getItemDescription = (item) => {
    const descriptions = {
        Bolo: "Large knife - effective against aswangs",
        Asin: "Blessed salt - harms evil spirits",
        Bawang: "Sacred garlic - repels creatures",
        Agimat: "Protective amulet - shields from harm",
    };
    return descriptions[item] || "Unknown item";
};

const InventoryDisplay = ({ inventory }) => {
    return (
        <div className="hud-inventory">
            <h6 className="hud-label">📦 Inventory</h6>
            {inventory.length === 0 ? (
                <p className="hud-empty">Empty</p>
            ) : (
                <div className="hud-items">
                    {inventory.map((item, index) => (
                        <div
                            key={index}
                            className="hud-item"
                            title={getItemDescription(item)}
                        >
                            <div className="hud-item-icon">{getItemIcon(item)}</div>
                            <small>{item}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InventoryDisplay;
