// data/equipmentData.js

const EQUIPMENT_QUALITIES = {
  WHITE: { name: "白色", color: "#FFFFFF", sortOrder: 1 },
  GREEN: { name: "绿色", color: "#00FF00", sortOrder: 2 },
  BLUE: { name: "蓝色", color: "#0000FF", sortOrder: 3 },
  PURPLE: { name: "紫色", color: "#cb4aca", sortOrder: 4 },
  ORANGE: { name: "橙色", color: "#FF7F00", sortOrder: 5 },
  RED: { name: "红色", color: "#FF0000", sortOrder: 6 }
};

const EQUIPMENT_TYPES = {
  WEAPON: "武器",
  ARMOR: "衣服", 
  GLOVES: "手",  
  SHOES: "鞋子",
  RING: "戒指",
  BELT: "腰带",
  SPRITE1: "精灵1", 
  SPRITE2: "精灵2"  
};

// --- NEW: Base Item Stats by Type and Level ---
const BASE_ITEM_STATS_BY_TYPE_AND_LEVEL = {
  [EQUIPMENT_TYPES.WEAPON]: { 
      1: { attack: 10, speed: 0 }, 
      5: { attack: 18, speed: 1 },
      10: { attack: 25, speed: 1 },
      20: { attack: 40, speed: 2 }
  },
  [EQUIPMENT_TYPES.ARMOR]: { 
      1: { defense: 8, hp: 20 },
      5: { defense: 15, hp: 35 },
      10: { defense: 22, hp: 55 },
      20: { defense: 35, hp: 80 }
  },
  [EQUIPMENT_TYPES.GLOVES]: {
      1: { attack: 3, defense: 2},
      5: { attack: 5, defense: 3},
      10: { attack: 8, defense: 5},
      20: { attack: 12, defense: 8}
  },
  [EQUIPMENT_TYPES.SHOES]: {
      1: { speed: 1, defense: 1},
      5: { speed: 1, defense: 2},
      10: { speed: 2, defense: 3},
      20: { speed: 2, defense: 5}
  },
  [EQUIPMENT_TYPES.RING]: {
      1: { hp: 10, attack: 2},
      5: { hp: 20, attack: 4},
      10: { hp: 35, attack: 7},
      20: { hp: 50, attack: 10}
  },
  [EQUIPMENT_TYPES.BELT]: {
      1: { hp: 25, defense: 2},
      5: { hp: 40, defense: 4},
      10: { hp: 60, defense: 6},
      20: { hp: 90, defense: 8}
  }
  // SPRITE1 and SPRITE2 might have more unique stats or only special effects
};

// Helper to get base stats for equipment
function getBaseStatsForEquipment(itemType, itemLevel) {
  const typeLine = BASE_ITEM_STATS_BY_TYPE_AND_LEVEL[itemType];
  if (!typeLine) return {};
  
  let chosenLevelStats = null;
  let bestLevelMatch = 0;

  // Find the highest defined level that is less than or equal to the itemLevel
  for (const definedLevelStr in typeLine) {
      const definedLevel = parseInt(definedLevelStr);
      if (definedLevel <= itemLevel && definedLevel > bestLevelMatch) {
          bestLevelMatch = definedLevel;
          chosenLevelStats = typeLine[definedLevelStr];
      }
  }
  // If no level below or equal itemLevel is found (e.g. itemLevel is 1, but lowest defined is 5),
  // use the lowest available defined stats for that type.
  if (!chosenLevelStats) {
      const lowestDefinedLevel = Math.min(...Object.keys(typeLine).map(k => parseInt(k)));
      chosenLevelStats = typeLine[lowestDefinedLevel.toString()] || {};
  }
  return chosenLevelStats; // Returns a copy of the stats object
}


// --- NEW: Special Effect Data ---
const SPECIAL_EFFECT_RARITY = { 
    WHITE: 1, GREEN: 2, BLUE: 3, PURPLE: 4, ORANGE: 5, RED: 6
};

