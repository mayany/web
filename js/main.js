// js/main.js

const Game = {
    playerLingChong: null, // 玩家的灵宠实例
    pveInstance: null,     // PVE战斗实例
    localStorageKey: 'datangLingChongSaveData',

    /**
     * 初始化游戏
     */
    init: function() {
        console.log("《大唐灵宠》开始初始化...");
        try {
            // 确保UI对象和UI.init方法存在
            if (typeof UI !== 'undefined' && UI.init && typeof UI.init === 'function') {
                // Game.init() 在 DOMContentLoaded 后执行，UI.init() 也在 DOMContentLoaded 后执行。
                // 通常 ui.js 的 DOMContentLoaded 会先于 main.js 的（如果脚本顺序正确）。
                // 因此，UI.init() 多数情况下已经由 ui.js 自己调用过了。
                if (!UI.elements || !UI.elements.mainContent) {
                     console.warn("Game.init: UI.elements.mainContent not found or UI.elements not initialized. Attempting to call UI.init().");
                     UI.init(); // 尝试初始化UI
                     if (!UI.elements || !UI.elements.mainContent) {
                         throw new Error("UI.init() was called but failed to initialize critical elements (e.g., mainContent).");
                     }
                } else {
                    console.log("Game.init: UI.elements.mainContent found, UI seems initialized.");
                }
            } else {
                console.error("Game.init: UI object or UI.init method is not available! Cannot proceed.");
                alert("游戏界面核心组件加载失败，请刷新页面。如果问题持续，请联系技术支持。");
                return; // 停止进一步初始化
            }
        } catch (e) {
            console.error("Error during UI check/initialization in Game.init:", e.name, e.message, e.stack);
            alert(`游戏初始化过程中发生界面错误: ${e.message}。请刷新页面。`);
            return; // 停止进一步初始化
        }

        this.loadGameData(); 

        if (this.playerLingChong) {
            this.loadMainInterface();
            UI.showMessage(`欢迎回来，${this.playerLingChong.name}的主人！`, 2500);
        } else {
            UI.showPetSelectionModal(GameData.lingChong.appearanceOptions, (selectedPetId) => {
                const defaultName = "灵虚子"; 
                this.createNewLingChong(selectedPetId, defaultName);
            });
        }
        this.setupDevTools();
        console.log("游戏初始化完毕。");
    },

    createNewLingChong: function(appearanceId, name) {
        try {
            this.playerLingChong = new LingChong(appearanceId, name);
            UI.showMessage(`恭喜您获得灵宠：${this.playerLingChong.name}！`, 3000);
            this.saveGameData();
            this.loadMainInterface();
        } catch (error) {
            console.error("创建灵宠失败:", error);
            UI.showMessage("创建灵宠失败，请刷新页面重试。", 5000);
            UI.showPetSelectionModal(GameData.lingChong.appearanceOptions, (selectedPetId) => {
                this.createNewLingChong(selectedPetId, name);
            });
        }
    },

    loadMainInterface: function() {
        if (!this.playerLingChong) {
            console.error("无法加载主界面：玩家灵宠未初始化。");
            // Attempt to re-initialize if lingChong is missing, might be a load order issue or failed creation
            // However, this could lead to loops if init itself fails.
            // A better approach might be to ensure init() fully completes before this is callable.
            // For now, we'll keep the re-init attempt but be mindful of potential loops.
            this.init(); 
            return;
        }
        try {
            UI.loadMainGameUI(this.playerLingChong);
            this.updatePlayerUI(); 
        } catch (e) {
            console.error("Error in loadMainInterface:", e.name, e.message, e.stack);
            UI.showMessage("加载主界面时出错，请尝试刷新。", 3000);
        }
    },

    updatePlayerUI: function() {
        if (this.playerLingChong) {
            try {
                UI.updateLingChongStats(this.playerLingChong);
                UI.renderEquipmentSlots(this.playerLingChong); 
            } catch (e) {
                console.error("Error in updatePlayerUI:", e.name, e.message, e.stack);
                UI.showMessage("更新玩家界面时出错。", 2000);
            }
        }
    },

    saveGameData: function() {
        if (this.playerLingChong) {
            try {
                const saveData = this.playerLingChong.saveState();
                localStorage.setItem(this.localStorageKey, JSON.stringify(saveData));
                console.log("游戏数据已保存。");
            } catch (error) {
                console.error("保存游戏数据失败:", error);
                UI.showMessage("数据保存失败！", 3000);
            }
        }
    },

    loadGameData: function() {
        try {
            const savedDataString = localStorage.getItem(this.localStorageKey);
            if (savedDataString) {
                const savedData = JSON.parse(savedDataString);
                if (savedData && savedData.appearanceId) { 
                    this.playerLingChong = new LingChong(savedData.appearanceId, savedData.name);
                    this.playerLingChong.loadState(savedData);
                    console.log("游戏数据已加载。");
                    return;
                }
            }
        } catch (error) {
            console.error("加载游戏数据失败:", error);
            localStorage.removeItem(this.localStorageKey); 
            UI.showMessage("加载存档失败，将开始新游戏。", 3000);
        }
        this.playerLingChong = null; 
    },

    resetGameData: function() {
        if (confirm("确定要重置所有游戏数据并重新开始吗？此操作不可撤销！")) {
            localStorage.removeItem(this.localStorageKey);
            this.playerLingChong = null;
            if (this.pveInstance) {
                this.pveInstance.stopBattle(); 
                this.pveInstance = null;
            }
            UI.showLoading("正在重置游戏...");
            setTimeout(() => {
                window.location.reload(); 
            }, 1000);
        }
    },

    setupDevTools: function() {
        if (UI.elements.testAddExpButton) {
            UI.elements.testAddExpButton.addEventListener('click', () => {
                if (this.playerLingChong) {
                    this.playerLingChong.addExp(100);
                    this.updatePlayerUI();
                    this.saveGameData();
                } else {
                    UI.showMessage("请先创建灵宠。");
                }
            });
        }
        if (UI.elements.testAddQifuVoucherButton) {
            UI.elements.testAddQifuVoucherButton.addEventListener('click', () => {
                if (this.playerLingChong) {
                    this.playerLingChong.addQifuVoucher(1);
                    this.updatePlayerUI(); 
                    this.saveGameData();
                } else {
                    UI.showMessage("请先创建灵宠。");
                }
            });
        }
        if (UI.elements.testResetPetButton) {
            UI.elements.testResetPetButton.addEventListener('click', () => {
                this.resetGameData();
            });
        }
        const devToolsContainer = UI.elements.devToolsContainer;
        if (devToolsContainer) {
            if (!document.getElementById('gm-add-equipment')) { // 防止重复添加
                const addEquipmentButton = document.createElement('button');
                addEquipmentButton.id = 'gm-add-equipment';
                addEquipmentButton.textContent = '获得随机装备';
                addEquipmentButton.className = 'text-xs bg-purple-500 hover:bg-purple-700 text-white py-1 px-2 rounded w-full mt-1';
                addEquipmentButton.onclick = () => {
                    if (this.playerLingChong) {
                        const newItem = EquipmentManager.createRandomEquipment(this.playerLingChong.level);
                        UI.showMessage(`通过GM工具获得装备: ${newItem.name} (${newItem.quality} Lv.${newItem.level})`, 3000);
                        console.log("GM获得装备:", newItem);
                        // TODO: Add to inventory
                        this.updatePlayerUI();
                        this.saveGameData();
                    } else {
                        UI.showMessage("请先创建灵宠。");
                    }
                };
                devToolsContainer.appendChild(addEquipmentButton);
            }
        }
    },

    performQifu: function() {
        if (!this.playerLingChong) {
            UI.showMessage("请先创建灵宠。");
            return;
        }
        if (this.playerLingChong.useQifuVoucher()) {
            UI.showMessage("进行了一次祈福...", 1000);
            const newItem = EquipmentManager.createRandomEquipment(this.playerLingChong.level);
            setTimeout(() => {
                UI.showMessage(`祈福获得：${newItem.name} (${GameData.equipment.qualities[newItem.quality].name} Lv.${newItem.level})！`, 3500);
                console.log("祈福获得:", newItem);
            }, 1500);
            this.updatePlayerUI(); 
            this.saveGameData();
        }
    },

    startPVE: function() {
        if (!this.playerLingChong) {
            UI.showMessage("请先创建灵宠。");
            return;
        }
        if (this.pveInstance && this.pveInstance.isInBattle) {
            UI.showMessage("已在战斗中！");
            if (this.pveInstance.currentMonster) { 
                 UI.loadPVEBattleUI(this.playerLingChong, this.pveInstance.currentMonster, this.pveInstance);
            } else {
                UI.showMessage("战斗状态异常，请尝试重新进入迷雾森林。", 3000);
                this.pveInstance = null; 
            }
            return;
        }
        this.playerLingChong.heal(); 
        if (typeof PVE === 'undefined' || typeof PVE !== 'function') {
            console.error("PVE class is not defined. Ensure pve.js is loaded correctly and PVE class is globally available.");
            UI.showMessage("PVE系统组件未能正确加载，无法开始战斗。", 3000);
            return;
        }
        try {
            this.pveInstance = new PVE(this.playerLingChong);
            this.pveInstance.startNextLevel(); 
        } catch (error) {
            console.error("启动PVE战斗时发生错误:", error.name, error.message, error.stack);
            UI.showMessage("启动PVE战斗失败，详情请查看控制台。", 3000);
            this.pveInstance = null; 
        }
    },

    endPVEBattle: function(rewards) {
        if (rewards && this.playerLingChong) {
            if (rewards.exp) this.playerLingChong.addExp(rewards.exp);
            if (rewards.points) this.playerLingChong.addPvePoints(rewards.points);
            if (rewards.qifuVoucher) this.playerLingChong.addQifuVoucher(rewards.qifuVoucher);
        }
        this.loadMainInterface(); 
        this.saveGameData();
        this.pveInstance = null; 
    }
};

