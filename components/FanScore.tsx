"use client";

import { TIERS } from "@/lib/mockData";
import { Trophy } from "lucide-react";

interface FanScoreProps {
  user: any;
}

export default function FanScore({ user }: FanScoreProps) {
  const userPoints = user?.points || 0;
  const maxTier = TIERS[TIERS.length - 1];
  
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  // Check if user is at max tier
  const isMaxTier = currentTier.name === maxTier.name && userPoints >= maxTier.minPoints;
  
  const nextTier = isMaxTier 
    ? null 
    : TIERS.find((t) => t.minPoints > userPoints);
  
  // Handle max tier case
  const pointsToNext = isMaxTier ? 0 : (nextTier ? nextTier.minPoints - userPoints : 0);
  
  // Calculate progress relative to current tier and next tier
  const progressPercent = isMaxTier 
    ? 100 
    : nextTier 
      ? (() => {
          const tierRange = nextTier.minPoints - currentTier.minPoints;
          // Prevent division by zero if tiers have same minPoints
          if (tierRange <= 0) return 100;
          return Math.min(((userPoints - currentTier.minPoints) / tierRange) * 100, 100);
        })()
      : 100;

  const teamData = user?.teamData;
  const teamColors = teamData 
    ? { primary: teamData.primaryColor, secondary: teamData.secondaryColor }
    : { primary: "#00A651", secondary: "#FFB800" };

  return (
    <div 
      className="bg-nrl-dark-card rounded-2xl p-8 relative overflow-hidden border border-nrl-border-light"
      style={{
        background: `linear-gradient(135deg, ${teamColors.primary}08 0%, ${teamColors.secondary}08 100%)`,
      }}
    >
      {/* Decorative gradient overlay */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: teamColors.primary }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-nrl-text-secondary uppercase tracking-wider mb-2">Fan Score</h2>
            <div className="text-6xl font-black bg-gradient-to-r from-nrl-green to-nrl-amber bg-clip-text text-transparent">
              {user?.points || 0}
            </div>
          </div>
          <div className="text-right">
            <div 
              className="inline-block px-5 py-3 rounded-xl font-bold text-sm shadow-lg border-2"
              style={{
                background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`,
                borderColor: teamColors.secondary,
              }}
            >
              {currentTier.name}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-3">
            {isMaxTier ? (
              <>
                <span className="flex items-center gap-1 text-nrl-text-secondary font-medium">
                  <Trophy size={14} className="text-white/60" strokeWidth={2} />
                  Maximum tier achieved!
                </span>
                <span className="text-nrl-amber font-semibold">{currentTier.reward}</span>
              </>
            ) : nextTier ? (
              <>
                <span className="text-nrl-text-secondary font-medium">{pointsToNext} pts to {nextTier.name}</span>
                <span className="text-nrl-amber font-semibold">{nextTier.reward}</span>
              </>
            ) : (
              <>
                <span className="text-nrl-text-secondary font-medium">Progress complete</span>
                <span className="text-nrl-amber font-semibold">{currentTier.reward}</span>
              </>
            )}
          </div>
          <div className="w-full bg-nrl-dark-hover rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ 
                width: `${Math.min(progressPercent, 100)}%`,
                background: `linear-gradient(90deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`,
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-nrl-border-light">
          <div>
            <div className="text-xs text-nrl-text-secondary uppercase tracking-wider mb-1">Lifetime Points</div>
            <div className="text-2xl font-bold text-nrl-text-primary">{user?.lifetimePoints || 0}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-nrl-text-secondary uppercase tracking-wider mb-1">Member Since</div>
            <div className="text-2xl font-bold text-nrl-text-primary">{user?.memberSince || new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
