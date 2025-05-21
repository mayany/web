// js/data.js

// 游戏常量和配置
const GameData = {
    lingChong: {
        initialStats: {
            hp: 20,
            attack: 5,
            defense: 3,
            speed: 1,
        },
        appearanceOptions: [ // 灵宠造型ID
            { id: '1132', name: '墨麒麟', icon: '🖤', description: '神秘的黑色麒麟，步伐稳健。' },
            { id: '1144', name: '赤羽雀', icon: '❤️‍🔥', description: '拥有火焰般羽毛的灵鸟，迅捷如风。' },
            { id: '1154', name: '苍雷豹', icon: '💙', description: '身披雷电的矫健猎手，攻击迅猛。' },
            { id: '1161', name: '碧水蛟', icon: '💚', description: '操控水流的蛟龙，守护一方。' },
            { id: '1168', name: '金甲龟', icon: '💛', description: '披着金色甲壳的玄龟，防御惊人。' }
        ],
        maxLevel: 100,
        // 每级属性成长值 (示例，需要仔细调整以保证平衡)
        statGrowthPerLevel: {
            hp: 5,        // 每级增加5点气血
            attack: 2,    // 每级增加2点攻击
            defense: 1,   // 每级增加1点防御
            speed: 0.2    // 每级增加0.2点速度 (可能需要处理小数或积累升级)
        },
        // 经验表 (示例，每级所需经验)
        // levelExpRequirements[level-1] 是升到下一级所需经验
        // 例如，从1级升到2级需要 experienceTable[0] 的经验
        experienceTable: [
            100, 200, 350, 500, 700, 900, 1200, 1500, 2000, 2500, // 1-10级
            // ... 后续等级经验可以按公式生成或手动配置
            // 简单公式示例: prevExp * 1.1 + baseIncrement
        ],
        expFromDecomposingEquipment: 10,
    },
    equipment: {
        types: {
            WEAPON: { id: 'WEAPON', name: '武器', icon: '⚔️' },
            ARMOR: { id: 'ARMOR', name: '衣服', icon: '👕' },
            GLOVES: { id: 'GLOVES', name: '护手', icon: '🧤' },
            BOOTS: { id: 'BOOTS', name: '鞋子', icon: '👟' },
            RING: { id: 'RING', name: '戒指', icon: '💍' },
            BELT: { id: 'BELT', name: '腰带', icon: '🎗️' },
            SPRITE_1: { id: 'SPRITE_1', name: '精灵1', icon: '🧚' }, // 精灵也视为一种特殊装备
            SPRITE_2: { id: 'SPRITE_2', name: '精灵2', icon: '🧚‍♀️' }
        },
        qualities: {
            WHITE:  { id: 'WHITE',  name: '凡品', color: '#FFFFFF', class: 'quality-white',  statMultiplier: 1.0, effectTier: 0 },
            GREEN:  { id: 'GREEN',  name: '匠制', color: '#00FF00', class: 'quality-green',  statMultiplier: 1.2, effectTier: 1 },
            BLUE:   { id: 'BLUE',   name: '精工', color: '#0000FF', class: 'quality-blue',   statMultiplier: 1.5, effectTier: 2 },
            PURPLE: { id: 'PURPLE', name: '名家', color: '#cb4aca', class: 'quality-purple', statMultiplier: 1.9, effectTier: 3 },
            ORANGE: { id: 'ORANGE', name: '御赐', color: '#FF7F00', class: 'quality-orange', statMultiplier: 2.4, effectTier: 4 },
            RED:    { id: 'RED',    name: '传说', color: '#ff0000', class: 'quality-red',    statMultiplier: 3.0, effectTier: 5 }
        },
        // 基础属性定义 (示例，具体数值区间待“分页3”或详细设计)
        // key是装备类型ID
        baseStatsConfig: {
            WEAPON: { attack: [5, 10] }, // 表示白色品质1级武器攻击力在5-10之间
            ARMOR:  { defense: [3, 7], hp: [10, 20] },
            GLOVES: { attack: [2, 4], defense: [1, 2] },
            BOOTS:  { speed: [0.5, 1], defense: [1,3]},
            RING:   { attack: [3,6], hp: [5,15]},
            BELT:   { defense: [2,5], hp: [15,30]},
            // 精灵的基础属性可能不同，更多是百分比或特殊技能
        },
        effects: [ // 特效库
            // tier 0: White, tier 1: Green, etc.
            { id: 'E_FROST',    name: '冰冻',    description: '攻击时{value}%概率冰冻对手，1回合无法行动', tiers: [0,1,2,3,4,5], valueRange: [5, 30], type: 'on_attack_target' },
            { id: 'E_COMBO',    name: '连击',    description: '攻击时{value}%概率再次攻击', tiers: [0,1,2,3,4,5], valueRange: [5, 25], type: 'on_attack_self' },
            { id: 'E_COUNTER',  name: '反击',    description: '被攻击时{value}%概率反击', tiers: [0,1,2,3,4,5], valueRange: [5, 30], type: 'on_defense_self' },
            { id: 'E_CRIT',     name: '暴击',    description: '攻击时{value}%概率增加{extraValue}%伤害', tiers: [1,2,3,4,5], valueRange: [5, 20], extraValueRange: [20, 100], type: 'on_attack_self' },
            { id: 'E_DODGE',    name: '闪避',    description: '被攻击时{value}%概率完全不受伤害', tiers: [1,2,3,4,5], valueRange: [3, 15], type: 'on_defense_self' },
            { id: 'E_LIFESTEAL',name: '吸血',    description: '根据伤害的{value}%回复生命', tiers: [2,3,4,5], valueRange: [5, 25], type: 'on_attack_self' },
            { id: 'E_RES_FROST',name: '抗冰冻',  description: '{value}%概率免疫冰冻', tiers: [2,3,4,5], valueRange: [10, 50], type: 'on_defense_self_passive' },
            { id: 'E_RES_CRIT', name: '抗暴击',  description: '{value}%概率免疫暴击 (降低对方暴击率)', tiers: [3,4,5], valueRange: [10, 50], type: 'on_defense_self_passive' },
            // ... 更多特效
        ],
        // 品质对应的特效层级限制
        // qualityEffectTiers[quality.effectTier] = [allowed_effect_tier_indices]
        qualityEffectTiers: [
            [0],        // White: only tier 0 effects
            [0, 1],     // Green: tier 0 or 1 effects
            [1, 2],     // Blue: tier 1 or 2 effects
            [2, 3],     // Purple: tier 2 or 3 effects
            [3, 4],     // Orange: tier 3 or 4 effects
            [4, 5]      // Red: tier 4 or 5 effects
        ],
        // 装备名称库 (用于随机生成)
        // 可以根据大唐时期风格来命名
        nameTemplates: {
            WEAPON: ["破阵枪", "龙泉剑", "鸣鸿刀", "玄铁锏", "游龙弓"],
            ARMOR:  ["明光铠", "锁子甲", "山文铠", "步人甲", "锦斓袈裟"],
            GLOVES: ["鎏金腕", "玄铁手", "虎咆拳套", "龙鳞护手"],
            BOOTS:  ["踏云靴", "追风履", "神行靴", "步云鞋"],
            RING:   ["白玉戒", "玛瑙指环", "紫金戒", "龙纹戒"],
            BELT:   ["瑞兽纹带", "金丝腰带", "盘龙革带", "玲珑玉带"]
        }
    },
    sprites: { // 精灵系统
        maxLevel: 50,
        // 碎片合成数量
        fragmentsToSynthesize: 50,
        // 示例精灵数据
        spriteData: {
            S001: {
                id: 'S001', name: '青鸾使者', icon: '🐦', quality: 'PURPLE',
                description: '传说中的青鸟，能带来祥瑞与指引。',
                baseAttrPercent: { hp: 0.05, attack: 0.03 }, // 提升灵宠5%气血, 3%攻击
                activeSkill: { name: '风之祈愿', description: '为灵宠恢复少量生命值。', cooldown: 3 }, // 回合
                passiveSkill: { name: '轻盈', description: '回合开始时，15%概率提升灵宠速度。', trigger: 'round_start' },
                fragmentsForLevelUp: [10, 20, 30, 40, 50] // 每级所需碎片
            },
            S002: {
                id: 'S002', name: '火鼠精魄', icon: '🔥', quality: 'ORANGE',
                description: '蕴含火焰力量的精魄，极具爆发力。',
                baseAttrPercent: { attack: 0.08, speed: 0.02 },
                activeSkill: { name: '烈焰冲击', description: '对敌方造成一次火焰伤害。', cooldown: 2 },
                passiveSkill: { name: '燃魂', description: '攻击时，10%概率附加灼烧效果。', trigger: 'on_attack' },
                fragmentsForLevelUp: [15, 25, 35, 45, 60]
            }
        }
    },
    pve: {
        mistForest: {
            maxRounds: 30, // 最大回合数
            autoAdvanceDelay: 3000, // ms, 通关后自动进入下一关的延迟
            // 关卡怪物配置 (示例)
            // level: { name, icon, hp, attack, defense, speed, rewards: {exp, points, qifuVoucher} }
            levels: [
                { name: '迷雾小妖', icon: '👻', hp: 50, attack: 8, defense: 2, speed: 2, rewards: { exp: 20, points: 5, qifuVoucher: 0 } },
                { name: '林中精怪', icon: '🌲', hp: 80, attack: 10, defense: 4, speed: 3, rewards: { exp: 30, points: 8, qifuVoucher: 1 } },
                { name: '石肤蛮兵', icon: '🗿', hp: 120, attack: 12, defense: 8, speed: 1, rewards: { exp: 50, points: 12, qifuVoucher: 1 } },
                // ... 更多关卡
            ]
        }
    },
    ui: {
        // 品质颜色可以直接从 equipment.qualities 获取
        // 这里可以放一些UI特定的配置，比如动画速度等
        messageBoxDisplayTime: 4000, // ms
    }
};

// 初始化经验表 (如果需要更复杂的生成逻辑)
function initializeExperienceTable() {
    if (GameData.lingChong.experienceTable.length < GameData.lingChong.maxLevel -1) {
        let currentExp = GameData.lingChong.experienceTable[GameData.lingChong.experienceTable.length - 1] || 100;
        for (let i = GameData.lingChong.experienceTable.length; i < GameData.lingChong.maxLevel - 1; i++) {
            currentExp = Math.floor(currentExp * 1.15 + 50 * (i + 1)); // 示例公式
            GameData.lingChong.experienceTable.push(currentExp);
        }
    }
}
initializeExperienceTable(); // 确保经验表被填充

// 根据灵宠等级获取升级所需总经验
function getExpForLevel(level) {
    if (level <= 0 || level > GameData.lingChong.maxLevel) return Infinity;
    if (level === GameData.lingChong.maxLevel) return Infinity; // 满级
    return GameData.lingChong.experienceTable[level - 1] || Infinity;
}

console.log("GameData loaded and initialized.");
