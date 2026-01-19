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

// Auth Provider Logos - using files from social-logos folder
export const AUTH_LOGOS = {
  google: "/social-logos/Google__G__logo.svg",
  apple: "/social-logos/apple.jpg",
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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
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

// Social Media Icon Component - optimized for professional display like Strava/NBA/NFL
export const SocialIcon = ({ platform, size = 32 }: { platform: string; size?: number }) => {
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
  
  // Platform-specific styling for better visibility
  const platformStyles: Record<string, { bg?: string; padding?: string }> = {
    instagram: { bg: "bg-white/10", padding: "p-1" }, // Instagram needs background for visibility
    facebook: { bg: "bg-white/5", padding: "p-0.5" },
    tiktok: { bg: "bg-white/5", padding: "p-0.5" },
    x: { bg: "bg-white/5", padding: "p-0.5" },
  };
  
  const styles = platformStyles[platform] || {};
  
  return (
    <div 
      className={`relative flex items-center justify-center ${styles.bg || ""} rounded ${styles.padding || ""}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {!hasError ? (
        <Image
          src={imgSrc}
          alt={`${platform} logo`}
          width={size}
          height={size}
          className="object-contain w-full h-full"
          unoptimized
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        <span className="text-xs font-semibold uppercase text-nrl-text-primary">
          {platform.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};
