// js/ui.js

const UI = {
    // DOM元素引用
    elements: {
        mainContent: null,
        initialLoading: null,
        petSelectionModal: null,
        petOptionsContainer: null,
        confirmPetSelectionButton: null,
        gameMessageBox: null,
        gameMessageText: null,
        closeMessageBoxButton: null,
        petNameDisplay: null,
        petIconDisplay: null,
        petLevelDisplay: null,
        petExpBar: null,
        petExpText: null,
        petHpDisplay: null,
        petAttackDisplay: null,
        petDefenseDisplay: null,
        petSpeedDisplay: null,
        equipmentSlotsContainer: null,
        pveBattleScreen: null,
        playerPetBattleDisplay: null,
        enemyMonsterBattleDisplay: null,
        pveBattleLog: null,
        pveBattleControls: null,
        devToolsContainer: null,
        testAddExpButton: null,
        testAddQifuVoucherButton: null,
        testResetPetButton: null,
    },

    init: function() {
        try {
            console.log("UI.init() called."); // 新增：确认UI.init开始执行

            this.elements.mainContent = document.getElementById('main-content');
            this.elements.initialLoading = document.getElementById('initial-loading');
            this.elements.petSelectionModal = document.getElementById('pet-selection-modal');
            this.elements.petOptionsContainer = document.getElementById('pet-options-container');
            this.elements.confirmPetSelectionButton = document.getElementById('confirm-pet-selection');
            this.elements.gameMessageBox = document.getElementById('game-message-box');
            this.elements.gameMessageText = document.getElementById('game-message-text');
            this.elements.closeMessageBoxButton = document.getElementById('close-message-box');
            this.elements.devToolsContainer = document.getElementById('dev-tools');
            this.elements.testAddExpButton = document.getElementById('test-add-exp');
            this.elements.testAddQifuVoucherButton = document.getElementById('test-add-qifu-voucher');
            this.elements.testResetPetButton = document.getElementById('test-reset-pet');

            // 确保这些元素存在，否则 getElementById 会返回 null
            if (!this.elements.mainContent) console.warn("UI.init: 'main-content' not found.");
            if (!this.elements.initialLoading) console.warn("UI.init: 'initial-loading' not found.");
            if (!this.elements.petSelectionModal) console.warn("UI.init: 'pet-selection-modal' not found.");
            // ...可以为其他重要元素添加类似检查

            if (this.elements.closeMessageBoxButton) {
                this.elements.closeMessageBoxButton.addEventListener('click', () => this.hideMessage());
            } else {
                console.warn("UI.init: 'close-message-box' button not found.");
            }
            console.log("UI module initialized and DOM elements cached."); // 目标日志
        } catch (e) {
            console.error("Error INSIDE UI.init():", e.name, e.message, e.stack);
            // 尝试显示一个非常基础的错误信息给用户，以防UI.showMessage也坏了
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '0';
            errorDiv.style.left = '0';
            errorDiv.style.width = '100%';
            errorDiv.style.padding = '10px';
            errorDiv.style.backgroundColor = 'rgba(255,0,0,0.9)';
            errorDiv.style.color = 'white';
            errorDiv.style.zIndex = '20000';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.fontSize = '16px';
            errorDiv.textContent = `UI Initialization Error: ${e.message}. Check console for details.`;
            
            const appendError = () => {
                if (document.body) {
                    document.body.insertBefore(errorDiv, document.body.firstChild);
                } else {
                    // 如果body还不存在，等DOM加载完再尝试
                    document.addEventListener('DOMContentLoaded', () => {
                        if (document.body) document.body.insertBefore(errorDiv, document.body.firstChild);
                    });
                }
            };
            
            // 尝试立即追加，如果失败则等待DOMContentLoaded
            try {
                appendError();
            } catch (domError) {
                console.error("Could not append fallback error message to body immediately:", domError);
                 document.addEventListener('DOMContentLoaded', appendError);
            }
            throw e; // 重新抛出错误，以便 window.onerror 仍能捕获（如果它配置为这样做）
        }
    },

    showLoading: function(message = "加载中...") {
        if (this.elements.initialLoading) {
            this.elements.initialLoading.innerHTML = `<p class="text-lg">${message}</p>`;
            this.elements.initialLoading.classList.remove('hidden');
        } else {
            console.warn("showLoading: initialLoading element not found.");
        }
        if (this.elements.mainContent) {
            this.elements.mainContent.innerHTML = '';
        } else {
            console.warn("showLoading: mainContent element not found.");
        }
    },

    hideLoading: function() {
        if (this.elements.initialLoading) {
            this.elements.initialLoading.classList.add('hidden');
        }
    },

    showMessage: function(message, duration = GameData.ui.messageBoxDisplayTime) {
        if (!this.elements.gameMessageBox || !this.elements.gameMessageText) {
            console.warn("showMessage: gameMessageBox or gameMessageText element not found. Message:", message);
            return;
        }
        this.elements.gameMessageText.textContent = message;
        this.elements.gameMessageBox.classList.remove('hidden');
        this.elements.gameMessageBox.style.animation = 'none';
        void this.elements.gameMessageBox.offsetWidth;
        this.elements.gameMessageBox.style.animation = `fadeInOut ${duration / 1000}s ease-in-out forwards`;
    },

    hideMessage: function() {
        if (this.elements.gameMessageBox) {
            this.elements.gameMessageBox.classList.add('hidden');
        }
    },

    showPetSelectionModal: function(petOptions, callback) {
        if (!this.elements.petSelectionModal || !this.elements.petOptionsContainer || !this.elements.confirmPetSelectionButton) {
            console.error("灵宠选择模态框元素未找到!");
            return;
        }
        this.elements.petOptionsContainer.innerHTML = '';
        let selectedPetId = null;

        petOptions.forEach(pet => {
            const card = document.createElement('div');
            card.className = 'pet-option-card bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 ease-in-out text-center';
            card.dataset.petId = pet.id;
            const icon = document.createElement('div');
            icon.className = 'emoji-placeholder text-5xl mb-2';
            icon.textContent = pet.icon;
            const name = document.createElement('h3');
            name.className = 'font-semibold text-tang-primary';
            name.textContent = pet.name;
            const description = document.createElement('p');
            description.className = 'text-xs text-gray-600 mt-1';
            description.textContent = pet.description;
            card.appendChild(icon);
            card.appendChild(name);
            card.appendChild(description);
            card.addEventListener('click', () => {
                this.elements.petOptionsContainer.querySelectorAll('.pet-option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedPetId = pet.id;
                this.elements.confirmPetSelectionButton.disabled = false;
            });
            this.elements.petOptionsContainer.appendChild(card);
        });

        this.elements.confirmPetSelectionButton.disabled = true;
        this.elements.confirmPetSelectionButton.onclick = () => {
            if (selectedPetId) {
                this.hidePetSelectionModal();
                callback(selectedPetId);
            }
        };
        this.elements.petSelectionModal.classList.remove('hidden');
        this.hideLoading();
    },

    hidePetSelectionModal: function() {
        if (this.elements.petSelectionModal) {
            this.elements.petSelectionModal.classList.add('hidden');
        }
    },

    loadMainGameUI: function(lingChongInstance) {
        this.hideLoading();
        if (!this.elements.mainContent) {
            console.error("loadMainGameUI: mainContent element is not available to load UI into.");
            return;
        }
        this.elements.mainContent.innerHTML = `
            <div id="pet-dashboard" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1 bg-gradient-to-br from-tang-background to-yellow-100 p-6 rounded-xl shadow-lg border border-tang-border">
                    <div class="text-center mb-4">
                        <div id="pet-icon-display" class="text-7xl mb-2">${lingChongInstance.appearance.icon}</div>
                        <h2 id="pet-name-display" class="text-2xl font-bold text-tang-primary">${lingChongInstance.name}</h2>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="font-semibold">等级:</span>
                            <span id="pet-level-display">${lingChongInstance.level}</span>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="font-semibold">经验:</span>
                                <span id="pet-exp-text" class="text-xs">${lingChongInstance.currentExp} / ${getExpForLevel(lingChongInstance.level)}</span>
                            </div>
                            <div class="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                                <div id="pet-exp-bar" class="bg-tang-secondary h-4 rounded-full transition-all duration-500 ease-out" style="width: ${(lingChongInstance.currentExp / getExpForLevel(lingChongInstance.level)) * 100}%"></div>
                            </div>
                        </div>
                        <hr class="my-3 border-tang-border opacity-50">
                        <h4 class="font-semibold text-tang-primary text-lg mb-2">基础属性</h4>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                            <span>❤️ 气血:</span> <span id="pet-hp-display" class="font-medium">${lingChongInstance.stats.hp}</span>
                            <span>⚔️ 攻击:</span> <span id="pet-attack-display" class="font-medium">${lingChongInstance.stats.attack}</span>
                            <span>🛡️ 防御:</span> <span id="pet-defense-display" class="font-medium">${lingChongInstance.stats.defense}</span>
                            <span>💨 速度:</span> <span id="pet-speed-display" class="font-medium">${lingChongInstance.stats.speed.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 class="text-xl font-semibold text-tang-primary mb-4">灵宠装备</h3>
                    <div id="equipment-slots-container" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        </div>
                    <div class="mt-6 text-center">
                        <button id="open-inventory-button" class="game-button button-secondary mr-2">🎒 背包</button>
                        <button id="open-qifu-button" class="game-button button-primary">✨ 祈福 (${lingChongInstance.qifuVouchers || 0}次)</button>
                    </div>
                </div>
            </div>

            <div id="game-actions" class="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 class="text-xl font-semibold text-tang-primary mb-4">行动指令</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <button id="goto-pve-mist-forest" class="game-button button-primary">🌲 闯荡迷雾森林</button>
                    <button id="goto-pvp-arena" class="game-button button-secondary" disabled>⚔️ 众神之境 (PVP - 待开放)</button>
                    <button id="open-battle-pass-button" class="game-button button-secondary" disabled>📜 战令 (待开放)</button>
                </div>
            </div>
        `;

        this.elements.petNameDisplay = document.getElementById('pet-name-display');
        this.elements.petIconDisplay = document.getElementById('pet-icon-display');
        this.elements.petLevelDisplay = document.getElementById('pet-level-display');
        this.elements.petExpBar = document.getElementById('pet-exp-bar');
        this.elements.petExpText = document.getElementById('pet-exp-text');
        this.elements.petHpDisplay = document.getElementById('pet-hp-display');
        this.elements.petAttackDisplay = document.getElementById('pet-attack-display');
        this.elements.petDefenseDisplay = document.getElementById('pet-defense-display');
        this.elements.petSpeedDisplay = document.getElementById('pet-speed-display');
        this.elements.equipmentSlotsContainer = document.getElementById('equipment-slots-container');

        this.renderEquipmentSlots(lingChongInstance);
        this.updateLingChongStats(lingChongInstance);

        const pveButton = document.getElementById('goto-pve-mist-forest');
        if (pveButton) {
            pveButton.addEventListener('click', () => {
                console.log('PVE button clicked. Checking Game object:'); 
                console.log('window.Game:', window.Game); 
                if (window.Game) {
                    console.log('window.Game.startPVE:', window.Game.startPVE); 
                    console.log('typeof window.Game.startPVE:', typeof window.Game.startPVE); 
                }
                if (window.Game && typeof window.Game.startPVE === 'function') {
                    window.Game.startPVE();
                } else {
                    UI.showMessage("PVE功能暂未完全加载或配置错误。请检查控制台。");
                    console.error("PVE start function not available or not a function. window.Game:", window.Game, "window.Game.startPVE:", (window.Game ? window.Game.startPVE : 'N/A'), "typeof:", (window.Game ? typeof window.Game.startPVE : 'N/A'));
                }
            });
        }

        const qifuButton = document.getElementById('open-qifu-button');
        if (qifuButton) {
             qifuButton.addEventListener('click', () => {
                if (window.Game && typeof window.Game.performQifu === 'function') {
                    window.Game.performQifu();
                } else {
                    UI.showMessage("祈福功能暂未完全加载。");
                }
            });
        }
       
        document.getElementById('open-inventory-button').addEventListener('click', () => {
            UI.showMessage("背包系统开发中...");
        });
    },

    updateLingChongStats: function(lingChongInstance) {
        if (!lingChongInstance) return;
        // Ensure elements are available before updating
        if (this.elements.petNameDisplay) this.elements.petNameDisplay.textContent = lingChongInstance.name;
        if (this.elements.petIconDisplay) this.elements.petIconDisplay.textContent = lingChongInstance.appearance.icon;
        if (this.elements.petLevelDisplay) this.elements.petLevelDisplay.textContent = lingChongInstance.level;
        
        const expForNextLevel = getExpForLevel(lingChongInstance.level);
        const expPercentage = (expForNextLevel === Infinity || expForNextLevel === 0) ? 100 : (lingChongInstance.currentExp / expForNextLevel) * 100;

        if (this.elements.petExpText) this.elements.petExpText.textContent = `${lingChongInstance.currentExp} / ${expForNextLevel === Infinity ? 'MAX' : expForNextLevel}`;
        if (this.elements.petExpBar) this.elements.petExpBar.style.width = `${Math.min(expPercentage, 100)}%`;
        
        const totalStats = lingChongInstance.getTotalStats();
        if (this.elements.petHpDisplay) this.elements.petHpDisplay.textContent = totalStats.hp;
        if (this.elements.petAttackDisplay) this.elements.petAttackDisplay.textContent = totalStats.attack;
        if (this.elements.petDefenseDisplay) this.elements.petDefenseDisplay.textContent = totalStats.defense;
        if (this.elements.petSpeedDisplay) this.elements.petSpeedDisplay.textContent = totalStats.speed.toFixed(1);
        
        const qifuButton = document.getElementById('open-qifu-button');
        if (qifuButton) {
            qifuButton.textContent = `✨ 祈福 (${lingChongInstance.qifuVouchers || 0}次)`;
        }
    },

    renderEquipmentSlots: function(lingChongInstance) {
        if (!this.elements.equipmentSlotsContainer || !lingChongInstance) return;
        this.elements.equipmentSlotsContainer.innerHTML = '';
        for (const typeKey in GameData.equipment.types) {
            const typeInfo = GameData.equipment.types[typeKey];
            const slot = document.createElement('div');
            slot.className = 'equipment-slot relative flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 hover:border-tang-primary transition-colors cursor-pointer';
            slot.dataset.slotType = typeInfo.id;
            slot.title = `装备 ${typeInfo.name}`;
            const equippedItem = (typeKey === 'SPRITE_1' || typeKey === 'SPRITE_2') ? lingChongInstance.sprites[typeInfo.id] : lingChongInstance.equipment[typeInfo.id];
            if (equippedItem) {
                // Determine quality information, whether it's an equipment or sprite
                let qualityName = '凡品';
                let qualityClass = GameData.equipment.qualities['WHITE'].class; // Default to white
                let itemQualityKey = equippedItem.quality; // For Equipment

                if (equippedItem instanceof Sprite) { // Check if it's a Sprite
                    const spriteBaseData = GameData.sprites.spriteData[equippedItem.spriteId];
                    itemQualityKey = spriteBaseData.quality; // Sprites have quality in their base data
                }
                
                const qualityInfo = GameData.equipment.qualities[itemQualityKey];
                if (qualityInfo) {
                    qualityName = qualityInfo.name;
                    qualityClass = qualityInfo.class;
                }

                slot.innerHTML = `
                    <span class="equipment-item-icon text-3xl">${equippedItem.icon || typeInfo.icon}</span>
                    <span class="equipment-item-level absolute top-0.5 left-0.5 text-xs bg-black bg-opacity-60 text-white px-1 rounded-sm">Lv.${equippedItem.level}</span>
                `;
                slot.classList.remove('border-gray-400', 'border-dashed');
                slot.classList.add(qualityClass);
                slot.title = `${qualityName} ${equippedItem.name} (Lv.${equippedItem.level})\n点击查看详情/卸下`;
            } else {
                slot.innerHTML = `<span class="text-3xl text-gray-400">${typeInfo.icon}</span>`;
            }
            this.elements.equipmentSlotsContainer.appendChild(slot);
        }
    },

    loadPVEBattleUI: function(playerPet, enemyMonster, pveInstance) {
        if (!this.elements.mainContent) {
            console.error("loadPVEBattleUI: mainContent element is not available.");
            return;
        }
        this.elements.mainContent.innerHTML = `
            <div id="pve-battle-screen" class="bg-gray-800 text-white p-4 rounded-lg shadow-xl">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-yellow-400">迷雾森林 - 第 ${pveInstance.currentLevel + 1} 关</h2>
                    <button id="pve-return-button" class="game-button button-danger text-sm py-1 px-3">返回主城</button>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div id="player-pet-battle-display" class="battle-character bg-gray-700 p-3 rounded"></div>
                    <div id="enemy-monster-battle-display" class="battle-character bg-gray-700 p-3 rounded"></div>
                </div>
                <div id="pve-battle-controls" class="text-center mb-4 space-x-2">
                    <span class="font-semibold mr-2">战斗速度:</span>
                    <button data-speed="1" class="pve-speed-btn game-button button-secondary text-xs py-1 px-2">1X</button>
                    <button data-speed="2" class="pve-speed-btn game-button button-secondary text-xs py-1 px-2">2X</button>
                    <button data-speed="3" class="pve-speed-btn game-button button-secondary text-xs py-1 px-2">3X</button>
                </div>
                <div id="pve-battle-log-container" class="bg-gray-900 p-3 rounded">
                     <h4 class="text-sm font-semibold text-yellow-300 mb-1">战斗记录</h4>
                     <div id="pve-battle-log" class="h-32 overflow-y-auto text-xs border border-gray-700 p-2 rounded">
                        <p>战斗开始！</p>
                    </div>
                </div>
                <div id="pve-battle-result" class="text-center mt-4 hidden">
                    <h3 id="pve-result-message" class="text-xl font-bold"></h3>
                    <button id="pve-next-level-button" class="game-button button-primary mt-2 hidden">挑战下一关</button>
                    <button id="pve-retry-button" class="game-button button-secondary mt-2 hidden">再次尝试</button>
                </div>
            </div>
        `;
        this.elements.pveBattleScreen = document.getElementById('pve-battle-screen');
        this.elements.playerPetBattleDisplay = document.getElementById('player-pet-battle-display');
        this.elements.enemyMonsterBattleDisplay = document.getElementById('enemy-monster-battle-display');
        this.elements.pveBattleLog = document.getElementById('pve-battle-log');
        this.elements.pveBattleControls = document.getElementById('pve-battle-controls');
        
        const returnButton = document.getElementById('pve-return-button');
        if(returnButton) {
            returnButton.addEventListener('click', () => {
                pveInstance.stopBattle();
                if(window.Game) window.Game.endPVEBattle(null); 
            });
        }
        
        this.updatePVECharacterDisplay(this.elements.playerPetBattleDisplay, playerPet.name, playerPet.appearance.icon, playerPet.currentHp, playerPet.getTotalStats().hp); 
        this.updatePVECharacterDisplay(this.elements.enemyMonsterBattleDisplay, enemyMonster.name, enemyMonster.icon, enemyMonster.currentHp, enemyMonster.hp);
        
        this.elements.pveBattleControls.querySelectorAll('.pve-speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseInt(e.target.dataset.speed);
                pveInstance.setBattleSpeed(speed);
                this.elements.pveBattleControls.querySelectorAll('.pve-speed-btn').forEach(b => b.classList.remove('active', 'bg-yellow-400', 'text-gray-800'));
                e.target.classList.add('active', 'bg-yellow-400', 'text-gray-800');
                UI.showMessage(`战斗速度调整为 ${speed}X`);
            });
        });
        const initialSpeedButton = this.elements.pveBattleControls.querySelector(`.pve-speed-btn[data-speed="${pveInstance.battleSpeed || 1}"]`);
        if (initialSpeedButton) {
            initialSpeedButton.classList.add('active', 'bg-yellow-400', 'text-gray-800');
        } else { // Default to 1X if current speed button not found
            const defaultSpeedButton = this.elements.pveBattleControls.querySelector(`.pve-speed-btn[data-speed="1"]`);
            if(defaultSpeedButton) defaultSpeedButton.classList.add('active', 'bg-yellow-400', 'text-gray-800');
        }
    },

    updatePVECharacterDisplay: function(element, name, icon, currentHp, maxHp) {
        if (!element) return;
        const hpPercentage = maxHp > 0 ? Math.max(0, (currentHp / maxHp) * 100) : 0; 
        element.innerHTML = `
            <div class="name text-lg">${name}</div>
            <div class="char-icon text-5xl my-2">${icon}</div>
            <div class="hp-bar-container w-full h-5 bg-gray-600 rounded overflow-hidden border border-gray-500">
                <div class="hp-bar h-full bg-green-500 transition-all duration-300 ease-linear text-xs flex items-center justify-center" style="width: ${hpPercentage}%;">
                    ${Math.max(0, currentHp)} / ${maxHp}
                </div>
            </div>
            <div class="hp-text text-sm">${Math.max(0, currentHp)} / ${maxHp}</div>
        `;
    },

    addPVEBattleLogEntry: function(message, type = 'info') {
        if (!this.elements.pveBattleLog) return;
        const entry = document.createElement('p');
        entry.textContent = message;
        if (type === 'damage') entry.classList.add('text-red-400');
        if (type === 'heal') entry.classList.add('text-green-400');
        if (type === 'effect') entry.classList.add('text-blue-400');
        if (type === 'system') entry.classList.add('text-yellow-400', 'font-semibold');
        this.elements.pveBattleLog.appendChild(entry);
        this.elements.pveBattleLog.scrollTop = this.elements.pveBattleLog.scrollHeight;
    },

    showPVEBattleResult: function(isWin, pveInstance) {
        const resultDiv = document.getElementById('pve-battle-result');
        const messageEl = document.getElementById('pve-result-message');
        const nextButton = document.getElementById('pve-next-level-button');
        const retryButton = document.getElementById('pve-retry-button');
        if (!resultDiv || !messageEl || !nextButton || !retryButton) return;
        
        resultDiv.classList.remove('hidden');
        if (pveInstance.autoAdvanceTimeout) clearTimeout(pveInstance.autoAdvanceTimeout); // Clear previous timeout

        if (isWin) {
            messageEl.textContent = '胜利！💪';
            messageEl.className = 'text-2xl font-bold text-green-400';
            nextButton.classList.remove('hidden');
            retryButton.classList.add('hidden');
            nextButton.onclick = () => { // Ensure onclick is fresh
                if (pveInstance.autoAdvanceTimeout) clearTimeout(pveInstance.autoAdvanceTimeout);
                resultDiv.classList.add('hidden');
                pveInstance.advanceToNextLevel();
            };
            UI.addPVEBattleLogEntry(`将在 ${GameData.pve.mistForest.autoAdvanceDelay / 1000} 秒后自动进入下一关...`, 'system');
            pveInstance.autoAdvanceTimeout = setTimeout(() => {
                // Check if the result screen is still visible and the PVE instance is still active for this battle
                if (pveInstance && pveInstance.isInBattle === false && !resultDiv.classList.contains('hidden') && !nextButton.classList.contains('hidden')) {
                     nextButton.click(); 
                }
            }, GameData.pve.mistForest.autoAdvanceDelay);
        } else {
            messageEl.textContent = '惜败...💔';
            messageEl.className = 'text-2xl font-bold text-red-400';
            nextButton.classList.add('hidden');
            retryButton.classList.remove('hidden');
            retryButton.onclick = () => { // Ensure onclick is fresh
                 if (pveInstance.autoAdvanceTimeout) clearTimeout(pveInstance.autoAdvanceTimeout);
                resultDiv.classList.add('hidden');
                pveInstance.retryCurrentLevel();
            };
            UI.addPVEBattleLogEntry('战斗失败。调整策略后再次尝试吧！', 'system');
        }
    },
    updateDevTools: function(gameState) {}
};

// Ensure UI.init is called after the DOM is fully loaded.
// This is the primary call to UI.init.
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
console.log("UI module loaded."); // This confirms the script file itself is parsed.
