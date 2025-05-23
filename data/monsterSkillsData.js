const MONSTER_SKILLS_DATA = {
  "MSK001_STRONG_BLOW": {
    id: "MSK001_STRONG_BLOW",
    name: "强力一击",
    type: "attack_boost", // 'attack_boost', 'debuff_player', 'heal_self', 'special_attack'
    description_template: "{monsterName} 使用了强力一击！",
    cooldown: 3, // Rounds before it can be used again
    // currentCooldown will be added to instances
    damageMultiplier: 1.5, 
  },
  "MSK002_QUICK_HEAL": {
    id: "MSK002_QUICK_HEAL",
    name: "快速治疗",
    type: "heal_self",
    description_template: "{monsterName} 进行了快速治疗！",
    cooldown: 4,
    healPercent: 25, // Heals 25% of monster's maxHp
  },
  "MSK003_WEAKENING_CURSE": {
    id: "MSK003_WEAKENING_CURSE",
    name: "虚弱诅咒",
    type: "debuff_player", // Logic for this will be basic for now (logging)
    description_template: "{monsterName} 对你释放了虚弱诅咒！",
    cooldown: 3,
    debuff: { // Data for potential future implementation
       stat: "attack", 
       value: -3,      
       duration: 2    
    }
  }
};

// If not using modules:
// window.MONSTER_SKILLS_DATA = MONSTER_SKILLS_DATA;
