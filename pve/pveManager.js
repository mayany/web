// pve/pveManager.js

class PveManager {
  constructor() {
    this.currentLevelNumber = 1; 
    this.currentMonster = null;
    this.isInBattle = false; 
    this.playerPet = null;

    this.battleLog = [];
    this.battleRound = 0;
    this.battleOver = false; 
    this.winner = null; 
    this.isProcessingTurn = false;
  }

  startLevel(levelNumber, pet) {
    if (typeof PVE_LEVELS === 'undefined') { this.isInBattle = false; return false; }
    const levelData = PVE_LEVELS.find(l => l.levelNumber === levelNumber);
    if (!levelData) { this.isInBattle = false; return false; }
    
    this.playerPet = pet; 
    if (!this.playerPet || !(this.playerPet instanceof Pet)) { this.isInBattle = false; return false; }
    if (typeof this.playerPet.maxHp === 'undefined') { this.playerPet.maxHp = this.playerPet.hp; }

    const md = levelData.monsterData;
    this.currentMonster = new Monster( // Monster class already takes skillIds from md.skills
      md.id || `m-${Date.now()}`, md.name, md.level, md.maxHp, md.attack,
      md.defense, md.speed, md.experienceReward, md.icon, md.skills 
    );
    // Add voucherReward to the monster instance if defined in data
    if (md.hasOwnProperty('voucherReward')) {
        this.currentMonster.voucherReward = md.voucherReward;
    } else {
        this.currentMonster.voucherReward = 0; // Default if not specified
    }


    this.playerPet.hp = this.playerPet.maxHp;
    this.currentMonster.hp = this.currentMonster.maxHp;

    this.isInBattle = true; 
    this.currentLevelNumber = levelNumber;
    this.battleLog = [`战斗开始! ${this.playerPet.name} (HP: ${this.playerPet.hp.toFixed(0)}) vs ${this.currentMonster.name} (HP: ${this.currentMonster.hp.toFixed(0)})`];
    if (this.currentMonster.skills && this.currentMonster.skills.length > 0) {
        this.battleLog.push(`${this.currentMonster.name} 拥有技能: ${this.currentMonster.skills.map(s => `${s.name}(CD:${s.currentCooldown})`).join(', ')}`);
    }
    this.battleRound = 1; 
    this.battleOver = false; 
    this.winner = null;
    this.isProcessingTurn = false;
    return true;
  }

  processBattleTurn() {
    if (this.battleOver || this.isProcessingTurn || !this.isInBattle) { return; }
    this.isProcessingTurn = true; 

    if (typeof frameCount !== 'undefined' && frameCount % 60 !== 0 ) { 
        this.isProcessingTurn = false; return;
    }

    this.battleLog.push(`--- 第 ${this.battleRound} 回合 ---`);

    if (this.battleRound > 30) { 
      this.battleLog.push("回合数超过30，判定玩家失败 (怪物获胜)！"); 
      this.determineWinnerAndEndBattle('monster');
      this.isProcessingTurn = false; return;
    }

    if (this.playerPet.hp > 0 && this.currentMonster.hp > 0) {
        this.performAttack(this.playerPet, this.currentMonster, "player");
        if (this.battleOver) { this.isProcessingTurn = false; return; }
    }

    if (this.currentMonster.hp > 0 && this.playerPet.hp > 0) {
        this.executeMonsterAction(this.currentMonster, this.playerPet);
        if (this.battleOver) { this.isProcessingTurn = false; return; }
    }
    
    if (this.currentMonster && this.currentMonster.skills) {
        this.currentMonster.skills.forEach(skill => {
            if (skill.currentCooldown > 0) { skill.currentCooldown--; }
        });
    }
    this.battleRound++;
    this.isProcessingTurn = false;
  }

