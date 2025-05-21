// js/equipment.js

/**
 * Represents an individual piece of equipment.
 */
class Equipment {
    /**
     * Creates a new piece of equipment.
     * @param {string} type - The type of equipment (e.g., WEAPON, ARMOR from GameData.equipment.types).
     * @param {string} quality - The quality of the equipment (e.g., WHITE, GREEN from GameData.equipment.qualities).
     * @param {number} level - The level of the equipment, influencing its stats.
     * @param {string} [forcedName=null] - Optional. If provided, this name will be used. Otherwise, a name is generated.
     */
    constructor(type, quality, level, forcedName = null) {
        this.id = Utils.generateUUID(); // 唯一ID
        this.type = type; // 装备类型 (WEAPON, ARMOR, etc.)
        this.quality = quality; // 品质 (WHITE, GREEN, etc.)
        this.level = Math.max(1, level); // 装备等级，最低为1

        const typeInfo = GameData.equipment.types[this.type];
        const qualityInfo = GameData.equipment.qualities[this.quality];

        if (!typeInfo || !qualityInfo) {
            throw new Error(`无效的装备类型或品质: ${type}, ${quality}`);
        }

        this.name = forcedName || this.generateEquipmentName(typeInfo, qualityInfo); // 装备名称
        this.icon = typeInfo.icon; // 装备图标

        this.baseStats = this.generateBaseStats(typeInfo, qualityInfo); // 基础属性 {hp: 10, attack: 5}
        this.effects = this.generateEffects(qualityInfo); // 特效 [{id: 'E_CRIT', name: '暴击', value: 10, extraValue: 50}, ...]

        console.log(`装备已创建: ${this.name} (Lv.${this.level}, ${qualityInfo.name}), 类型: ${typeInfo.name}`);
    }

    /**
     * Generates a name for the equipment based on its type and quality.
     * @param {object} typeInfo - Information about the equipment type from GameData.
     * @param {object} qualityInfo - Information about the equipment quality from GameData.
     * @returns {string} The generated equipment name.
     */
    generateEquipmentName(typeInfo, qualityInfo) {
        let baseName = Utils.getRandomElement(GameData.equipment.nameTemplates[this.type] || ["凡铁"]);
        // 可以根据品质添加前缀或后缀，例如 "精工的破阵枪" 或 "破阵枪·名家"
        // 为简化，暂时只用品质名称和基础名称组合，或直接用基础名称
        // return `${qualityInfo.name}${baseName}`; // 例如："名家破阵枪"
        return baseName; // 简化为只用模板名
    }

    /**
     * Generates the base stats for the equipment.
     * Stats are determined by type, quality, and level.
     * @param {object} typeInfo - Information about the equipment type.
     * @param {object} qualityInfo - Information about the equipment quality.
     * @returns {object} An object containing the base stats (e.g., { attack: 10, defense: 5 }).
     */
    generateBaseStats(typeInfo, qualityInfo) {
        const stats = {};
        const baseConfig = GameData.equipment.baseStatsConfig[this.type];
        if (!baseConfig) return stats;

        for (const statKey in baseConfig) {
            const statRange = baseConfig[statKey]; // e.g., [min, max] for level 1 white quality
            if (Array.isArray(statRange) && statRange.length === 2) {
                // 1. 基础值：在给定范围内随机一个基础值
                let baseValue = Utils.getRandomInt(statRange[0], statRange[1]);

                // 2. 等级加成：每级提升一定百分比或固定值 (简化：每级提升基础值的5%)
                let levelBonus = baseValue * (0.05 * (this.level - 1));

                // 3. 品质加成：应用品质乘数
                let qualityMultiplier = qualityInfo.statMultiplier || 1.0;

                // 总属性 = (基础值 + 等级加成) * 品质乘数
                // 注意：对于速度等特殊属性，可能不需要如此大的乘数或有不同计算方式
                if (statKey === 'speed') { // 速度属性特殊处理，避免过高
                    stats[statKey] = parseFloat(((baseValue + baseValue * (0.02 * (this.level -1))) * (1 + (qualityInfo.statMultiplier-1)/5)).toFixed(1));
                } else {
                    stats[statKey] = Math.floor((baseValue + levelBonus) * qualityMultiplier);
                }

                // 确保属性不为0，除非设计如此
                if (stats[statKey] <= 0 && baseValue > 0) {
                    stats[statKey] = 1;
                }
            }
        }
        return stats;
    }

