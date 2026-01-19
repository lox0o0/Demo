"use client";

import Image from "next/image";
import { useState } from "react";

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
      className="relative group cursor-pointer rounded-xl overflow-hidden border border-[#2a2a2d] hover:border-[#22c55e] transition-all duration-300 hover:scale-[1.02]"
      onClick={onCardClick}
    >
      {/* Background Image */}
      <div className="relative aspect-video w-full">
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
            <span className="text-4xl">📺</span>
          </div>
        )}
        
        {/* Gradient Overlay (bottom-heavy) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Title and Badge Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-white flex-1">{title}</h3>
          {/* Badge */}
          {badge && (
            <div
              className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                badgeColors[badgeColor]
              } ${badge.includes("🎰") ? "animate-pulse" : ""}`}
            >
              {badge}
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
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#2a2a2d] hover:border-[#22c55e] text-white text-sm font-semibold rounded-lg transition-colors text-center"
            >
              {subtitle}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#a1a1aa] mb-2">{subtitle}</p>
        )}
        
        {/* Status Indicator */}
        {statusIndicator && (
          <div className="flex items-center gap-2 mb-2">
            {statusIndicator.includes("✓") && (
              <span className="text-[#22c55e] text-sm">✓</span>
            )}
            <span className="text-xs text-white/80">{statusIndicator}</span>
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
        
        {/* CTA Button - Centered */}
        {ctaButton && ctaStyle !== "subtitle" && (
          <div className="w-full flex justify-center mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick?.();
              }}
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#2a2a2d] hover:border-[#22c55e] text-white text-sm font-semibold rounded-lg transition-colors text-center"
            >
              {ctaButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
