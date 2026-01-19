"use client";

import { useState } from "react";

export type NavSection = 
  | "home"
  | "dashboard";

// Legacy types kept for compatibility but not used in new navigation
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
  const navItems = [
    {
      id: "home" as NavSection,
      label: "Home",
    },
    {
      id: "dashboard" as NavSection,
      label: "Dashboard",
    },
  ];

  const handleNavClick = (section: NavSection) => {
    setActiveSection(section);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-nrl-dark-card border-b border-nrl-border-light backdrop-blur-sm bg-opacity-95 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-around overflow-x-auto scrollbar-hide px-2 py-3">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-8 py-2 rounded-lg transition-all font-semibold text-lg ${
                  isActive
                    ? "text-nrl-green bg-nrl-green/10"
                    : "text-nrl-text-secondary hover:text-nrl-text-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
