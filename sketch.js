// sketch.js
// GameManager, Pet, PetSelectionUI, Equipment, Monster, PveManager, data files, uiManager, Sprite, spriteData are loaded via index.html

let petSelectionUI; 
// Button configurations 
let gainExpButtonConfig = { 
    x: 550, y: 50, w: 120, h: 40, 
    label: "获取10经验", 
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14 
};
let getNewWeaponButtonConfig = { 
    x: 550, y: 100, w: 150, h: 40, 
    label: "替换武器并分解旧的", 
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14
};
let pveButtonConfig = { 
    x: 550, y: 150, w: 180, h: 40, 
    label: "", // Dynamic
    baseColor: null, hoverColor: null, inactiveColor: null, textColor: null, active: true, textSize: 14
}; 
let getSpriteButtonConfig = {
    x: 550, y: 200, w: 180, h: 40,
    label: "随机精灵碎片/精灵",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14
};
let equipSpriteButtonConfig = {
    x: 550, y: 250, w: 180, h: 40,
    label: "装备首个精灵到槽1",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14
};
let viewFailedLogButtonConfig = {
    x: 550, y: 300, w: 180, h: 40, 
    label: "查看上次失败记录",
    baseColor: null, hoverColor: null, inactiveColor: null, textColor: null, active: false, textSize: 14
};
let getVouchersButtonConfig = {
    x: 550, y: 350, w: 180, h: 40,
    label: "获取10祈福券",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14
};
// NEW: Blessing System Buttons
let goToBlessingButtonConfig = {
    x: 550, y: 400, w: 180, h: 40,
    label: "前往祈福",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 14
};
let performBlessingButtonConfig = { // For blessing screen
    x: 350, y: 200, w: 150, h: 50,
    label: "祈福一次 (1券)",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 16
};
let backFromBlessingButtonConfig = { // For blessing screen
    x: 350, y: 450, w: 150, h: 40,
    label: "返回主城",
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 16
};


const closeLogButtonConfig = { 
    x: 800 / 2 - 60, y: 600 - 70, w: 120, h: 40, 
    label: "关闭", 
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 16
};
let pveAbandonButtonConfig = { 
    x: 800 - 150, y: 600 - 50, w: 120, h: 30, 
    label: "放弃挑战", 
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 16
};
let pveBackToMainButtonConfig = { 
    x: 800 / 2 - 60, y: 600 / 2 + 50, w: 120, h: 40, 
    label: "返回主城", 
    baseColor: null, hoverColor: null, textColor: null, active: true, textSize: 18
};


