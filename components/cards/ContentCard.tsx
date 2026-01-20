"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, CircleDot, Video } from "lucide-react";

interface ContentCardProps {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: "default" | "gold" | "green";
  statusIndicator?: string;
  progressRing?: { current: number; total: number };
  progressPercent?: number;
  ctaButton?: string;
  ctaStyle?: "default" | "wide" | "centered" | "subtitle";
  completed?: boolean;
  onCardClick?: () => void;
  onCtaClick?: () => void;
}

export default function ContentCard({
  image,
  title,
  subtitle,
  badge,
  badgeColor = "default",
  statusIndicator,
  progressRing,
  progressPercent,
  ctaButton,
  ctaStyle = "default",
  completed = false,
  onCardClick,
  onCtaClick,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  const badgeColors = {
    default: "bg-[#1a1a1d] border-[#2a2a2d] text-white",
    gold: "bg-[#f59e0b] border-[#f59e0b] text-white",
    green: "bg-[#22c55e] border-[#22c55e] text-white",
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-500 ${
        completed 
          ? "opacity-75" 
          : ""
      }`}
      onClick={onCardClick}
    >
      {/* Glassmorphism Wrapper */}
      <div className="relative w-full h-full rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/10 shadow-glass hover:shadow-glass-strong transition-all duration-500 hover:scale-[1.02] hover:border-white/20 overflow-hidden">
        {/* Shine Sweep Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div 
            className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine-sweep transition-opacity duration-300"
            style={{
              width: '200%',
              height: '200%',
            }}
          />
        </div>
        {/* Background Image with padding and border */}
        <div className="relative aspect-video w-full p-3">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#1a1a1d]/50 backdrop-blur-sm border border-white/5">
          {!imageError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1d] to-[#0a0a0b] flex items-center justify-center">
              <Video size={32} className="text-white/40" strokeWidth={2} />
            </div>
          )}
          
          {/* Dark overlay across entire image (15-20% opacity, stronger if completed) */}
          <div className={`absolute inset-0 ${completed ? "bg-black/30" : "bg-black/18"}`} />
          
          {/* Strengthened Gradient Overlay - ensures bottom 40% is dark enough for white text */}
          {/* Starts at 70% opacity black at bottom, maintains 50%+ opacity through bottom 40% */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.65) 10%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 70%, transparent 100%)'
            }}
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Title and Badge Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-1">
            {completed && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/50">
                  <Check size={14} className="text-[#22c55e]" strokeWidth={3} />
                </div>
              </div>
            )}
            <h3 
              className={`text-lg font-bold flex-1 ${completed ? "text-white/70" : "text-white"}`}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {title}
            </h3>
          </div>
          {/* Badge with dark pill background */}
          {badge && (
            <div className="flex-shrink-0">
              <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                <div
                  className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${
                    badgeColors[badgeColor]
                  }`}
                >
                  {badge}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle - either as text or CTA box */}
        {ctaStyle === "subtitle" ? (
          <div className="w-full flex justify-center mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick?.();
              }}
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#f59e0b]/40 text-white text-sm font-semibold rounded-lg transition-all text-center shadow-[0_0_8px_rgba(245,158,11,0.3)] hover:shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:border-[#f59e0b]/60"
            >
              {subtitle}
            </button>
          </div>
        ) : (
          <p 
            className={`text-sm font-normal mb-2 ${completed ? "text-white/60" : "text-white"}`}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {subtitle}
          </p>
        )}
        
        {/* Status Indicator */}
        {statusIndicator && (
          <div className="flex items-center gap-2 mb-2">
            {statusIndicator.includes("✓") && (
              <Check size={14} className="text-[#22c55e]" strokeWidth={2} />
            )}
            <span className="text-xs text-white/80">{statusIndicator.replace("✓", "").trim()}</span>
          </div>
        )}
        
        {/* Progress Ring */}
        {progressRing && (
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-6 h-6">
              <svg className="transform -rotate-90 w-6 h-6" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#2a2a2d"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${(progressRing.current / progressRing.total) * 62.83} 62.83`}
                />
              </svg>
            </div>
            <span className="text-xs text-white/80">
              {progressRing.current}/{progressRing.total} complete
            </span>
          </div>
        )}
        
        {/* Progress Percent */}
        {progressPercent !== undefined && (
          <div className="mb-2">
            <div className="text-xs text-white/80 mb-1">{progressPercent}% complete</div>
            <div className="w-full h-1 bg-[#2a2a2d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#f59e0b] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
        
        {/* CTA Button - Centered with Glow Effect */}
        {ctaButton && ctaStyle !== "subtitle" && (
          <div className="w-full flex justify-center mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick?.();
              }}
              className={`relative w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-center overflow-hidden ${
                completed
                  ? "bg-[#1a1a1d]/60 border border-[#2a2a2d] text-white/70 hover:border-[#2a2a2d]/80"
                  : "bg-gradient-to-r from-[#1a1a1d] to-[#2a2a2d] border border-[#f59e0b]/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)] hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:border-[#f59e0b]/80 hover:scale-[1.02]"
              }`}
            >
              {/* Button Glow Effect */}
              {!completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/20 via-[#f59e0b]/40 to-[#f59e0b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
              )}
              <span className="relative z-10">{ctaButton}</span>
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
