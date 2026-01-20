"use client";

import { useState, useEffect } from "react";
import { X, Trophy } from "lucide-react";
import { TIERS } from "@/lib/mockData";

interface TierProgressModalProps {
  userPoints: number;
  currentTier: any;
  nextTier: any;
  pointsToNext: number;
  onDismiss: () => void;
  onCompleteProfile: () => void;
}

export default function TierProgressModal({
  userPoints,
  currentTier,
  nextTier,
  pointsToNext,
  onDismiss,
  onCompleteProfile,
}: TierProgressModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!nextTier) return null;

  // Calculate progress percentage, handle edge cases
  const tierRange = nextTier.minPoints - currentTier.minPoints;
  const progressPercent = tierRange > 0 
    ? Math.min(((userPoints - currentTier.minPoints) / tierRange) * 100, 100)
    : 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onDismiss}
    >
      <div
        className={`glass-strong rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 60px rgba(251, 191, 36, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎯</div>
          <h2 className="text-2xl font-black text-white mb-2">You're almost there!</h2>
        </div>

        {/* Current Tier Badge */}
        <div className="flex justify-center mb-6">
          <div
            className="px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider"
            style={{
              backgroundColor: `${currentTier.color}33`,
              borderColor: currentTier.color,
              borderWidth: '2px',
              borderStyle: 'solid',
              color: currentTier.color,
              boxShadow: `0 0 20px ${currentTier.color}40`,
            }}
          >
            {currentTier.name} Tier
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70 font-medium">{userPoints} points</span>
            <span className="text-white/70 font-medium">{nextTier.minPoints} points</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500 relative"
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                background: `linear-gradient(to right, ${currentTier.color}, ${nextTier.color || '#C0C0C0'})`,
                boxShadow: `0 0 20px ${currentTier.color}60`,
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
          <p className="text-center mt-3 text-white/90 font-semibold">
            Just <span className="text-emerald-400 font-bold">{pointsToNext} points</span> away from <span className="font-bold" style={{ color: nextTier.color || '#C0C0C0' }}>{nextTier.name.toUpperCase()}</span> tier!
          </p>
        </div>

        {/* Next Tier Reward Preview */}
        <div className="glass rounded-xl p-4 mb-6 border border-white/10">
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 text-center">
            {nextTier.name} Reward
          </div>
          <div className="flex items-center justify-center gap-3">
            <div 
              className="w-16 h-16 rounded-lg bg-white/5 border flex items-center justify-center"
              style={{
                borderColor: `${nextTier.color || '#C0C0C0'}40`,
                boxShadow: `0 0 20px ${nextTier.color || '#C0C0C0'}30`,
              }}
            >
              <Trophy className="w-8 h-8" style={{ color: nextTier.color || '#C0C0C0' }} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm">{nextTier.reward}</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCompleteProfile}
          className="w-full py-3.5 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-3"
          style={{
            backgroundColor: '#00A651',
            boxShadow: '0 4px 20px rgba(0, 166, 81, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 166, 81, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 166, 81, 0.4)';
          }}
        >
          Complete Profile →
        </button>

        {/* Dismiss link */}
        <button
          onClick={onDismiss}
          className="w-full text-center text-sm text-white/50 hover:text-white/70 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