function setup() {
  createCanvas(800, 600); 
  petSelectionUI = new PetSelectionUI(); 
  petSelectionUI.show(); 
  
  // Initialize button colors
  gainExpButtonConfig.baseColor = color(220, 220, 100); 
  gainExpButtonConfig.hoverColor = color(red(gainExpButtonConfig.baseColor) * 0.85, green(gainExpButtonConfig.baseColor) * 0.85, blue(gainExpButtonConfig.baseColor) * 0.85);
  gainExpButtonConfig.textColor = color(0);

  getNewWeaponButtonConfig.baseColor = color(100, 150, 220); 
  getNewWeaponButtonConfig.hoverColor = color(red(getNewWeaponButtonConfig.baseColor) * 0.85, green(getNewWeaponButtonConfig.baseColor) * 0.85, blue(getNewWeaponButtonConfig.baseColor) * 0.85);
  getNewWeaponButtonConfig.textColor = color(0);
  
  pveButtonConfig.inactiveColor = color(170, 170, 170); 
  pveButtonConfig.textColor = color(0); 

  getSpriteButtonConfig.baseColor = color(150, 220, 100); 
  getSpriteButtonConfig.hoverColor = color(130, 200, 80);
  getSpriteButtonConfig.textColor = color(0);

  equipSpriteButtonConfig.baseColor = color(220, 150, 100); 
  equipSpriteButtonConfig.hoverColor = color(200, 130, 80);
  equipSpriteButtonConfig.textColor = color(0);

  viewFailedLogButtonConfig.baseColor = color(200, 180, 100); 
  viewFailedLogButtonConfig.hoverColor = color(180, 160, 80);
  viewFailedLogButtonConfig.inactiveColor = color(170, 170, 170);
  viewFailedLogButtonConfig.textColor = color(0);

  getVouchersButtonConfig.baseColor = color(210, 180, 230); 
  getVouchersButtonConfig.hoverColor = color(190, 160, 210);
  getVouchersButtonConfig.textColor = color(0);

  goToBlessingButtonConfig.baseColor = color(255, 215, 0); // Gold
  goToBlessingButtonConfig.hoverColor = color(235, 195, 0);
  goToBlessingButtonConfig.textColor = color(0);

  performBlessingButtonConfig.baseColor = color(0, 200, 200); // Cyan
  performBlessingButtonConfig.hoverColor = color(0, 180, 180);
  performBlessingButtonConfig.textColor = color(255);

  backFromBlessingButtonConfig.baseColor = color(180, 180, 180);
  backFromBlessingButtonConfig.hoverColor = color(160, 160, 160);
  backFromBlessingButtonConfig.textColor = color(0);


  closeLogButtonConfig.baseColor = color(180, 180, 180);
  closeLogButtonConfig.hoverColor = color(160, 160, 160);
  closeLogButtonConfig.textColor = color(0);

  pveAbandonButtonConfig.baseColor = color(200, 100, 100); 
  pveAbandonButtonConfig.hoverColor = color(red(pveAbandonButtonConfig.baseColor) * 0.85, green(pveAbandonButtonConfig.baseColor) * 0.85, blue(pveAbandonButtonConfig.baseColor) * 0.85);
  pveAbandonButtonConfig.textColor = color(255);

  pveBackToMainButtonConfig.baseColor = color(100, 100, 200); 
  pveBackToMainButtonConfig.hoverColor = color(red(pveBackToMainButtonConfig.baseColor) * 0.85, green(pveBackToMainButtonConfig.baseColor) * 0.85, blue(pveBackToMainButtonConfig.baseColor) * 0.85);
  pveBackToMainButtonConfig.textColor = color(255);
}

function draw() {
  background(240, 240, 255); 
  if (typeof uiManager === 'undefined' || typeof gameManager === 'undefined') {
    fill(0); textSize(20); textAlign(CENTER,CENTER); text("核心组件加载中...", width/2, height/2); return;
  }

  if (uiManager.showingBlessingScreen) {
      drawBlessingScreen();
  } else if (uiManager.showingFailedLog) { 
      drawFailedBattleLogScreen();
  } else if (petSelectionUI.visible) { 
    petSelectionUI.draw();
  } else if (gameManager.playerPet) { 
    if (gameManager.pveManager && gameManager.pveManager.isInBattle) {
      drawPveBattleScreen();
    } else {
      drawMainGameUI(); 
    }
  } else { 
    fill(0); textSize(20); textAlign(CENTER,CENTER); text("正在等待灵宠选择...", width/2, height/2); textAlign(LEFT, BASELINE);
  }
  if (typeof uiManager !== 'undefined') { uiManager.drawTooltip(); }
}

