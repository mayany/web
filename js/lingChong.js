// js/lingChong.js

/**
 * Represents the player's LingChong (Spirit Pet).
 * Manages its stats, level, experience, equipment, and sprites.
 */
class LingChong {
    /**
     * Creates a new LingChong instance.
     * @param {string} appearanceId - The ID of the chosen appearance from GameData.lingChong.appearanceOptions.
     * @param {string} [name="灵虚子"] - The name of the LingChong.
     */
    constructor(appearanceId, name = "灵虚子") {
        const appearanceData = GameData.lingChong.appearanceOptions.find(opt => opt.id === appearanceId);
        if (!appearanceData) {
            throw new Error(`无效的灵宠造型ID: ${appearanceId}`);
        }

        this.id = Utils.generateUUID(); // 灵宠实例的唯一ID
        this.name = name;
        this.appearance = Utils.deepClone(appearanceData); // {id, name, icon, description}

        this.level = 1;
        this.currentExp = 0;
        this.stats = Utils.deepClone(GameData.lingChong.initialStats); // 基础属性 {hp, attack, defense, speed}
        this.maxLevel = GameData.lingChong.maxLevel;

        // 初始化装备槽
        this.equipment = {};
        for (const typeKey in GameData.equipment.types) {
            // SPRITE_1 and SPRITE_2 are for Sprite class instances, not Equipment class instances
            if (typeKey !== 'SPRITE_1' && typeKey !== 'SPRITE_2') {
                 this.equipment[GameData.equipment.types[typeKey].id] = null; // e.g., this.equipment.WEAPON = null
            }
        }

        // 初始化精灵槽
        this.sprites = {
            [GameData.equipment.types.SPRITE_1.id]: null,
            [GameData.equipment.types.SPRITE_2.id]: null
        };

        this.qifuVouchers = 0; // 祈福券数量
        this.pvePoints = 0; // PVE闯关积分

        // 用于PVE战斗的当前血量
        this.currentHp = this.stats.hp;


        console.log(`灵宠 "${this.name}" (${this.appearance.name}) 已成功创建！等级: ${this.level}`);
    }

    /**
     * Adds experience to the LingChong and handles leveling up.
     * @param {number} amount - The amount of experience to add.
     */
    addExp(amount) {
        if (this.level >= this.maxLevel) {
            UI.showMessage("灵宠已达到最高等级！", 2000);
            return;
        }
        if (amount <= 0) return;

        this.currentExp += amount;
        UI.showMessage(`获得 ${amount} 点经验！`, 1500);

        let expForNextLevel = getExpForLevel(this.level);
        while (this.level < this.maxLevel && this.currentExp >= expForNextLevel) {
            this.currentExp -= expForNextLevel;
            this.levelUp();
            expForNextLevel = getExpForLevel(this.level); // 更新下一级所需经验
            if (this.level >= this.maxLevel) {
                this.currentExp = 0; // 满级后经验清零或设为上限值
                break;
            }
        }
        // 确保当前经验不会超过升级所需经验（除非满级）
        if (this.level < this.maxLevel && this.currentExp > expForNextLevel) {
            this.currentExp = expForNextLevel -1; // 避免显示 xx / yy (xx > yy)
        }


        // 更新UI (通常在Game主逻辑中调用UI更新)
        // if (window.Game) Game.updatePlayerUI();
    }

    /**
     * Handles the LingChong leveling up.
     * Increases stats and updates relevant properties.
     */
    levelUp() {
        this.level++;
        const growth = GameData.lingChong.statGrowthPerLevel;
        this.stats.hp += growth.hp;
        this.stats.attack += growth.attack;
        this.stats.defense += growth.defense;
        this.stats.speed = parseFloat((this.stats.speed + growth.speed).toFixed(1));

        // 升级时完全恢复HP
        this.currentHp = this.getTotalStats().hp;


        UI.showMessage(`恭喜！灵宠 "${this.name}" 升级至 Lv.${this.level}！各项属性提升！`, 3000);

        if (this.level >= this.maxLevel) {
            UI.showMessage(`"${this.name}" 已达到最高等级 ${this.maxLevel}！`, 3000);
        }
    }

