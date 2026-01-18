"use client";

import Image from "next/image";

// Social Media Logo URLs (official brand assets from Wikimedia)
export const SOCIAL_LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
  tiktok: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  x: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023.svg",
};

// Navigation Icons - using simple SVG paths or text labels
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
    <span className="text-xs font-bold uppercase tracking-tight">
      {icons[type] || type}
    </span>
  );
};

// Social Media Icon Component
export const SocialIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
  const logoUrl = SOCIAL_LOGOS[platform as keyof typeof SOCIAL_LOGOS];
  
  if (!logoUrl) return null;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={logoUrl}
        alt={platform}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
};