function mousePressed() {
  if (typeof uiManager === 'undefined' || typeof gameManager === 'undefined') { return; }

  if (uiManager.showingBlessingScreen) {
      if (uiManager.isMouseOver(performBlessingButtonConfig.x, performBlessingButtonConfig.y, performBlessingButtonConfig.w, performBlessingButtonConfig.h)) {
          gameManager.performBlessing(); // This will update gameManager.lastBlessingRewardDisplay
      } else if (uiManager.isMouseOver(backFromBlessingButtonConfig.x, backFromBlessingButtonConfig.y, backFromBlessingButtonConfig.w, backFromBlessingButtonConfig.h)) {
          uiManager.showingBlessingScreen = false;
          gameManager.lastBlessingRewardDisplay = ""; // Clear display when leaving
          gameManager.lastObtainedItemFromBlessing = null;
      }
      return;
  }

  if (uiManager.showingFailedLog) {
      if (uiManager.isMouseOver(closeLogButtonConfig.x, closeLogButtonConfig.y, closeLogButtonConfig.w, closeLogButtonConfig.h)) {
          uiManager.showingFailedLog = false; console.log("关闭失败战斗日志。");
      }
      return; 
  }

  if (petSelectionUI.visible) { 
    let selectedPetId = petSelectionUI.handleMousePress(mouseX, mouseY);
    if (selectedPetId) { gameManager.playerPet = new Pet(selectedPetId); addTestEquipment(); petSelectionUI.hide(); }
  } else if (gameManager.playerPet) {
    const pveMgr = gameManager.pveManager; 
    const pet = gameManager.playerPet;

    if (pveMgr && pveMgr.isInBattle) { 
      if (pveMgr.battleOver) {
        if (uiManager.isMouseOver(pveBackToMainButtonConfig.x, pveBackToMainButtonConfig.y, pveBackToMainButtonConfig.w, pveBackToMainButtonConfig.h)) { pveMgr.isInBattle = false; }
      } else {
        if (uiManager.isMouseOver(pveAbandonButtonConfig.x, pveAbandonButtonConfig.y, pveAbandonButtonConfig.w, pveAbandonButtonConfig.h)) { pveMgr.determineWinnerAndEndBattle('monster'); }
      }
    } else {
      // Main Game UI buttons
      if (pveButtonConfig.active && uiManager.isMouseOver(pveButtonConfig.x, pveButtonConfig.y, pveButtonConfig.w, pveButtonConfig.h)) {
          const targetLevel = gameManager.playerMaxPveLevel;
          const levelData = (typeof PVE_LEVELS !== 'undefined') ? PVE_LEVELS.find(l => l.levelNumber === targetLevel) : null;
          if (levelData) { if(pet) { pet.hp = pet.maxHp; } else { return; } pveMgr.startLevel(targetLevel, pet); } 
          else {
              if (typeof PVE_LEVELS !== 'undefined' && PVE_LEVELS.length > 0) {
                  const lastDefinedLevelNumber = PVE_LEVELS[PVE_LEVELS.length - 1].levelNumber;
                  if (targetLevel > lastDefinedLevelNumber) { gameManager.allPveLevelsCleared = true; }
              } else if (typeof PVE_LEVELS === 'undefined' || PVE_LEVELS.length === 0) { gameManager.allPveLevelsCleared = true; }
          } return; 
      }
      if (gainExpButtonConfig.active && uiManager.isMouseOver(gainExpButtonConfig.x, gainExpButtonConfig.y, gainExpButtonConfig.w, gainExpButtonConfig.h)) { pet.gainExperience(10); return; }
      if (getNewWeaponButtonConfig.active && uiManager.isMouseOver(getNewWeaponButtonConfig.x, getNewWeaponButtonConfig.y, getNewWeaponButtonConfig.w, getNewWeaponButtonConfig.h)) {
        let unequippedOldWeapon = null;
        if (pet.equipmentSlots[EQUIPMENT_TYPES.WEAPON]) { unequippedOldWeapon = pet.unequipItem(EQUIPMENT_TYPES.WEAPON); }
        if (unequippedOldWeapon) { pet.dismantleEquipment(unequippedOldWeapon); }
        const qualitiesArray = Object.keys(EQUIPMENT_QUALITIES);
        const randomQualityKey = qualitiesArray[Math.floor(Math.random() * qualitiesArray.length)];
        const newWeapon = new Equipment(`wep_${Date.now()}`,`${EQUIPMENT_QUALITIES[randomQualityKey].name}长剑`, EQUIPMENT_TYPES.WEAPON, randomQualityKey, pet.level, '🗡️');
        pet.equipItem(newWeapon); return; 
      }
      if (getSpriteButtonConfig.active && uiManager.isMouseOver(getSpriteButtonConfig.x, getSpriteButtonConfig.y, getSpriteButtonConfig.w, getSpriteButtonConfig.h)) {
          const spriteDefKeys = Object.keys(SPRITE_DEFINITIONS); if (spriteDefKeys.length === 0) { return; }
          const randomSpriteKey = spriteDefKeys[Math.floor(Math.random() * spriteDefKeys.length)];
          const spriteDef = SPRITE_DEFINITIONS[randomSpriteKey];
          if (!gameManager.availableSprites[spriteDef.id]) { gameManager.availableSprites[spriteDef.id] = new Sprite(spriteDef.id); } 
          else { const ownedSprite = gameManager.availableSprites[spriteDef.id]; ownedSprite.fragments += Math.floor(Math.random() * 5) + 1; ownedSprite.levelUp(); }
          return;
      }
      if (equipSpriteButtonConfig.active && uiManager.isMouseOver(equipSpriteButtonConfig.x, equipSpriteButtonConfig.y, equipSpriteButtonConfig.w, equipSpriteButtonConfig.h)) {
          const firstAvailableSpriteId = Object.keys(gameManager.availableSprites)[0];
          if (firstAvailableSpriteId) { const spriteToEquip = gameManager.availableSprites[firstAvailableSpriteId]; if (EQUIPMENT_TYPES.SPRITE1) { pet.equipSprite(spriteToEquip, EQUIPMENT_TYPES.SPRITE1); } }
          return;
      }
      if (viewFailedLogButtonConfig.active && uiManager.isMouseOver(viewFailedLogButtonConfig.x, viewFailedLogButtonConfig.y, viewFailedLogButtonConfig.w, viewFailedLogButtonConfig.h)) {
          if (gameManager.lastPveBattleLog && gameManager.lastPveBattleLog.length > 0) { uiManager.showingFailedLog = true; } 
          else { console.log("没有可查看的失败战斗记录。"); } return;
      }
      if (getVouchersButtonConfig.active && uiManager.isMouseOver(getVouchersButtonConfig.x, getVouchersButtonConfig.y, getVouchersButtonConfig.w, getVouchersButtonConfig.h)) {
          gameManager.blessingVouchers = (gameManager.blessingVouchers || 0) + 10; return;
      }
      // NEW: Go To Blessing Button Click
      if (goToBlessingButtonConfig.active && uiManager.isMouseOver(goToBlessingButtonConfig.x, goToBlessingButtonConfig.y, goToBlessingButtonConfig.w, goToBlessingButtonConfig.h)) {
          uiManager.showingBlessingScreen = true;
          gameManager.lastBlessingRewardDisplay = "欢迎来到祈福台！"; // Initial message
          gameManager.lastObtainedItemFromBlessing = null;
          console.log("前往祈福台。");
          return;
      }
    }
  }
}

