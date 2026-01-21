"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, Sparkles, X } from "lucide-react";
import Image from "next/image";

interface TierUpgradeCelebrationProps {
  oldTier: any;
  newTier: any;
  reward: string;
  startPoints?: number; // User's actual current points (e.g., 950)
  onDismiss: () => void;
  onViewRewards?: () => void;
}

export default function TierUpgradeCelebration({
  oldTier,
  newTier,
  reward,
  startPoints: userStartPoints,
  onDismiss,
  onViewRewards,
}: TierUpgradeCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showTierReveal, setShowTierReveal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  // Start from user's actual current points (e.g., 950) or old tier's minPoints as fallback
  const startPoints = userStartPoints ?? oldTier.minPoints;
  const [points, setPoints] = useState(startPoints);
  const targetPoints = newTier.minPoints;
  const confettiRef = useRef<HTMLCanvasElement>(null);

  // Entry animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setShowCelebration(true), 100);
    const timer2 = setTimeout(() => {
      setShowFireworks(true);
      setShowLevelUp(true);
      animatePoints();
    }, 300);
    const timer3 = setTimeout(() => setShowTierReveal(true), 1500);
    const timer4 = setTimeout(() => setShowReward(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Animate points counter: start from old tier, count up to new tier
  const animatePoints = () => {
    const duration = 2000; // 2 seconds
    const steps = 50;
    const pointsDiff = targetPoints - startPoints;
    const increment = pointsDiff / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newPoints = Math.min(
        Math.floor(startPoints + increment * currentStep),
        targetPoints
      );
      setPoints(newPoints);

      // Trigger fireworks when hitting target
      if (newPoints >= targetPoints) {
        clearInterval(interval);
        setPoints(targetPoints);
        // Fireworks already triggered, but ensure they're visible
      }
    }, stepDuration);
  };

  // Confetti animation
  useEffect(() => {
    if (!showFireworks || !confettiRef.current) return;

    const canvas = confettiRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }> = [];

    // Create confetti particles
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Remove particles that are off screen
        if (particle.y > canvas.height + 10) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showFireworks]);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {/* Confetti Canvas */}
      <canvas
        ref={confettiRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Screen Flash Effect */}
      {showFireworks && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
            animation: 'flash 0.3s ease-out',
            zIndex: 2,
          }}
        />
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 max-w-md w-full mx-4 transform transition-all duration-500 ${
          showCelebration ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(13, 13, 13, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white/70" strokeWidth={2} />
        </button>

        {/* Points Counter - Minimal */}
        <div className="text-center mb-4">
          <div
            className="text-3xl font-black mb-1"
            style={{
              color: '#ffd700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            }}
          >
            {points.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">points</div>
        </div>

        {/* Congratulations Message - Minimal */}
        {showLevelUp && (
          <div
            className={`text-center mb-4 transform transition-all duration-500 ${
              showLevelUp ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            <h1
              id="celebration-title"
              className="text-xl font-bold"
              style={{
                color: '#ffffff',
              }}
            >
              Congratulations you've hit Fan Tier: {newTier.name}
            </h1>
          </div>
        )}

        {/* Tier Reveal - Minimal */}
        {showTierReveal && (
          <div
            className={`text-center mb-5 transform transition-all duration-500 ${
              showTierReveal ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-2'
            }`}
          >
            {/* Tier Badge */}
            <div className="mb-3">
              <div
                className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider inline-block"
                style={{
                  backgroundColor: `${newTier.color}20`,
                  border: `1px solid ${newTier.color}`,
                  color: newTier.color,
                }}
              >
                {newTier.name} Tier
              </div>
            </div>
            <p className="text-base font-semibold text-white/90">Welcome to {newTier.name} Tier!</p>
          </div>
        )}

        {/* Reward Reveal - Minimal */}
        {showReward && (
          <div
            className={`text-center mb-5 transform transition-all duration-500 ${
              showReward ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white/60" strokeWidth={2} />
              <p className="text-sm font-semibold text-white/80">
                You WON:
              </p>
            </div>

            {/* Reward Icon - Smaller */}
            <div className="mb-3">
              <div
                className="w-20 h-20 mx-auto rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <Trophy
                  className="w-10 h-10"
                  style={{
                    color: '#ffd700',
                  }}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Reward Text */}
            <div
              className="text-base font-bold mb-4"
              style={{
                color: '#ffd700',
              }}
            >
              {reward}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              {onViewRewards && (
                <button
                  onClick={onViewRewards}
                  className="group/cta w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold h-11 px-6 bg-gray-900/90 hover:bg-gray-800/95 text-white border-2 border-yellow-400/50 hover:border-yellow-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  View in Locker Room
                </button>
              )}
              <button
                onClick={onDismiss}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