  executeMonsterAction(monster, playerPet) {
    let skillUsed = false;
    const quickHealSkill = monster.skills.find(s => s.id === "MSK002_QUICK_HEAL" && s.currentCooldown === 0);
    if (quickHealSkill && monster.hp < monster.maxHp * 0.5) {
        if ((typeof random === 'function' ? random() : Math.random()) < 0.75) {
            this.useMonsterSkill(monster, playerPet, quickHealSkill); skillUsed = true;
        }
    }
    if (!skillUsed) {
        const strongBlowSkill = monster.skills.find(s => s.id === "MSK001_STRONG_BLOW" && s.currentCooldown === 0);
        if (strongBlowSkill) {
            if ((typeof random === 'function' ? random() : Math.random()) < 0.5) {
                this.useMonsterSkill(monster, playerPet, strongBlowSkill); skillUsed = true;
            }
        }
    }
    if (!skillUsed) {
        const weakeningCurseSkill = monster.skills.find(s => s.id === "MSK003_WEAKENING_CURSE" && s.currentCooldown === 0);
        if (weakeningCurseSkill) {
             if ((typeof random === 'function' ? random() : Math.random()) < 0.3) {
                this.useMonsterSkill(monster, playerPet, weakeningCurseSkill); skillUsed = true;
            }
        }
    }
    if (!skillUsed) { this.performAttack(monster, playerPet, "monster"); }
  }

  useMonsterSkill(monster, playerPet, skill) {
    this.battleLog.push(`❗ ${monster.name} 使用了技能 [${skill.name}]!`);
    skill.currentCooldown = skill.cooldown; 
    let finalDamage = 0; 
    let defender = playerPet; 

    switch (skill.id) { 
        case "MSK001_STRONG_BLOW":
            finalDamage = Math.max(0, Math.round((monster.attack * (skill.damageMultiplier || 1)) - playerPet.defense));
            playerPet.hp -= finalDamage;
            this.battleLog.push(`${monster.name} 对 ${playerPet.name} 造成 ${finalDamage} 点伤害。`);
            break;
        case "MSK002_QUICK_HEAL":
            let healAmount = Math.round(monster.maxHp * (skill.healPercent / 100));
            monster.hp = Math.min(monster.maxHp, monster.hp + healAmount);
            this.battleLog.push(`${monster.name} 回复了 ${healAmount} 点生命。`);
            break;
        case "MSK003_WEAKENING_CURSE":
            this.battleLog.push(`${monster.name} 对 ${playerPet.name} 施加了 ${skill.name}。(效果暂未实装)`);
            break;
        default:
            this.battleLog.push(`技能 ${skill.name} (类型: ${skill.type}) 的效果尚未实现。`);
            break;
    }
    if (playerPet.hp <= 0) {
        playerPet.hp = 0;
        this.determineWinnerAndEndBattle('monster');
    }
    this.battleLog.push(`${playerPet.name}剩余HP: ${Math.max(0, playerPet.hp).toFixed(0)}, ${monster.name}剩余HP: ${Math.max(0, monster.hp).toFixed(0)}`);
  }

  performAttack(attacker, defender, attackerRole) { 
    if (!attacker || !defender) {
        this.battleLog.push("错误：攻击者或防御者未定义。");
        this.determineWinnerAndEndBattle(attacker ? 'monster' : 'player'); return;
    }
    const attackStat = Number(attacker.attack) || 0;
    const defenseStat = Number(defender.defense) || 0;
    let damageMultiplier = 1.0;
    let isCritical = false;
    let lifeStealValue = 0;
    let attackerName = attacker.name || (attacker instanceof Pet ? "灵宠" : "怪物"); 
    let defenderName = defender.name || (defender instanceof Pet ? "灵宠" : "怪物");

    if (attackerRole === "player" && attacker.equipmentSlots) { 
        for (const slotType in attacker.equipmentSlots) {
            const item = attacker.equipmentSlots[slotType];
            if (item && item.specialEffects) {
                for (const effect of item.specialEffects) {
                    if (effect.id === "CRITICAL_HIT" && (typeof random === 'function' ? random() * 100 < effect.value : Math.random() * 100 < effect.value)) {
                        isCritical = true; damageMultiplier = 1 + (effect.critDamageBonus / 100);
                        this.battleLog.push(`✨ ${attackerName}触发[${effect.name}]!`); break; 
                    }
                }
            }
            if (isCritical) break; 
        }
    }
    let damage = Math.max(0, Math.round((attackStat * damageMultiplier) - defenseStat));
    if (isCritical) { this.battleLog.push(`💥 暴击! ${attackerName} 对 ${defenderName} 造成 ${damage} 点伤害!`); } 
    else { this.battleLog.push(`${attackerName} 攻击 ${defenderName}，造成 ${damage} 点伤害。`); }
    defender.hp -= damage;

    if (attackerRole === "player" && attacker.equipmentSlots && damage > 0) { 
        for (const slotType in attacker.equipmentSlots) {
            const item = attacker.equipmentSlots[slotType];
            if (item && item.specialEffects) {
                for (const effect of item.specialEffects) {
                    if (effect.id === "LIFE_STEAL") {
                        lifeStealValue = effect.value; 
                        let healedAmount = Math.round(damage * (lifeStealValue / 100));
                        if (healedAmount > 0) {
                            attacker.hp = Math.min(attacker.maxHp, attacker.hp + healedAmount);
                            this.battleLog.push(`🩸 ${attackerName}触发[${effect.name}]，回复了 ${healedAmount} 点生命。`);
                        }
                        break; 
                    }
                }
            }
            if (lifeStealValue > 0) break; 
        }
    }
    this.battleLog.push(`${defenderName}剩余HP: ${Math.max(0, defender.hp).toFixed(0)}`);
    if (attacker.hp !== undefined && (lifeStealValue > 0 || attackerRole === "monster")) { 
         this.battleLog.push(`${attackerName}当前HP: ${Math.max(0, attacker.hp).toFixed(0)}`);
    }
    if (defender.hp <= 0) {
      defender.hp = 0; 
      this.determineWinnerAndEndBattle(attacker === this.playerPet ? 'player' : 'monster');
    }
  }

