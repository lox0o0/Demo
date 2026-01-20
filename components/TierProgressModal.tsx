"use client";

import { useState, useEffect } from "react";
import { X, Trophy, Target } from "lucide-react";
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
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
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
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden relative mb-3" style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' }}>
            <div
              className="h-4 rounded-full transition-all duration-500 relative"
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                background: `linear-gradient(to right, ${currentTier.color}, ${nextTier.color || '#C0C0C0'})`,
                boxShadow: `0 0 20px ${currentTier.color}60, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
          <div className="text-center mb-2">
            <span className="text-white/90 font-semibold text-sm">
              {userPoints} / {nextTier.minPoints} points
            </span>
          </div>
          <p className="text-center text-white/90 font-semibold">
            Just <span className="text-emerald-400 font-bold">{pointsToNext} points</span> away from <span className="font-bold" style={{ color: nextTier.color || '#C0C0C0' }}>{nextTier.name.toUpperCase()}</span> tier!
          </p>
        </div>

        {/* Next Tier Reward Preview - Enhanced with gold glow */}
        <div 
          className="glass rounded-xl p-5 mb-6 border-2 relative overflow-hidden"
          style={{
            borderColor: '#FFD70080',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 40px rgba(255, 215, 0, 0.15)',
          }}
        >
          {/* Animated gold glow effect */}
          <div 
            className="absolute inset-0 opacity-40 animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.5) 0%, transparent 70%)',
            }}
          />
          
          <div className="relative z-10">
            <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3 text-center flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">{nextTier.name} Reward</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div 
                className="w-20 h-20 rounded-xl bg-white/10 border-2 flex items-center justify-center relative"
                style={{
                  borderColor: '#FFD700',
                  boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), inset 0 0 30px rgba(255, 215, 0, 0.3)',
                }}
              >
                <Trophy 
                  className="w-10 h-10 animate-pulse text-yellow-400" 
                  style={{ 
                    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))',
                  }} 
                />
                {/* Sparkle effect */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <div 
                  className="font-black text-white text-base leading-tight"
                  style={{
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
                  }}
                >
                  {nextTier.reward}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Matching home page style */}
        <button
          onClick={onCompleteProfile}
          className="group/cta w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold h-11 px-6 bg-gray-900/90 hover:bg-gray-800/95 text-white border-2 border-yellow-400/50 hover:border-yellow-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 mb-3"
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
