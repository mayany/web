// js/pve.js

class PVE {
    /**
     * PVE (迷雾森林) 战斗管理器
     * @param {LingChong} playerLingChong - 玩家的灵宠实例
     */
    constructor(playerLingChong) {
        this.playerLingChong = playerLingChong;
        this.currentLevel = 0; // 当前挑战的关卡索引 (从0开始)
        this.currentMonster = null;
        this.isInBattle = false;
        this.battleLog = [];
        this.battleSpeed = 1; // 1x, 2x, 3x
        this.battleInterval = null; // 用于控制自动战斗的定时器
        this.roundCount = 0; // 当前战斗回合数

        // 从 localStorage 或其他地方加载PVE进度 (可选)
        // this.loadPveProgress();
        console.log("PVE模块已为灵宠 " + playerLingChong.name + " 初始化。");
    }

    // loadPveProgress() {
    //     const savedLevel = parseInt(localStorage.getItem('pveMistForestLevel'));
    //     if (!isNaN(savedLevel) && savedLevel >= 0) {
    //         this.currentLevel = savedLevel;
    //     }
    // }

    // savePveProgress() {
    //     localStorage.setItem('pveMistForestLevel', this.currentLevel.toString());
    // }

    /**
     * 开始下一关或当前关卡的战斗
     */
    startNextLevel() {
        if (this.currentLevel >= GameData.pve.mistForest.levels.length) {
            UI.showMessage("恭喜！您已通关所有迷雾森林关卡！", 3000);
            Game.endPVEBattle(null); // 结束PVE，返回主城
            return;
        }

        const levelData = GameData.pve.mistForest.levels[this.currentLevel];
        if (!levelData) {
            console.error(`PVE错误：找不到关卡 ${this.currentLevel} 的数据。`);
            UI.showMessage("关卡数据错误，无法开始战斗。", 3000);
            Game.endPVEBattle(null);
            return;
        }

        // 创建怪物实例 (简化版，实际怪物也应该是一个类)
        this.currentMonster = {
            ...levelData, // 复制基础属性
            currentHp: levelData.hp, // 添加当前血量
            // 未来可以添加怪物技能、特效等
        };

        this.playerLingChong.currentHp = this.playerLingChong.getTotalStats().hp; // 确保灵宠满血开始战斗

        this.isInBattle = true;
        this.battleLog = [];
        this.roundCount = 0;

        UI.loadPVEBattleUI(this.playerLingChong, this.currentMonster, this);
        this.addLog(`开始挑战第 ${this.currentLevel + 1} 关：${this.currentMonster.name}！`, 'system');

        this.startAutoBattle();
    }

    /**
     * 重新尝试当前关卡
     */
    retryCurrentLevel() {
        if (!this.currentMonster) { // 如果没有当前怪物（比如直接点了重试）
            this.startNextLevel();
        } else {
            // 重置玩家和怪物状态
            this.playerLingChong.heal(); // 玩家灵宠回满血
            this.currentMonster.currentHp = this.currentMonster.hp; // 怪物回满血
            this.roundCount = 0;
            this.battleLog = [];

            UI.loadPVEBattleUI(this.playerLingChong, this.currentMonster, this); // 重新加载战斗UI
            this.addLog(`再次尝试挑战第 ${this.currentLevel + 1} 关：${this.currentMonster.name}！`, 'system');
            this.startAutoBattle();
        }
    }