    /**
     * Equips an item to the specified slot.
     * @param {Equipment} itemInstance - The instance of the Equipment to equip.
     * @param {string} slotType - The equipment slot type (e.g., GameData.equipment.types.WEAPON.id).
     * @returns {Equipment|null} The previously equipped item, or null if the slot was empty or equip failed.
     */
    equipItem(itemInstance, slotType) {
        if (!(itemInstance instanceof Equipment)) {
            console.error("装备失败: 提供的不是一个有效的装备对象。", itemInstance);
            UI.showMessage("装备失败：物品无效。", 2000);
            return null;
        }
        if (itemInstance.type !== slotType) {
            console.error(`装备失败: 物品类型 (${itemInstance.type}) 与槽位类型 (${slotType}) 不匹配。`);
            UI.showMessage("装备失败：物品与槽位不匹配。", 2000);
            return null;
        }
        if (!this.equipment.hasOwnProperty(slotType)) {
            console.error(`装备失败: 无效的装备槽位 ${slotType}`);
            UI.showMessage("装备失败：无效的槽位。", 2000);
            return null;
        }

        const oldItem = this.equipment[slotType];
        this.equipment[slotType] = itemInstance;
        UI.showMessage(`成功装备 ${itemInstance.name} 到 ${GameData.equipment.types[slotType].name} 槽位。`, 2000);
        // Recalculate stats and update UI (typically done in main game loop or via event)
        this.currentHp = this.getTotalStats().hp; // 装备变化可能影响最大HP，血量可能需要调整
        return oldItem;
    }

    /**
     * Unequips an item from the specified slot.
     * @param {string} slotType - The equipment slot type.
     * @returns {Equipment|null} The unequipped item, or null if the slot was empty.
     */
    unequipItem(slotType) {
        if (!this.equipment.hasOwnProperty(slotType)) {
            console.error(`卸装失败: 无效的装备槽位 ${slotType}`);
            return null;
        }
        const itemToUnequip = this.equipment[slotType];
        if (itemToUnequip) {
            this.equipment[slotType] = null;
            UI.showMessage(`已卸下 ${itemToUnequip.name}。`, 2000);
            // Recalculate stats and update UI
            this.currentHp = Math.min(this.currentHp, this.getTotalStats().hp); // 确保当前血量不超过新的最大血量
            if(this.currentHp <= 0) this.currentHp = 1; // 避免0血
            return itemToUnequip;
        }
        return null;
    }

    /**
     * Equips a sprite to the specified sprite slot.
     * @param {Sprite} spriteInstance - The instance of the Sprite to equip.
     * @param {string} slotId - The sprite slot ID (e.g., GameData.equipment.types.SPRITE_1.id).
     * @returns {Sprite|null} The previously equipped sprite, or null.
     */
    equipSprite(spriteInstance, slotId) {
        if (!(spriteInstance instanceof Sprite)) {
            console.error("装备精灵失败: 提供的不是一个有效的精灵对象。", spriteInstance);
            UI.showMessage("装备精灵失败：物品无效。", 2000);
            return null;
        }
        if (!this.sprites.hasOwnProperty(slotId)) {
            console.error(`装备精灵失败: 无效的精灵槽位 ${slotId}`);
            UI.showMessage("装备精灵失败：无效的槽位。", 2000);
            return null;
        }

        const oldSprite = this.sprites[slotId];
        this.sprites[slotId] = spriteInstance;
        UI.showMessage(`成功装备精灵 ${spriteInstance.name}。`, 2000);
        this.currentHp = this.getTotalStats().hp;
        return oldSprite;
    }

    /**
     * Unequips a sprite from the specified slot.
     * @param {string} slotId - The sprite slot ID.
     * @returns {Sprite|null} The unequipped sprite, or null.
     */
    unequipSprite(slotId) {
        if (!this.sprites.hasOwnProperty(slotId)) {
            console.error(`卸下精灵失败: 无效的精灵槽位 ${slotId}`);
            return null;
        }
        const spriteToUnequip = this.sprites[slotId];
        if (spriteToUnequip) {
            this.sprites[slotId] = null;
            UI.showMessage(`已卸下精灵 ${spriteToUnequip.name}。`, 2000);
            this.currentHp = Math.min(this.currentHp, this.getTotalStats().hp);
             if(this.currentHp <= 0) this.currentHp = 1;
            return spriteToUnequip;
        }
        return null;
    }

