"use client";

import { useState } from "react";
import { NavIcon } from "@/lib/icons";

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

  const navItems = [
    {
      id: "latest" as NavSection,
      label: "Latest",
      dropdown: [
        { id: "news" as LatestSubSection, label: "News" },
        { id: "watch" as LatestSubSection, label: "Watch" },
        { id: "highlights" as LatestSubSection, label: "Highlights" },
      ],
    },
    {
      id: "home" as NavSection,
      label: "Home",
    },
    {
      id: "stats" as NavSection,
      label: "Stats",
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
    },
    {
      id: "tipping" as NavSection,
      label: "Tipping",
    },
    {
      id: "lockerroom" as NavSection,
      label: "Lockerroom",
    },
    {
      id: "shop" as NavSection,
      label: "Shop",
    },
    {
      id: "tickets" as NavSection,
      label: "Tickets",
    },
    {
      id: "memberships" as NavSection,
      label: "Memberships",
    },
    {
      id: "social" as NavSection,
      label: "Social",
      dropdown: [
        { id: "leaderboards" as SocialSubSection, label: "Leaderboards" },
        { id: "friends" as SocialSubSection, label: "Friends" },
      ],
    },
  ];

  const handleNavClick = (section: NavSection, subSection?: any) => {
    const clickedItem = navItems.find((item) => item.id === section);
    const hasDropdown = !!clickedItem?.dropdown;

    if (hasDropdown) {
      // If a subSection is provided, navigate to it and close dropdown
      if (subSection) {
        setActiveSection(section, subSection);
        setOpenDropdown(null);
        return;
      }
      // Otherwise, toggle the dropdown
      if (openDropdown === section) {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(section);
      }
    } else {
      // For items without dropdowns, navigate directly and close any open dropdown
      setOpenDropdown(null);
      setActiveSection(section);
    }
  };

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
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-xl transition-all min-w-[60px] ${
                      isActive
                        ? "text-nrl-green bg-nrl-green/10"
                        : "text-nrl-text-secondary hover:text-nrl-text-primary"
                    }`}
                  >
                    <div className="relative flex items-center justify-center w-full">
                      <NavIcon type={item.id} />
                      {hasDropdown && (
                        <span
                          className={`absolute -top-0.5 -right-0.5 text-[6px] text-nrl-text-muted transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      )}
                    </div>
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
