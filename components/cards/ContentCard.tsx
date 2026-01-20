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
      className={`p-2 bg-gradient-to-br from-white/20 to-white/10 rounded-lg backdrop-blur-sm border border-white/30 group hover:scale-105 transition-transform duration-500 ease-out ${
        completed ? "opacity-75" : ""
      }`}
      onClick={onCardClick}
    >
      {/* Inner Card Container */}
      <div className="rounded-lg text-card-foreground shadow-sm relative border-0 cursor-pointer h-80 bg-transparent overflow-visible">
        {/* Content Wrapper */}
        <div className="p-0 h-full relative overflow-hidden rounded-lg">
          {/* Hover Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-pulse"></div>
          </div>

          {/* Background Image with Zoom */}
          {!imageError ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1d] to-[#0a0a0b] flex items-center justify-center">
              <Video size={32} className="text-white/40" strokeWidth={2} />
            </div>
          )}
          {/* Hidden image for error detection */}
          {!imageError && (
            <Image
              src={image}
              alt={title}
              fill
              className="opacity-0 pointer-events-none"
              onError={() => setImageError(true)}
              unoptimized
            />
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>

          {/* Card Content Layout */}
          <div className="relative h-full flex flex-col p-4">
            {/* Top icon area */}
            <div className="h-12 mb-auto">
              {badge && (
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs">
                  {badge}
                </div>
              )}
            </div>

            {/* Bottom content */}
            <div className="mt-auto space-y-2">
              {/* Card Title */}
              <h3 className="text-white font-bold text-xl leading-tight">
                {title}
              </h3>

              {/* Card Subtitle */}
              {ctaStyle !== "subtitle" && (
                <p className="text-white/80 text-xs leading-relaxed">
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
        
              {/* Card Button with Glow */}
              {ctaButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCtaClick?.();
                  }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold h-9 rounded-md px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md w-full shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.7)] transition-all duration-300"
                >
                  {ctaButton}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