  determineWinnerAndEndBattle(winnerSide) {
    if (this.battleOver) return; 
    this.battleOver = true; 
    this.winner = winnerSide;
    const winnerName = winnerSide === 'player' ? (this.playerPet ? this.playerPet.name : '玩家') : (this.currentMonster ? this.currentMonster.name : '怪物');
    this.battleLog.push(`战斗结束! ${winnerName} 胜利!`);

    if (winnerSide === 'monster' && typeof gameManager !== 'undefined') {
        gameManager.lastPveBattleLog = [...this.battleLog]; 
        console.log("玩家失败，战斗日志已保存到 gameManager.lastPveBattleLog");
    }

    if (typeof gameManager !== 'undefined') { this.endBattle(winnerSide === 'player', gameManager); } 
    else { this.endBattle(winnerSide === 'player', null); }
  }

  endBattle(isVictory, gm) { 
    if (isVictory && this.playerPet && this.currentMonster) { 
      this.battleLog.push(`${this.playerPet.name} 获得了 ${this.currentMonster.experienceReward} 点经验。`);
      this.playerPet.gainExperience(this.currentMonster.experienceReward);
      
      // Award Blessing Vouchers
      const vouchersAwarded = this.currentMonster.voucherReward || 0;
      if (vouchersAwarded > 0 && gm) {
          gm.blessingVouchers = (gm.blessingVouchers || 0) + vouchersAwarded; // Ensure gm.blessingVouchers is initialized
          this.battleLog.push(`获得了 ${vouchersAwarded} 张祈福券。`);
          console.log(`Awarded ${vouchersAwarded} Blessing Vouchers. Total: ${gm.blessingVouchers}`);
      }

      if (gm && this.currentLevelNumber === gm.playerMaxPveLevel) {
        const nextLevelData = (typeof PVE_LEVELS !== 'undefined') ? PVE_LEVELS.find(level => level.levelNumber === this.currentLevelNumber + 1) : null;
        if (nextLevelData) {
          gm.playerMaxPveLevel++;
          this.battleLog.push(`恭喜通过第 ${this.currentLevelNumber} 关！最高可挑战关卡提升至 ${gm.playerMaxPveLevel}`);
        } else {
          this.battleLog.push(`恭喜通过第 ${this.currentLevelNumber} 关！您已通关所有当前迷雾森林的试炼！`);
          if(gm) gm.allPveLevelsCleared = true; 
        }
      } else if (gm && this.currentLevelNumber < gm.playerMaxPveLevel) {
         this.battleLog.push(`再次通过第 ${this.currentLevelNumber} 关！`);
      }
    } else if (!isVictory) { 
        this.battleLog.push("很遗憾，挑战失败了。");
    }
    // Note: this.isInBattle is NOT set to false here. UI controls return.
  }
}

// If not using modules
// window.PveManager = PveManager;
