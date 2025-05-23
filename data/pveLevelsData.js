// data/pveLevelsData.js

const PVE_LEVELS = [
  {
    levelNumber: 1,
    levelName: "迷雾初现",
    monsterData: { 
      id: "m001", 
      name: "迷雾小妖", 
      level: 1, 
      maxHp: 30, 
      attack: 4, 
      defense: 2, 
      speed: 1, 
      experienceReward: 10, 
      icon: '👻',
      skills: ["MSK001_STRONG_BLOW"],
      voucherReward: 1 // Added voucher reward
    }
  },
  {
    levelNumber: 2,
    levelName: "林间狼影",
    monsterData: { 
      id: "m002", 
      name: "恶狼", 
      level: 2, 
      maxHp: 50, 
      attack: 6, 
      defense: 3, 
      speed: 2, 
      experienceReward: 15, 
      icon: '🐺',
      skills: [],
      voucherReward: 1 // Added voucher reward
    }
  },
  {
    levelNumber: 3,
    levelName: "石巨人首领",
    monsterData: { 
      id: "m003", 
      name: "石巨人首领", 
      level: 3, 
      maxHp: 80, 
      attack: 5, 
      defense: 5, 
      speed: 1, 
      experienceReward: 20, 
      icon: '🗿',
      skills: ["MSK001_STRONG_BLOW", "MSK002_QUICK_HEAL"],
      voucherReward: 2 // Boss gives more
    }
  },
  {
    levelNumber: 4,
    levelName: "洞穴巫师蝠",
    monsterData: { 
      id: "m004", 
      name: "洞穴巫师蝠", 
      level: 4, 
      maxHp: 60, 
      attack: 7, 
      defense: 2, 
      speed: 3, 
      experienceReward: 25, 
      icon: '🦇',
      skills: ["MSK003_WEAKENING_CURSE"],
      voucherReward: 1 // Added voucher reward
    }
  },
  {
    levelNumber: 5,
    levelName: "山岭暴怒熊",
    monsterData: { 
      id: "m005", 
      name: "山岭暴怒熊", 
      level: 5, 
      maxHp: 120, 
      attack: 8, 
      defense: 6, 
      speed: 2, 
      experienceReward: 35, 
      icon: '🐻',
      skills: ["MSK001_STRONG_BLOW", "MSK002_QUICK_HEAL"],
      voucherReward: 3 // Boss gives more
    }
  }
];

// If not using modules
// window.PVE_LEVELS = PVE_LEVELS;
