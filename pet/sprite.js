// pet/sprite.js

class Sprite {
  constructor(spriteId) {
    // SPRITE_DEFINITIONS should be globally available from data/spriteData.js
    if (typeof SPRITE_DEFINITIONS === 'undefined' || !SPRITE_DEFINITIONS[spriteId]) {
      throw new Error(`Sprite definition not found for ID: ${spriteId}`);
    }
    const definition = SPRITE_DEFINITIONS[spriteId];

    this.id = spriteId;
    this.name = definition.name;
    this.level = 1;
    this.maxLevel = definition.maxLevel;
    this.fragments = 0;
    this.fragmentsToLevelUpData = definition.fragmentsToLevelUp; // Array: e.g. [5, 10, 15...] for L2, L3, L4
    
    this.baseAttributeBonusData = definition.baseAttributeBonus; // e.g., { attack_percent: 2 }
    this.bonusPerLevelData = definition.bonusPerLevel;     // e.g., { attack_percent: 0.5 }
    
    this.skillData = definition.skill; // { name, description_template, baseValue, valuePerLevel, type }
    this.icon = definition.icon;

    // Initialize attributeBonus and skill.value based on current level (which is 1)
    this.attributeBonus = {}; // This will store the calculated bonuses for the current level
    this.skill = {};          // This will store the skill details for the current level
    this.updateStatsForCurrentLevel(); 
    // console.log(`Sprite ${this.name} (L${this.level}) created. Fragments: ${this.fragments}/${this.getFragmentsNeededForNextLevel()}`);
  }

  updateStatsForCurrentLevel() {
    // Calculate attribute bonuses for the current level
    this.attributeBonus = {}; // Reset current bonuses
    for (const stat in this.baseAttributeBonusData) {
      const baseStatValue = this.baseAttributeBonusData[stat] || 0;
      const perLevelValue = this.bonusPerLevelData[stat] || 0;
      this.attributeBonus[stat] = parseFloat((baseStatValue + perLevelValue * (this.level - 1)).toFixed(2));
    }

    // Calculate skill values for the current level
    this.skill = { ...this.skillData }; // Clone base skill data
    const skillBaseValue = this.skillData.baseValue || 0;
    const skillValuePerLevel = this.skillData.valuePerLevel || 0;
    this.skill.value = parseFloat((skillBaseValue + skillValuePerLevel * (this.level - 1)).toFixed(2));
    
    // Update skill description with the new value
    if (this.skillData.description_template) {
      this.skill.description = this.skillData.description_template.replace("{value}", this.skill.value);
    } else {
      this.skill.description = this.skillData.name; // Fallback
    }
    // console.log(`Sprite ${this.name} L${this.level} stats updated. Bonus:`, this.attributeBonus, `Skill Value: ${this.skill.value}`);
  }

  getFragmentsNeededForNextLevel() {
    if (this.level >= this.maxLevel) {
      return Infinity; // Already at max level
    }
    // fragmentsToLevelUpData is an array where index 0 = fragments for level 2
    // So for current level `this.level`, we need fragments at index `this.level - 1`
    return this.fragmentsToLevelUpData[this.level - 1] || Infinity; // Return Infinity if data not found
  }

  levelUp() {
    if (this.level >= this.maxLevel) {
      // console.log(`${this.name} 已达到最高等级 (L${this.maxLevel})!`);
      return false;
    }

    const needed = this.getFragmentsNeededForNextLevel();
    if (this.fragments >= needed) {
      this.fragments -= needed;
      this.level++;
      this.updateStatsForCurrentLevel();
      console.log(`🎉 ${this.name} 升级到 Lv.${this.level}! 剩余碎片: ${this.fragments}`);
      
      // If this sprite is equipped by the player's pet, trigger a stat recalculation for the pet.
      // Assuming gameManager and gameManager.playerPet are globally accessible here.
      if (typeof gameManager !== 'undefined' && gameManager.playerPet) {
        let petNeedsRecalc = false;
        for (const slotKey in gameManager.playerPet.spriteSlots) {
          if (gameManager.playerPet.spriteSlots[slotKey] === this) {
            petNeedsRecalc = true;
            break;
          }
        }
        if (petNeedsRecalc) {
          // console.log(`Sprite ${this.name} leveled up while equipped. Recalculating pet stats.`);
          gameManager.playerPet.recalculateStats();
        }
      }
      return true;
    } else {
      // console.log(`${this.name} Lv.${this.level} 升级失败, 需要 ${needed} 碎片, 当前拥有 ${this.fragments}`);
      return false;
    }
  }
}

// If not using modules:
// window.Sprite = Sprite;
