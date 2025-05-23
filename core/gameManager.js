// Basic initialization code for GameManager
// This can be expanded later to manage global game states

class GameManager {
    constructor() {
        this.gameState = 'initializing'; 
        this.playerPet = null; 
        
        if (typeof PveManager !== 'undefined') {
            this.pveManager = new PveManager();
        } else {
            console.error("PveManager class not found. Ensure pveManager.js is loaded before gameManager.js if PveManager is a dependency for GameManager constructor.");
            this.pveManager = null; 
        }
        this.playerMaxPveLevel = 1; 
        this.allPveLevelsCleared = false; 
        this.availableSprites = {}; 
        this.lastPveBattleLog = null; 

        // NEW for Blessing System
        this.blessingVouchers = 0;
        this.lastBlessingRewardDisplay = ""; 
        this.lastObtainedItemFromBlessing = null; 

        console.log("GameManager initialized. Added properties for Blessing System.");
    }

    setGameState(newState) { 
        this.gameState = newState;
        console.log(`Game state changed to: ${newState}`);
    }

    getGameState() {
        return this.gameState;
    }

    // --- Blessing System Methods ---
    _getRandomBlessingReward(playerLevel) { // Underscore to indicate internal helper
        if (typeof BLESSING_REWARDS_POOL === 'undefined' || BLESSING_REWARDS_POOL.length === 0) {
            console.error("BLESSING_REWARDS_POOL is not defined or empty!");
            return null;
        }

        let totalWeight = 0;
        BLESSING_REWARDS_POOL.forEach(reward => totalWeight += reward.weight);
        
        let randomVal = Math.random() * totalWeight; // Use Math.random() for core logic, p5.random() might not be ready if this is called very early
        let cumulativeWeight = 0;
        
        for (const rewardTemplate of BLESSING_REWARDS_POOL) {
            cumulativeWeight += rewardTemplate.weight;
            if (randomVal <= cumulativeWeight) {
                // Create a deep copy of the reward template to avoid modifying the original pool
                let reward = JSON.parse(JSON.stringify(rewardTemplate));

                if (reward.type === "EQUIPMENT") {
                    // Ensure dependent data/classes are loaded
                    if (typeof EQUIPMENT_QUALITIES === 'undefined' || 
                        typeof EQUIPMENT_TYPES === 'undefined' || 
                        typeof Equipment === 'undefined' ||
                        typeof getEmojiForEquipmentType === 'undefined' || // Defined in data/equipmentData.js
                        typeof random !== 'function' ) { // p5.random for array item selection
                        console.error("Dependencies for EQUIPMENT reward generation are missing!");
                        return { type: "ERROR", details: { message: "Equipment generation failed." } };
                    }

                    const qualities = Object.keys(EQUIPMENT_QUALITIES); 
                    let randomQualityKey;
                    const qualityRoll = Math.random(); // Use Math.random() for probabilities
                    if (qualityRoll < 0.4) randomQualityKey = "WHITE";       
                    else if (qualityRoll < 0.7) randomQualityKey = "GREEN";  
                    else if (qualityRoll < 0.9) randomQualityKey = "BLUE";   
                    else if (qualityRoll < 0.97) randomQualityKey = "PURPLE"; 
                    else randomQualityKey = "ORANGE"; 

                    const equipmentTypeValues = Object.values(EQUIPMENT_TYPES).filter(t => t !== EQUIPMENT_TYPES.SPRITE1 && t !== EQUIPMENT_TYPES.SPRITE2);
                    const randomTypeValue = random(equipmentTypeValues); // p5.js random from array

                    // Equipment constructor expects qualityKey (string like "WHITE") and itemLevel
                    const newEquip = new Equipment(
                        `equip_${Date.now()}_${Math.floor(Math.random()*1000)}`,
                        `${EQUIPMENT_QUALITIES[randomQualityKey].name} ${randomTypeValue}`,
                        randomTypeValue,
                        randomQualityKey, // Pass the key e.g. "WHITE"
                        playerLevel, // Scale equipment level to player pet's level
                        getEmojiForEquipmentType(randomTypeValue) // Use global helper
                    );
                    reward.generatedItem = newEquip; 
                }
                return reward; 
            }
        }
        return null; // Should ideally not be reached if weights are correct
    }

