"use client";

import { useState } from "react";

interface LeftSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function LeftSidebar({ activeSection, onNavigate }: LeftSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { 
      id: "home", 
      label: "Home", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      id: "dashboard", 
      label: "Locker Room", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      id: "fantasy", 
      label: "Fantasy & Tipping", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    },
    { 
      id: "watch", 
      label: "Watch", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[70px] bg-[#0a0a0b] border-r border-[#2a2a2d] z-50 flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 pt-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center justify-center py-4 transition-all duration-200 relative ${
                  isActive ? "text-[#22c55e]" : "text-white/60 hover:text-white"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#22c55e]" />
                )}
                
                {/* Icon */}
                <div className="flex items-center justify-center">
                  {item.icon}
                </div>
              </button>
              
              {/* Tooltip on hover */}
              {isHovered && !isActive && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-[#1a1a1d] border border-[#2a2a2d] rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  {/* Tooltip arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2a2a2d]" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pb-4 border-t border-[#2a2a2d] pt-4">
        <button
          onClick={() => {
            localStorage.removeItem("nrl_onboarded");
            localStorage.removeItem("nrl_user");
            window.location.reload();
          }}
          className="w-full flex flex-col items-center justify-center py-3 text-white/60 hover:text-white transition-colors"
          title="Reset Demo"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
          </svg>
        </button>
        <button
          className="w-full flex flex-col items-center justify-center py-3 text-white/60 hover:text-white transition-colors mt-2"
          title="Help"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
