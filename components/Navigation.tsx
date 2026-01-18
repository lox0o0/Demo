"use client";

import { useState } from "react";

export type NavSection = 
  | "home"
  | "latest"
  | "stats"
  | "fantasy"
  | "tipping"
  | "lockerroom"
  | "shop"
  | "tickets"
  | "memberships"
  | "social";

export type LatestSubSection = "news" | "watch" | "highlights";
export type StatsSubSection = "ladder" | "draw" | "players" | "stats";
export type SocialSubSection = "leaderboards" | "friends";

interface NavigationProps {
  activeSection: NavSection;
  activeSubSection?: LatestSubSection | StatsSubSection | SocialSubSection;
  setActiveSection: (section: NavSection, subSection?: any) => void;
}

export default function Navigation({ 
  activeSection, 
  activeSubSection,
  setActiveSection 
}: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<NavSection | null>(null);

  const handleNavClick = (section: NavSection, subSection?: any) => {
    if (openDropdown === section) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(section);
      if (subSection) {
        setActiveSection(section, subSection);
        setOpenDropdown(null);
      }
    }
  };

  const navItems = [
    {
      id: "latest" as NavSection,
      label: "Latest",
      icon: "📰",
      dropdown: [
        { id: "news" as LatestSubSection, label: "News" },
        { id: "watch" as LatestSubSection, label: "Watch" },
        { id: "highlights" as LatestSubSection, label: "Highlights" },
      ],
    },
    {
      id: "home" as NavSection,
      label: "Home",
      icon: "🏠",
    },
    {
      id: "stats" as NavSection,
      label: "Stats",
      icon: "📊",
      dropdown: [
        { id: "ladder" as StatsSubSection, label: "Ladder" },
        { id: "draw" as StatsSubSection, label: "Draw" },
        { id: "players" as StatsSubSection, label: "Players" },
        { id: "stats" as StatsSubSection, label: "Stats" },
      ],
    },
    {
      id: "fantasy" as NavSection,
      label: "Fantasy",
      icon: "⚽",
    },
    {
      id: "tipping" as NavSection,
      label: "Tipping",
      icon: "🎯",
    },
    {
      id: "lockerroom" as NavSection,
      label: "Lockerroom",
      icon: "👤",
    },
    {
      id: "shop" as NavSection,
      label: "Shop",
      icon: "🛒",
    },
    {
      id: "tickets" as NavSection,
      label: "Tickets",
      icon: "🎫",
    },
    {
      id: "memberships" as NavSection,
      label: "Memberships",
      icon: "⭐",
    },
    {
      id: "social" as NavSection,
      label: "Social",
      icon: "👥",
      dropdown: [
        { id: "leaderboards" as SocialSubSection, label: "Leaderboards" },
        { id: "friends" as SocialSubSection, label: "Friends" },
      ],
    },
  ];

  return (
    <>
      {/* Dropdown Overlay */}
      {openDropdown && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-nrl-dark-card border-t border-nrl-border-light backdrop-blur-sm bg-opacity-95 z-50 shadow-lg">
        {/* Dropdown Menu */}
        {openDropdown && (
          <div className="absolute bottom-full left-0 right-0 bg-nrl-dark-card border-t border-nrl-border-light max-h-64 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-3">
              {navItems
                .find((item) => item.id === openDropdown)
                ?.dropdown?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleNavClick(openDropdown, subItem.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                      activeSubSection === subItem.id
                        ? "bg-nrl-green/20 text-nrl-green font-semibold"
                        : "text-nrl-text-secondary hover:bg-nrl-dark-hover hover:text-nrl-text-primary"
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-around overflow-x-auto scrollbar-hide px-2 py-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const isDropdownOpen = openDropdown === item.id;
              const hasDropdown = !!item.dropdown;

              return (
                <div key={item.id} className="relative flex-shrink-0">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                      isActive
                        ? "text-nrl-green bg-nrl-green/10"
                        : "text-nrl-text-secondary hover:text-nrl-text-primary"
                    }`}
                  >
                    <div className="relative">
                      <span className="text-xl">{item.icon}</span>
                      {hasDropdown && (
                        <span
                          className={`absolute -top-1 -right-1 text-[10px] transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