function addTestEquipment() { /* ... unchanged ... */ }

function drawMainGameUI() {
  if (!gameManager.playerPet) return;
  let pet = gameManager.playerPet;
  fill(50); textSize(18); textAlign(LEFT, TOP); 
  let xPos = 50, yPos = 50, lineHeight = 28; 

  text(`${pet.emoji} ${pet.name} (ID: ${pet.id})`, xPos, yPos); yPos += lineHeight * 1.5;
  text(`祈福券: 🎫 ${gameManager.blessingVouchers || 0}`, xPos, yPos); yPos += lineHeight;
  text(`等级: ${pet.level}`, xPos, yPos); yPos += lineHeight;
  text(`经验: ${pet.experience} / ${pet.maxExperience}`, xPos, yPos); yPos += lineHeight * 0.8; 
  let expBarWidth = 200, expBarHeight = 20;
  let currentExpWidth = pet.level >= 100 ? expBarWidth : (pet.maxExperience > 0 ? (pet.experience / pet.maxExperience) * expBarWidth : 0) ;
  fill(150); rect(xPos, yPos, expBarWidth, expBarHeight, 3); 
  fill(120, 220, 120); rect(xPos, yPos, currentExpWidth, expBarHeight, 3); 
  noFill(); stroke(50); rect(xPos, yPos, expBarWidth, expBarHeight, 3); noStroke(); 
  yPos += expBarHeight + lineHeight * 0.8; 

  textSize(17); fill(40); text("--- 属性 ---", xPos, yPos); yPos += lineHeight;
  text(`❤️ 生命: ${pet.hp.toFixed(0)} / ${pet.maxHp.toFixed(0)}`, xPos, yPos); yPos += lineHeight; 
  text(`⚔️ 攻击: ${pet.attack.toFixed(1)}`, xPos, yPos); yPos += lineHeight;
  text(`🛡️ 防御: ${pet.defense.toFixed(1)}`, xPos, yPos); yPos += lineHeight;
  text(`👟 速度: ${pet.speed.toFixed(1)}`, xPos, yPos);
  let initialYPosForEquipAndSprite = yPos; 

  // Buttons
  uiManager.drawButton(gainExpButtonConfig);
  uiManager.drawButton(getNewWeaponButtonConfig); 
  uiManager.drawButton(getSpriteButtonConfig); 
  uiManager.drawButton(equipSpriteButtonConfig);
  uiManager.drawButton(viewFailedLogButtonConfig); 
  uiManager.drawButton(getVouchersButtonConfig); 
  uiManager.drawButton(goToBlessingButtonConfig); // Draw new button

  // PVE Button
  if (gameManager.allPveLevelsCleared) {
      pveButtonConfig.label = "已通关迷雾森林"; pveButtonConfig.active = false; 
  } else {
      const nextLevelExists = (typeof PVE_LEVELS !== 'undefined') ? PVE_LEVELS.find(level => level.levelNumber === gameManager.playerMaxPveLevel) : null;
      if (nextLevelExists) {
          pveButtonConfig.label = `挑战第 ${gameManager.playerMaxPveLevel} 关`; pveButtonConfig.active = true;
          pveButtonConfig.baseColor = color(120, 200, 120); pveButtonConfig.hoverColor = color(100, 180, 100); pveButtonConfig.textColor = color(0);
      } else {
          pveButtonConfig.label = "后续关卡暂未开放"; pveButtonConfig.active = false;
      }
  }
  if (gameManager.pveManager && gameManager.pveManager.isInBattle) {
      pveButtonConfig.label = "战斗中..."; pveButtonConfig.active = false;
  }
  if (!pveButtonConfig.active) {
      pveButtonConfig.baseColor = pveButtonConfig.inactiveColor; pveButtonConfig.textColor = color(100); 
  }
  uiManager.drawButton(pveButtonConfig);

  viewFailedLogButtonConfig.active = (gameManager.lastPveBattleLog && gameManager.lastPveBattleLog.length > 0);
  if (!viewFailedLogButtonConfig.active) {
      viewFailedLogButtonConfig.baseColor = viewFailedLogButtonConfig.inactiveColor || color(170,170,170); 
      viewFailedLogButtonConfig.textColor = color(100);
  } else {
      viewFailedLogButtonConfig.baseColor = color(200, 180, 100); 
      viewFailedLogButtonConfig.hoverColor = color(180, 160, 80);
      viewFailedLogButtonConfig.textColor = color(0);
  }
  
  yPos = initialYPosForEquipAndSprite; 
  const slotSize = 50, padding = 10, equipStartX = 50, slotsPerRow = 4;
  yPos += lineHeight * 1.5; 
  textSize(16); fill(40); text("--- 装备栏 ---", equipStartX, yPos);
  yPos += lineHeight * 1.2;
  let mouseIsOverAnEquipmentSlot = false;
  let equipSlotIndex = 0; 
  for (const typeValue of Object.values(EQUIPMENT_TYPES)) { 
    if (typeValue === EQUIPMENT_TYPES.SPRITE1 || typeValue === EQUIPMENT_TYPES.SPRITE2) continue;
    const equipment = pet.equipmentSlots[typeValue]; 
    const row = Math.floor(equipSlotIndex / slotsPerRow); const col = equipSlotIndex % slotsPerRow; equipSlotIndex++;
    const eqX = equipStartX + col * (slotSize + padding); const eqY = yPos + row * (slotSize + padding); 
    push(); fill(equipment ? color(equipment.quality.color) : color(200, 200, 200, 150)); 
    stroke(100); rect(eqX, eqY, slotSize, slotSize, 5); 
    if (equipment) {
      textAlign(CENTER, CENTER); textSize(24); text(equipment.icon, eqX + slotSize / 2, eqY + slotSize / 2 - 5); 
      textSize(12); let qc = color(equipment.quality.color); fill(red(qc) + green(qc) + blue(qc) > 382.5 ? 0 : 255);
      text(`Lv.${equipment.level}`, eqX + slotSize / 2, eqY + slotSize - 10); 
      let tooltipText = `名称: ${equipment.name}\n品质: ${equipment.quality.name}\n等级: Lv.${equipment.level}`;
      let statsText = ""; for(const stat in equipment.baseStats){ statsText += `\n  ${stat}: ${equipment.baseStats[stat]}`; }
      if(statsText) tooltipText += `\n属性:${statsText}`;
      if (equipment.specialEffects && equipment.specialEffects.length > 0) {
        tooltipText += "\n特效:"; equipment.specialEffects.forEach(effect => { tooltipText += `\n  - ${effect.description || effect.name}`; });
      }
      uiManager.updateTooltip(eqX, eqY, slotSize, slotSize, tooltipText, equipment); 
      if(uiManager.isMouseOver(eqX, eqY, slotSize, slotSize)) mouseIsOverAnEquipmentSlot = true;
    } else {
      textAlign(CENTER, CENTER); textSize(10); fill(80); text(typeValue, eqX + slotSize/2, eqY + slotSize/2); 
      if(uiManager.tooltip.targetElement === typeValue + '_empty_slot_ref') { uiManager.updateTooltip(eqX, eqY, slotSize, slotSize, "", null); }
    }
    pop();
  }
  let numEquipRows = Math.ceil(equipSlotIndex / slotsPerRow);
  yPos += numEquipRows * (slotSize + padding) + lineHeight * 0.5; 
  textSize(16); fill(40); text("--- 精灵栏 ---", equipStartX, yPos);
  yPos += lineHeight * 1.2;
  let mouseIsOverASpriteSlot = false;
  let spriteSlotDrawnIndex = 0; 
  for (const slotKey of [EQUIPMENT_TYPES.SPRITE1, EQUIPMENT_TYPES.SPRITE2]) { 
      if (!pet.spriteSlots.hasOwnProperty(slotKey)) continue; 
      const sprite = pet.spriteSlots[slotKey];
      const spriteSlotX = equipStartX + spriteSlotDrawnIndex * (slotSize + padding); const spriteSlotY = yPos; 
      push(); fill(sprite ? color(180, 220, 255) : color(200, 200, 200, 150)); 
      stroke(100); rect(spriteSlotX, spriteSlotY, slotSize, slotSize, 5);
      if (sprite) {
          textAlign(CENTER, CENTER); textSize(24); text(sprite.icon, spriteSlotX + slotSize / 2, spriteSlotY + slotSize / 2 - 5);
          textSize(12); fill(0); text(`Lv.${sprite.level}`, spriteSlotX + slotSize / 2, spriteSlotY + slotSize - 10);
          let fragmentsNeeded = sprite.getFragmentsNeededForNextLevel();
          let fragDisplay = (fragmentsNeeded === Infinity) ? "MAX" : `${sprite.fragments}/${fragmentsNeeded}`;
          let tooltipText = `名称: ${sprite.name} (Lv.${sprite.level}/${sprite.maxLevel})\n碎片: ${fragDisplay}`;
          tooltipText += `\n属性加成:`;
          for (const stat in sprite.attributeBonus) { tooltipText += `\n  ${stat.replace('_percent','%')}: +${sprite.attributeBonus[stat].toFixed(1)}%`; }
          if (sprite.skill) {
              tooltipText += `\n技能: ${sprite.skill.name} (Lv.${sprite.level})`;
              tooltipText += `\n  ${sprite.skill.description}`; 
          }
          uiManager.updateTooltip(spriteSlotX, spriteSlotY, slotSize, slotSize, tooltipText, sprite); 
          if(uiManager.isMouseOver(spriteSlotX, spriteSlotY, slotSize, slotSize)) mouseIsOverASpriteSlot = true;
      } else {
          textAlign(CENTER, CENTER); textSize(10); fill(80); text(slotKey, spriteSlotX + slotSize / 2, spriteSlotY + slotSize / 2); 
          if(uiManager.tooltip.targetElement === slotKey + '_empty_sprite_slot_ref') { uiManager.updateTooltip(spriteSlotX, spriteSlotY, slotSize, slotSize, "", null); }
      }
      pop(); spriteSlotDrawnIndex++;
  }
  if (!mouseIsOverAnEquipmentSlot && uiManager.tooltip.targetElement instanceof Equipment) {
      uiManager.tooltip.visible = false; uiManager.tooltip.timer = 0; uiManager.tooltip.targetElement = null;
  }
  if (!mouseIsOverASpriteSlot && uiManager.tooltip.targetElement instanceof Sprite) {
      uiManager.tooltip.visible = false; uiManager.tooltip.timer = 0; uiManager.tooltip.targetElement = null;
  }
  textAlign(LEFT, BASELINE); 
}

