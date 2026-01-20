"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import Navigation, { NavSection } from "./Navigation";
import { generateMockStreakData, getFlameLevelName, type StreakData } from "@/lib/streakData";
import { 
  List, Shirt, Trophy, Clock, Star, Flame, Ticket, Gift, Coins, 
  CircleDot, Lock, Check, Circle, HelpCircle, User, Sparkles, 
  TrendingUp, Calendar, Award, Crown
} from "lucide-react";

interface DashboardProps {
  user: any;
  hideNavigation?: boolean;
  onNavigate?: (section: NavSection) => void;
}

// Calculate tier based on points and profile completion
const calculateTier = (points: number, profileCompletion: number) => {
  // Calculate tier based on points first
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return points >= t.minPoints && (!nextTier || points < nextTier.minPoints);
  }) || TIERS[0];
  
  // If profile completion is 90% or higher (team + auth + all 4 socials), ensure at least Bronze tier
  // Note: Maximum completion from onboarding is 90% (20% team + 30% auth + 40% from 4 socials)
  // Additional profile fields (DOB, gender, home ground) can add up to 10% more to reach 100%
  // This guarantees Bronze tier as a minimum, but allows progression to higher tiers if points warrant it
  if (profileCompletion >= 90) {
    const bronzeTier = TIERS.find(t => t.name === "Bronze") || TIERS[1];
    // If the calculated tier is below Bronze, return Bronze. Otherwise, return the calculated tier.
    return currentTier.minPoints < bronzeTier.minPoints ? bronzeTier : currentTier;
  }
  
  return currentTier;
};

