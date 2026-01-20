"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Gem } from "lucide-react";

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
    <div className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/20 shadow-xl mb-6">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Activity label with icon */}
        <div className="flex items-center gap-3">
          <div 
            className="text-green-500 transition-transform duration-300 hover:scale-110"
            style={{
              filter: "drop-shadow(rgba(255, 255, 255, 0.6) 0px 0px 8px) drop-shadow(rgba(34, 197, 94, 0.8) 0px 0px 16px) drop-shadow(rgba(34, 197, 94, 0.4) 0px 0px 24px)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wider">Activity</span>
        </div>

        {/* Center: Avatar and Progress */}
        <div className="flex-1 flex items-center justify-center gap-4 mx-8">
          {/* Avatar with Glass Effect and Glow */}
          <div 
            className="relative w-8 h-8 rounded-full overflow-hidden border border-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 backdrop-blur-sm bg-white/5"
            style={{
              boxShadow: "rgba(34, 197, 94, 0.5) 0px 4px 14px 0px"
            }}
          >
            {teamData ? (
              <Image
                src={teamData.logoUrl}
                alt={teamData.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0) || "F"}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar - Floating Pill with Glass Effect */}
          <div className="flex-1 max-w-md">
            {/* Floating Pill Container */}
            <div 
              className="bg-transparent backdrop-blur-md border border-white/20 rounded-full py-[8px] px-4 mx-auto relative w-full max-w-[250px]"
              style={{
                filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0px 10px 25px)'
              }}
            >
              <div className="flex items-center gap-3">
                {/* Current Points with Gem Icon */}
                <div className="flex items-center gap-1 text-xs text-white font-medium whitespace-nowrap">
                  <span>{userPoints}</span>
                  <Gem className="w-3 h-3 text-yellow-400" />
                </div>

                {/* Progress Bar Track */}
                <div className="flex-1 relative bg-gray-700/50 rounded-full h-4 overflow-hidden border border-gray-600/50 min-w-[120px] max-w-[160px]">
                  {/* Progress Fill with Purple-Cyan Gradient */}
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {/* Shine Animation Inside Progress Fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Target Points with Gem Icon */}
                <div className="flex items-center gap-1 text-xs text-white font-medium whitespace-nowrap">
                  <span>{nextTier?.minPoints || currentTier.minPoints}</span>
                  <Gem className="w-3 h-3 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Empty space for balance */}
        <div className="w-24" />
      </div>
    </div>
  );
}
