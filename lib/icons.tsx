"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Social Media Logo URLs - using local files from public/social-logos/
export const SOCIAL_LOGOS = {
  facebook: "/social-logos/facebook.png",
  tiktok: "/social-logos/tiktok.svg", // or .png
  instagram: "/social-logos/instagram.png",
  x: "/social-logos/x.svg", // or .png
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