export default function DashboardNew({ user, hideNavigation = false, onNavigate }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  
  // Get user data
  const profileCompletion = user?.profileCompletion || 0;
  // Use actual user points (not boosted) for display in the tier card
  const actualUserPoints = user?.points || 0;
  // Calculate tier based on actual points (not boosted) - this shows the user's real current tier
  const currentTier = calculateTier(actualUserPoints, profileCompletion);
  const nextTier = TIERS.find(t => t.minPoints > currentTier.minPoints) || TIERS[TIERS.length - 1];
  const pointsToNext = Math.max(0, nextTier.minPoints - actualUserPoints);
  const progressPercent = nextTier.minPoints > currentTier.minPoints
    ? Math.min(((actualUserPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)
    : 100;
  
  // For other calculations that need boosted points (like minimum Bronze for 90% completion)
  // Use boosted points only where needed, but display actual points in the card
  const userPoints = profileCompletion >= 90 
    ? Math.max(actualUserPoints, 250) 
    : actualUserPoints;

  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const firstName = user?.name?.split(' ')[0] || "Fan";
  
  // Generate streak data
  const streakData = generateMockStreakData(user);

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Navigation at top */}
      {!hideNavigation && (
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      )}

      {/* Main Content - 3 Column Layout */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${hideNavigation ? 'pt-6' : 'pt-24'}`}>
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            {/* Streak Celebration Hero Zone */}
            <StreakHeroZone streakData={streakData} user={user} />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activities, Profile Completion, Connect Socials */}
            <div className="space-y-6">
              <WeeklyActivitiesSimplified user={user} teamData={teamData} />
              
              <ProfileCompletionSimplified user={user} profileCompletion={profileCompletion} />
              
              <ConnectSocialsCard user={user} />
            </div>

            {/* Middle Column - Your Season */}
            <div className="space-y-6">
              <YourSeasonCard
                tier={currentTier}
                points={actualUserPoints}
                progressPercent={progressPercent}
                pointsToNext={pointsToNext}
                nextTier={nextTier}
                teamData={teamData}
                user={user}
              />
            </div>

            {/* Right Column - Prize Wheel, Leaderboards */}
            <div className="space-y-6">
              <PrizeWheelCard streakData={streakData} teamData={teamData} />
              
              <LeaderboardsCard user={user} teamData={teamData} userPoints={userPoints} />
            </div>
            </div>
          </div>
        )}

        {/* Other sections */}
        {activeSection !== "dashboard" && (
          <div className="text-center py-20">
            <p className="text-nrl-text-secondary">Coming soon: {activeSection}</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Streak Celebration Hero Zone
function StreakHeroZone({ streakData, user }: { streakData: StreakData; user: any }) {
  const streakWeeks = streakData.fanStreak.currentWeeks;
  const flameLevel = streakData.currentWeek.flameLevel;
  
  // Calculate percentile messaging
  const getPercentileMessage = (weeks: number): string => {
    if (weeks >= 52) return "You're in the top 1% of dedicated fans";
    if (weeks >= 26) return "You're in the top 3% of dedicated fans";
    if (weeks >= 11) return "You're in the top 8% of dedicated fans";
    if (weeks >= 5) return "You're in the top 15% of dedicated fans";
    return "Keep it up! Your consistency is building";
  };

  // Calculate next milestone
  const nextMilestone = streakData.nextMilestone;
  const milestoneProgress = nextMilestone 
    ? Math.max(0, Math.min(100, ((streakWeeks / nextMilestone.weeks) * 100)))
    : 100;

  // Get flame icon size based on level
  const getFlameIconSize = () => {
    if (flameLevel === 'inferno') return 48;
    if (flameLevel === 'blazing') return 40;
    if (flameLevel === 'burning') return 32;
    if (flameLevel === 'lit') return 24;
    return 20;
  };

  return (
    <div className="relative bg-gradient-to-r from-[#1a1a1d] via-[#2a1a1d] to-[#1a1a1d] rounded-2xl p-4 md:p-6 border border-[#f59e0b]/20 overflow-hidden" style={{ maxHeight: '25vh', minHeight: '20vh' }}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative flex items-center justify-between gap-4 md:gap-6">
        {/* Left: Streak Number with inline milestone */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="animate-pulse">
            <Flame size={getFlameIconSize()} className="text-[#f59e0b]" strokeWidth={2} />
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold text-white leading-none">
              {streakWeeks}
            </div>
            <div className="text-sm md:text-base text-[#a1a1aa] font-semibold">
              week streak
            </div>
          </div>
        </div>

        {/* Center: Contextual praise */}
        <div className="flex-1 text-center">
          <div className="text-xs md:text-sm text-[#f59e0b] font-semibold">
            {getPercentileMessage(streakWeeks)}
          </div>
        </div>

        {/* Right: Next Milestone - Inline */}
        {nextMilestone && (
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-[#a1a1aa] mb-1">Next: {nextMilestone.weeks} weeks</div>
            <div className="text-xs font-semibold text-white">{nextMilestone.name}</div>
            <div className="text-[10px] text-[#a1a1aa] mt-1">{nextMilestone.weeksRemaining} weeks to go</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Status Card Component with Streak
function StatusCard({ tier, points, progressPercent, pointsToNext, nextTier, streak, profileCompletion, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      {/* Tier Badge Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: tier.color }}
          >
            <Star size={20} className="text-white/70" fill="currentColor" strokeWidth={2} />
          </div>
          <span 
            className="text-sm font-bold uppercase"
            style={{ color: tier.color }}
          >
            {tier.name}
          </span>
        </div>
        
        {/* Streak in profile card */}
        {streak > 0 && (
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-nrl-amber" strokeWidth={2} />
            <span className="text-sm font-bold text-nrl-amber">{streak}</span>
          </div>
        )}
      </div>

      {/* Points Display */}
      <div className="mb-4">
        <div className="text-5xl font-bold text-white mb-1">
          {points.toLocaleString()}
        </div>
        <div className="text-sm text-nrl-text-secondary">points</div>
      </div>

      {/* Profile Completion */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-nrl-text-secondary">Profile Completion</span>
          <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-nrl-dark-hover rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nrl-green to-nrl-amber"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: tier.color
            }}
          />
        </div>
        <div className="text-sm text-nrl-text-secondary">
          {pointsToNext} pts to {nextTier.name}
        </div>
      </div>

      {/* Benefit Preview */}
      <div className="flex items-center gap-2 text-xs text-nrl-text-muted">
        <Lock size={16} className="text-white/60" strokeWidth={2} />
        <span>{nextTier.name} unlocks: {nextTier.access || nextTier.reward}</span>
      </div>
    </div>
  );
}

// Streak Card Component
function StreakCard({ streakData, teamData }: { streakData: StreakData; teamData: any }) {
  const [showWheel, setShowWheel] = useState(false);
  const flameLevel = streakData.currentWeek.flameLevel;
  const flameName = getFlameLevelName(streakData.currentWeek.flameLevel);
  const fuelPercent = Math.min((streakData.currentWeek.fuel / 300) * 100, 100); // Cap at 300 for Inferno
  const fuelToNext = streakData.currentWeek.flameLevel === 'inferno' 
    ? 0 
    : streakData.currentWeek.flameLevel === 'blazing'
    ? 300 - streakData.currentWeek.fuel
    : streakData.currentWeek.flameLevel === 'burning'
    ? 200 - streakData.currentWeek.fuel
    : streakData.currentWeek.flameLevel === 'lit'
    ? 150 - streakData.currentWeek.fuel
    : 100 - streakData.currentWeek.fuel;

  const getFlameSize = () => {
    if (flameLevel === 'inferno') return 32;
    if (flameLevel === 'blazing') return 28;
    if (flameLevel === 'burning') return 24;
    if (flameLevel === 'lit') return 20;
    return 16;
  };

  return (
    <>
      <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
        {/* Flame and Streak Count */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <Flame size={getFlameSize()} className="text-[#f59e0b]" strokeWidth={2} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {streakData.fanStreak.currentWeeks}
          </div>
          <div className="text-sm text-nrl-text-secondary mb-2">week streak</div>
          <div className="text-xs text-nrl-amber font-semibold">
            {flameName} ({streakData.currentWeek.fuel} Fuel this week)
          </div>
        </div>

        {/* Fuel Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-nrl-text-secondary">Weekly Fuel</span>
            <span className="text-xs font-bold text-nrl-green">
              {streakData.currentWeek.fuel} / {streakData.currentWeek.target}
            </span>
          </div>
          <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-1">
            <div
              className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: `${fuelPercent}%` }}
            />
          </div>
          {fuelToNext > 0 && streakData.currentWeek.flameLevel !== 'inferno' && (
            <div className="text-xs text-nrl-text-muted">
              {fuelToNext} to {streakData.currentWeek.flameLevel === 'lit' ? 'Burning' : streakData.currentWeek.flameLevel === 'burning' ? 'Blazing' : 'Inferno'}
            </div>
          )}
        </div>

        {/* Streak Benefits */}
        <div className="bg-nrl-dark-hover rounded-xl p-4 mb-4 border border-nrl-border-light">
          <div className="text-xs font-bold uppercase text-nrl-text-secondary mb-3 tracking-wider">
            Streak Benefits
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex items-center gap-1 text-nrl-text-muted mb-1">
                <Coins size={14} className="text-white/60" strokeWidth={2} />
                <span>Points Multiplier</span>
              </div>
              <div className="font-bold text-white">{streakData.benefits.pointsMultiplier}x</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-nrl-text-muted mb-1">
                <Gift size={14} className="text-white/60" strokeWidth={2} />
                <span>Weekly Bonus</span>
              </div>
              <div className="font-bold text-white">+{streakData.benefits.weeklyBonus} pts</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-nrl-text-muted mb-1">
                <CircleDot size={14} className="text-white/60" strokeWidth={2} />
                <span>Spins Available</span>
              </div>
              <div className="font-bold text-white">{streakData.spins.available}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-nrl-text-muted mb-1">
                <Award size={14} className="text-white/60" strokeWidth={2} />
                <span>Shields</span>
              </div>
              <div className="font-bold text-white">{streakData.shields.available}/{streakData.shields.maxCapacity}</div>
            </div>
          </div>
        </div>

        {/* Spin Wheel Button */}
        {streakData.spins.available > 0 && (
          <button
            onClick={() => setShowWheel(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02] mb-3"
          >
            <span className="flex items-center gap-2 justify-center">
              <CircleDot size={18} className="text-white" strokeWidth={2} />
              SPIN THE WHEEL ({streakData.spins.available} left)
            </span>
          </button>
        )}

        {/* Next Milestone */}
        {streakData.nextMilestone && (
          <div className="text-center">
            <div className="text-xs text-nrl-text-muted mb-1">
              Next milestone: {streakData.nextMilestone.weeks} weeks ({streakData.nextMilestone.weeksRemaining} to go)
            </div>
            <div className="text-xs text-nrl-text-secondary">
              {streakData.nextMilestone.name} — {streakData.nextMilestone.reward}
            </div>
          </div>
        )}
      </div>

      {/* Prize Wheel Modal */}
      {showWheel && (
        <PrizeWheel 
          streakData={streakData}
          teamData={teamData}
          onClose={() => setShowWheel(false)}
        />
      )}
    </>
  );
}

// Prize Wheel Component
function PrizeWheel({ streakData, teamData, onClose }: { streakData: StreakData; teamData: any; onClose: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<any>(null);
  const [spinsRemaining, setSpinsRemaining] = useState(streakData.spins.available);
  const [rotation, setRotation] = useState(0);

  // 20 prizes with alternating color scheme: purple, orange, green, blue, gray
  const colorScheme = ['#8B5CF6', '#F97316', '#10B981', '#3B82F6', '#6B7280']; // purple, orange, green, blue, gray
  
  const prizes = [
    { id: 1, name: '25 Points', tier: 'common', icon: '🪙', shortName: '25 PTS' },
    { id: 2, name: '$10 Telstra', tier: 'uncommon', icon: '📱', shortName: '$10 TELSTRA', sponsor: 'Telstra' },
    { id: 3, name: '50 Points', tier: 'common', icon: '🪙', shortName: '50 PTS' },
    { id: 4, name: '100 Points', tier: 'uncommon', icon: '🪙', shortName: '100 PTS' },
    { id: 5, name: '10 Points', tier: 'common', icon: '🪙', shortName: '10 PTS' },
    { id: 6, name: '$10 KFC', tier: 'rare', icon: '🍗', shortName: '$10 KFC', sponsor: 'KFC' },
    { id: 7, name: '25 Points', tier: 'common', icon: '🪙', shortName: '25 PTS' },
    { id: 8, name: 'Free Shield', tier: 'uncommon', icon: '🛡️', shortName: 'SHIELD' },
    { id: 9, name: '50 Points', tier: 'common', icon: '🪙', shortName: '50 PTS' },
    { id: 10, name: '$25 NRL Shop', tier: 'epic', icon: '🛍️', shortName: '$25 NRL', sponsor: 'NRL' },
    { id: 11, name: '250 Points', tier: 'rare', icon: '🪙', shortName: '250 PTS' },
    { id: 12, name: 'Signed Ball', tier: 'epic', icon: '🏉', shortName: 'BALL' },
    { id: 13, name: '25 Points', tier: 'common', icon: '🪙', shortName: '25 PTS' },
    { id: 14, name: '500 Points', tier: 'rare', icon: '🪙', shortName: '500 PTS' },
    { id: 15, name: '$20 Uber Eats', tier: 'uncommon', icon: '🍔', shortName: '$20 UBER', sponsor: 'Uber Eats' },
    { id: 16, name: '100 Points', tier: 'uncommon', icon: '🪙', shortName: '100 PTS' },
    { id: 17, name: 'Match Tickets', tier: 'legendary', icon: '🎟️', shortName: 'TICKETS' },
    { id: 18, name: '25 Points', tier: 'common', icon: '🪙', shortName: '25 PTS' },
    { id: 19, name: '50 Points', tier: 'common', icon: '🪙', shortName: '50 PTS' },
    { id: 20, name: '$15 Voucher', tier: 'uncommon', icon: '🎁', shortName: '$15 VOUCHER' },
  ].map((prize, idx) => ({
    ...prize,
    color: colorScheme[idx % colorScheme.length],
  }));

  const handleSpin = () => {
    if (spinsRemaining === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setPrizeWon(null);
    
    // Calculate random final rotation (3-5 full spins + random angle)
    const fullSpins = 3 + Math.random() * 2; // 3-5 full rotations
    const randomAngle = Math.random() * 360; // Random final angle
    const finalRotation = fullSpins * 360 + randomAngle;
    
    // Simulate spin duration (4-7 seconds)
    const spinDuration = 4000 + Math.random() * 3000;
    
    // Animate rotation
    setRotation(finalRotation);
    
    setTimeout(() => {
      // Calculate which prize the pointer lands on based on final rotation
      // Pointer is at 3 o'clock (0 degrees in standard math, but we need to account for wheel rotation)
      // The wheel rotates clockwise, so we need to reverse the calculation
      const normalizedAngle = (360 - (finalRotation % 360)) % 360;
      const segmentAngle = 360 / 20; // 18 degrees per segment
      // Find which segment index the pointer is pointing at
      let prizeIndex = Math.floor(normalizedAngle / segmentAngle);
      // Ensure index is within bounds
      prizeIndex = prizeIndex % 20;
      
      const actualPrize = prizes[prizeIndex];
      
      setIsSpinning(false);
      setPrizeWon(actualPrize);
      setSpinsRemaining(spinsRemaining - 1);
    }, spinDuration);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-black rounded-2xl p-8 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Gift size={24} className="text-white/70" strokeWidth={2} />
            <h2 className="text-2xl font-bold text-white">Weekly Prize Wheel</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* Wheel Visual */}
        <div className="relative w-full mb-8 flex items-center justify-center">
          <div className="relative" style={{ width: '500px', height: '500px' }}>
            {/* Pointer at 3 o'clock (right side) */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-20">
              <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-l-[30px] border-transparent border-l-white drop-shadow-lg"></div>
            </div>
            
            {/* Wheel Container */}
            <div 
              className="relative w-[500px] h-[500px] rounded-full overflow-hidden shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'transform 0s',
              }}
            >
              <svg width="500" height="500" viewBox="0 0 500 500" className="absolute inset-0">
                <defs>
                  <clipPath id="wheel-clip">
                    <circle cx="250" cy="250" r="250" />
                  </clipPath>
                </defs>
                <g clipPath="url(#wheel-clip)">
                  {prizes.map((prize, idx) => {
                    const segmentAngle = 360 / 20; // 18 degrees
                    // SVG coordinates: 0° = 3 o'clock (right), 90° = 6 o'clock (bottom)
                    // Start from top (12 o'clock = -90° in SVG) and go clockwise
                    const startAngle = (idx * segmentAngle - 90) * (Math.PI / 180);
                    const endAngle = ((idx + 1) * segmentAngle - 90) * (Math.PI / 180);
                    const centerAngle = (idx * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
                    
                    const x1 = 250 + 250 * Math.cos(startAngle);
                    const y1 = 250 + 250 * Math.sin(startAngle);
                    const x2 = 250 + 250 * Math.cos(endAngle);
                    const y2 = 250 + 250 * Math.sin(endAngle);
                    
                    // Icon position (closer to center)
                    const iconRadius = 120;
                    const iconX = 250 + iconRadius * Math.cos(centerAngle);
                    const iconY = 250 + iconRadius * Math.sin(centerAngle);
                    
                    // Text position (between icon and edge)
                    const textRadius = 200;
                    const textX = 250 + textRadius * Math.cos(centerAngle);
                    const textY = 250 + textRadius * Math.sin(centerAngle);
                    
                    // Text rotation: align with segment direction (centerAngle + 90° to make text horizontal when segment is vertical)
                    const textRotation = (centerAngle * 180 / Math.PI);
                    
                    return (
                      <g key={prize.id}>
                        {/* Segment */}
                        <path
                          d={`M 250 250 L ${x1} ${y1} A 250 250 0 0 1 ${x2} ${y2} Z`}
                          fill={prize.color}
                          stroke="#000"
                          strokeWidth="2"
                        />
                        {/* Icon */}
                        <text
                          x={iconX}
                          y={iconY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="36"
                          fill="white"
                          fontWeight="bold"
                        >
                          {prize.icon}
                        </text>
                        {/* Text - rotated to follow segment direction */}
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="11"
                          fill="white"
                          fontWeight="bold"
                          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        >
                          {prize.shortName}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
              
              {/* Center Circle with Logo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black rounded-full border-4 border-white/20 flex items-center justify-center z-10 shadow-xl">
                <div className="text-2xl font-bold text-white">NRL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spins Remaining - Bottom Overlay */}
        <div className="bg-black/80 rounded-xl px-6 py-4 flex items-center justify-center gap-3 mb-6">
          <CircleDot size={24} className="text-white/70 animate-spin" strokeWidth={2} />
          <div className="text-white font-semibold">
            Spins Remaining • <span className="text-nrl-green">{spinsRemaining}</span>
          </div>
        </div>

        {/* Prize Won Display */}
        {prizeWon && !isSpinning && (
          <div className="bg-gradient-to-br from-nrl-green/30 to-nrl-amber/30 border-2 border-nrl-green rounded-xl p-6 mb-4 text-center animate-pulse">
            <div className="flex justify-center mb-3">
              <Sparkles size={48} className="text-nrl-green" strokeWidth={2} />
            </div>
            <div className="text-2xl font-bold text-white mb-2">YOU WON!</div>
            <div className="flex justify-center mb-3">
              {prizeWon.name.includes('Points') && <Coins size={32} className="text-nrl-green" strokeWidth={2} />}
              {prizeWon.name.includes('Ticket') && <Ticket size={32} className="text-nrl-green" strokeWidth={2} />}
              {prizeWon.name.includes('Voucher') && <Gift size={32} className="text-nrl-green" strokeWidth={2} />}
              {!prizeWon.name.includes('Points') && !prizeWon.name.includes('Ticket') && !prizeWon.name.includes('Voucher') && <Award size={32} className="text-nrl-green" strokeWidth={2} />}
            </div>
            <div className="text-xl font-semibold text-nrl-green mb-2">{prizeWon.name}</div>
            {prizeWon.sponsor && (
              <div className="text-sm text-nrl-text-muted mb-4">Sponsored by {prizeWon.sponsor}</div>
            )}
            <div className="flex gap-3 justify-center">
              {spinsRemaining > 0 && (
                <button
                  onClick={handleSpin}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Spin Again ({spinsRemaining} left)
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-nrl-dark-hover border border-nrl-border-light text-white font-bold rounded-lg hover:border-nrl-green transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Spin Button - Only show if no prize won */}
        {!prizeWon && spinsRemaining > 0 && (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
          </button>
        )}

        {!prizeWon && spinsRemaining === 0 && (
          <div className="text-center text-nrl-text-secondary">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Check size={16} className="text-nrl-green" strokeWidth={2} />
              <span>All spins used this week</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-nrl-dark-hover border border-nrl-border-light text-white font-bold rounded-lg hover:border-nrl-green transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Card Component (Left Column)
function ProfileCard({ tier, points, progressPercent, pointsToNext, nextTier, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: tier.color }}
        >
          <Star size={20} className="text-white/70" fill="currentColor" strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-bold uppercase" style={{ color: tier.color }}>
            {tier.name} Tier
          </div>
          <div className="text-2xl font-bold text-white">{points.toLocaleString()}</div>
          <div className="text-xs text-nrl-text-secondary">points</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ 
            width: `${progressPercent}%`,
            backgroundColor: tier.color 
          }}
        />
      </div>
      <div className="text-xs text-nrl-text-secondary">
        {pointsToNext > 0 ? `${pointsToNext} to ${nextTier.name}` : "Max tier reached"}
      </div>
    </div>
  );
}

// Total Points Card with CTA (Left Column)
function TotalPointsCard({ points, onGoToShop }: { points: number; onGoToShop: () => void }) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="mb-4">
        <div className="text-3xl font-bold text-white mb-1">{points.toLocaleString()}</div>
        <div className="text-sm text-nrl-text-secondary">Total Points</div>
      </div>
      <button
        onClick={onGoToShop}
        className="w-full bg-nrl-green text-white font-bold py-3 rounded-xl hover:bg-nrl-green/90 transition-colors"
      >
        Go to Points Shop
      </button>
    </div>
  );
}

// Attend Game Card (Middle Column)
function AttendGameCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Attend {teamData?.name || "Broncos"} Game</h3>
      <div className="bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 mb-4">
        <div className="text-sm text-white mb-2">Check-in at game QR</div>
        <div className="text-xs text-nrl-text-secondary mb-3">Scan the QR code at the stadium</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-nrl-green">+200 points</span>
          <button className="ml-auto px-4 py-2 bg-nrl-green text-white text-sm font-semibold rounded-lg hover:bg-nrl-green/90">
            Check In
          </button>
        </div>
      </div>
    </div>
  );
}

// Today's Activities (Middle Column)
function TodaysActivities() {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Today's Activities</h3>
      <div className="space-y-3">
        <ActivityButton 
          title="Daily check-in"
          points="+5"
          completed={true}
        />
        <ActivityButton 
          title="Watch a highlight"
          points="+10"
          completed={false}
        />
        <ActivityButton 
          title="Read an article"
          points="+10"
          completed={false}
        />
      </div>
    </div>
  );
}

// Weekly Activities Simplified (Left Column)
function WeeklyActivitiesSimplified({ user, teamData }: any) {
  const [showLastRoundMVP, setShowLastRoundMVP] = useState(false);
  const [selectedLastRoundPlayer, setSelectedLastRoundPlayer] = useState("");
  const [playerSearchLastRound, setPlayerSearchLastRound] = useState("");
  
  const [showNextWeekMVP, setShowNextWeekMVP] = useState(false);
  const [selectedNextWeekPlayer, setSelectedNextWeekPlayer] = useState("");
  const [playerSearchNextWeek, setPlayerSearchNextWeek] = useState("");
  
  const [showDominantTeam, setShowDominantTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");

  // Mock players for MVP search
  const players = [
    { id: 1, name: "Nathan Cleary", stats: "2 tries, 6 goals" },
    { id: 2, name: "Reece Walsh", stats: "3 try assists" },
    { id: 3, name: "Jahrome Hughes", stats: "250m, 2 linebreaks" },
    { id: 4, name: "Kalyn Ponga", stats: "1 try, 4 goals" },
    { id: 5, name: "Cameron Munster", stats: "2 tries, 1 assist" },
  ];

  const filteredPlayersLastRound = players.filter(p => 
    p.name.toLowerCase().includes(playerSearchLastRound.toLowerCase())
  );
  
  const filteredPlayersNextWeek = players.filter(p => 
    p.name.toLowerCase().includes(playerSearchNextWeek.toLowerCase())
  );

  // Mock team voting results
  const teamVotes = [
    { name: "Broncos", percentage: 44 },
    { name: "Sharks", percentage: 20 },
    { name: "Panthers", percentage: 15 },
    { name: "Storm", percentage: 12 },
    { name: "Roosters", percentage: 9 },
  ];
  
  // Get all teams for dropdown
  const allTeams = NRL_TEAMS.map(t => t.name);

  // Mission data with status, progress, urgency
  const missions = [
    {
      id: 1,
      type: "tipping",
      iconComponent: List,
      iconColor: "bg-blue-500/20",
      title: "Tips made for weekend fixtures",
      points: "+50",
      completed: false,
      progress: { current: 6, total: 8 },
      urgency: null,
    },
    {
      id: 2,
      type: "fantasy",
      iconComponent: TrendingUp,
      iconColor: "bg-purple-500/20",
      title: "Team set and trades made for Fantasy",
      points: "+30",
      completed: true,
      progress: null,
      urgency: null,
    },
    {
      id: 3,
      type: "mvp",
      iconComponent: User,
      iconColor: "bg-yellow-500/20",
      title: "Vote for MVP of last round",
      points: "+25",
      completed: false,
      progress: null,
      urgency: null,
    },
    {
      id: 4,
      type: "prediction",
      iconComponent: Clock,
      iconColor: "bg-pink-500/20",
      title: "Telstra Tuesday MVP Predict",
      points: "+25",
      completed: false,
      progress: null,
      urgency: "4h left", // Time-sensitive
    },
    {
      id: 5,
      type: "prediction",
      iconComponent: Calendar,
      iconColor: "bg-pink-500/20",
      title: "Most dominant team prediction",
      points: "+25",
      completed: false,
      progress: null,
      urgency: null,
    },
  ];

  // Sort missions: urgent first, then incomplete, then completed, then locked
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.urgency && !b.urgency) return -1;
    if (!a.urgency && b.urgency) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">This Week's Missions</h3>
      <div className="space-y-3">
        {sortedMissions.map((mission) => {
          const isExpanded = 
            (mission.id === 3 && showLastRoundMVP) ||
            (mission.id === 4 && showNextWeekMVP) ||
            (mission.id === 5 && showDominantTeam);
          
          return (
            <div key={mission.id}>
              <MissionCard
                mission={mission}
                onExpand={() => {
                  if (mission.id === 3) setShowLastRoundMVP(!showLastRoundMVP);
                  if (mission.id === 4) setShowNextWeekMVP(!showNextWeekMVP);
                  if (mission.id === 5) setShowDominantTeam(!showDominantTeam);
                }}
                isExpanded={isExpanded}
              />
              
              {/* Expandable content for MVP voting */}
              {mission.id === 3 && isExpanded && (
                <div className="mt-2 ml-[52px] pt-3 border-t border-nrl-border-light space-y-3 bg-nrl-dark-card rounded-lg p-3">
                  <div className="text-xs font-bold text-nrl-text-secondary mb-2">ROUND 5 MVP</div>
                  <div className="text-xs text-nrl-text-secondary mb-3">Who was the best player this round?</div>
                  
                  <input
                    type="text"
                    placeholder="Search player..."
                    value={playerSearchLastRound}
                    onChange={(e) => setPlayerSearchLastRound(e.target.value)}
                    className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-lg px-3 py-2 text-sm text-white placeholder-nrl-text-muted focus:outline-none focus:border-nrl-green"
                  />
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredPlayersLastRound.map((player) => (
                      <button
                        key={player.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLastRoundPlayer(player.name);
                        }}
                        className={`w-full bg-nrl-dark-hover border rounded-lg p-3 text-left transition-colors ${
                          selectedLastRoundPlayer === player.name 
                            ? 'border-nrl-green bg-nrl-green/10' 
                            : 'border-nrl-border-light hover:border-nrl-green'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-nrl-dark-card flex items-center justify-center">
                            <User size={20} className="text-white/60" strokeWidth={2} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">{player.name}</div>
                            <div className="text-xs text-nrl-text-secondary">{player.stats}</div>
                          </div>
                          {selectedLastRoundPlayer === player.name && (
                            <Check size={16} className="text-nrl-green" strokeWidth={2} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {selectedLastRoundPlayer && (
                    <div className="pt-3 border-t border-nrl-border-light">
                      <div className="text-xs text-nrl-text-secondary mb-2">
                        +10 Fuel • +25 pts
                      </div>
                      <div className="text-xs text-nrl-text-muted">
                        Winner announced: Wednesday 12pm
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Expandable content for Telstra Tuesday MVP Predict */}
              {mission.id === 4 && isExpanded && (
                <div className="mt-2 ml-[52px] pt-3 border-t border-nrl-border-light space-y-3 bg-nrl-dark-card rounded-lg p-3">
                  <div className="text-xs font-bold text-nrl-text-secondary mb-2">ROUND 6 MVP PREDICTION</div>
                  <div className="text-xs text-nrl-text-secondary mb-3">Who will be the best player next round?</div>
                  
                  <input
                    type="text"
                    placeholder="Search player..."
                    value={playerSearchNextWeek}
                    onChange={(e) => setPlayerSearchNextWeek(e.target.value)}
                    className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-lg px-3 py-2 text-sm text-white placeholder-nrl-text-muted focus:outline-none focus:border-nrl-green"
                  />
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredPlayersNextWeek.map((player) => (
                      <button
                        key={player.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNextWeekPlayer(player.name);
                        }}
                        className={`w-full bg-nrl-dark-hover border rounded-lg p-3 text-left transition-colors ${
                          selectedNextWeekPlayer === player.name 
                            ? 'border-nrl-green bg-nrl-green/10' 
                            : 'border-nrl-border-light hover:border-nrl-green'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-nrl-dark-card flex items-center justify-center">
                            <User size={20} className="text-white/60" strokeWidth={2} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">{player.name}</div>
                          </div>
                          {selectedNextWeekPlayer === player.name && (
                            <Check size={16} className="text-nrl-green" strokeWidth={2} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {selectedNextWeekPlayer && (
                    <div className="pt-3 border-t border-nrl-border-light">
                      <div className="text-xs text-nrl-text-secondary mb-2">
                        +10 Fuel • +25 pts
                      </div>
                      <div className="text-xs text-nrl-text-muted">
                        Prediction locked until next round
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Expandable content for Most dominant team prediction */}
              {mission.id === 5 && isExpanded && (
                <div className="mt-2 ml-[52px] pt-3 border-t border-nrl-border-light space-y-3 bg-nrl-dark-card rounded-lg p-3">
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nrl-green"
                  >
                    <option value="">Select a team...</option>
                    {allTeams.map((teamName) => (
                      <option key={teamName} value={teamName}>{teamName}</option>
                    ))}
                  </select>
                  
                  {selectedTeam && (
                    <div className="pt-3 border-t border-nrl-border-light">
                      <div className="text-xs text-nrl-text-secondary mb-2">
                        +10 Fuel • +25 pts
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-nrl-border-light">
                    <div className="text-xs font-semibold text-white mb-2">Current Voting Results:</div>
                    <div className="space-y-2">
                      {teamVotes.map((team) => (
                        <div key={team.name} className="flex items-center gap-2">
                          <div className="w-20 text-xs text-nrl-text-secondary">{team.name}</div>
                          <div className="flex-1 bg-nrl-dark-hover rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-nrl-green"
                              style={{ width: `${team.percentage}%` }}
                            />
                          </div>
                          <div className="w-10 text-xs text-nrl-text-secondary text-right">{team.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

// Mission Card Component
function MissionCard({ mission, onExpand, isExpanded }: { 
  mission: any; 
  onExpand: () => void; 
  isExpanded: boolean;
}) {
  const progressPercent = mission.progress 
    ? (mission.progress.current / mission.progress.total) * 100 
    : null;

  return (
    <div
      className={`group relative bg-nrl-dark-hover border-l-4 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
        mission.completed 
          ? 'border-l-nrl-green bg-nrl-green/8 border-r border-t border-b border-nrl-green/30' 
          : mission.urgency
          ? 'border-l-orange-500 border-r border-t border-b border-orange-500/50 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5'
          : 'border-l-nrl-border-light border-r border-t border-b border-nrl-border-light hover:border-l-nrl-green hover:border-nrl-green hover:shadow-lg hover:shadow-nrl-green/20 hover:-translate-y-0.5'
      }`}
      onClick={onExpand}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${mission.iconColor}`}>
          {mission.iconComponent && (
            <mission.iconComponent 
              size={20} 
              className={mission.urgency ? "text-orange-400" : mission.completed ? "text-nrl-green/70" : "text-white/70"} 
              strokeWidth={2} 
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-1">
              <h4 className="text-sm font-semibold text-white">
                {mission.title}
              </h4>
              {mission.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-nrl-green/20 border border-nrl-green/50 rounded-full">
                  <Check size={12} className="text-nrl-green" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-nrl-green">Completed</span>
                </span>
              )}
            </div>
            
            {/* Points - Prominent */}
            <span className={`text-sm font-bold whitespace-nowrap ${
              mission.completed ? 'text-nrl-green/80' : 'text-nrl-green'
            }`}>
              {mission.completed ? '✓' : ''} {mission.points}
            </span>
          </div>

          {/* Progress Bar */}
          {progressPercent !== null && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-nrl-text-secondary">
                  {mission.progress.current}/{mission.progress.total} complete
                </span>
                <span className="text-xs text-nrl-text-secondary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="w-full bg-nrl-dark-card rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-nrl-green to-nrl-amber transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Urgency Badge */}
          {mission.urgency && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full animate-pulse">
              <span className="text-xs font-bold text-orange-400">{mission.urgency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Activity Button Component
function ActivityButton({ title, points, completed }: { title: string; points: string; completed: boolean }) {
  return (
    <button className={`w-full bg-nrl-dark-hover border rounded-xl p-3 text-left transition-colors ${
      completed ? 'border-nrl-green bg-nrl-green/10' : 'border-nrl-border-light hover:border-nrl-green'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {completed && <Check size={16} className="text-nrl-green" strokeWidth={2} />}
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <span className="text-xs font-bold text-nrl-green">{points}</span>
      </div>
    </button>
  );
}

// One-time Activities (Middle Column)
function OneTimeActivities() {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">One-time Activities</h3>
      <div className="space-y-3">
        <ActivityButton 
          title="Complete your profile"
          points="+50"
          completed={false}
        />
        <ActivityButton 
          title="Connect all social accounts"
          points="+40"
          completed={false}
        />
        <ActivityButton 
          title="Set your home ground"
          points="+25"
          completed={false}
        />
      </div>
    </div>
  );
}

// Sponsor Quest Card (Middle Column)
function SponsorQuestCard() {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase text-nrl-text-muted">SPONSOR QUEST</span>
        <span className="text-xs text-nrl-text-secondary">• Optional</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Telstra Tuesday MVP</h3>
      <p className="text-sm text-nrl-text-secondary mb-4">
        Vote for the best player of the week and earn bonus points
      </p>
      <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-3 text-left hover:border-nrl-green transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">View Quest</span>
          <span className="text-nrl-green font-bold">→</span>
        </div>
      </button>
    </div>
  );
}

// Profile Card Full (Right Column)
// Your Season Card - Merged Profile and Season Stats
function YourSeasonCard({ tier, points, progressPercent, pointsToNext, nextTier, teamData, user }: any) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  
  // All possible badges
  const allBadges = [
    { id: "i-was-there", name: "I Was There", iconComponent: Ticket, earned: true, description: "Attended 5+ games this season" },
    { id: "dedicated", name: "Dedicated", iconComponent: Flame, earned: true, description: "Maintained a 10+ week streak" },
    { id: "top-fan", name: "Top Fan", iconComponent: Star, earned: true, description: "Reached top 15% of team fans" },
    { id: "prediction-master", name: "Prediction Master", iconComponent: Clock, earned: false, description: "Made 20+ accurate predictions" },
    { id: "tipping-champion", name: "Tipping Champion", iconComponent: Trophy, earned: false, description: "Won 3+ tipping rounds" },
    { id: "fantasy-legend", name: "Fantasy Legend", iconComponent: Crown, earned: false, description: "Top 100 in Fantasy league" },
  ];

  const earnedBadges = allBadges.filter(b => b.earned);
  const unearnedBadges = allBadges.filter(b => !b.earned);

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      {/* Current Tier - Primary Info */}
      <div className="text-center mb-4">
        <div 
          className="text-lg font-bold uppercase tracking-wider mb-2"
          style={{ color: tier.color }}
        >
          {tier.name} TIER
        </div>
        <div 
          className="relative w-16 h-16 mx-auto rounded-full border-[3px] flex items-center justify-center mb-2"
          style={{ 
            borderColor: tier.color,
            boxShadow: `0 0 15px ${tier.color}40`
          }}
        >
          <Star size={24} className="text-white/70" fill="currentColor" strokeWidth={2} />
        </div>
      </div>

      {/* User's Actual Points - Large Number */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-white mb-1">{points.toLocaleString()}</div>
        <div className="text-xs text-nrl-text-secondary">your points</div>
      </div>

      {/* Progress to Next Tier - Secondary Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-nrl-text-secondary">
            {pointsToNext > 0 ? `Progress to ${nextTier.name}` : "Max tier reached"}
          </span>
          <span className="text-xs text-nrl-text-secondary">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full bg-nrl-dark-hover rounded-full h-4 mb-3 overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${tier.color} 0%, ${nextTier.color || tier.color} 100%)`
            }}
          >
            {/* Shine effect on progress bar */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer 2s infinite",
                backgroundSize: "200% 100%"
              }}
            />
          </div>
        </div>
        
        {/* Next Tier Preview */}
        {pointsToNext > 0 && (
          <div className="text-xs text-nrl-text-secondary mt-2">
            <span className="font-semibold text-white">{pointsToNext} points</span> to unlock {nextTier.name}
          </div>
        )}
      </div>

      {/* Season Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-nrl-border-light">
        <div>
          <div className="text-2xl font-bold text-white">{user?.lifetimePoints || points}</div>
          <div className="text-xs text-nrl-text-secondary">Lifetime Points</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">5/7</div>
          <div className="text-xs text-nrl-text-secondary">Games Attended</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">#847</div>
          <div className="text-xs text-nrl-text-secondary">Tipping Rank</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
          <div className="text-xs text-nrl-text-secondary">Badges Earned</div>
        </div>
      </div>

      {/* Trophy Case - Badges Showcase */}
      <div>
        <div className="text-sm font-bold uppercase text-nrl-text-secondary mb-4 tracking-wider">
          Trophy Case
        </div>
        
        {/* Shelf visual treatment */}
        <div className="relative">
          {/* Shelf top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nrl-border-light to-transparent" />
          
          <div className="grid grid-cols-3 gap-3 pt-4">
            {/* Earned Badges */}
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="relative group"
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                <div className="bg-nrl-dark-hover rounded-xl p-3 text-center border-2 border-nrl-green/50 hover:border-nrl-green transition-all cursor-pointer">
                  <div className="flex justify-center mb-2">
                    {badge.iconComponent && (
                      <badge.iconComponent size={24} className="text-nrl-green" strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white">{badge.name}</div>
                </div>
                
                {/* Tooltip */}
                {hoveredBadge === badge.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a1d] border border-nrl-border-light rounded-lg text-xs text-white whitespace-nowrap z-10 shadow-lg">
                    {badge.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-nrl-border-light" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Unearned Badges - Silhouettes */}
            {unearnedBadges.slice(0, 3 - earnedBadges.length).map((badge) => (
              <div
                key={badge.id}
                className="relative group"
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                <div className="bg-nrl-dark-hover rounded-xl p-3 text-center border-2 border-nrl-border-light opacity-40">
                  <div className="flex justify-center mb-2">
                    {badge.iconComponent ? (
                      <badge.iconComponent size={24} className="text-white/30" strokeWidth={2} />
                    ) : (
                      <HelpCircle size={24} className="text-white/30" strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-nrl-text-muted">Locked</div>
                </div>
                
                {/* Tooltip */}
                {hoveredBadge === badge.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a1d] border border-nrl-border-light rounded-lg text-xs text-white whitespace-nowrap z-10 shadow-lg">
                    {badge.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-nrl-border-light" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Leaderboards Card (Right Column)
function LeaderboardsCard({ user, teamData, userPoints }: any) {
  // Mock leaderboard data with user's position and rivals
  const userRank = 847;
  const userPointsValue = userPoints || 380;
  
  const leaderboard = [
    { rank: 845, name: "BroncosFan23", points: 425, change: "+5", movement: "up" },
    { rank: 846, name: "QLD4Life", points: 400, change: "+2", movement: "up" },
    { rank: 847, name: user?.name || "You", points: userPointsValue, change: "+23", movement: "up", isUser: true },
    { rank: 848, name: "MaroonArmy", points: 350, change: "-1", movement: "down" },
    { rank: 849, name: "StormChaser", points: 320, change: "+8", movement: "up" },
  ];
  
  const userPosition = leaderboard.find(f => f.isUser);
  const aboveUser = leaderboard.find(f => f.rank === userRank - 1);
  const belowUser = leaderboard.find(f => f.rank === userRank + 1);
  const pointsBehind = aboveUser ? aboveUser.points - userPointsValue : 0;
  const pointsAhead = belowUser ? userPointsValue - belowUser.points : 0;
  
  // Top climbers this week
  const topClimbers = [
    { name: "RisingStar", change: "+47", movement: "up" },
    { name: "ClimbMaster", change: "+35", movement: "up" },
    { name: "UpwardFan", change: "+28", movement: "up" },
  ];

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Leaderboards</h3>
      
      {/* User's Position with Rivalry Framing */}
      <div className="bg-nrl-dark-hover rounded-xl p-4 mb-4 border border-nrl-border-light">
        <div className="flex items-center justify-between mb-3">
          <div className="text-3xl font-bold text-nrl-green">#{userRank}</div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-nrl-green/20 ${
            userPosition?.movement === "up" ? "text-nrl-green" : "text-nrl-text-muted"
          }`}>
            {userPosition?.movement === "up" && <Flame size={14} className="text-nrl-green" strokeWidth={2} />}
            <span className="text-xs font-bold">{userPosition?.change}</span>
          </div>
        </div>
        <div className="text-sm text-white font-semibold mb-1">Top 12% of {teamData?.name || "Broncos"} fans</div>
        
        {/* Rivalry Framing */}
        {aboveUser && (
          <div className="mt-3 pt-3 border-t border-nrl-border-light">
            <div className="text-xs text-nrl-text-secondary mb-1">
              <span className="font-semibold text-white">{pointsBehind} points behind {aboveUser.name}</span>
            </div>
            <div className="text-xs text-nrl-amber">
              Complete 2 missions to pass them
            </div>
          </div>
        )}
      </div>

      {/* Rivals - Above and Below */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-bold uppercase text-nrl-text-secondary mb-2 tracking-wider">Your Rivals</div>
        {aboveUser && (
          <div className="flex items-center justify-between py-2 px-3 bg-nrl-dark-hover rounded-lg border border-nrl-border-light">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-nrl-green/20 flex items-center justify-center text-xs font-bold text-nrl-green">
                {aboveUser.rank}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{aboveUser.name}</div>
                <div className="text-xs text-nrl-text-secondary">{aboveUser.points} pts</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {aboveUser.movement === "up" && <span className="text-nrl-green text-sm">↑</span>}
              {aboveUser.movement === "down" && <span className="text-red-500 text-sm">↓</span>}
              <span className={`text-xs font-bold ${aboveUser.change.startsWith('+') ? 'text-nrl-green' : 'text-nrl-text-muted'}`}>
                {aboveUser.change}
              </span>
            </div>
          </div>
        )}
        
        {belowUser && (
          <div className="flex items-center justify-between py-2 px-3 bg-nrl-dark-hover rounded-lg border border-nrl-border-light">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-nrl-green/20 flex items-center justify-center text-xs font-bold text-nrl-green">
                {belowUser.rank}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{belowUser.name}</div>
                <div className="text-xs text-nrl-text-secondary">{belowUser.points} pts</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {belowUser.movement === "up" && <span className="text-nrl-green text-sm">↑</span>}
              {belowUser.movement === "down" && <span className="text-red-500 text-sm">↓</span>}
              <span className={`text-xs font-bold ${belowUser.change.startsWith('+') ? 'text-nrl-green' : 'text-nrl-text-muted'}`}>
                {belowUser.change}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Top Climbers This Week - Consolidated */}
      <div className="pt-4 border-t border-nrl-border-light">
        <div className="text-xs font-bold uppercase text-nrl-text-secondary mb-3 tracking-wider">Top Climbers This Week</div>
        <div className="space-y-2">
          {[
            { rank: 1, name: "ChampionFan", points: "12,450", change: "+5", movement: "up" },
            { rank: 2, name: "EliteSupporter", points: "11,890", change: "+2", movement: "up" },
            { rank: 3, name: "TopTierFan", points: "11,200", change: "-1", movement: "down" },
            ...topClimbers.map((c, idx) => ({ rank: idx + 4, name: c.name, points: "", change: c.change, movement: c.movement }))
          ].slice(0, 5).map((fan, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 px-3 bg-nrl-dark-hover rounded-lg border border-nrl-border-light">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-nrl-green/20 flex items-center justify-center text-xs font-bold text-nrl-green">
                  {fan.rank}
                </div>
                <div className="flex items-center gap-2">
                  {fan.movement === "up" && <Flame size={14} className="text-nrl-green" strokeWidth={2} />}
                  <div>
                    <div className="text-sm font-semibold text-white">{fan.name}</div>
                    {fan.points && <div className="text-xs text-nrl-text-secondary">{fan.points} pts</div>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {fan.movement === "up" && <span className="text-nrl-green text-sm">↑</span>}
                {fan.movement === "down" && <span className="text-red-500 text-sm">↓</span>}
                <span className={`text-xs font-bold ${fan.change.startsWith('+') ? 'text-nrl-green' : 'text-nrl-text-muted'}`}>
                  {fan.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Profile Completion Simplified (Left Column)
function ProfileCompletionSimplified({ user, profileCompletion }: any) {
  const activities = [
    { 
      id: "homeGround", 
      label: "Local home ground", 
      completed: !!user?.homeGround,
      points: 25
    },
    { 
      id: "dob", 
      label: "DOB", 
      completed: !!user?.dob,
      points: 20
    },
    { 
      id: "gender", 
      label: "Gender", 
      completed: !!user?.gender,
      points: 15
    },
  ];

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Profile Completion</h3>
        <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
      </div>
      
      <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nrl-green to-nrl-amber"
          style={{ width: `${profileCompletion}%` }}
        />
      </div>
      
      <div className="space-y-2 mb-4">
        {activities.map((activity) => (
          <button
            key={activity.id}
            className={`w-full bg-nrl-dark-hover border rounded-xl p-3 text-left transition-colors ${
              activity.completed 
                ? 'border-nrl-green bg-nrl-green/10' 
                : 'border-nrl-border-light hover:border-nrl-green'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activity.completed ? (
                  <Check size={16} className="text-nrl-green" strokeWidth={2} />
                ) : (
                  <Circle size={16} className="text-white/40" strokeWidth={2} />
                )}
                <span className={`text-sm font-semibold ${activity.completed ? 'text-white' : 'text-nrl-text-secondary'}`}>
                  {activity.label}
                </span>
              </div>
              <span className="text-xs font-bold text-nrl-green">
                +{activity.points} pts
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Social Media Icons Row */}
      <div className="pt-4 border-t border-nrl-border-light">
        <div className="text-xs text-nrl-text-secondary mb-3 text-center">Connect social accounts</div>
        <div className="flex items-center justify-center gap-4">
          {[
            { id: "facebook", name: "Facebook" },
            { id: "instagram", name: "Instagram" },
            { id: "x", name: "X" },
            { id: "tiktok", name: "TikTok" },
          ].map((social) => {
            const isConnected = user?.connectedSocials?.includes(social.id) || false;
            return (
              <button
                key={social.id}
                className={`relative flex items-center justify-center transition-all ${
                  isConnected 
                    ? "opacity-100 hover:scale-110" 
                    : "opacity-40 hover:opacity-60"
                }`}
                title={isConnected ? `${social.name} connected` : `Connect ${social.name}`}
              >
                <div className={`relative ${isConnected ? "w-10 h-10" : "w-8 h-8"}`}>
                  <Image
                    src={`/social-logos/${social.id === "x" ? "x.png" : social.id === "facebook" ? "facebook.png" : social.id === "instagram" ? "instagram.png" : "tiktok.png"}`}
                    alt={social.name}
                    fill
                    className={`object-contain ${isConnected ? "" : "grayscale"}`}
                    unoptimized
                  />
                </div>
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-nrl-green rounded-full border-2 border-nrl-dark-card">
                    <Check size={8} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Tiers Rewards Card (Right Column)
function TiersRewardsCard({ currentTier, userPoints }: any) {
  const tiers = [
    { name: "Silver", minPoints: 1000, reward: "NRL / Broncos Hat" },
    { name: "Gold", minPoints: 2000, reward: "Team Jersey" },
    { name: "Platinum", minPoints: 3500, reward: "Game ticket" },
    { name: "Diehard", minPoints: 5000, reward: "Signed team jersey" },
    { name: "Legend", minPoints: 10000, reward: "Premiership package - flight + ticket + accommodation" },
  ];

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Tier Rewards</h3>
      <div className="space-y-3">
        {tiers.map((tier, idx) => {
          const isUnlocked = userPoints >= tier.minPoints;
          const isCurrent = currentTier.name === tier.name;
          
          return (
            <div
              key={idx}
              className={`bg-nrl-dark-hover border rounded-xl p-3 ${
                isUnlocked ? 'border-nrl-green' : 'border-nrl-border-light'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {isUnlocked && <Check size={16} className="text-nrl-green" strokeWidth={2} />}
                  <span className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-nrl-text-secondary'}`}>
                    {tier.name} tier
                  </span>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-nrl-green/20 text-nrl-green rounded">Current</span>
                  )}
                </div>
                <span className="text-xs font-bold text-nrl-text-secondary">{tier.minPoints.toLocaleString()} points</span>
              </div>
              <div className="text-xs text-nrl-text-secondary">{tier.reward}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Connect Socials Card (Left Column)
function ConnectSocialsCard({ user }: any) {
  const allSocials = [
    { id: "facebook", name: "Facebook", logo: "/social-logos/facebook.png" },
    { id: "tiktok", name: "TikTok", logo: "/social-logos/tiktok.png" },
    { id: "instagram", name: "Instagram", logo: "/social-logos/instagram.png" },
    { id: "x", name: "X", logo: "/social-logos/x.png" },
  ];

  const connectedSocials = user?.connectedSocials || [];
  const missingSocials = allSocials.filter(social => !connectedSocials.includes(social.id));

  if (missingSocials.length === 0) {
    return null; // Don't show if all socials are connected
  }

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Connect Socials</h3>
      <div className="text-xs text-nrl-text-secondary mb-4">
        Connect additional social accounts to earn more points
      </div>
      <div className="grid grid-cols-2 gap-3">
        {missingSocials.map((social) => (
          <button
            key={social.id}
            className="bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 flex flex-col items-center gap-2 hover:border-nrl-green transition-colors"
          >
            <div className="relative w-12 h-12">
              <Image
                src={social.logo}
                alt={social.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-xs font-semibold text-white">{social.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Prize Wheel Card (Right Column)
function PrizeWheelCard({ streakData, teamData }: any) {
  const [showWheel, setShowWheel] = useState(false);

  // Prize preview icons
  const prizeIcons = [
    { iconComponent: Ticket, label: "Tickets" },
    { iconComponent: Gift, label: "Vouchers" },
    { iconComponent: Coins, label: "Points" },
    { iconComponent: Shirt, label: "Merch" },
  ];

  // Recent wins feed
  const recentWins = [
    { name: "BroncosFan23", prize: "100 pts" },
    { name: "QLD4Life", prize: "$10 Voucher" },
    { name: "MaroonArmy", prize: "Match Tickets" },
  ];

  return (
    <>
      <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
        <h3 className="text-lg font-bold text-white mb-1">Prize Wheel</h3>
        <div className="text-xs text-nrl-text-secondary mb-4">(win tickets, vouchers and points!)</div>
        {streakData.spins.available > 0 ? (
          <div>
            {/* Hero Text - Spins Available with Glow */}
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-nrl-green mb-2 animate-pulse" style={{
                textShadow: "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)"
              }}>
                {streakData.spins.available} Spins Available
              </div>
              <div className="text-sm text-nrl-text-secondary">
                Your {streakData.fanStreak.currentWeeks}-week streak gives you {streakData.spins.baseSpins} base spins
                {streakData.spins.bonusSpins > 0 && ` + ${streakData.spins.bonusSpins} bonus spins`}
              </div>
            </div>

            {/* Prize Preview Icons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {prizeIcons.map((prize, idx) => (
                <div key={idx} className="bg-nrl-dark-hover rounded-lg p-2 text-center border border-nrl-border-light">
                  <div className="flex justify-center mb-1">
                    {prize.iconComponent && (
                      <prize.iconComponent size={20} className="text-white/60" strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-[10px] text-nrl-text-secondary">{prize.label}</div>
                </div>
              ))}
            </div>

            {/* Spin Button - Most Prominent CTA */}
            <button
              onClick={() => setShowWheel(true)}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/50 text-lg mb-4 relative overflow-hidden group flex items-center justify-center"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 3s infinite"
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <CircleDot size={18} className="text-white" strokeWidth={2} />
                SPIN THE WHEEL
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {/* Recent Wins Feed */}
            <div className="pt-4 border-t border-nrl-border-light">
              <div className="text-xs font-bold uppercase text-nrl-text-secondary mb-3 tracking-wider">Recent Wins</div>
              <div className="space-y-2">
                {recentWins.map((win, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 bg-nrl-dark-hover rounded-lg border border-nrl-border-light">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-nrl-green" strokeWidth={2} />
                      <span className="text-sm text-white">{win.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-nrl-amber">won {win.prize}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Lock size={32} className="text-white/60" strokeWidth={2} />
            </div>
            <div className="text-lg font-semibold text-white mb-2">No Spins Available</div>
            <div className="text-sm text-nrl-text-secondary">
              Start a streak to earn weekly spins!
            </div>
          </div>
        )}
      </div>

      {/* Prize Wheel Modal */}
      {showWheel && (
        <PrizeWheel 
          streakData={streakData}
          teamData={teamData}
          onClose={() => setShowWheel(false)}
        />
      )}
    </>
  );
}

// Today's Quest Card
function TodaysQuestCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="text-xs font-bold uppercase text-nrl-text-muted mb-2">
        TELSTRA TUESDAY • 2X POINTS
      </div>
      <div className="text-base font-bold text-white mb-1">Tuesday Prediction</div>
      <div className="text-xs text-nrl-text-secondary mb-3">Total points: Broncos vs Roosters?</div>
      <div className="text-sm font-semibold mb-3" style={{ color: teamData?.primaryColor || "#00A651" }}>
        +100 pts
      </div>
      <button
        className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-all"
        style={{ backgroundColor: teamData?.primaryColor || "#00A651" }}
      >
        Make Prediction →
      </button>
    </div>
  );
}

// Season Favourite Picks
function SeasonFavouritePicks({ user }: any) {
  const picks = user?.seasonPicks || [];
  
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Season Favourite Picks</h3>
        {picks.length < 3 && (
          <button className="text-xs text-nrl-green font-semibold">Pick 3 players →</button>
        )}
      </div>
      
      {picks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-nrl-text-secondary mb-3">Pick 3 favourite players</p>
          <p className="text-xs text-nrl-text-muted">Scored by fantasy data • Locked for season</p>
        </div>
      ) : (
        <div className="space-y-3">
          {picks.map((pick: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-nrl-dark-hover rounded-lg">
              <div>
                <div className="text-sm font-semibold text-white">{pick.name}</div>
                <div className="text-xs text-nrl-text-secondary">{pick.position} • {pick.team}</div>
              </div>
              <div className="text-sm font-bold text-nrl-green">{pick.points || 0} pts</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile Completion Component with Dropdown
function ProfileCompletion({ user, profileCompletion }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check which socials are missing (assuming 4 total: facebook, tiktok, instagram, x)
  const allSocials = ["facebook", "tiktok", "instagram", "x"];
  const connectedSocials = user?.connectedSocials || [];
  const missingSocials = allSocials.filter(social => !connectedSocials.includes(social));

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Profile Completion</h3>
        <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nrl-green to-nrl-amber"
          style={{ width: `${profileCompletion}%` }}
        />
      </div>

      {/* Dropdown */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 hover:border-nrl-green transition-colors"
        >
          <span className="text-sm font-semibold text-white">Complete Profile for Points</span>
          <span className={`text-nrl-green transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="mt-2 bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 space-y-3">
            {/* DOB */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.dob ? (
                  <Check size={16} className="text-nrl-green" strokeWidth={2} />
                ) : (
                  <Circle size={16} className="text-white/40" strokeWidth={2} />
                )}
                <span className="text-sm text-nrl-text-secondary">DOB</span>
              </div>
              {!user?.dob && (
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Add →
                </button>
              )}
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.gender ? (
                  <Check size={16} className="text-nrl-green" strokeWidth={2} />
                ) : (
                  <Circle size={16} className="text-white/40" strokeWidth={2} />
                )}
                <span className="text-sm text-nrl-text-secondary">Gender</span>
              </div>
              {!user?.gender ? (
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    M
                  </button>
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    F
                  </button>
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    Rather not say
                  </button>
                </div>
              ) : (
                <span className="text-xs text-nrl-text-secondary">{user.gender}</span>
              )}
            </div>

            {/* Home Ground Stadium */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user?.homeGround ? (
                  <Check size={16} className="text-nrl-green" strokeWidth={2} />
                ) : (
                  <Circle size={16} className="text-white/40" strokeWidth={2} />
                )}
                <span className="text-sm text-nrl-text-secondary">Home Ground Stadium</span>
              </div>
              {!user?.homeGround && (
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Set →
                </button>
              )}
            </div>

            {/* Connect Socials */}
            {missingSocials.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle size={16} className="text-white/40" strokeWidth={2} />
                  <span className="text-sm text-nrl-text-secondary">Connect socials</span>
                </div>
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Connect →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mates Activity Component
function MatesActivity() {
  const matesActivity = [
    {
      id: "act-1",
      mateName: "Dave",
      activityText: "submitted tips — 7/8 this round",
      timestamp: "2026-01-19T10:00:00Z",
      isCompetitive: false
    },
    {
      id: "act-2",
      mateName: "Emma",
      activityText: "passed you — you're now #4 in The Office Comp",
      timestamp: "2026-01-19T08:00:00Z",
      isCompetitive: true
    }
  ];

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light max-h-[400px] overflow-y-auto">
      <h3 className="text-sm font-bold uppercase text-nrl-text-secondary mb-4 tracking-wider">
        Mates
      </h3>
      <div className="space-y-3">
        {matesActivity.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 pb-3 border-b border-nrl-border-light last:border-0 ${
              activity.isCompetitive ? "bg-orange-500/10 border-l-4 border-l-orange-500 pl-3" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-sm">
              {activity.mateName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-white">{activity.mateName}</span>{" "}
                {activity.isCompetitive && "⚡ "}
                <span className="text-nrl-text-secondary">{activity.activityText}</span>
              </div>
              <div className="text-xs text-nrl-text-muted mt-1">
                {new Date(activity.timestamp).toLocaleDateString()}
              </div>
            </div>
            <button className="text-xs border border-nrl-border-light px-2 py-1 rounded hover:bg-nrl-green/20 transition-colors">
              Nice!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Points Shop Card
function PointsShopCard({ points, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-nrl-text-secondary mb-1">Overall Points</div>
          <div className="text-3xl font-bold text-white">{points.toLocaleString()}</div>
        </div>
      </div>
      <button
        className="w-full bg-nrl-dark-hover border-2 border-nrl-green text-nrl-green font-bold py-3 rounded-xl hover:bg-nrl-green/10 transition-colors"
      >
        Points Shop →
      </button>
    </div>
  );
}

// Tips Card Component
function TipsCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Tipping</h3>
        <span className="text-xl">🎯</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        6/8 this round
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #847 overall
      </div>
      <a 
        href="#" 
        className="text-xs font-bold"
        style={{ color: teamData?.primaryColor || "#00A651" }}
      >
        Make Tips →
      </a>
    </div>
  );
}

// Fantasy Card Component
function FantasyCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Fantasy</h3>
        <span className="text-xl">🏈</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        12,847 pts
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #2,341 rank
      </div>
      <a 
        href="#" 
        className="text-xs font-bold"
        style={{ color: teamData?.primaryColor || "#00A651" }}
      >
        View Team →
      </a>
    </div>
  );
}
