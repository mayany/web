// js/sprite.js

/**
 * Represents an individual Sprite (LingChong's companion).
 * Sprites are special items that provide percentage-based stat boosts and skills.
 */
class Sprite {
    /**
     * Creates a new Sprite instance.
     * @param {string} spriteId - The ID of the sprite from GameData.sprites.spriteData.
     * @param {number} [initialLevel=1] - The initial level of the sprite.
     */
    constructor(spriteId, initialLevel = 1) {
        const spriteBaseData = GameData.sprites.spriteData[spriteId];
        if (!spriteBaseData) {
            throw new Error(`无效的精灵ID: ${spriteId}`);
        }

        this.id = Utils.generateUUID(); // 实例的唯一ID
        this.spriteId = spriteId; // 精灵的基础定义ID (S001, S002, ...)
        this.name = spriteBaseData.name;
        this.icon = spriteBaseData.icon;
        this.quality = spriteBaseData.quality; // 品质 (PURPLE, ORANGE, etc.)
        this.description = spriteBaseData.description;

        this.level = Math.max(1, initialLevel);
        this.maxLevel = GameData.sprites.maxLevel;
        this.currentFragments = 0; // 当前拥有的用于升级的该精灵碎片数量

        // 属性和技能会随等级提升
        this.baseAttrPercent = Utils.deepClone(spriteBaseData.baseAttrPercent); // { hp: 0.05, attack: 0.03 }
        this.activeSkill = spriteBaseData.activeSkill ? Utils.deepClone(spriteBaseData.activeSkill) : null;
        this.passiveSkill = spriteBaseData.passiveSkill ? Utils.deepClone(spriteBaseData.passiveSkill) : null;

        // 初始化/根据等级调整属性和技能数值
        this.updateStatsAndSkillsForLevel();

        console.log(`精灵已创建: ${this.name} (Lv.${this.level}, ${this.quality})`);
    }

    /**
     * Updates the sprite's percentage attributes and skill values based on its current level.
     * This needs a defined scaling logic in GameData or here.
     */
    updateStatsAndSkillsForLevel() {
        const spriteBaseData = GameData.sprites.spriteData[this.spriteId];
        if (!spriteBaseData) return;

        // 示例：每级提升基础百分比属性的 5% (相对值)
        const levelMultiplier = 1 + (this.level - 1) * 0.05;

        for (const attr in spriteBaseData.baseAttrPercent) {
            this.baseAttrPercent[attr] = parseFloat((spriteBaseData.baseAttrPercent[attr] * levelMultiplier).toFixed(4));
        }

        // 技能数值提升 (更复杂的逻辑可能需要定义在GameData中)
        // 简单示例: 主动技能效果值每5级提升10%
        if (this.activeSkill && spriteBaseData.activeSkill && spriteBaseData.activeSkill.valueRange) {
            // 假设 activeSkill有一个 value 字段代表效果值
            // this.activeSkill.value = spriteBaseData.activeSkill.value * (1 + Math.floor(this.level / 5) * 0.1);
        }
        // 被动技能概率/效果值提升类似处理
        if (this.passiveSkill && spriteBaseData.passiveSkill && spriteBaseData.passiveSkill.chanceRange) {
            // this.passiveSkill.chance = spriteBaseData.passiveSkill.chance * (1 + Math.floor(this.level / 10) * 0.05);
        }
        // 注意: 上述技能升级为伪代码，具体实现依赖于GameData中技能效果的详细定义
    }

    /**
     * Adds fragments and attempts to level up the sprite.
     * @param {number} amount - The number of fragments to add.
     * @returns {boolean} True if the sprite leveled up, false otherwise.
     */
    addFragments(amount) {
        if (this.level >= this.maxLevel) {
            // UI.showMessage(`${this.name} 已达到最高等级！多余碎片将转化为通用碎片。`);
            // TODO: 实现通用碎片转换逻辑
            return false;
        }

        this.currentFragments += amount;
        let leveledUp = false;
        const fragmentsForNextLevel = this.getFragmentsNeededForLevel(this.level + 1);

        while (this.level < this.maxLevel && this.currentFragments >= fragmentsForNextLevel) {
            this.currentFragments -= fragmentsForNextLevel;
            this.level++;
            this.updateStatsAndSkillsForLevel();
            leveledUp = true;
            UI.showMessage(`${this.name} 升级至 Lv.${this.level}!`, 3000);
            if (this.level >= this.maxLevel) {
                // UI.showMessage(`${this.name} 已达到最高等级！`);
                // TODO: 处理剩余碎片
                break;
            }
            fragmentsForNextLevel = this.getFragmentsNeededForLevel(this.level + 1); // 更新下一级所需
        }
        return leveledUp;
    }

    /**
     * Gets the number of fragments needed to reach the specified level.
     * @param {number} targetLevel - The target level.
     * @returns {number} The number of fragments required, or Infinity if not defined.
     */
    getFragmentsNeededForLevel(targetLevel) {
        const spriteBaseData = GameData.sprites.spriteData[this.spriteId];
        if (!spriteBaseData || !spriteBaseData.fragmentsForLevelUp || targetLevel <= 1) {
            return Infinity;
        }
        if (targetLevel - 2 < spriteBaseData.fragmentsForLevelUp.length) {
            return spriteBaseData.fragmentsForLevelUp[targetLevel - 2]; // fragmentsForLevelUp[0] is for level 2
        }
        return Infinity; // Or a formula for higher levels
    }

