// Streak System Data and Utilities

export type FlameLevel = 'none' | 'lit' | 'burning' | 'blazing' | 'inferno';

export interface StreakData {
  fanStreak: {
    currentWeeks: number;
    longestWeeks: number;
    status: 'active' | 'at_risk' | 'broken';
  };
  currentWeek: {
    fuel: number;
    flameLevel: FlameLevel;
    target: number; // 100 for streak maintenance
  };
  spins: {
    available: number;
    usedThisWeek: number;
    baseSpins: number;
    bonusSpins: number;
  };
  shields: {
    available: number;
    maxCapacity: 3;
  };
  benefits: {
    pointsMultiplier: number;
    weeklyBonus: number;
    accessLevel: 'none' | 'basic' | 'early_access' | 'exclusive' | 'vip';
  };
  nextMilestone?: {
    weeks: number;
    name: string;
    reward: string;
    weeksRemaining: number;
  };
}

// Calculate flame level from fuel
export const getFlameLevel = (fuel: number): FlameLevel => {
  if (fuel >= 300) return 'inferno';
  if (fuel >= 200) return 'blazing';
  if (fuel >= 150) return 'burning';
  if (fuel >= 100) return 'lit';
  return 'none';
};

// Get flame emoji based on level
export const getFlameEmoji = (level: FlameLevel): string => {
  switch (level) {
    case 'inferno': return '🔥🔥🔥🔥';
    case 'blazing': return '🔥🔥🔥';
    case 'burning': return '🔥🔥';
    case 'lit': return '🔥';
    default: return '';
  }
};

// Get flame level name
export const getFlameLevelName = (level: FlameLevel): string => {
  switch (level) {
    case 'inferno': return 'Inferno';
    case 'blazing': return 'Blazing';
    case 'burning': return 'Burning';
    case 'lit': return 'Lit';
    default: return 'No Flame';
  }
};

// Calculate base spins from streak length
export const getBaseSpins = (streakWeeks: number): number => {
  if (streakWeeks === 0) return 0;
  if (streakWeeks >= 52) return 5;
  if (streakWeeks >= 26) return 4;
  if (streakWeeks >= 11) return 3;
  if (streakWeeks >= 5) return 2;
  return 1;
};

// Calculate bonus spins from flame level
export const getBonusSpins = (level: FlameLevel): number => {
  switch (level) {
    case 'inferno': return 3;
    case 'blazing': return 2;
    case 'burning': return 1;
    default: return 0;
  }
};

// Calculate weekly bonus points
export const getWeeklyBonus = (streakWeeks: number): number => {
  if (streakWeeks >= 52) return 150;
  if (streakWeeks >= 26) return 100;
  if (streakWeeks >= 11) return 75;
  if (streakWeeks >= 5) return 50;
  if (streakWeeks >= 1) return 25;
  return 0;
};

// Calculate points multiplier
export const getPointsMultiplier = (streakWeeks: number): number => {
  if (streakWeeks >= 52) return 1.20;
  if (streakWeeks >= 26) return 1.15;
  if (streakWeeks >= 11) return 1.10;
  if (streakWeeks >= 1) return 1.05;
  return 1.0;
};

// Get access level
export const getAccessLevel = (streakWeeks: number): StreakData['benefits']['accessLevel'] => {
  if (streakWeeks >= 52) return 'vip';
  if (streakWeeks >= 25) return 'exclusive';
  if (streakWeeks >= 10) return 'early_access';
  if (streakWeeks >= 4) return 'basic';
  if (streakWeeks >= 1) return 'basic';
  return 'none';
};

// Get next milestone
export const getNextMilestone = (streakWeeks: number) => {
  if (streakWeeks < 4) {
    return { weeks: 4, name: 'Month One', reward: '100 pts + Badge', weeksRemaining: 4 - streakWeeks };
  }
  if (streakWeeks < 10) {
    return { weeks: 10, name: 'Dedicated', reward: '250 pts + Shield + Badge', weeksRemaining: 10 - streakWeeks };
  }
  if (streakWeeks < 25) {
    return { weeks: 25, name: 'Committed', reward: '500 pts + Shield + Badge + Profile Frame', weeksRemaining: 25 - streakWeeks };
  }
  if (streakWeeks < 52) {
    return { weeks: 52, name: 'Year One Legend', reward: '1,000 pts + 2 Shields + Badge + Guaranteed Epic+ spin', weeksRemaining: 52 - streakWeeks };
  }
  if (streakWeeks < 104) {
    return { weeks: 104, name: 'Two Year Titan', reward: '2,500 pts + 3 Shields + Badge + Guaranteed Legendary spin', weeksRemaining: 104 - streakWeeks };
  }
  return undefined;
};

// Mock streak data generator
export const generateMockStreakData = (user: any): StreakData => {
  // Use streakWeeks if available, otherwise convert day streak to weeks (divide by 7), or default to 23 for demo
  const streakWeeks = user?.streakWeeks || (user?.streak ? Math.floor(user.streak / 7) : 23);
  const currentFuel = user?.currentFuel || 215;
  const flameLevel = getFlameLevel(currentFuel);
  const baseSpins = getBaseSpins(streakWeeks);
  const bonusSpins = getBonusSpins(flameLevel);
  
  return {
    fanStreak: {
      currentWeeks: streakWeeks,
      longestWeeks: user?.longestStreakWeeks || user?.longestStreak || streakWeeks,
      status: currentFuel >= 100 ? 'active' : currentFuel >= 50 ? 'at_risk' : 'broken',
    },
    currentWeek: {
      fuel: currentFuel,
      flameLevel,
      target: 100,
    },
    spins: {
      available: Math.max(0, baseSpins + bonusSpins - (user?.spinsUsed || 0)),
      usedThisWeek: user?.spinsUsed || 0,
      baseSpins,
      bonusSpins,
    },
    shields: {
      available: user?.shields || 2,
      maxCapacity: 3,
    },
    benefits: {
      pointsMultiplier: getPointsMultiplier(streakWeeks),
      weeklyBonus: getWeeklyBonus(streakWeeks),
      accessLevel: getAccessLevel(streakWeeks),
    },
    nextMilestone: getNextMilestone(streakWeeks),
  };
};