    /**
     * Calculates and returns the total stats of the LingChong, including equipment and sprite bonuses.
     * @returns {object} An object containing all calculated stats (hp, attack, defense, speed, and potentially effects).
     */
    getTotalStats() {
        const totalStats = Utils.deepClone(this.stats); // Start with base stats

        // 1. Add flat stats from equipment
        for (const slotType in this.equipment) {
            const item = this.equipment[slotType];
            if (item instanceof Equipment) {
                for (const statKey in item.baseStats) {
                    if (totalStats.hasOwnProperty(statKey)) {
                        totalStats[statKey] += item.baseStats[statKey];
                    } else {
                        totalStats[statKey] = item.baseStats[statKey]; // For stats not in base (e.g. crit from equip)
                    }
                }
            }
        }

        // 2. Apply percentage bonuses from sprites
        // These percentages apply to the (base + equipment flat stats)
        for (const slotId in this.sprites) {
            const sprite = this.sprites[slotId];
            if (sprite instanceof Sprite) {
                for (const attrKey in sprite.baseAttrPercent) {
                    if (totalStats.hasOwnProperty(attrKey)) {
                        totalStats[attrKey] += Math.floor(this.stats[attrKey] * sprite.baseAttrPercent[attrKey]); // Sprites usually buff base stats
                        // Or buff (base + equip): totalStats[attrKey] * (1 + sprite.baseAttrPercent[attrKey])
                        // For simplicity, let's assume sprite buffs base stats for now as per document.
                        // A more common approach: (Base + FlatEquip) * (1 + SpritePercent)
                        // Let's refine:
                        // totalStats[attrKey] = Math.floor(totalStats[attrKey] * (1 + sprite.baseAttrPercent[attrKey]));
                    }
                }
            }
        }
        // Refined sprite stat calculation:
        // Calculate sum of base + flat equip stats first.
        const baseAndEquipStats = Utils.deepClone(this.stats);
        for (const slotType in this.equipment) {
            const item = this.equipment[slotType];
            if (item instanceof Equipment) {
                for (const statKey in item.baseStats) {
                    if (baseAndEquipStats.hasOwnProperty(statKey)) {
                        baseAndEquipStats[statKey] += item.baseStats[statKey];
                    } else {
                         baseAndEquipStats[statKey] = item.baseStats[statKey];
                    }
                }
            }
        }

        const finalStats = Utils.deepClone(baseAndEquipStats);
        for (const slotId in this.sprites) {
            const sprite = this.sprites[slotId];
            if (sprite instanceof Sprite) {
                for (const attrKey in sprite.baseAttrPercent) {
                    if (baseAndEquipStats.hasOwnProperty(attrKey)) { // Ensure the stat exists to be buffed
                         // Additive percentage: add the bonus amount to the stat
                        finalStats[attrKey] += Math.floor(baseAndEquipStats[attrKey] * sprite.baseAttrPercent[attrKey]);
                    }
                }
            }
        }


        // Ensure speed is to one decimal place
        if (finalStats.speed) {
            finalStats.speed = parseFloat(finalStats.speed.toFixed(1));
        }

        // Collect all active effects from equipment
        finalStats.activeEffects = [];
        for (const slotType in this.equipment) {
            const item = this.equipment[slotType];
            if (item instanceof Equipment && item.effects && item.effects.length > 0) {
                finalStats.activeEffects.push(...item.effects);
            }
        }

        return finalStats;
    }

    /**
     * Gets a specific total stat value.
     * @param {string} statName - The name of the stat (e.g., 'hp', 'attack').
     * @returns {number} The value of the stat.
     */
    getStat(statName) {
        return this.getTotalStats()[statName] || 0;
    }

    /**
     * Adds祈福券 (Qifu Vouchers).
     * @param {number} amount - The amount of vouchers to add.
     */
    addQifuVoucher(amount) {
        this.qifuVouchers += amount;
        UI.showMessage(`获得 ${amount} 张祈福券！`, 2000);
    }

    /**
     * Uses one祈福券.
     * @returns {boolean} True if a voucher was used, false otherwise.
     */
    useQifuVoucher() {
        if (this.qifuVouchers > 0) {
            this.qifuVouchers--;
            // UI.showMessage("消耗 1 张祈福券。", 1500); // Usually shown after successful qifu
            return true;
        }
        UI.showMessage("祈福券不足！", 2000);
        return false;
    }

    /**
     * Adds PVE points.
     * @param {number} amount - The amount of points to add.
     */
    addPvePoints(amount) {
        this.pvePoints += amount;
        UI.showMessage(`获得 ${amount} 点闯关积分！`, 1500);
    }


    /**
     * Heals the LingChong by a certain amount or to full.
     * @param {number} [amount=null] - Amount to heal. If null, heals to full HP.
     */
    heal(amount = null) {
        const maxHp = this.getTotalStats().hp;
        if (amount === null) {
            this.currentHp = maxHp;
        } else {
            this.currentHp = Math.min(maxHp, this.currentHp + amount);
        }
    }

    /**
     * Takes damage.
     * @param {number} damageAmount - The amount of damage to take.
     * @returns {boolean} True if the LingChong is defeated (HP <= 0).
     */
    takeDamage(damageAmount) {
        this.currentHp -= damageAmount;
        if (this.currentHp < 0) this.currentHp = 0;
        return this.currentHp <= 0;
    }


