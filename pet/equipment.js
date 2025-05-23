// pet/equipment.js

// Helper function for stat variance (can be static or outside if preferred)
function generateStatsWithVariance(baseValue, qualityName) {
    // Ensure EQUIPMENT_QUALITIES is available. This is a bit tricky if this file is loaded before data.js
    // A better approach might be to pass the quality object or its sortOrder directly.
    // For now, assuming EQUIPMENT_QUALITIES is globally available.
    if (typeof EQUIPMENT_QUALITIES === 'undefined' || !EQUIPMENT_QUALITIES[qualityName]) {
        console.warn(`Quality ${qualityName} not found in EQUIPMENT_QUALITIES. Using base value for stat.`);
        return Math.max(1, Math.round(baseValue)); // Ensure at least 1
    }
    const quality = EQUIPMENT_QUALITIES[qualityName]; // Get the quality object by its key (e.g., "WHITE")
    
    // The prompt used quality.sortOrder * 0.05.
    // Let's use a slightly different variance scale based on sortOrder for more impact:
    // White (1): +/- 5%
    // Green (2): +/- 8%
    // Blue (3): +/- 12%
    // Purple (4): +/- 17%
    // Orange (5): +/- 23%
    // Red (6): +/- 30%
    let variancePercentage;
    switch (quality.sortOrder) {
        case 1: variancePercentage = 0.05; break;
        case 2: variancePercentage = 0.08; break;
        case 3: variancePercentage = 0.12; break;
        case 4: variancePercentage = 0.17; break;
        case 5: variancePercentage = 0.23; break;
        case 6: variancePercentage = 0.30; break;
        default: variancePercentage = 0.05;
    }

    const minStat = baseValue * (1 - variancePercentage);
    const maxStat = baseValue * (1 + variancePercentage);
    
    // Use p5.js random() if available, otherwise Math.random()
    let finalStat;
    if (typeof random === 'function' && typeof randomSeed === 'function') { // Check for p5.js random
        finalStat = random(minStat, maxStat);
    } else {
        finalStat = Math.random() * (maxStat - minStat) + minStat;
    }
    
    return Math.max(1, Math.round(finalStat)); // Ensure stats are at least 1 and rounded
}


class Equipment {
  constructor(id, name, type, qualityKey, itemLevel = 1, icon = "❓") { // qualityKey is "WHITE", "GREEN" etc.
    this.id = id || `eq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.type = type; // Should be one of EQUIPMENT_TYPES values
    
    // Ensure qualityKey is valid and get the quality object
    if (typeof EQUIPMENT_QUALITIES === 'undefined' || !EQUIPMENT_QUALITIES[qualityKey]) {
        console.error(`Invalid qualityKey: ${qualityKey}. Defaulting to WHITE.`);
        this.quality = EQUIPMENT_QUALITIES.WHITE;
    } else {
        this.quality = EQUIPMENT_QUALITIES[qualityKey]; // This is the quality OBJECT {name, color, sortOrder}
    }
    
    this.level = itemLevel;
    this.icon = icon;
    this.baseStats = {};
    this.specialEffects = [];

    // 1. Get average base stats for item type and level
    // getBaseStatsForEquipment is global, loaded from data/equipmentData.js
    const averageStats = (typeof getBaseStatsForEquipment === 'function') ? 
                         getBaseStatsForEquipment(this.type, this.level) : {};

    // 2. Apply variance to each stat
    for (const statName in averageStats) {
        const baseValue = averageStats[statName];
        // Pass the quality key (e.g., "WHITE") to generateStatsWithVariance
        this.baseStats[statName] = generateStatsWithVariance(baseValue, qualityKey);
    }

    // 3. Randomly add one special effect based on quality and eligibility
    if (typeof SPECIAL_EFFECTS_DATA !== 'undefined' && typeof SPECIAL_EFFECT_RARITY !== 'undefined' && typeof random === 'function') {
        const qualityOrder = this.quality.sortOrder;
        const effectPool = Object.values(SPECIAL_EFFECTS_DATA).filter(effect => {
            // Filter by item type applicability first
            if (effect.appliesTo && !effect.appliesTo.includes(this.type)) {
                return false;
            }
            // Then by rarity based on the refined logic from the prompt
            if (qualityOrder === SPECIAL_EFFECT_RARITY.WHITE) return effect.rarity === SPECIAL_EFFECT_RARITY.WHITE;
            if (qualityOrder === SPECIAL_EFFECT_RARITY.GREEN) return effect.rarity === SPECIAL_EFFECT_RARITY.WHITE || effect.rarity === SPECIAL_EFFECT_RARITY.GREEN;
            if (qualityOrder === SPECIAL_EFFECT_RARITY.BLUE) return effect.rarity === SPECIAL_EFFECT_RARITY.GREEN || effect.rarity === SPECIAL_EFFECT_RARITY.BLUE;
            if (qualityOrder === SPECIAL_EFFECT_RARITY.PURPLE) return effect.rarity === SPECIAL_EFFECT_RARITY.BLUE || effect.rarity === SPECIAL_EFFECT_RARITY.PURPLE;
            if (qualityOrder === SPECIAL_EFFECT_RARITY.ORANGE) return effect.rarity === SPECIAL_EFFECT_RARITY.PURPLE || effect.rarity === SPECIAL_EFFECT_RARITY.ORANGE;
            if (qualityOrder === SPECIAL_EFFECT_RARITY.RED) return effect.rarity === SPECIAL_EFFECT_RARITY.ORANGE || effect.rarity === SPECIAL_EFFECT_RARITY.RED;
            return false;
        });

        const chanceOfEffect = qualityOrder * 0.10; // e.g., White=10%, Green=20%, ..., Red=60%
        if (effectPool.length > 0 && random() < chanceOfEffect) { // p5.random() gives [0, 1)
            let chosenEffectData = random(effectPool); // p5.random to pick one from array
            
            let actualValue = chosenEffectData.value; // Assuming fixed value for now as valueRange is not in all effects
            // Example if valueRange was used:
            // if (chosenEffectData.valueRange) {
            //     actualValue = Math.round(random(chosenEffectData.valueRange[0], chosenEffectData.valueRange[1]));
            // }

            let description = chosenEffectData.description;
            if (description) { // Check if description exists
                description = description.replace("{value}", actualValue);
                if (chosenEffectData.critDamageBonus) { // Specific for CRITICAL_HIT
                    description = description.replace("{critDamageBonus}", chosenEffectData.critDamageBonus);
                }
            } else {
                description = chosenEffectData.name; // Fallback if no description template
            }
            
            this.specialEffects.push({
                id: chosenEffectData.id,
                name: chosenEffectData.name,
                description: description,
                type: chosenEffectData.type,
                value: actualValue,
                critDamageBonus: chosenEffectData.critDamageBonus, // Store if exists
                // Store other specific params if needed for other effects
            });
        }
    }
    // console.log(`Equipment created: ${this.name} (L${this.level}, Q:${this.quality.name}), BaseStats:`, this.baseStats, "Special Effects:", this.specialEffects);
  }
}

// If not using modules:
// window.Equipment = Equipment;
// Or for ES6 modules:
// export default Equipment;
