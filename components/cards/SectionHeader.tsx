"use client";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  seeAllLink?: string;
}

export default function SectionHeader({ icon, title, seeAllLink }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 text-green-500">{icon}</div>
        <h2 className="text-xs font-bold leading-7 text-white drop-shadow-lg uppercase">
          {title}
        </h2>
      </div>
      <div className="flex-1 h-px bg-white/30"></div>
      {seeAllLink && (
        <a
          href={seeAllLink}
          className="text-xs font-semibold text-white/80 hover:text-white transition-colors whitespace-nowrap"
        >
          See all →
        </a>
      )}
    </div>
  );
}
