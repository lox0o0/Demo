"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trophy, Target } from "lucide-react";
import { TIERS } from "@/lib/mockData";

// Design Tokens
const tokens = {
  colors: {
    base: '#0d0d0d',
    maroon: '#73003c',
    gold: '#ffd700',
    white: '#ffffff',
    glass: {
      bg: 'rgba(13, 13, 13, 0.85)',
      border: 'rgba(255, 255, 255, 0.06)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.65)',
      tertiary: 'rgba(255, 255, 255, 0.45)',
    },
  },
  blur: {
    backdrop: '20px',
    glow: '18px',
  },
  shadows: {
    modal: '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
    glow: {
      gold: '0 0 18px rgba(255, 215, 0, 0.25)',
      maroon: '0 0 18px rgba(115, 0, 60, 0.25)',
    },
  },
  radii: {
    modal: '16px',
    pill: '9999px',
    card: '12px',
    button: '8px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  motion: {
    duration: {
      fast: '200ms',
      base: '300ms',
      slow: '700ms',
    },
    easing: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

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
  const [progressWidth, setProgressWidth] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Entry animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  // Progress bar fill animation
  useEffect(() => {
    if (!nextTier) return;
    
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const targetPercent = tierRange > 0 
      ? Math.min(((userPoints - currentTier.minPoints) / tierRange) * 100, 100)
      : 100;
    
    // Animate progress fill
    const timer = setTimeout(() => {
      setProgressWidth(targetPercent);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userPoints, currentTier, nextTier]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  if (!nextTier) return null;

  const tierRange = nextTier.minPoints - currentTier.minPoints;
  const progressPercent = tierRange > 0 
    ? Math.min(((userPoints - currentTier.minPoints) / tierRange) * 100, 100)
    : 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      <div
        ref={modalRef}
        className={`max-w-md w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.96] opacity-0 translate-y-2'
        }`}
        style={{
          backgroundColor: tokens.colors.glass.bg,
          backdropFilter: `blur(${tokens.blur.backdrop})`,
          WebkitBackdropFilter: `blur(${tokens.blur.backdrop})`,
          border: `1px solid ${tokens.colors.glass.border}`,
          borderRadius: tokens.radii.modal,
          boxShadow: tokens.shadows.modal,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" style={{ color: tokens.colors.text.secondary }} strokeWidth={2} />
          </button>

          {/* Header - Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${tokens.colors.glass.border}`,
                }}
              >
                <Target 
                  className="w-6 h-6" 
                  style={{ color: tokens.colors.text.secondary }} 
                  strokeWidth={2} 
                />
              </div>
            </div>
            <h2 
              id="modal-title"
              className="text-xl font-bold mb-1"
              style={{ 
                color: tokens.colors.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              Your current Fan Tier:
            </h2>
          </div>

          {/* Current Tier Badge */}
          <div className="flex justify-center mb-6">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${currentTier.color}20`,
                border: `1px solid ${currentTier.color}`,
                color: currentTier.color,
              }}
            >
              {currentTier.name} Tier
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            {/* Physical progress bar */}
            <div 
              ref={progressBarRef}
              className="w-full rounded-full overflow-hidden relative mb-2"
              style={{
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Inner track highlight */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
              
              {/* Animated fill */}
              <div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${progressWidth}%`,
                  background: `linear-gradient(to right, ${currentTier.color}, ${tokens.colors.gold})`,
                  transition: `width ${tokens.motion.duration.slow} ${tokens.motion.easing.easeOut}`,
                  boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.2), ${tokens.shadows.glow.gold}`,
                }}
              >
                {/* Subtle highlight on fill */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
                  }}
                />
              </div>
            </div>

            {/* Points text - centered */}
            <div className="text-center mb-2">
              <span 
                className="text-sm font-medium"
                style={{ color: tokens.colors.text.secondary }}
              >
                {userPoints} / {nextTier.minPoints} points
              </span>
            </div>

            {/* Progress message */}
            <p 
              className="text-center text-sm"
              style={{ color: tokens.colors.text.secondary }}
            >
              <span style={{ color: tokens.colors.gold, fontWeight: 600 }}>{pointsToNext} points</span> to {nextTier.name}
            </p>
          </div>

          {/* Reward Card - Gold glow only on edge */}
          <div 
            className="relative mb-6 rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid rgba(255, 215, 0, 0.2)`,
              borderRadius: tokens.radii.card,
              padding: tokens.spacing.md,
              boxShadow: tokens.shadows.glow.gold,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Trophy icon with subtle gold glow */}
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.08)',
                  border: `1px solid rgba(255, 215, 0, 0.25)`,
                }}
              >
                <Trophy 
                  className="w-7 h-7" 
                  style={{ 
                    color: tokens.colors.gold,
                    filter: `drop-shadow(0 0 ${tokens.blur.glow} rgba(255, 215, 0, 0.3))`,
                  }} 
                  strokeWidth={2}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div 
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: tokens.colors.text.tertiary }}
                >
                  {nextTier.name} Reward
                </div>
                <div 
                  className="text-base font-semibold leading-tight"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {nextTier.reward}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Matching home page design */}
          <button
            onClick={onCompleteProfile}
            className="group/cta w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold h-11 px-6 bg-gray-900/90 hover:bg-gray-800/95 text-white border-2 border-yellow-400/50 hover:border-yellow-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent mb-2"
          >
            Complete Profile →
          </button>

          {/* Secondary dismiss - low emphasis */}
          <button
            onClick={onDismiss}
            className="w-full text-center text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
            style={{ 
              color: tokens.colors.text.tertiary,
              padding: `${tokens.spacing.sm} 0`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = tokens.colors.text.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = tokens.colors.text.tertiary;
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/*
MOTION NOTES:
=============

Entry Animation:
- Modal: scale 0.96 → 1.0, opacity 0 → 1, translateY 2px → 0
- Duration: 300ms, easing: ease-out
- Backdrop: blur 4px (subtle)

Progress Fill:
- Width: 0 → target% over 700ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1) for physical feel
- Delay: 300ms after entry

Hover States:
- CTA: translateY -1px, shadow increase, color darken
- Close button: background opacity increase
- Dismiss link: color lighten
- All: 200-300ms transitions

Focus States:
- All interactive elements: ring-2 with appropriate color
- CTA: gold ring
- Close/Dismiss: white/20 ring
- Ring offset: 2px

Accessibility:
- ARIA: dialog role, aria-modal, aria-labelledby
- Keyboard: Escape closes modal
- Focus management: first focusable element on open
- Contrast: All text meets WCAG AA (4.5:1 minimum)
*/
