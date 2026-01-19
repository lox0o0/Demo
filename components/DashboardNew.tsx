"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import Navigation, { NavSection } from "./Navigation";
import { generateMockStreakData, getFlameEmoji, getFlameLevelName, type StreakData } from "@/lib/streakData";

interface DashboardProps {
  user: any;
  hideNavigation?: boolean;
}

// Calculate tier based on points and profile completion
const calculateTier = (points: number, profileCompletion: number) => {
  // If profile completion is 90% or higher (team + auth + all 4 socials), give Bronze tier (250 points)
  // Note: Maximum completion from onboarding is 90% (20% team + 30% auth + 40% from 4 socials)
  // Additional profile fields (DOB, gender, home ground) can add up to 10% more to reach 100%
  if (profileCompletion >= 90) {
    return TIERS.find(t => t.name === "Bronze") || TIERS[1];
  }
  
  // Otherwise calculate based on points
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return points >= t.minPoints && (!nextTier || points < nextTier.minPoints);
  }) || TIERS[0];
  
  return currentTier;
};

export default function DashboardNew({ user, hideNavigation = false }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  
  // Get user data
  const profileCompletion = user?.profileCompletion || 0;
  // If profile completion is 90% or higher (team + auth + all 4 socials), give Bronze tier (250 points minimum)
  // Note: Maximum completion from onboarding is 90% (20% team + 30% auth + 40% from 4 socials)
  const userPoints = profileCompletion >= 90 
    ? Math.max(user?.points || 0, 250) 
    : (user?.points || 0);
  const currentTier = calculateTier(userPoints, profileCompletion);
  const nextTier = TIERS.find(t => t.minPoints > currentTier.minPoints) || TIERS[TIERS.length - 1];
  const pointsToNext = Math.max(0, nextTier.minPoints - userPoints);
  const progressPercent = nextTier.minPoints > currentTier.minPoints
    ? Math.min(((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)
    : 100;

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

      {/* Main Content - Horizontal layout */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${hideNavigation ? 'pt-6' : 'pt-24'}`}>
        {activeSection === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Today's Activity */}
            <div className="lg:col-span-1 space-y-6">
              <TodaysActivity user={user} teamData={teamData} />
            </div>

            {/* Middle Column - Main Dashboard Content */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card with Streak */}
              <StatusCard 
                tier={currentTier}
                points={userPoints}
                progressPercent={progressPercent}
                pointsToNext={pointsToNext}
                nextTier={nextTier}
                streak={user?.streak || 0}
                profileCompletion={profileCompletion}
                teamData={teamData}
              />
              
              {/* Streak Card */}
              <StreakCard streakData={streakData} teamData={teamData} />
              
              {/* Today's Quest */}
              <TodaysQuestCard teamData={teamData} />
              
              {/* Season Favourite Picks */}
              <SeasonFavouritePicks user={user} />
            </div>

            {/* Right Column - Mates, Points Shop, etc */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Completion */}
              <ProfileCompletion user={user} profileCompletion={profileCompletion} />
              
              {/* Mates Activity */}
              <MatesActivity />
              
              {/* Points Shop */}
              <PointsShopCard points={userPoints} teamData={teamData} />
              
              {/* Tips & Fantasy Cards */}
              <div className="grid grid-cols-2 gap-3">
                <TipsCard teamData={teamData} />
                <FantasyCard teamData={teamData} />
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
            <span className="text-lg">⭐</span>
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
            <span className="text-xl">🔥</span>
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
        <span>🔒</span>
        <span>{nextTier.name} unlocks: {nextTier.access || nextTier.reward}</span>
      </div>
    </div>
  );
}

// Streak Card Component
function StreakCard({ streakData, teamData }: { streakData: StreakData; teamData: any }) {
  const [showWheel, setShowWheel] = useState(false);
  const flameEmoji = getFlameEmoji(streakData.currentWeek.flameLevel);
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

  return (
    <>
      <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
        {/* Flame and Streak Count */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{flameEmoji}</div>
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
              <div className="text-nrl-text-muted mb-1">💰 Points Multiplier</div>
              <div className="font-bold text-white">{streakData.benefits.pointsMultiplier}x</div>
            </div>
            <div>
              <div className="text-nrl-text-muted mb-1">🎁 Weekly Bonus</div>
              <div className="font-bold text-white">+{streakData.benefits.weeklyBonus} pts</div>
            </div>
            <div>
              <div className="text-nrl-text-muted mb-1">🎰 Spins Available</div>
              <div className="font-bold text-white">{streakData.spins.available}</div>
            </div>
            <div>
              <div className="text-nrl-text-muted mb-1">🛡️ Shields</div>
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
            🎰 SPIN THE WHEEL ({streakData.spins.available} left)
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
    
    // Random prize selection
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const prizeIndex = prizes.findIndex(p => p.id === randomPrize.id);
    
    // Simulate spin duration based on tier
    const spinDuration = randomPrize.tier === 'legendary' ? 7000 :
                        randomPrize.tier === 'epic' ? 6000 :
                        randomPrize.tier === 'rare' ? 5000 :
                        4000;
    
    // Calculate rotation: full spins (3-5) + position of prize
    // Pointer is at 3 o'clock (0 degrees), so we need to rotate to center the prize
    const fullSpins = 3 + Math.random() * 2; // 3-5 full rotations
    const segmentAngle = 360 / 20; // 18 degrees per segment
    // Prize should be centered at the pointer (3 o'clock = 0 degrees)
    // So we rotate the wheel so the prize segment centers at 0 degrees
    const targetAngle = prizeIndex * segmentAngle;
    const finalRotation = fullSpins * 360 + (360 - targetAngle) + segmentAngle / 2;
    
    // Animate rotation
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setPrizeWon(randomPrize);
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
          <h2 className="text-2xl font-bold text-white">🎁 Weekly Prize Wheel</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
          >
            ✕
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
          <div className="text-2xl animate-spin">🎰</div>
          <div className="text-white font-semibold">
            Spins Remaining • <span className="text-nrl-green">{spinsRemaining}</span>
          </div>
        </div>

        {/* Prize Won Display */}
        {prizeWon && !isSpinning && (
          <div className="bg-nrl-green/20 border-2 border-nrl-green rounded-xl p-6 mb-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold text-white mb-1">YOU WON!</div>
            <div className="text-2xl mb-2">{prizeWon.icon}</div>
            <div className="text-lg font-semibold text-nrl-green mb-2">{prizeWon.name}</div>
            {prizeWon.sponsor && (
              <div className="text-xs text-nrl-text-muted">Sponsored by {prizeWon.sponsor}</div>
            )}
          </div>
        )}

        {/* Spin Button */}
        {spinsRemaining > 0 && (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
          </button>
        )}

        {spinsRemaining === 0 && (
          <div className="text-center text-nrl-text-secondary text-sm">
            ✓ All spins used this week
          </div>
        )}
      </div>
    </div>
  );
}

// Today's Activity Component
function TodaysActivity({ user, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Today's Activity</h3>
      
      <div className="space-y-4">
        {/* Refer a friend */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Refer a friend</div>
              <div className="text-xs text-nrl-text-secondary">Earn points for each referral</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>

        {/* Watch recent highlights */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Watch recent highlights</div>
              <div className="text-xs text-nrl-text-secondary">Top tries from this week</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>

        {/* Pick rival team */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Pick rival team</div>
              <div className="text-xs text-nrl-text-secondary">Compare stats vs your team</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>
      </div>
    </div>
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
                <span className={user?.dob ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.dob ? '✓' : '○'}
                </span>
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
                <span className={user?.gender ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.gender ? '✓' : '○'}
                </span>
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
                <span className={user?.homeGround ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.homeGround ? '✓' : '○'}
                </span>
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
                  <span className="text-nrl-text-muted">○</span>
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
