// data/spriteData.js

const SPRITE_DEFINITIONS = {
  "SPR001_FIRE": {
    id: "SPR001_FIRE", // Ensure ID is part of definition for easy lookup if needed elsewhere
    name: "炎之小灵",
    maxLevel: 10,
    fragmentsToLevelUp: [5, 10, 15, 25, 40, 60, 80, 100, 150], // For L2, L3,...L10
    baseAttributeBonus: { attack_percent: 2, speed_percent: 1 }, // At level 1
    bonusPerLevel: { attack_percent: 0.5, speed_percent: 0.2 }, // Additional bonus per level from L2 onwards
    skill: {
      name: "烈焰冲击",
      description_template: "对敌人造成 {value} 点火焰伤害 (主动)",
      baseValue: 10, // Skill value at level 1
      valuePerLevel: 5, // Additional skill value per level from L2 onwards
      type: "active"
    },
    icon: '🔥'
  },
  "SPR002_WIND": {
    id: "SPR002_WIND",
    name: "风之精灵",
    maxLevel: 8,
    fragmentsToLevelUp: [8, 12, 20, 30, 50, 70, 90], // For L2...L8
    baseAttributeBonus: { hp_percent: 3, speed_percent: 2 },
    bonusPerLevel: { hp_percent: 0.5, speed_percent: 0.3 },
    skill: {
      name: "风刃",
      description_template: "提升自身速度 {value} 点，持续2回合 (主动)",
      baseValue: 2,
      valuePerLevel: 0.5,
      type: "active"
    },
    icon: '🍃'
  },
  "SPR003_ROCK": {
    id: "SPR003_ROCK",
    name: "岩之守卫",
    maxLevel: 12,
    fragmentsToLevelUp: [3, 6, 10, 15, 20, 28, 38, 50, 65, 80, 100], // For L2...L12
    baseAttributeBonus: { defense_percent: 4 },
    bonusPerLevel: { defense_percent: 0.8 },
    skill: {
      name: "岩石护盾",
      description_template: "为自身附加一个吸收 {value} 点伤害的护盾 (主动)",
      baseValue: 20,
      valuePerLevel: 10,
      type: "active"
    },
    icon: '🪨'
  }
};

// If not using modules:
// window.SPRITE_DEFINITIONS = SPRITE_DEFINITIONS;