    /**
     * Generates special effects for the equipment based on its quality.
     * @param {object} qualityInfo - Information about the equipment quality.
     * @returns {Array<object>} An array of effect objects.
     */
    generateEffects(qualityInfo) {
        const effects = [];
        const possibleEffectTiers = GameData.equipment.qualityEffectTiers[qualityInfo.effectTier];
        if (!possibleEffectTiers || possibleEffectTiers.length === 0) return effects;

        // 简化：每件装备最多1-2个特效，高品质概率更高
        // 红色必定有特效，橙色大概率，紫色有几率等
        let numberOfEffects = 0;
        if (qualityInfo.id === 'RED') numberOfEffects = Utils.getRandomInt(1, 2);
        else if (qualityInfo.id === 'ORANGE') numberOfEffects = Utils.rollPercentage(80) ? Utils.getRandomInt(1, 2) : 0;
        else if (qualityInfo.id === 'PURPLE') numberOfEffects = Utils.rollPercentage(50) ? 1 : 0;
        else if (qualityInfo.id === 'BLUE') numberOfEffects = Utils.rollPercentage(30) ? 1 : 0;
        else if (qualityInfo.id === 'GREEN') numberOfEffects = Utils.rollPercentage(15) ? 1 : 0;


        const availableEffects = GameData.equipment.effects.filter(effectDef =>
            effectDef.tiers.some(tier => possibleEffectTiers.includes(tier))
        );

        if (availableEffects.length === 0) return effects;

        for (let i = 0; i < numberOfEffects; i++) {
            if (effects.length >= 2) break; // 最多2个特效

            const randomEffectDef = Utils.getRandomElement(availableEffects);
            if (randomEffectDef && !effects.some(e => e.id === randomEffectDef.id)) { // 避免重复特效
                const effectValue = Utils.getRandomInt(randomEffectDef.valueRange[0], randomEffectDef.valueRange[1]);
                let effectExtraValue;
                if (randomEffectDef.extraValueRange) {
                    effectExtraValue = Utils.getRandomInt(randomEffectDef.extraValueRange[0], randomEffectDef.extraValueRange[1]);
                }

                const newEffect = {
                    id: randomEffectDef.id,
                    name: randomEffectDef.name,
                    description: randomEffectDef.description
                                        .replace('{value}', effectValue)
                                        .replace('{extraValue}', effectExtraValue),
                    value: effectValue,
                    type: randomEffectDef.type
                };
                if (effectExtraValue !== undefined) {
                    newEffect.extraValue = effectExtraValue;
                }
                effects.push(newEffect);
            }
        }
        return effects;
    }

    /**
     * Gets a string representation of the equipment for display.
     * @returns {string}
     */
    getTooltipHTML() {
        const qualityInfo = GameData.equipment.qualities[this.quality];
        let html = `<div class="p-2 rounded shadow-lg bg-gray-800 text-white border border-${qualityInfo.class.replace('quality-','')}">`; // Tailwind doesn't support dynamic class names well for borders like this.
        html += `<h4 class="font-bold text-lg ${qualityInfo.class}" style="color: ${qualityInfo.color}; border-bottom: 1px solid ${qualityInfo.color}; padding-bottom: 5px; margin-bottom:5px;">${this.name} (Lv.${this.level})</h4>`;
        html += `<p class="text-sm mb-1">类型: ${GameData.equipment.types[this.type].name}</p>`;
        html += `<p class="text-sm mb-2">品质: <span style="color:${qualityInfo.color}; font-weight:bold;">${qualityInfo.name}</span></p>`;

        html += '<h5 class="font-semibold mt-2 mb-1 text-sm">基础属性:</h5><ul class="list-disc list-inside text-xs">';
        for (const stat in this.baseStats) {
            html += `<li>${stat}: ${this.baseStats[stat]}</li>`;
        }
        if (Object.keys(this.baseStats).length === 0) html += '<li>无基础属性</li>';
        html += '</ul>';

        if (this.effects.length > 0) {
            html += '<h5 class="font-semibold mt-2 mb-1 text-sm">特效:</h5><ul class="list-disc list-inside text-xs">';
            this.effects.forEach(effect => {
                html += `<li>${effect.name}: ${effect.description}</li>`;
            });
            html += '</ul>';
        }
        html += '</div>';
        return html;
    }
}

// 装备相关的辅助函数或管理器 (如果需要)
const EquipmentManager = {
    /**
     * Creates a random piece of equipment.
     * @param {number} playerLevel - The player's (LingChong's) current level.
     * @returns {Equipment} A new Equipment instance.
     */
    createRandomEquipment: function(playerLevel) {
        const types = Object.keys(GameData.equipment.types).filter(t => t !== 'SPRITE_1' && t !== 'SPRITE_2'); // 排除精灵槽
        const randomType = Utils.getRandomElement(types);

        // 根据玩家等级和一定随机性决定装备品质
        // 简单示例：等级越高，高品质概率越大
        let qualityKey;
        const roll = Math.random() * 100;
        if (playerLevel > 80 && roll > 80) qualityKey = 'RED';       // 20% for Red at high level
        else if (playerLevel > 60 && roll > 70) qualityKey = 'ORANGE'; // 30% for Orange
        else if (playerLevel > 40 && roll > 60) qualityKey = 'PURPLE'; // 40% for Purple
        else if (playerLevel > 20 && roll > 50) qualityKey = 'BLUE';   // 50% for Blue
        else if (roll > 30) qualityKey = 'GREEN';                      // ~70% for Green (30-100)
        else qualityKey = 'WHITE';                                     // ~30% for White

        // 装备等级通常与玩家等级相近，可以有一定的浮动
        const equipmentLevel = Math.max(1, playerLevel + Utils.getRandomInt(-5, 2)); // 例如，玩家等级上下浮动

        return new Equipment(randomType, qualityKey, equipmentLevel);
    },

    /**
     * Generates a specific piece of equipment, e.g. for quest reward or shop.
     * @param {string} type
     * @param {string} quality
     * @param {number} level
     * @param {string} [name=null]
     * @returns {Equipment}
     */
    createSpecificEquipment: function(type, quality, level, name = null) {
        if (!GameData.equipment.types[type] || !GameData.equipment.qualities[quality]) {
            console.error(`Cannot create specific equipment: Invalid type (${type}) or quality (${quality})`);
            return null;
        }
        return new Equipment(type, quality, level, name);
    }
};

console.log("Equipment module loaded.");