    /**
     * Saves the LingChong's state to a plain JavaScript object.
     * @returns {object} The LingChong's state.
     */
    saveState() {
        const state = {
            name: this.name,
            appearanceId: this.appearance.id,
            level: this.level,
            currentExp: this.currentExp,
            baseStats: Utils.deepClone(this.stats), // Save the base stats at current level
            equipment: {},
            sprites: {},
            qifuVouchers: this.qifuVouchers,
            pvePoints: this.pvePoints,
            // currentHp is not saved, should be full on load or based on context
        };

        for (const slot in this.equipment) {
            if (this.equipment[slot]) {
                // Save enough info to reconstruct the equipment
                state.equipment[slot] = {
                    type: this.equipment[slot].type,
                    quality: this.equipment[slot].quality,
                    level: this.equipment[slot].level,
                    // name: this.equipment[slot].name, // Name can be regenerated
                    // Potentially save effects if they are uniquely generated and not purely from type/quality/level
                    // For now, assume effects are regenerated. If specific rolls on effects are saved:
                    // effects: Utils.deepClone(this.equipment[slot].effects)
                };
            } else {
                state.equipment[slot] = null;
            }
        }
        for (const slot in this.sprites) {
            if (this.sprites[slot]) {
                state.sprites[slot] = {
                    spriteId: this.sprites[slot].spriteId,
                    level: this.sprites[slot].level,
                    currentFragments: this.sprites[slot].currentFragments
                };
            } else {
                state.sprites[slot] = null;
            }
        }
        return state;
    }

    /**
     * Loads the LingChong's state from a saved object.
     * @param {object} savedState - The state object to load.
     */
    loadState(savedState) {
        if (!savedState) return;

        this.name = savedState.name || "灵虚子";
        const appearanceData = GameData.lingChong.appearanceOptions.find(opt => opt.id === savedState.appearanceId);
        this.appearance = appearanceData ? Utils.deepClone(appearanceData) : Utils.deepClone(GameData.lingChong.appearanceOptions[0]);

        this.level = savedState.level || 1;
        this.currentExp = savedState.currentExp || 0;
        this.stats = savedState.baseStats ? Utils.deepClone(savedState.baseStats) : Utils.deepClone(GameData.lingChong.initialStats);
        
        // Recalculate stats if baseStats weren't saved correctly for the level
        if (!savedState.baseStats) {
            this.stats = Utils.deepClone(GameData.lingChong.initialStats);
            for (let i = 1; i < this.level; i++) {
                 const growth = GameData.lingChong.statGrowthPerLevel;
                 this.stats.hp += growth.hp;
                 this.stats.attack += growth.attack;
                 this.stats.defense += growth.defense;
                 this.stats.speed = parseFloat((this.stats.speed + growth.speed).toFixed(1));
            }
        }


        this.qifuVouchers = savedState.qifuVouchers || 0;
        this.pvePoints = savedState.pvePoints || 0;

        // Load equipment
        this.equipment = {};
        for (const typeKey in GameData.equipment.types) {
             if (typeKey !== 'SPRITE_1' && typeKey !== 'SPRITE_2') {
                const slotId = GameData.equipment.types[typeKey].id;
                this.equipment[slotId] = null; // Initialize
                if (savedState.equipment && savedState.equipment[slotId]) {
                    const eqData = savedState.equipment[slotId];
                    try {
                        // Recreate the equipment instance.
                        // If effects were saved and need to be restored, Equipment constructor/manager needs adjustment
                        const newEquipment = new Equipment(eqData.type, eqData.quality, eqData.level);
                        // If effects were saved: newEquipment.effects = Utils.deepClone(eqData.effects);
                        this.equipment[slotId] = newEquipment;
                    } catch (e) {
                        console.error(`加载装备 ${slotId} 失败:`, e);
                        this.equipment[slotId] = null;
                    }
                }
            }
        }

        // Load sprites
        this.sprites = {
            [GameData.equipment.types.SPRITE_1.id]: null,
            [GameData.equipment.types.SPRITE_2.id]: null
        };
        if (savedState.sprites) {
            for (const slot in savedState.sprites) {
                if (savedState.sprites[slot]) {
                    const spData = savedState.sprites[slot];
                    try {
                        const newSprite = new Sprite(spData.spriteId, spData.level);
                        newSprite.currentFragments = spData.currentFragments || 0;
                        newSprite.updateStatsAndSkillsForLevel(); // Ensure stats are correct for loaded level
                        this.sprites[slot] = newSprite;
                    } catch (e) {
                        console.error(`加载精灵 ${slot} 失败:`, e);
                        this.sprites[slot] = null;
                    }
                }
            }
        }
        this.currentHp = this.getTotalStats().hp; // Full HP on load
        console.log(`灵宠 "${this.name}" 状态已加载。等级: ${this.level}`);
    }

    /**
     * Resets the LingChong to its initial state.
     * @param {string} appearanceId - The ID for the new appearance.
     */
    resetState(appearanceId) {
        const newAppearance = GameData.lingChong.appearanceOptions.find(opt => opt.id === appearanceId) || GameData.lingChong.appearanceOptions[0];
        this.constructor(newAppearance.id, this.name); // Re-initialize
        UI.showMessage("灵宠已重置为初始状态。", 2000);
    }
}

console.log("LingChong module loaded.");
