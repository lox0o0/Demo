"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";

interface StatusBarProps {
  user: any;
}

export default function StatusBar({ user }: StatusBarProps) {
  const userPoints = user?.points || 0;
  const teamData = user?.teamData;
  
  // Calculate current tier and next tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];
  
  const nextTier = TIERS.find(t => t.minPoints > userPoints);
  const pointsToNext = nextTier ? nextTier.minPoints - userPoints : 0;
  const progressPercent = nextTier 
    ? Math.min(((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)
    : 100;

  return (
    <div className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-[#2a2a2d] mb-6">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Activity label with icon */}
        <div className="flex items-center gap-3">
          <div className="text-[#22c55e]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wider">Activity</span>
        </div>

        {/* Center: Avatar and Progress */}
        <div className="flex-1 flex items-center justify-center gap-4 mx-8">
          {/* Avatar */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#2a2a2d]">
            {teamData ? (
              <Image
                src={teamData.logoUrl}
                alt={teamData.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a1d] flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0) || "F"}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar - Floating Pill with Glass Effect */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">
                {userPoints} / {nextTier?.minPoints || currentTier.minPoints}
              </span>
            </div>
            {/* Floating Pill Container */}
            <div 
              className="w-full px-4 py-3 rounded-full backdrop-blur-md bg-white/5 border border-white/20"
              style={{
                filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0px 10px 25px)'
              }}
            >
              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-gray-700/50 rounded-full border border-gray-600/50 overflow-hidden relative">
                {/* Progress Fill with Gradient */}
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Shine Animation - Subtle shimmer */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      animation: 'shimmer 2s ease-in-out infinite',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="text-xs text-[#a1a1aa] mt-2 text-center">
              Points to {nextTier?.name || "Max"} Tier
            </div>
          </div>
        </div>

        {/* Right: Empty space for balance */}
        <div className="w-24" />
      </div>
    </div>
  );
}
