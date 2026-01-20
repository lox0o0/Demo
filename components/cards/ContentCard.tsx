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
  backgroundSize?: string; // Optional custom background size
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
  backgroundSize,
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

          {/* Background Image */}
          {!imageError ? (
            <div 
              className="absolute inset-0 bg-center"
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundSize: backgroundSize || 'cover',
                backgroundRepeat: 'no-repeat',
              }}
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
