"use client";

import Image from "next/image";

// Social Media Logo URLs (official brand assets - high quality)
export const SOCIAL_LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
  tiktok: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
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

// Social Media Icon Component - using official brand logos
export const SocialIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
  const logoUrl = SOCIAL_LOGOS[platform as keyof typeof SOCIAL_LOGOS];
  
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
      <Image
        src={logoUrl}
        alt={`${platform} logo`}
        width={size}
        height={size}
        className="object-contain w-full h-full"
        unoptimized
      />
    </div>
  );
};