function drawPveBattleScreen() { /* ... unchanged ... */ }
function drawFailedBattleLogScreen() { /* ... unchanged ... */ }

// NEW: Blessing Screen UI
function drawBlessingScreen() {
    background(230, 220, 250); // Light purple background

    // Title
    fill(50);
    textSize(32);
    textAlign(CENTER, TOP);
    text("祈福台", width / 2, 50);

    // Voucher Count
    textSize(18);
    fill(80);
    text(`当前祈福券: 🎫 ${gameManager.blessingVouchers || 0}`, width / 2, 120);

    // "Perform Blessing" Button
    performBlessingButtonConfig.active = (gameManager.blessingVouchers > 0 && gameManager.playerPet !== null);
    uiManager.drawButton(performBlessingButtonConfig);

    // Display Last Reward
    if (gameManager.lastBlessingRewardDisplay) {
        textSize(16);
        fill(50, 50, 150); // Dark blue for reward text
        textAlign(CENTER, CENTER);
        // Wrap text if too long - simple split by \n for now, more complex wrapping could be added to uiManager
        const rewardLines = gameManager.lastBlessingRewardDisplay.split('\n');
        let rewardY = performBlessingButtonConfig.y + performBlessingButtonConfig.h + 40;
        for(let i=0; i < rewardLines.length; i++) {
            text(rewardLines[i], width / 2, rewardY + i * 20);
        }

        // If the last reward was an item, show its tooltip if hovered
        if (gameManager.lastObtainedItemFromBlessing) {
            const item = gameManager.lastObtainedItemFromBlessing;
            // For simplicity, just showing the text, not a visual representation here.
            // Tooltip could be attached to the text area if it were a button/element.
            // For now, the text is the main display.
        }
    }
    
    // "Back to Main" Button
    uiManager.drawButton(backFromBlessingButtonConfig);
    textAlign(LEFT, BASELINE); // Reset
}

