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
        {/* Premium Header */}
        <header className="bg-nrl-dark-card border-b border-nrl-border-light sticky top-0 z-20 backdrop-blur-sm bg-opacity-95">
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          {activeSection === "home" && (
            <div className="space-y-8">
              {/* Hero Section - Featured Content */}
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={featuredContent.image}
                  alt={featuredContent.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-3xl">
                    <span className="inline-block px-3 py-1 bg-nrl-green text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                      {featuredContent.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                      {featuredContent.title}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 font-medium">
                      {featuredContent.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Must Watch Videos Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-nrl-text-primary">Must-Watch Videos</h2>
                  <button className="text-nrl-green hover:text-nrl-green/80 font-semibold text-sm">
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mustWatchContent.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-nrl-dark-card rounded-xl overflow-hidden border border-nrl-border-light hover:border-nrl-border-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="relative aspect-video bg-nrl-dark-hover">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-semibold text-white">
                          {item.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-nrl-text-primary group-hover:text-nrl-green transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fan Score & Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <FanScore user={user} />
                  <StatusCards user={user} />
                </div>
                <div>
                  <QuestsPanel user={user} />
                </div>
              </div>

              {/* Activity Feed */}
              <ActivityFeed />
            </div>
          )}

          {/* Latest Section */}
          {(activeSection === "latest" || activeSubSection === "news" || activeSubSection === "watch" || activeSubSection === "highlights") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-nrl-text-primary">
                  {activeSubSection === "news" ? "News" : activeSubSection === "watch" ? "Watch" : activeSubSection === "highlights" ? "Highlights" : "Latest"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-nrl-dark-card rounded-xl overflow-hidden border border-nrl-border-light hover:border-nrl-border-medium transition-all cursor-pointer">
                    <div className="aspect-video bg-nrl-dark-hover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-nrl-text-primary mb-2">Sample {activeSubSection || "Latest"} Content {i}</h3>
                      <p className="text-sm text-nrl-text-secondary">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Section */}
          {(activeSection === "stats" || activeSubSection === "ladder" || activeSubSection === "draw" || activeSubSection === "players" || activeSubSection === "stats") && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">
                {activeSubSection === "ladder" ? "Ladder" : activeSubSection === "draw" ? "Draw" : activeSubSection === "players" ? "Players" : activeSubSection === "stats" ? "Stats" : "Stats"}
              </h2>
              <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
                <p className="text-nrl-text-secondary">Stats content coming soon...</p>
              </div>
            </div>
          )}

          {/* Fantasy Section */}
          {activeSection === "fantasy" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">Fantasy</h2>
              <StatusCards user={user} />
            </div>
          )}

          {/* Tipping Section */}
          {activeSection === "tipping" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">Tipping</h2>
              <StatusCards user={user} />
            </div>
          )}

          {/* Lockerroom (Profile) Section */}
          {activeSection === "lockerroom" && (
            <div className="space-y-6">
              <ProfileView user={user} teamData={teamData} />
            </div>
          )}

          {/* Shop Section */}
          {activeSection === "shop" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">Shop</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-nrl-dark-card rounded-xl overflow-hidden border border-nrl-border-light">
                    <div className="aspect-square bg-nrl-dark-hover" />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-nrl-text-primary">Product {i}</p>
                      <p className="text-xs text-nrl-text-secondary mt-1">$99.99</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets Section */}
          {activeSection === "tickets" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">Tickets</h2>
              <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
                <p className="text-nrl-text-secondary">Ticket purchasing coming soon...</p>
              </div>
            </div>
          )}

          {/* Memberships Section */}
          {activeSection === "memberships" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">Memberships</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Bronze", "Silver", "Gold"].map((tier) => (
                  <div key={tier} className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light hover:border-nrl-green transition-all cursor-pointer">
                    <h3 className="text-xl font-bold text-nrl-text-primary mb-2">{tier} Membership</h3>
                    <p className="text-2xl font-black text-nrl-green mb-4">$199</p>
                    <ul className="space-y-2 text-sm text-nrl-text-secondary mb-6">
                      <li>✓ Exclusive content</li>
                      <li>✓ Early ticket access</li>
                      <li>✓ Member-only events</li>
                    </ul>
                    <button className="w-full bg-nrl-green text-white font-bold py-3 rounded-xl hover:bg-nrl-green/90 transition-colors">
                      Join Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Section */}
          {(activeSection === "social" || activeSubSection === "leaderboards" || activeSubSection === "friends") && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nrl-text-primary">
                {activeSubSection === "leaderboards" ? "Leaderboards" : activeSubSection === "friends" ? "Friends" : "Social"}
              </h2>
              <ActivityFeed expanded />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation 
          activeSection={activeSection} 
          activeSubSection={activeSubSection}
          setActiveSection={(section, subSection) => {
            setActiveSection(section);
            setActiveSubSection(subSection);
          }} 
        />
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
                width: `${isMaxTier ? 100 : nextTier ? Math.min(((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100) : 100}%`,
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
