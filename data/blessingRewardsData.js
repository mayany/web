// data/blessingRewardsData.js

// Assumes EQUIPMENT_QUALITIES, EQUIPMENT_TYPES are globally available from data/equipmentData.js
// Assumes SPRITE_DEFINITIONS is globally available from data/spriteData.js

const BLESSING_REWARDS_POOL = [
    // Pet Experience
    { type: "PET_EXPERIENCE", weight: 30, details: { amount: 20 } }, 
    { type: "PET_EXPERIENCE", weight: 20, details: { amount: 50 } }, 

    // Equipment (details like quality/type will be generated on-the-fly by GameManager.performBlessing)
    { type: "EQUIPMENT", weight: 25 }, 

    // Sprite Fragments
    // Ensure these sprite IDs match those in data/spriteData.js
    { type: "SPRITE_FRAGMENT", weight: 15, details: { spriteId: "SPR001_FIRE", amount: 2 } },
    { type: "SPRITE_FRAGMENT", weight: 15, details: { spriteId: "SPR002_WIND", amount: 2 } },
    { type: "SPRITE_FRAGMENT", weight: 10, details: { spriteId: "SPR003_ROCK", amount: 2 } }, // Make sure SPR003_ROCK is defined in spriteData.js

    // Full Sprites (rarer)
    { type: "SPRITE_FULL", weight: 2, details: { spriteId: "SPR001_FIRE" } },
    { type: "SPRITE_FULL", weight: 2, details: { spriteId: "SPR002_WIND" } },
    { type: "SPRITE_FULL", weight: 1, details: { spriteId: "SPR003_ROCK" } } 
];

// Note: The function getRandomBlessingReward will be part of GameManager.performBlessing().
// The function getEmojiForEquipmentType will be added to data/equipmentData.js.

// If not using modules:
// window.BLESSING_REWARDS_POOL = BLESSING_REWARDS_POOL;