// Helper to format blessing reward messages (can be expanded)
// This function is not explicitly in the prompt's sketch.js, but it's good practice.
// GameManager.performBlessing now directly sets gameManager.lastBlessingRewardDisplay.
// So, this helper might not be needed if GameManager handles formatting.
// For now, I'll assume GameManager's formatting is sufficient.
/*
function formatBlessingRewardMessage(reward) {
    if (!reward) return "祈福失败，请稍后再试。";
    switch (reward.type) {
        case "PET_EXPERIENCE":
            return `获得灵宠经验: +${reward.details.amount}!`;
        case "EQUIPMENT":
            if (reward.generatedItem) {
                return `获得装备: ${reward.generatedItem.icon} ${reward.generatedItem.name} (品质: ${reward.generatedItem.quality.name})`;
            }
            return "获得了一件装备（生成错误）";
        case "SPRITE_FRAGMENT":
            const spriteDefFrag = SPRITE_DEFINITIONS[reward.details.spriteId];
            return `获得 ${spriteDefFrag ? spriteDefFrag.name : '未知'} 碎片 x${reward.details.amount}!`;
        case "SPRITE_FULL":
            const spriteDefFull = SPRITE_DEFINITIONS[reward.details.spriteId];
            // Logic for whether it's new or converted to frags is in performBlessing.
            // Here, we'd need more info from performBlessing, or GameManager sets a more detailed message.
            // For now, using the message set by GameManager.performBlessing for simplicity.
            return gameManager.lastBlessingRewardDisplay; // Rely on GameManager to set a good message
        default:
            return `获得未知奖励: ${reward.type}`;
    }
}
*/
