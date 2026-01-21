"use client";

interface LeftSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function LeftSidebar({ activeSection, onNavigate }: LeftSidebarProps) {

  const navItems = [
    { 
      id: "home", 
      label: "Home", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      id: "dashboard", 
      label: "Locker Room", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      id: "leaderboards", 
      label: "Leaderboards", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      id: "rewards", 
      label: "Rewards", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
        </svg>
      )
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[70px] bg-transparent backdrop-blur-md border-r border-white/20 shadow-xl z-50 flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 pt-4 px-2">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;

          return (
            <div 
              key={item.id} 
              className="relative group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 p-2 h-12 px-4 rounded-lg text-sm bg-transparent hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-lg hover:shadow-white/20 relative overflow-hidden ${
                  isActive 
                    ? "text-purple-300 font-bold" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"></div>
                </div>

                {/* Icon with Glow Effect */}
                <div 
                  className="flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  style={isActive 
                    ? {
                        filter: "drop-shadow(rgba(255, 255, 255, 0.8) 0px 0px 12px) drop-shadow(rgb(139, 92, 246) 0px 0px 24px) drop-shadow(rgba(139, 92, 246, 0.6) 0px 0px 36px)"
                      }
                    : {
                        filter: "drop-shadow(rgba(255, 255, 255, 0.6) 0px 0px 8px) drop-shadow(rgba(103, 126, 234, 0.8) 0px 0px 16px) drop-shadow(rgba(103, 126, 234, 0.4) 0px 0px 24px)"
                      }
                  }
                >
                  {item.icon}
                </div>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pb-4 border-t border-white/20 pt-4 px-2">
        <button
          onClick={() => {
            // Clear all onboarding and user data
            localStorage.removeItem("nrl_onboarded");
            localStorage.removeItem("nrl_user");
            
            // Clear all completed tasks and progress
            localStorage.removeItem("completedMissionIds");
            localStorage.removeItem("completedProfileItems");
            localStorage.removeItem("selectedHomeGround");
            
            // Clear modal dismissal flags
            localStorage.removeItem("tierProgressModalDismissedPermanently");
            localStorage.removeItem("tierProgressModalShownAfterOnboarding");
            
            // Clear all tier progress modal dismissals (for all tiers)
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith("tierProgressModalDismissed_")) {
                localStorage.removeItem(key);
              }
            });
            
            // Clear sessionStorage items
            sessionStorage.removeItem("userUpgradedPoints");
            sessionStorage.removeItem("onboardingJustCompleted");
            sessionStorage.removeItem("tierUpgradeJustCompleted");
            sessionStorage.removeItem("highlightProfileCompletion");
            
            // Reload to restart the experience
            window.location.reload();
          }}
          className="flex w-full items-center gap-3 p-2 h-12 px-4 rounded-lg text-sm text-white/90 hover:text-white bg-transparent hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-lg hover:shadow-white/20 group relative overflow-hidden"
          title="Reset Demo"
        >
          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"></div>
          </div>
          <div 
            className="flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            style={{
              filter: "drop-shadow(rgba(255, 255, 255, 0.6) 0px 0px 8px) drop-shadow(rgba(103, 126, 234, 0.8) 0px 0px 16px) drop-shadow(rgba(103, 126, 234, 0.4) 0px 0px 24px)"
            }}
          >
            <svg
              width="20"
              height="20"
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
          </div>
        </button>
        <button
          className="flex w-full items-center gap-3 p-2 h-12 px-4 rounded-lg text-sm text-white/90 hover:text-white bg-transparent hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-lg hover:shadow-white/20 group relative overflow-hidden mt-2"
          title="Help"
        >
          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"></div>
          </div>
          <div 
            className="flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            style={{
              filter: "drop-shadow(rgba(255, 255, 255, 0.6) 0px 0px 8px) drop-shadow(rgba(103, 126, 234, 0.8) 0px 0px 16px) drop-shadow(rgba(103, 126, 234, 0.4) 0px 0px 24px)"
            }}
          >
            <svg
              width="20"
              height="20"
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
          </div>
        </button>
      </div>
    </aside>
  );
}
