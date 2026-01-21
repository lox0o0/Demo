"use client";

import Image from "next/image";
import { useState } from "react";

interface SponsorActivityCardProps {
  image: string;
  title: string;
  description: string;
  benefit: string;
  availability: string;
  ctaText: string;
  points: string;
  onCtaClick?: () => void;
}

export default function SponsorActivityCard({
  image,
  title,
  description,
  benefit,
  availability,
  ctaText,
  points,
  onCtaClick,
}: SponsorActivityCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-2 bg-gradient-to-br from-white/20 to-white/10 rounded-lg backdrop-blur-sm border border-white/30 group hover:scale-105 transition-transform duration-500 ease-out">
      <div className="rounded-lg text-card-foreground shadow-sm relative border-0 cursor-pointer h-80 bg-transparent overflow-visible">
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
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1d] to-[#0a0a0b]"></div>
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

          {/* Card Content */}
          <div className="relative h-full flex flex-col p-4">
            {/* Top - Points Badge */}
            <div className="h-12 mb-auto flex justify-end">
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold bg-[#f59e0b] backdrop-blur-md text-white border border-[#f59e0b] text-xs">
                {points}
              </div>
            </div>

            {/* Bottom content */}
            <div className="mt-auto space-y-3">
              {/* Title */}
              <h3 className="text-white font-bold text-lg leading-tight uppercase">
                {title}
              </h3>

              {/* Description */}
              <p className="text-white/90 text-xs leading-relaxed">
                {description}
              </p>

              {/* Benefit */}
              <div className="space-y-1">
                <p className="text-white/80 text-xs">
                  <span className="font-semibold">You get:</span> {benefit}
                </p>
                <p className="text-white/80 text-xs">
                  <span className="font-semibold">{availability.includes('Ends') ? 'Ends:' : 'Available:'}</span> {availability.replace(/^(Ends:|Available:)\s*/, '')}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick?.();
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold h-9 rounded-md px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md w-full shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.7)] transition-all duration-300"
              >
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
