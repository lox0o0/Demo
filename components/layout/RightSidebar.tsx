"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Flame } from "lucide-react";

interface RightSidebarProps {
  user: any;
}

export default function RightSidebar({ user }: RightSidebarProps) {
  const userPoints = user?.points || 0;
  const teamData = user?.teamData;
  
  // Calculate current tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  // Get tier color and border style
  const getTierBorderStyle = () => {
    switch (currentTier.name) {
      case "Rookie":
        return "border-[#2a2a2d] border";
      case "Bronze":
        return "border-[#cd7f32] border-[3px]";
      case "Silver":
        return "border-[#c0c0c0] border-[3px]";
      case "Gold":
        return "border-[#ffd700] border-[3px] shadow-[0_0_10px_rgba(255,215,0,0.3)]";
      case "Diehard":
        return "border-[4px] animate-shimmer-border border-[#ef4444]";
      case "Legend":
        return "border-[4px] animate-shimmer-legend border-[#8b5cf6]";
      default:
        return "border-[#2a2a2d] border";
    }
  };

  // Filter tiers for progress bar (exclude Rookie if user is above it)
  const visibleTiers = TIERS.filter(t => t.name !== "Rookie" || userPoints < 250);
  const reversedTiers = [...visibleTiers].reverse();
  
  // Calculate progress fill height based on user's position between tiers
  const calculateFillHeight = () => {
    if (reversedTiers.length === 0) return 0;
    
    // Find current tier and next tier
    const currentIndex = reversedTiers.findIndex(t => t.name === currentTier.name);
    if (currentIndex === -1) return 0;
    
    const currentTierData = reversedTiers[currentIndex];
    const nextTierData = reversedTiers[currentIndex - 1]; // Next tier is above (lower index)
    
    // Calculate progress within current tier
    let progressInTier = 0;
    if (nextTierData) {
      const tierRange = nextTierData.minPoints - currentTierData.minPoints;
      const pointsInTier = userPoints - currentTierData.minPoints;
      progressInTier = tierRange > 0 ? Math.min(pointsInTier / tierRange, 1) : 1;
    } else {
      // At max tier, show full
      progressInTier = 1;
    }
    
    // Calculate fill: completed tiers + progress in current tier
    const completedTiers = currentIndex;
    const tierSpacing = 32; // space-y-8 = 2rem = 32px
    const baseHeight = completedTiers * tierSpacing;
    const currentTierProgress = progressInTier * tierSpacing;
    
    return baseHeight + currentTierProgress;
  };
  
  const filledHeight = calculateFillHeight();

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[280px] bg-[#0a0a0b] border-l border-[#2a2a2d] z-50 overflow-y-auto">
      <div className="p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className={`relative w-20 h-20 mx-auto rounded-full ${getTierBorderStyle()} p-1 mb-3`}>
            {teamData ? (
              <div className="w-full h-full rounded-full bg-[#1a1a1d] flex items-center justify-center overflow-hidden">
                <Image
                  src={teamData.logoUrl}
                  alt={teamData.name}
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-[#1a1a1d] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || "F"}
                </span>
              </div>
            )}
          </div>
          <div className="text-white font-semibold mb-1">{user?.name || "Fan"}</div>
          <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            <Trophy size={12} className="text-white/60" strokeWidth={2} />
            <span>{currentTier.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Vertical Progress Bar */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-4">
            YOUR FAN JOURNEY
          </div>
          
          <div className="relative">
            {/* Vertical track line (background) */}
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2a2a2d] via-[#f59e0b] to-[#8b5cf6]" />
            
            {/* Filled progress gradient up to current position */}
            {filledHeight > 0 && (
              <div 
                className="absolute left-[20px] bottom-0 w-[2px] bg-gradient-to-t from-[#22c55e] via-[#f59e0b] to-[#8b5cf6] transition-all duration-1000"
                style={{ height: `${filledHeight}px` }}
              />
            )}
            
            {/* Tier markers */}
            <div className="relative space-y-8">
              {reversedTiers.map((tier, idx) => {
                const isCurrentTier = tier.name === currentTier.name;
                const isUnlocked = userPoints >= tier.minPoints;
                const isLegend = tier.name === "Legend";
                
                return (
                  <div key={tier.name} className="relative pl-10">
                    {/* Diamond marker */}
                    <div
                      className={`absolute left-[14px] w-4 h-4 transform rotate-45 ${
                        isUnlocked ? "bg-[#22c55e]" : "bg-[#2a2a2d]"
                      } ${isCurrentTier ? "ring-2 ring-[#22c55e] ring-offset-2 ring-offset-[#0a0a0b]" : ""}`}
                    />
                    
                    {/* Tier label */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isUnlocked ? "text-white" : "text-[#a1a1aa]"}`}>
                        {isUnlocked ? "◆" : "◇"} {tier.name.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#a1a1aa]">{tier.minPoints.toLocaleString()}</span>
                    </div>
                    
                    {/* Reward preview icon at tier marker */}
                    <div className="absolute left-[16px] top-[-4px] w-4 h-4 flex items-center justify-center">
                      {tier.name === "Bronze" && <Award size={12} className="text-white/60" strokeWidth={2} />}
                      {tier.name === "Silver" && <Award size={12} className="text-white/60" strokeWidth={2} />}
                      {tier.name === "Gold" && <Shirt size={12} className="text-white/60" strokeWidth={2} />}
                      {tier.name === "Platinum" && <Ticket size={12} className="text-white/60" strokeWidth={2} />}
                      {tier.name === "Diehard" && <Star size={12} className="text-white/60" strokeWidth={2} />}
                      {tier.name === "Legend" && <Trophy size={12} className="text-white/60" strokeWidth={2} />}
                    </div>
                    
                    {/* Legend tier special callout - Enhanced */}
                    {isLegend && (
                      <div className="mt-2 p-3 bg-gradient-to-br from-[#f59e0b]/20 to-[#8b5cf6]/20 border-2 border-[#f59e0b]/50 rounded-lg text-xs relative overflow-hidden">
                        {/* Golden glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/10 to-transparent" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy size={16} className="text-[#f59e0b]" strokeWidth={2} />
                            <span className="text-[#f59e0b] font-bold">Grand Final Pack</span>
                          </div>
                          <div className="text-[#a1a1aa] text-[10px] leading-tight">
                            Flights + Tix + Hotel
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Current position indicator */}
                    {isCurrentTier && (
                      <div className="mt-2 p-2 bg-[#1a1a1d] border-2 border-[#22c55e] rounded text-xs animate-pulse-glow">
                        <div className="text-[#22c55e] font-semibold mb-1">▲ YOU ARE HERE</div>
                        <div className="text-white font-bold">{userPoints.toLocaleString()} pts</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 pt-4 border-t border-[#2a2a2d]">
          <div>
            <div className="text-xs text-[#a1a1aa] mb-1">Overall Points</div>
            <div className="text-2xl font-bold text-white">{userPoints.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] mb-1">Current Streak</div>
            <div className="flex items-center gap-1 text-lg font-semibold text-[#f59e0b]">
              <Flame size={18} className="text-[#f59e0b]" strokeWidth={2} />
              <span>{user?.streak || 0} {user?.streak === 1 ? "week" : "weeks"}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-[#a1a1aa] mb-1">Leaderboard Position</div>
            <div className="text-lg font-semibold text-white">#847 overall</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