    /**
     * Gets a string representation of the sprite for display or tooltip.
     * @returns {string} HTML string for the tooltip.
     */
    getTooltipHTML() {
        const qualityInfo = GameData.equipment.qualities[this.quality] || { name: this.quality, color: '#FFFFFF' };
        let html = `<div class="p-2 rounded shadow-lg bg-gray-800 text-white border" style="border-color:${qualityInfo.color};">`;
        html += `<h4 class="font-bold text-lg" style="color: ${qualityInfo.color}; border-bottom: 1px solid ${qualityInfo.color}; padding-bottom: 5px; margin-bottom:5px;">${this.name} (Lv.${this.level}/${this.maxLevel})</h4>`;
        html += `<p class="text-sm mb-1">品质: <span style="color:${qualityInfo.color}; font-weight:bold;">${qualityInfo.name}</span></p>`;
        html += `<p class="text-xs mb-2 italic">${this.description}</p>`;

        html += '<h5 class="font-semibold mt-2 mb-1 text-sm">属性加成 (对灵宠):</h5><ul class="list-disc list-inside text-xs">';
        for (const attr in this.baseAttrPercent) {
            html += `<li>${GameData.lingChong.initialStats.hasOwnProperty(attr) ? attr : attr}: +${(this.baseAttrPercent[attr] * 100).toFixed(2)}%</li>`;
        }
        html += '</ul>';

        if (this.activeSkill) {
            html += `<h5 class="font-semibold mt-2 mb-1 text-sm">主动技能: ${this.activeSkill.name}</h5>`;
            html += `<p class="text-xs italic">${this.activeSkill.description} (冷却: ${this.activeSkill.cooldown}回合)</p>`;
        }
        if (this.passiveSkill) {
            html += `<h5 class="font-semibold mt-2 mb-1 text-sm">被动技能: ${this.passiveSkill.name}</h5>`;
            html += `<p class="text-xs italic">${this.passiveSkill.description}</p>`;
        }

        if (this.level < this.maxLevel) {
            html += `<p class="text-xs mt-2">升级所需碎片: ${this.currentFragments}/${this.getFragmentsNeededForLevel(this.level + 1)}</p>`;
        } else {
            html += `<p class="text-xs mt-2 text-yellow-400">已达到最高等级</p>`;
        }

        html += '</div>';
        return html;
    }
}

const SpriteManager = {
    /**
     * Creates a new sprite instance or adds fragments if the player already owns it.
     * (This function would typically be part of a player inventory/sprite collection manager)
     * For now, it just creates a new instance or returns fragments.
     * @param {string} spriteId - The ID of the sprite to grant.
     * @param {Array<Sprite>} existingSprites - Player's current list of sprites.
     * @param {object} spriteFragments - Player's current fragments count for each spriteId.
     * @returns {{ newSprite: Sprite|null, addedFragments: {spriteId: string, count: number}|null, message: string }}
     */
    grantSpriteOrFragments: function(spriteId, existingSprites = [], spriteFragments = {}) {
        const baseData = GameData.sprites.spriteData[spriteId];
        if (!baseData) return { newSprite: null, addedFragments: null, message: `无效的精灵ID: ${spriteId}`};

        const ownedSprite = existingSprites.find(s => s.spriteId === spriteId);

        if (ownedSprite) {
            // Already owns the sprite, convert to fragments
            const fragmentAmount = GameData.sprites.fragmentsToSynthesize / 2; // Example: duplicate gives half fragments needed for synth
            ownedSprite.addFragments(fragmentAmount); // Try to level up with these new fragments
            return {
                newSprite: null,
                addedFragments: { spriteId: spriteId, count: fragmentAmount },
                message: `获得 ${baseData.name} 碎片 x${fragmentAmount} (因重复拥有)。`
            };
        } else {
            // Does not own, grant a new Lvl 1 sprite
            const newSprite = new Sprite(spriteId, 1);
            return {
                newSprite: newSprite,
                addedFragments: null,
                message: `恭喜获得新精灵: ${newSprite.name}!`
            };
        }
    },

    /**
     * Synthesizes a sprite from fragments.
     * (This would also be part of a player inventory manager)
     * @param {string} spriteId - The ID of the sprite to synthesize.
     * @param {object} playerFragments - An object иммутабельный { spriteId: count }.
     * @returns {Sprite|null} The new Sprite if successful, otherwise null.
     */
    synthesizeSprite: function(spriteId, playerFragments) {
        const baseData = GameData.sprites.spriteData[spriteId];
        if (!baseData) {
            console.error("无法合成：无效的精灵ID", spriteId);
            return null;
        }
        const fragmentsNeeded = GameData.sprites.fragmentsToSynthesize;
        if (playerFragments[spriteId] && playerFragments[spriteId] >= fragmentsNeeded) {
            playerFragments[spriteId] -= fragmentsNeeded; // Deduct fragments
            return new Sprite(spriteId, 1);
        } else {
            UI.showMessage(`合成 ${baseData.name} 失败，碎片不足 (${playerFragments[spriteId] || 0}/${fragmentsNeeded})。`);
            return null;
        }
    }
};

console.log("Sprite module loaded.");
