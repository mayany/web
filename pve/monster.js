// pve/monster.js

class Monster {
  constructor(id, name, level, maxHp, attack, defense, speed, experienceReward, icon = '❓', skillIds = []) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.maxHp = maxHp; 
    this.hp = maxHp;    
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
    this.experienceReward = experienceReward;
    this.icon = icon;
    
    this.skills = [];
    if (typeof MONSTER_SKILLS_DATA !== 'undefined' && skillIds && skillIds.length > 0) {
        skillIds.forEach(skillId => {
            const skillDef = MONSTER_SKILLS_DATA[skillId];
            if (skillDef) {
                this.skills.push({ 
                    ...skillDef, // Copy all properties from definition
                    // Random initial cooldown: 0 to skillDef.cooldown (inclusive for 0, exclusive for cooldown+1)
                    // So, a skill might be usable on the first turn.
                    currentCooldown: Math.floor(Math.random() * (skillDef.cooldown + 1)) 
                });
            } else {
                console.warn(`Skill definition not found for ID: ${skillId} for monster ${this.name}`);
            }
        });
    }
    // console.log(`Monster ${this.name} created with skills:`, this.skills.map(s => `${s.name}(CD:${s.currentCooldown}/${s.cooldown})`).join(', '));
  }

  // Methods for taking damage, checking if alive, etc., can be added if PVE manager doesn't handle it directly.
  // For now, PVE manager directly manipulates monster.hp.
}

// If not using modules:
// window.Monster = Monster;
// Or for ES6 modules:
// export default Monster;
