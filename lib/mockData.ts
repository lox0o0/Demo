export interface Team {
  id: number;
  name: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  fanCount: number;
  welcomeMessage: string;
  chant: string;
}

export const NRL_TEAMS: Team[] = [
  { id: 1, name: "Broncos", emoji: "🐴", primaryColor: "#8B1538", secondaryColor: "#FFD700", fanCount: 847291, welcomeMessage: "Welcome to the herd", chant: "Go the Broncos!" },
  { id: 2, name: "Rabbitohs", emoji: "🐰", primaryColor: "#006633", secondaryColor: "#FF0000", fanCount: 523847, welcomeMessage: "Welcome to the burrow", chant: "Glory, glory!" },
  { id: 3, name: "Roosters", emoji: "🐓", primaryColor: "#000080", secondaryColor: "#FF0000", fanCount: 412583, welcomeMessage: "Welcome to the roost", chant: "Up the Roosters!" },
  { id: 4, name: "Storm", emoji: "⚡", primaryColor: "#1E3A8A", secondaryColor: "#FFD700", fanCount: 389472, welcomeMessage: "Welcome to the storm", chant: "Storm is coming!" },
  { id: 5, name: "Panthers", emoji: "🐆", primaryColor: "#000000", secondaryColor: "#FF6B00", fanCount: 456291, welcomeMessage: "Welcome to the den", chant: "Panther power!" },
  { id: 6, name: "Eels", emoji: "🐟", primaryColor: "#0066CC", secondaryColor: "#FFD700", fanCount: 398472, welcomeMessage: "Welcome to Parramatta", chant: "Up the Eels!" },
  { id: 7, name: "Sharks", emoji: "🦈", primaryColor: "#0066CC", secondaryColor: "#FFFFFF", fanCount: 312847, welcomeMessage: "Welcome to the tank", chant: "Up, up Cronulla!" },
  { id: 8, name: "Sea Eagles", emoji: "🦅", primaryColor: "#800080", secondaryColor: "#FFD700", fanCount: 287391, welcomeMessage: "Welcome to the nest", chant: "Eagles fly high!" },
  { id: 9, name: "Warriors", emoji: "⚔️", primaryColor: "#000000", secondaryColor: "#FFD700", fanCount: 523847, welcomeMessage: "Welcome to the warriors", chant: "Warriors!" },
  { id: 10, name: "Cowboys", emoji: "🐄", primaryColor: "#0066CC", secondaryColor: "#FFD700", fanCount: 298472, welcomeMessage: "Welcome to Townsville", chant: "Cowboys!" },
  { id: 11, name: "Titans", emoji: "👑", primaryColor: "#0066CC", secondaryColor: "#FFD700", fanCount: 234791, welcomeMessage: "Welcome to the Titans", chant: "Titans!" },
  { id: 12, name: "Dragons", emoji: "🐉", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", fanCount: 412583, welcomeMessage: "Welcome to the dragons", chant: "Dragons!" },
  { id: 13, name: "Knights", emoji: "⚔️", primaryColor: "#000080", secondaryColor: "#FFD700", fanCount: 287391, welcomeMessage: "Welcome to Newcastle", chant: "Knights!" },
  { id: 14, name: "Raiders", emoji: "🟢", primaryColor: "#006633", secondaryColor: "#FFD700", fanCount: 198472, welcomeMessage: "Welcome to Canberra", chant: "Raiders!" },
  { id: 15, name: "Tigers", emoji: "🐅", primaryColor: "#FF6B00", secondaryColor: "#000000", fanCount: 412583, welcomeMessage: "Welcome to the Tigers", chant: "Tigers!" },
  { id: 16, name: "Bulldogs", emoji: "🐕", primaryColor: "#0066CC", secondaryColor: "#FFFFFF", fanCount: 398472, welcomeMessage: "Welcome to the kennel", chant: "Bulldogs!" },
  { id: 17, name: "Dolphins", emoji: "🐬", primaryColor: "#FF6B00", secondaryColor: "#0066CC", fanCount: 234791, welcomeMessage: "Welcome to the Dolphins", chant: "Dolphins!" },
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