    performBlessing() {
        if (this.blessingVouchers < 1) {
            this.lastBlessingRewardDisplay = "祈福券不足！";
            this.lastObtainedItemFromBlessing = null;
            console.log("祈福券不足！");
            return null;
        }
        if (!this.playerPet) {
            this.lastBlessingRewardDisplay = "请先选择一个灵宠！";
            this.lastObtainedItemFromBlessing = null;
            console.log("Cannot perform blessing without a player pet.");
            return null;
        }

        this.blessingVouchers -= 1;
        const reward = this._getRandomBlessingReward(this.playerPet.level);
        this.lastObtainedItemFromBlessing = null; // Reset before processing new reward

        if (!reward) {
            this.lastBlessingRewardDisplay = "祈福失败，请稍后再试。";
            console.error("No reward generated from blessing pool.");
            return null;
        }
        
        let rewardMessage = "";

        switch (reward.type) {
            case "PET_EXPERIENCE":
                this.playerPet.gainExperience(reward.details.amount);
                rewardMessage = `获得灵宠经验: +${reward.details.amount}!`;
                break;
            case "EQUIPMENT":
                if (reward.generatedItem) {
                    this.lastObtainedItemFromBlessing = reward.generatedItem;
                    // Use quality.name from the generatedItem's quality object
                    rewardMessage = `获得装备: ${reward.generatedItem.icon} ${reward.generatedItem.name} (品质: ${reward.generatedItem.quality.name})`;
                    console.log(`祈福获得装备: ${reward.generatedItem.name}. Stored in lastObtainedItemFromBlessing.`);
                } else {
                    rewardMessage = "获得了一件装备（生成错误）";
                }
                break;
            case "SPRITE_FRAGMENT":
                if (typeof SPRITE_DEFINITIONS === 'undefined' || typeof Sprite === 'undefined') {
                    rewardMessage = "获得精灵碎片（处理错误）"; break;
                }
                const spriteIdFrag = reward.details.spriteId;
                const spriteDefFrag = SPRITE_DEFINITIONS[spriteIdFrag];
                if (!spriteDefFrag) { rewardMessage = `获得未知精灵碎片 (ID: ${spriteIdFrag})`; break;}
                if (!this.availableSprites[spriteIdFrag]) {
                    this.availableSprites[spriteIdFrag] = new Sprite(spriteIdFrag);
                }
                this.availableSprites[spriteIdFrag].fragments += reward.details.amount;
                rewardMessage = `获得 ${spriteDefFrag.name} 碎片 x${reward.details.amount}!`;
                this.availableSprites[spriteIdFrag].levelUp(); // Attempt level up
                break;
            case "SPRITE_FULL":
                if (typeof SPRITE_DEFINITIONS === 'undefined' || typeof Sprite === 'undefined') {
                     rewardMessage = "获得精灵（处理错误）"; break;
                }
                const spriteIdFull = reward.details.spriteId;
                const spriteDefFull = SPRITE_DEFINITIONS[spriteIdFull];
                if (!spriteDefFull) { rewardMessage = `获得未知精灵 (ID: ${spriteIdFull})`; break; }
                if (!this.availableSprites[spriteIdFull]) {
                    this.availableSprites[spriteIdFull] = new Sprite(spriteIdFull);
                    rewardMessage = `恭喜！获得了新的精灵: ${spriteDefFull.name}!`;
                } else {
                    // Convert to fragments if already owned
                    const fragmentsFromFullSprite = SPRITE_DEFINITIONS[spriteIdFull].fragmentsToLevelUp && SPRITE_DEFINITIONS[spriteIdFull].fragmentsToLevelUp[0] ? 
                                                    SPRITE_DEFINITIONS[spriteIdFull].fragmentsToLevelUp[0] : 10; 
                    this.availableSprites[spriteIdFull].fragments += fragmentsFromFullSprite;
                    rewardMessage = `已拥有精灵 ${spriteDefFull.name}，转化为碎片 x${fragmentsFromFullSprite}!`;
                    this.availableSprites[spriteIdFull].levelUp();
                }
                break;
            default:
                rewardMessage = `获得未知奖励: ${reward.type}`;
                console.warn("Unknown blessing reward type:", reward.type);
                break;
        }
        this.lastBlessingRewardDisplay = rewardMessage;
        console.log("Blessing Reward Processed:", rewardMessage, "Item if any:", this.lastObtainedItemFromBlessing);
        return reward; 
    }
}

// Instantiate the GameManager
const gameManager = new GameManager();
// export default gameManager; // If using modules