    /**
     * 停止战斗 (例如玩家选择返回主城)
     */
    stopBattle() {
        this.isInBattle = false;
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }
        console.log("PVE战斗已停止。");
        // 可以在这里结算一些未完成的奖励或惩罚，但通常是战斗结束后结算
    }

    /**
     * 设置战斗速度
     * @param {number} speedMultiplier - 1, 2, or 3
     */
    setBattleSpeed(speedMultiplier) {
        this.battleSpeed = Math.max(1, Math.min(3, speedMultiplier));
        if (this.isInBattle) {
            this.stopAutoBattle(); // 停止当前计时器
            this.startAutoBattle(); // 以新速度重启
        }
    }

    /**
     * 开始自动战斗循环
     */
    startAutoBattle() {
        if (this.battleInterval) clearInterval(this.battleInterval);

        const baseIntervalTime = 1500; //ms, 1x 速度下每回合的基础时间
        this.battleInterval = setInterval(() => {
            this.executeRound();
        }, baseIntervalTime / this.battleSpeed);
    }

    /**
     * 停止自动战斗循环
     */
    stopAutoBattle() {
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }
    }


    /**
     * 执行一个战斗回合
     */
    executeRound() {
        if (!this.isInBattle || !this.playerLingChong || !this.currentMonster) {
            this.stopAutoBattle();
            return;
        }

        this.roundCount++;
        this.addLog(`--- 第 ${this.roundCount} 回合 ---`, 'system');

        // 简单战斗逻辑：按速度决定出手顺序
        const playerStats = this.playerLingChong.getTotalStats();
        const monsterStats = this.currentMonster; // 怪物属性直接用

        let firstAttacker, secondAttacker;
        let firstAttackerName, secondAttackerName;
        let firstAttackerIsPlayer;

        if (playerStats.speed >= monsterStats.speed) {
            firstAttacker = this.playerLingChong;
            firstAttackerName = this.playerLingChong.name;
            firstAttackerIsPlayer = true;
            secondAttacker = this.currentMonster;
            secondAttackerName = this.currentMonster.name;
        } else {
            firstAttacker = this.currentMonster;
            firstAttackerName = this.currentMonster.name;
            firstAttackerIsPlayer = false;
            secondAttacker = this.playerLingChong;
            secondAttackerName = this.playerLingChong.name;
        }

        // 1. 先手攻击
        if (this.performAttack(firstAttacker, secondAttacker, firstAttackerName, secondAttackerName, firstAttackerIsPlayer)) return; // 战斗结束

        // 2. 后手攻击 (如果战斗未结束)
        if (this.performAttack(secondAttacker, firstAttacker, secondAttackerName, firstAttackerName, !firstAttackerIsPlayer)) return; // 战斗结束


        // 检查回合上限
        if (this.roundCount >= GameData.pve.mistForest.maxRounds) {
            this.addLog(`战斗超过 ${GameData.pve.mistForest.maxRounds} 回合，挑战失败！`, 'system');
            this.battleEnd(false);
            return;
        }

        // 更新UI血条等
        UI.updatePVECharacterDisplay(UI.elements.playerPetBattleDisplay, this.playerLingChong.name, this.playerLingChong.appearance.icon, this.playerLingChong.currentHp, playerStats.hp);
        UI.updatePVECharacterDisplay(UI.elements.enemyMonsterBattleDisplay, this.currentMonster.name, this.currentMonster.icon, this.currentMonster.currentHp, monsterStats.hp);
    }

    /**
     * 执行一次攻击动作
     * @param {object} attacker - 攻击方 (LingChong 或 Monster)
     * @param {object} defender - 防御方
     * @param {string} attackerName - 攻击方名称
     * @param {string} defenderName - 防御方名称
     * @param {boolean} isPlayerAttacking - 攻击方是否为玩家灵宠
     * @returns {boolean} True if battle ended, false otherwise
     */
    performAttack(attacker, defender, attackerName, defenderName, isPlayerAttacking) {
        // 确保双方都还存活
        const attackerCurrentHp = isPlayerAttacking ? this.playerLingChong.currentHp : this.currentMonster.currentHp;
        const defenderCurrentHp = isPlayerAttacking ? this.currentMonster.currentHp : this.playerLingChong.currentHp;

        if (attackerCurrentHp <= 0 || defenderCurrentHp <= 0) {
            return false; // 一方已倒下，不进行攻击
        }

        const attackerStats = isPlayerAttacking ? this.playerLingChong.getTotalStats() : this.currentMonster;
        const defenderBaseStats = isPlayerAttacking ? this.currentMonster : this.playerLingChong.getTotalStats(); // 用于取防御

        // 简化伤害计算: 攻击力 - 防御力 (最少造成1点伤害)
        // TODO: 加入装备特效、精灵技能、暴击、闪避等复杂逻辑
        let damage = Math.max(1, attackerStats.attack - defenderBaseStats.defense);

        this.addLog(`${attackerName} 对 ${defenderName} 发动攻击，造成 ${damage} 点伤害。`, 'damage');

        if (isPlayerAttacking) {
            this.currentMonster.currentHp -= damage;
            if (this.currentMonster.currentHp <= 0) {
                this.currentMonster.currentHp = 0;
                this.addLog(`${this.currentMonster.name} 被击败了！`, 'system');
                this.battleEnd(true); // 玩家胜利
                return true;
            }
        } else {
            this.playerLingChong.takeDamage(damage);
            if (this.playerLingChong.currentHp <= 0) {
                this.addLog(`${this.playerLingChong.name} 被击败了！`, 'system');
                this.battleEnd(false); // 玩家失败
                return true;
            }
        }
        return false; // 战斗继续
    }


    /**
     * 战斗结束处理
     * @param {boolean} playerWon - 玩家是否胜利
     */
    battleEnd(playerWon) {
        this.stopAutoBattle();
        this.isInBattle = false;

        UI.showPVEBattleResult(playerWon, this); // 显示胜利/失败界面

        if (playerWon) {
            const rewards = GameData.pve.mistForest.levels[this.currentLevel].rewards;
            this.addLog(`胜利！获得经验: ${rewards.exp}, 积分: ${rewards.points}, 祈福券: ${rewards.qifuVoucher}`, 'system');
            // this.savePveProgress(); // 保存PVE进度

            // 自动进入下一关的逻辑由UI的按钮或定时器处理
            // Game.endPVEBattle(rewards); // 移到UI的按钮回调或定时器中，给玩家看结果的时间
            // this.currentLevel++; // 移到 advanceToNextLevel
        } else {
            // 失败了，不给奖励，停留在当前关卡
            this.addLog("挑战失败，请再接再厉！", 'system');
            // Game.endPVEBattle(null); // 移到UI的按钮回调中
        }
    }

    /**
     * 玩家选择挑战下一关 (由UI调用)
     */
    advanceToNextLevel() {
        const rewards = GameData.pve.mistForest.levels[this.currentLevel].rewards;
        // 先把当前关卡的奖励给主控游戏
        if (Game && Game.playerLingChong) {
            if (rewards.exp) Game.playerLingChong.addExp(rewards.exp);
            if (rewards.points) Game.playerLingChong.addPvePoints(rewards.points);
            if (rewards.qifuVoucher) Game.playerLingChong.addQifuVoucher(rewards.qifuVoucher);
            Game.saveGameData(); // 保存获得的奖励
        }

        this.currentLevel++;
        // this.savePveProgress();
        this.startNextLevel();
    }


    /**
     * 向战斗日志添加条目，并更新UI
     * @param {string} message - 日志内容
     * @param {string} [type='info'] - 日志类型 (info, damage, heal, effect, system)
     */
    addLog(message, type = 'info') {
        this.battleLog.push({ message, type });
        UI.addPVEBattleLogEntry(message, type);
    }
}

console.log("PVE module loaded.");
