"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Social Media Logo URLs (official brand assets - verified working URLs)
export const SOCIAL_LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
  tiktok: "https://upload.wikimedia.org/wikipedia/commons/a/a7/TikTok_logo.svg",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  x: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_original.svg",
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

// Social Media Icon Component - using official brand logos with error handling
export const SocialIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
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
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
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
            // Fallback to text if image fails
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
