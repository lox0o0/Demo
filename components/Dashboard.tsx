"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import FanScore from "./FanScore";
import QuestsPanel from "./QuestsPanel";
import StatusCards from "./StatusCards";
import ActivityFeed from "./ActivityFeed";
import Navigation, { NavSection, LatestSubSection, StatsSubSection, SocialSubSection } from "./Navigation";
import DashboardNew from "./DashboardNew";

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  const [activeSubSection, setActiveSubSection] = useState<LatestSubSection | StatsSubSection | SocialSubSection | undefined>(undefined);

  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const teamColors = teamData 
    ? { primary: teamData.primaryColor, secondary: teamData.secondaryColor }
    : { primary: "#00A651", secondary: "#FFB800" };

  // Mock featured content for hero section
  const featuredContent = {
    title: "Las Vegas: NRL's American Dream",
    subtitle: "The historic double-header that changed everything",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
    category: "Feature",
  };

  // Mock matches/videos for grid
  const mustWatchContent = [
    { id: 1, title: "Round 1 Highlights", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop", duration: "5:23" },
    { id: 2, title: "Origin Preview", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop", duration: "3:45" },
    { id: 3, title: "Top 10 Tries", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop", duration: "8:12" },
    { id: 4, title: "Coach's Corner", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop", duration: "12:30" },
  ];

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Premium background with team colors */}
      <div 
        className="fixed inset-0 z-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${teamColors.primary} 0%, transparent 50%),
                       radial-gradient(circle at 80% 50%, ${teamColors.secondary} 0%, transparent 50%),
                       linear-gradient(to bottom, #0A0A0A 0%, #000000 100%)`,
        }}
      />
      <div className="relative z-10">
        {/* Top Navigation */}
        <Navigation 
          activeSection={activeSection} 
          activeSubSection={activeSubSection}
          setActiveSection={(section, subSection) => {
            setActiveSection(section);
            if (subSection) setActiveSubSection(subSection);
          }}
        />

        {/* Premium Header - Only show when not on home */}
        {activeSection !== "home" && (
          <header className="bg-nrl-dark-card border-b border-nrl-border-light sticky top-16 z-20 backdrop-blur-sm bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {teamData && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/10 border border-nrl-border-light p-1.5">
                    <Image
                      src={teamData.logoUrl}
                      alt={teamData.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-nrl-text-primary">
                    Welcome back, {user?.name || "Fan"}!
                  </h1>
                  <p className="text-sm text-nrl-text-secondary font-medium">{user?.team}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {user?.streak > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-nrl-dark-card rounded-full border border-nrl-amber/30">
                    <span className="text-xs font-bold text-nrl-amber fire-animation uppercase tracking-tight">STREAK</span>
                    <span className="font-bold text-nrl-amber">{user.streak} day streak</span>
                  </div>
                )}
                {/* Reset button for testing */}
                <button
                  onClick={() => {
                    localStorage.removeItem("nrl_onboarded");
                    localStorage.removeItem("nrl_user");
                    window.location.reload();
                  }}
                  className="text-xs text-nrl-text-muted hover:text-nrl-text-primary px-2 py-1 rounded"
                  title="Reset onboarding (for testing)"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </header>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
          {activeSection === "home" && (
            <div className="space-y-8">
              {/* Hero Section - Featured Content */}
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
                  <div className="text-xs font-bold uppercase tracking-wider text-nrl-amber mb-2">
                    {featuredContent.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-nrl-green transition-colors">
                    {featuredContent.title}
                  </h2>
                  <p className="text-lg text-nrl-text-secondary font-medium max-w-2xl">
                    {featuredContent.subtitle}
                  </p>
                </div>
                <div className="absolute inset-0 bg-nrl-dark opacity-40" />
              </div>

              {/* Fan Score and Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FanScore user={user} />
                </div>
                <div className="lg:col-span-1">
                  <StatusCards user={user} />
                </div>
              </div>

              {/* Must Watch Grid */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Must Watch</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mustWatchContent.map((item) => (
                    <div key={item.id} className="relative group cursor-pointer">
                      <div className="aspect-video bg-nrl-dark-card rounded-xl overflow-hidden border border-nrl-border-light group-hover:border-nrl-green transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute bottom-2 left-2 right-2 z-20">
                          <div className="text-xs font-semibold text-white mb-1">{item.title}</div>
                          <div className="text-[10px] text-nrl-text-secondary">{item.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quests and Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QuestsPanel user={user} />
                </div>
                <div className="lg:col-span-1">
                  <ActivityFeed user={user} />
                </div>
              </div>
            </div>
          )}
          
          {activeSection === "dashboard" && (
            <DashboardNew 
              user={user} 
              hideNavigation={true}
              onNavigate={(section) => setActiveSection(section)}
            />
          )}

          {/* Default fallback for any unrecognized sections */}
          {!["home", "dashboard"].includes(activeSection) && (
            <div className="text-center py-20">
              <p className="text-nrl-text-secondary">Section not found: {activeSection}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ProfileView({ user, teamData }: { user: any; teamData: any }) {
  const userPoints = user?.points || 0;
  const maxTier = TIERS[TIERS.length - 1];
  
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  // Check if user is at max tier
  const isMaxTier = currentTier.name === maxTier.name && userPoints >= maxTier.minPoints;
  
  const nextTier = isMaxTier 
    ? null 
    : TIERS.find((t) => t.minPoints > userPoints);
  
  const pointsToNext = isMaxTier ? 0 : (nextTier ? nextTier.minPoints - userPoints : 0);

  return (
    <div className="space-y-6">
      <div className="bg-nrl-dark-card rounded-2xl p-8 text-center border border-nrl-border-light">
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center border-4 border-nrl-amber overflow-hidden">
          {teamData ? (
            <Image
              src={teamData.logoUrl}
              alt={teamData.name}
              fill
              className="object-contain p-3"
              unoptimized
            />
          ) : (
            <span className="text-4xl">{user?.name?.charAt(0) || "F"}</span>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1 text-nrl-text-primary">{user?.name}</h2>
        <p className="text-nrl-text-secondary mb-4">{user?.team} • Member since {user?.memberSince}</p>
        <div className="inline-block px-4 py-2 bg-nrl-amber/20 text-nrl-amber rounded-full font-semibold border border-nrl-amber/30">
          {currentTier.name} Tier
        </div>
      </div>

      <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
        <h3 className="text-lg font-semibold mb-4 text-nrl-text-primary">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-nrl-green">{user?.lifetimePoints || 0}</div>
            <div className="text-sm text-nrl-text-secondary">Lifetime Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-nrl-text-primary">{user?.streak || 0}</div>
            <div className="text-sm text-nrl-text-secondary">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-nrl-text-primary">12</div>
            <div className="text-sm text-nrl-text-secondary">Games Attended</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-nrl-text-primary">#847</div>
            <div className="text-sm text-nrl-text-secondary">Tipping Rank</div>
          </div>
        </div>
      </div>

      <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
        <h3 className="text-lg font-semibold mb-4 text-nrl-text-primary">
          {isMaxTier ? `🏆 ${currentTier.name} Tier - Maximum Achieved!` : `Progress to ${nextTier?.name || currentTier.name}`}
        </h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-nrl-text-secondary">{userPoints} points</span>
            <span className="text-nrl-text-secondary">
              {isMaxTier ? maxTier.minPoints : nextTier ? nextTier.minPoints : currentTier.minPoints} points
            </span>
          </div>
          <div className="w-full bg-nrl-dark-hover rounded-full h-3">
            <div
              className="bg-gradient-to-r from-nrl-green to-nrl-amber h-3 rounded-full transition-all"
              style={{
                width: `${(() => {
                  if (isMaxTier) return 100;
                  if (!nextTier) return 100;
                  const tierRange = nextTier.minPoints - currentTier.minPoints;
                  // Prevent division by zero if tiers have same minPoints
                  if (tierRange <= 0) return 100;
                  return Math.min(((userPoints - currentTier.minPoints) / tierRange) * 100, 100);
                })()}%`,
              }}
            />
          </div>
        </div>
        <p className="text-sm text-nrl-text-secondary">
          {isMaxTier 
            ? `You've reached the maximum tier! Enjoy ${currentTier.reward}`
            : nextTier
              ? `${pointsToNext} points to unlock: ${nextTier.reward}`
              : `Current tier: ${currentTier.reward}`
          }
        </p>
      </div>
    </div>
  );
}