// **关键改动：将 Game 对象暴露到全局作用域**
window.Game = Game;

document.addEventListener('DOMContentLoaded', () => {
    // Game.init() is now called after UI.init() is guaranteed to have been attempted by ui.js
    // However, to ensure Game object is available for UI event handlers, Game.init() should also run early.
    // The robust checks within Game.init() for UI readiness should handle this.
    // Since window.Game = Game is set above, Game.init() will operate on the global Game object.
    Game.init();
});

// Enhanced window.onerror
window.onerror = function(message, source, lineno, colno, error) {
    console.error("捕获到全局错误 (RAW):", message, "Source:", source, "Line:", lineno, "Col:", colno, "Error Object:", error);
    try {
        // Check if UI and its necessary components for showMessage are available
        if (typeof UI !== 'undefined' && UI.showMessage && typeof UI.showMessage === 'function' && 
            UI.elements && UI.elements.gameMessageBox instanceof HTMLElement && UI.elements.gameMessageText instanceof HTMLElement) {
                 UI.showMessage(`发生了一个意外错误: ${message}. 建议刷新页面。`, 7000);
        } else {
            throw new Error("UI.showMessage dependencies not ready for onerror.");
        }
    } catch (e) {
        console.warn("Fallback error display triggered due to:", e.message);
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.bottom = '10px';
        errorDiv.style.left = '10px';
        errorDiv.style.padding = '10px';
        errorDiv.style.backgroundColor = 'red';
        errorDiv.style.color = 'white';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.border = '1px solid darkred';
        errorDiv.style.borderRadius = '5px';
        errorDiv.textContent = `发生严重错误: ${message}. 请检查控制台并刷新. (UI Message system failed: ${e.message})`;
        
        const appendErrorToBody = () => {
            if (document.body) {
                document.body.appendChild(errorDiv);
            } else {
                if (!window.errorDivAppendedToBody) { // Prevent multiple listeners
                    document.addEventListener('DOMContentLoaded', function onDomReadyForErrorDisplay() {
                        if(document.body) document.body.appendChild(errorDiv);
                        window.errorDivAppendedToBody = true; 
                        document.removeEventListener('DOMContentLoaded', onDomReadyForErrorDisplay); 
                    });
                }
            }
        };
        appendErrorToBody();
    }
    return true; 
};
