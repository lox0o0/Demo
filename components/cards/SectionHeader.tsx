"use client";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  seeAllLink?: string;
}

export default function SectionHeader({ icon, title, seeAllLink }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 flex-1">
        <div className="text-white/80">{icon}</div>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-wider text-[#a1a1aa]">
            {title}
          </span>
          <div className="flex-1 h-px bg-[#2a2a2d]" />
        </div>
      </div>
      {seeAllLink && (
        <a
          href={seeAllLink}
          className="text-xs font-semibold text-[#22c55e] hover:text-[#22c55e]/80 transition-colors whitespace-nowrap ml-4"
        >
          See all →
        </a>
      )}
    </div>
  );
}
