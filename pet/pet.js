class Pet {
  constructor(id, name = "灵小宠") {
    this.id = id;
    this.name = name;
    this.level = 1;
    this.experience = 0;
    
    // Initialize stats using setInitialStats, which now also calls recalculateStats implicitly
    // by virtue of recalculateStats being called at the end of this constructor.
    this.setInitialStats(id); 

    this.maxExperience = this.calculateMaxExperience();
    this.emoji = "";
    this.setEmoji();

    this.equipmentSlots = {
      [EQUIPMENT_TYPES.WEAPON]: null,
      [EQUIPMENT_TYPES.ARMOR]: null,
      [EQUIPMENT_TYPES.GLOVES]: null,
      [EQUIPMENT_TYPES.SHOES]: null,
      [EQUIPMENT_TYPES.RING]: null,
      [EQUIPMENT_TYPES.BELT]: null,
    };
    
    this.spriteSlots = {
        [EQUIPMENT_TYPES.SPRITE1]: null, 
        [EQUIPMENT_TYPES.SPRITE2]: null
    };
    this.recalculateStats(); // Initial calculation of all stats
  }

  calculateBaseHpForLevel(level) {
    if (level === 1) return 20;
    return 20 + (level - 1) * (10 + Math.floor((level - 1) / 10) * 2);
  }

  calculateBaseAttackForLevel(level) {
    if (level === 1) return 5;
    return parseFloat((5 + (level - 1) * (2 + Math.floor((level - 1) / 10) * 0.5)).toFixed(1));
  }

  calculateBaseDefenseForLevel(level) {
    if (level === 1) return 3;
    return parseFloat((3 + (level - 1) * (1 + Math.floor((level - 1) / 10) * 0.3)).toFixed(1));
  }

  calculateBaseSpeedForLevel(level) {
    if (level === 1) return 1;
    return 1 + Math.floor((level - 1) / 5);
  }

  setInitialStats(id) { 
    this.level = 1; 
    // These effectively set the "base" for level 1. recalculateStats will use these.
    this.maxHp = this.calculateBaseHpForLevel(1);
    this.hp = this.maxHp;   
    this.attack = this.calculateBaseAttackForLevel(1);
    this.defense = this.calculateBaseDefenseForLevel(1);
    this.speed = this.calculateBaseSpeedForLevel(1);
    // No need to call recalculateStats() here, constructor will do it once all slots are initialized.
  }

  setEmoji() {
    const emojis = { 1132: "🐅", 1144: "🐇", 1154: "🐉", 1161: "🐍", 1168: "🐎" };
    this.emoji = emojis[this.id] || "❓";
  }

  calculateMaxExperience() {
    if (this.level >= 100) return Infinity;
    return this.level * 50 + 50;
  }

  gainExperience(amount) {
    if (this.level >= 100) { return; }
    this.experience += amount;
    while (this.experience >= this.maxExperience && this.level < 100) {
      this.levelUp();
    }
  }

  levelUp() {
    if (this.level >= 100) { return; }
    this.experience -= this.maxExperience; 
    this.level++;
    console.log(`🎉 ${this.name} 升级了! 当前等级: ${this.level} 🎉`);
    this.maxExperience = this.calculateMaxExperience();
    this.recalculateStats(); 
    if (this.experience < 0) this.experience = 0;
    if (this.level >= 100) { this.experience = 0; }
  }

  equipItem(item) {
    if (!item || !(item instanceof Equipment)) { return null; }
    const itemType = item.type;
    if (!this.equipmentSlots.hasOwnProperty(itemType)) { return null; }
    let replacedItem = this.equipmentSlots[itemType];
    this.equipmentSlots[itemType] = item;
    this.recalculateStats(); 
    return replacedItem; 
  }

  unequipItem(itemTypeValue) { 
    if (!Object.values(EQUIPMENT_TYPES).includes(itemTypeValue)) { return null; }
    // Ensure it's not a sprite slot being unequipped here
    if (itemTypeValue === EQUIPMENT_TYPES.SPRITE1 || itemTypeValue === EQUIPMENT_TYPES.SPRITE2) {
        console.warn(`Use unequipSprite for sprite slots, not unequipItem. Slot: ${itemTypeValue}`);
        return null;
    }
    let unequippedItem = this.equipmentSlots[itemTypeValue];
    if (unequippedItem) {
      this.equipmentSlots[itemTypeValue] = null;
      this.recalculateStats();
      return unequippedItem;
    }
    return null;
  }

  equipSprite(spriteInstance, slotKey) {
    if (!spriteInstance || !(spriteInstance instanceof Sprite)) {
        console.error("无效的精灵对象，无法装备。");
        return null;
    }
    if (!this.spriteSlots.hasOwnProperty(slotKey)) {
        console.error("无效的精灵槽位Key:", slotKey);
        return null;
    }
    let replacedSprite = this.spriteSlots[slotKey];
    this.spriteSlots[slotKey] = spriteInstance;
    console.log(`将精灵 ${spriteInstance.name} (Lv.${spriteInstance.level}) 装备到了 ${slotKey}。`);
    this.recalculateStats();
    return replacedSprite; 
  }
  
  unequipSprite(slotKey) {
    if (!this.spriteSlots.hasOwnProperty(slotKey)) {
        console.error("无效的精灵槽位Key:", slotKey);
        return null;
    }
    let unequippedSprite = this.spriteSlots[slotKey];
    if (unequippedSprite) {
        this.spriteSlots[slotKey] = null;
        console.log(`从 ${slotKey} 槽位卸下了精灵 ${unequippedSprite.name}。`);
        this.recalculateStats();
        return unequippedSprite;
    }
    return null;
  }


  recalculateStats() {
    // 1. Get base stats for current level
    let flatMaxHp = this.calculateBaseHpForLevel(this.level);
    let flatAttack = this.calculateBaseAttackForLevel(this.level);
    let flatDefense = this.calculateBaseDefenseForLevel(this.level);
    let flatSpeed = this.calculateBaseSpeedForLevel(this.level);

    // 2. Accumulate flat bonuses from equipment
    for (const typeKey in this.equipmentSlots) {
        const item = this.equipmentSlots[typeKey];
        if (item && item.baseStats) {
            flatMaxHp += (item.baseStats.hp || 0);
            flatAttack += (item.baseStats.attack || 0);
            flatDefense += (item.baseStats.defense || 0);
            flatSpeed += (item.baseStats.speed || 0);
        }
    }

    // These are now the stats BEFORE percentage modifiers from sprites
    // (hpBeforeSprites, attackBeforeSprites, etc. are effectively flatMaxHp, flatAttack now)

    // 3. Accumulate total percentage bonuses from sprites
    let totalHpPercentBonus = 0;
    let totalAttackPercentBonus = 0;
    let totalDefensePercentBonus = 0;
    let totalSpeedPercentBonus = 0;

    for (const slotKey in this.spriteSlots) {
        const sprite = this.spriteSlots[slotKey];
        if (sprite && sprite.attributeBonus) { 
            totalHpPercentBonus += (sprite.attributeBonus.hp_percent || 0);
            totalAttackPercentBonus += (sprite.attributeBonus.attack_percent || 0);
            totalDefensePercentBonus += (sprite.attributeBonus.defense_percent || 0);
            totalSpeedPercentBonus += (sprite.attributeBonus.speed_percent || 0);
        }
    }

    // 4. Apply percentage bonuses to the (base + flat equipment) stats
    this.maxHp = flatMaxHp * (1 + totalHpPercentBonus / 100);
    this.attack = flatAttack * (1 + totalAttackPercentBonus / 100);
    this.defense = flatDefense * (1 + totalDefensePercentBonus / 100);
    this.speed = flatSpeed * (1 + totalSpeedPercentBonus / 100);
    
    // Round final stats as per prompt's last example (all to Math.round)
    this.maxHp = Math.round(this.maxHp);
    this.attack = Math.round(this.attack); 
    this.defense = Math.round(this.defense);
    this.speed = Math.round(this.speed);

    // 5. Set current HP 
    // Preserve current HP percentage relative to old maxHp is complex here because old maxHp isn't passed.
    // Simplest is to heal to full, or cap current if it was higher than new max.
    // The prompt's last recalculateStats example implies this.hp = this.maxHp;
    this.hp = Math.min(this.hp, this.maxHp); // Cap current HP if it was > new maxHp
    if (this.hp < this.maxHp && this.hp > 0) { 
        // If pet was damaged, and maxHP increased, it's a design choice:
        // 1. Heal to full (this.hp = this.maxHp) - current choice
        // 2. Maintain damage (e.g. if was at 50/100, now at X / newMaxHp where X/newMaxHp = 0.5)
        // 3. Add the difference in maxHp to current hp.
        // For now, setting to maxHp on any significant stat change like this simplifies things.
         this.hp = this.maxHp;
    } else if (this.hp <= 0 && this.maxHp > 0) { // If pet was "dead" but gained HP
        this.hp = this.maxHp; // Revive to full
    } else {
        this.hp = this.maxHp; // Default to full HP
    }


    // Ensure non-negative and minimums
    this.maxHp = Math.max(1, this.maxHp); // Min 1 maxHp
    this.hp = Math.max(0, Math.min(this.hp, this.maxHp)); 
    this.attack = Math.max(0, this.attack);
    this.defense = Math.max(0, this.defense);
    this.speed = Math.max(0, this.speed);
    
    // console.log(`Stats recalculated for ${this.name}. MaxHP: ${this.maxHp}, HP: ${this.hp}, Atk: ${this.attack}, Def: ${this.defense}, Spd: ${this.speed}`);
  }


  dismantleEquipment(item) {
    if (!item || !(item instanceof Equipment)) { return false; }
    const experienceGained = 10; 
    this.gainExperience(experienceGained);
    console.log(`分解了装备 ${item.name} (品质: ${item.quality.name})，获得了 ${experienceGained} 点经验。`);
    return true;
  }
}
