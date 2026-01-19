"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";

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
      case "Bronze":
        return "border-[#cd7f32] border-[3px]";
      case "Silver":
        return "border-[#c0c0c0] border-[3px]";
      case "Gold":
        return "border-[#ffd700] border-[3px] shadow-[0_0_10px_rgba(255,215,0,0.3)]";
      case "Diehard":
        return "border-[#ef4444] border-[4px] animate-shimmer";
      case "Legend":
        return "border-[#8b5cf6] border-[4px] animate-shimmer";
      default:
        return "border-[#2a2a2d] border";
    }
  };

  // Filter tiers for progress bar (exclude Rookie if user is above it)
  const visibleTiers = TIERS.filter(t => t.name !== "Rookie" || userPoints < 250);
  const reversedTiers = [...visibleTiers].reverse();

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
          <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
            🏆 {currentTier.name.toUpperCase()}
          </div>
        </div>

        {/* Vertical Progress Bar */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-4">
            YOUR FAN JOURNEY
          </div>
          
          <div className="relative">
            {/* Vertical track line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2a2a2d] via-[#f59e0b] to-[#8b5cf6]" />
            
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
                    
                    {/* Legend tier special callout */}
                    {isLegend && isUnlocked && (
                      <div className="mt-2 p-2 bg-[#1a1a1d] border border-[#2a2a2d] rounded text-xs">
                        <div className="text-[#f59e0b] font-semibold mb-1">🎁 Grand Final Pack</div>
                        <div className="text-[#a1a1aa]">Flights + Tix + Hotel</div>
                      </div>
                    )}
                    
                    {/* Current position indicator */}
                    {isCurrentTier && (
                      <div className="mt-2 p-2 bg-[#1a1a1d] border border-[#22c55e] rounded text-xs">
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
            <div className="text-lg font-semibold text-[#f59e0b]">
              🔥 {user?.streak || 0} {user?.streak === 1 ? "week" : "weeks"}
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
