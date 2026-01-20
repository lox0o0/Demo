"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Social Media Logo URLs - using local files from public/social-logos/
export const SOCIAL_LOGOS = {
  facebook: "/social-logos/facebook.png",
  tiktok: "/social-logos/tiktok.png",
  instagram: "/social-logos/instagram.png",
  x: "/social-logos/x.png",
};

// Auth Provider Logos - using files from auth-logos folder
export const AUTH_LOGOS = {
  google: "/auth-logos/google.svg",
  apple: "/auth-logos/apple.jpg",
};

// Auth Icon Component for Google and Apple
export const AuthIcon = ({ provider, size = 24 }: { provider: "google" | "apple"; size?: number }) => {
  const logoUrl = AUTH_LOGOS[provider];
  const [imgSrc, setImgSrc] = useState(logoUrl);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (logoUrl) {
      setImgSrc(logoUrl);
      setHasError(false);
    }
  }, [logoUrl]);
  
  if (!logoUrl || hasError) {
    // Fallback to text/emoji if logo not found
    return (
      <span className="text-lg font-semibold text-nrl-text-primary">
        {provider === "google" ? "G" : "🍎"}
      </span>
    );
  }
  
  return (
    <div 
      className="relative flex items-center justify-center" 
      style={{ 
        width: size, 
        height: size, 
        minWidth: size, 
        minHeight: size,
        backgroundColor: provider === "apple" ? "#262626" : undefined, // Match neutral-800 (#262626)
      }}
    >
      <Image
        src={imgSrc}
        alt={`${provider} logo`}
        width={size}
        height={size}
        className="object-contain w-full h-full"
        unoptimized
        onError={() => {
          setHasError(true);
        }}
      />
    </div>
  );
};

// Navigation Icons - text-only labels (like official NRL site)
export const NavIcon = ({ type }: { type: string }) => {
  const icons: Record<string, string> = {
    latest: "LATEST",
    home: "HOME",
    dashboard: "DASHBOARD",
    stats: "STATS",
    fantasy: "FANTASY",
    tipping: "TIP",
    lockerroom: "PROFILE",
    shop: "SHOP",
    tickets: "TICKETS",
    memberships: "MEMBER",
    social: "SOCIAL",
  };
  
  return (
    <span className="text-[11px] font-bold uppercase tracking-wider leading-none">
      {icons[type] || type.toUpperCase()}
    </span>
  );
};

// Social Media Icon Component - optimized for professional display matching reference style
export const SocialIcon = ({ platform, size = 32, className = "" }: { platform: string; size?: number; className?: string }) => {
  const logoUrl = SOCIAL_LOGOS[platform as keyof typeof SOCIAL_LOGOS];
  const [imgSrc, setImgSrc] = useState(logoUrl);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (logoUrl) {
      setImgSrc(logoUrl);
      setHasError(false);
    }
  }, [logoUrl]);
  
  if (!logoUrl) {
    // Fallback to text if logo not found
    return (
      <span className="text-xs font-semibold uppercase text-nrl-text-primary">
        {platform}
      </span>
    );
  }
  
  // Calculate icon size based on container size (approximately 50% of container)
  const iconSize = Math.round(size * 0.5);
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {!hasError ? (
        <Image
          src={imgSrc}
          alt={`${platform} logo`}
          width={iconSize}
          height={iconSize}
          className="object-contain"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          unoptimized
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        <span className="text-xs font-semibold uppercase text-white">
          {platform.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};