const SPECIAL_EFFECTS_DATA = {
    // --- Offensive Effects ---
    CRITICAL_HIT: {
         id: "CRITICAL_HIT",
         name: "暴击",
         description: "攻击时 {value}% 概率增加 {critDamageBonus}% 伤害",
         type: "on_attack",
         rarity: SPECIAL_EFFECT_RARITY.PURPLE,
         value: 15, // 15% chance
         critDamageBonus: 50, // 50% extra damage
         appliesTo: [EQUIPMENT_TYPES.WEAPON, EQUIPMENT_TYPES.RING, EQUIPMENT_TYPES.GLOVES]
    },
    COMBO_STRIKE: {
        id: "COMBO_STRIKE",
        name: "连击",
        description: "攻击时 {value}% 概率再次攻击 (上限1次)", // Added max 1 time for simplicity
        type: "on_attack",
        rarity: SPECIAL_EFFECT_RARITY.GREEN,
        value: 10, // 10%
        appliesTo: [EQUIPMENT_TYPES.WEAPON]
    },
    LIFE_STEAL: {
         id: "LIFE_STEAL",
         name: "吸血",
         description: "根据伤害按 {value}% 百分比回复生命",
         type: "on_damage_dealt", 
         rarity: SPECIAL_EFFECT_RARITY.ORANGE,
         value: 10, // 10% of damage dealt is healed
         appliesTo: [EQUIPMENT_TYPES.WEAPON, EQUIPMENT_TYPES.RING]
    },
    // --- Defensive Effects (Placeholders for now, logic not implemented in this subtask) ---
    EVASION: {
        id: "EVASION",
        name: "闪避",
        description: "受到攻击时有 {value}% 概率完全闪避伤害",
        type: "on_defense", // (Needs logic in PVE manager before damage calculation)
        rarity: SPECIAL_EFFECT_RARITY.BLUE,
        value: 8,
        appliesTo: [EQUIPMENT_TYPES.SHOES, EQUIPMENT_TYPES.ARMOR]
    },
    COUNTER_ATTACK: {
        id: "COUNTER_ATTACK",
        name: "反击",
        description: "受到攻击后有 {value}% 概率反击造成 {counterDamageRatio}% 伤害", // (Needs logic after taking damage)
        type: "on_damaged", 
        rarity: SPECIAL_EFFECT_RARITY.PURPLE,
        value: 15, // 15% chance
        counterDamageRatio: 50, // 50% of attacker's attack
        appliesTo: [EQUIPMENT_TYPES.ARMOR, EQUIPMENT_TYPES.BELT]
    },
    // --- Status Effects (Placeholder, logic not implemented in this subtask) ---
    ICE_FREEZE: {
        id: "ICE_FREEZE",
        name: "冰冻",
        description: "攻击时 {value}% 概率冰冻对手，1回合无法行动",
        type: "on_attack_status", // (Needs status effect system in Pet/Monster and PVE manager)
        rarity: SPECIAL_EFFECT_RARITY.BLUE,
        value: 8, 
        appliesTo: [EQUIPMENT_TYPES.WEAPON, EQUIPMENT_TYPES.RING]
    }
};


// Make them available if not using ES6 modules
// window.EQUIPMENT_QUALITIES = EQUIPMENT_QUALITIES;
// window.EQUIPMENT_TYPES = EQUIPMENT_TYPES;
// window.BASE_ITEM_STATS_BY_TYPE_AND_LEVEL = BASE_ITEM_STATS_BY_TYPE_AND_LEVEL;
// window.getBaseStatsForEquipment = getBaseStatsForEquipment;
// window.SPECIAL_EFFECT_RARITY = SPECIAL_EFFECT_RARITY;
// window.SPECIAL_EFFECTS_DATA = SPECIAL_EFFECTS_DATA;

// Helper function to get emoji for equipment type
function getEmojiForEquipmentType(typeValue) {
    // Ensure EQUIPMENT_TYPES is available if this function is called from other files
    // that might be loaded before this one, though ideally data files are first.
    const EMOJIS = {
        [EQUIPMENT_TYPES.WEAPON]: '🗡️',
        [EQUIPMENT_TYPES.ARMOR]: '👕',
        [EQUIPMENT_TYPES.GLOVES]: '🧤',
        [EQUIPMENT_TYPES.SHOES]: '👟',
        [EQUIPMENT_TYPES.RING]: '💍',
        [EQUIPMENT_TYPES.BELT]: '🎗️' 
        // SPRITE1 and SPRITE2 are also in EQUIPMENT_TYPES, but might not have emojis here
        // or are handled differently as they are not typical "equipment" items from blessing.
    };
    return EMOJIS[typeValue] || '❓'; // Default emoji
}
// window.getEmojiForEquipmentType = getEmojiForEquipmentType; // Make global if needed
