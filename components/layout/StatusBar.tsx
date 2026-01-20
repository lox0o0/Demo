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
    <div className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/20 shadow-xl mb-6">
      <div className="flex items-center justify-center px-6 py-4">
        {/* Center: Logo and Progress Bar */}
        <div className="flex items-center gap-4">
          {/* Broncos Logo in White Outlined Rectangle */}
          {teamData && (
            <div className="relative w-12 h-12 rounded-lg border-2 border-white/30 overflow-hidden bg-white/5 backdrop-blur-sm flex items-center justify-center">
              <Image
                src={teamData.logoUrl}
                alt={teamData.name}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          {/* Progress Bar - Floating Pill with Glass Effect */}
          <div className="flex flex-col items-center gap-2">
            {/* Floating Pill Container */}
            <div 
              className="bg-transparent backdrop-blur-md border border-white/20 rounded-full py-[8px] px-4"
              style={{
                filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0px 10px 25px)'
              }}
            >
              {/* Progress Bar Track */}
              <div className="flex-1 relative bg-gray-700/50 rounded-full h-4 overflow-hidden border border-gray-600/50 min-w-[240px]">
                {/* Progress Fill with Gradient */}
                <div
                  className="bg-gradient-to-r from-green-500 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Shine Animation Inside Progress Fill */}
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
            {/* Points to Tier Text */}
            <div className="text-xs text-white/80 text-center">
              {pointsToNext > 0 ? (
                <span>{pointsToNext} points to {nextTier?.name || "Max"} Tier</span>
              ) : (
                <span>Max tier reached</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
