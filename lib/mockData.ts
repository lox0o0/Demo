export const NRL_TEAMS = [
  { id: 1, name: "Broncos", emoji: "🐴" },
  { id: 2, name: "Rabbitohs", emoji: "🐰" },
  { id: 3, name: "Roosters", emoji: "🐓" },
  { id: 4, name: "Storm", emoji: "⚡" },
  { id: 5, name: "Panthers", emoji: "🐆" },
  { id: 6, name: "Eels", emoji: "🐟" },
  { id: 7, name: "Sharks", emoji: "🦈" },
  { id: 8, name: "Sea Eagles", emoji: "🦅" },
  { id: 9, name: "Warriors", emoji: "⚔️" },
  { id: 10, name: "Cowboys", emoji: "🐄" },
  { id: 11, name: "Titans", emoji: "👑" },
  { id: 12, name: "Dragons", emoji: "🐉" },
  { id: 13, name: "Knights", emoji: "⚔️" },
  { id: 14, name: "Raiders", emoji: "🟢" },
  { id: 15, name: "Tigers", emoji: "🐅" },
  { id: 16, name: "Bulldogs", emoji: "🐕" },
  { id: 17, name: "Dolphins", emoji: "🐬" },
];

export const TIERS = [
  { name: "Rookie", minPoints: 0, color: "gray", reward: "Welcome badge" },
  { name: "Bronze", minPoints: 250, color: "#CD7F32", reward: "Exclusive content" },
  { name: "Silver", minPoints: 500, color: "#C0C0C0", reward: "Early ticket access" },
  { name: "Gold", minPoints: 1000, color: "#FFD700", reward: "2 tickets to local game" },
  { name: "Legend", minPoints: 2500, color: "#FFB800", reward: "VIP experiences" },
];

export const DAILY_QUESTS = [
  { id: 1, title: "Check in today", points: 5, completed: false },
  { id: 2, title: "Read an article", points: 10, completed: false },
  { id: 3, title: "Watch a highlight", points: 15, completed: false },
];

export const WEEKLY_QUESTS = [
  { id: 4, title: "Complete your tips", points: 50, completed: false, progress: 0 },
  { id: 5, title: "Set your Fantasy team", points: 50, completed: false, progress: 0 },
];

export const MOCK_MATES = [
  { name: "Dave", activity: "just completed tipping (7/8)", time: "2h ago" },
  { name: "Sarah", activity: "hit a 15-week streak 🔥", time: "5h ago" },
  { name: "Mike", activity: "reached Gold tier!", time: "1d ago" },
];
