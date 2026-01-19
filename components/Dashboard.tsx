"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import Navigation, { NavSection, LatestSubSection, StatsSubSection, SocialSubSection } from "./Navigation";
import DashboardNew from "./DashboardNew";
import LeftSidebar from "./layout/LeftSidebar";
import RightSidebar from "./layout/RightSidebar";
import StatusBar from "./layout/StatusBar";
import SectionHeader from "./cards/SectionHeader";
import ContentCard from "./cards/ContentCard";

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


  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0b] flex">
      {/* Left Sidebar */}
      <LeftSidebar 
        activeSection={activeSection} 
        onNavigate={(section) => setActiveSection(section as NavSection)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[70px] mr-[280px] overflow-hidden">
        {/* Status Bar */}
        <StatusBar user={user} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pl-8 pr-6 py-6">
          {activeSection === "home" && (
            <div className="space-y-12 max-w-[95%]">
              {/* SECTION 1: ACTIVITIES */}
              <section>
                <SectionHeader
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  }
                  title="ACTIVITIES"
                  seeAllLink="#"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ContentCard
                    image="/images/cards/predictions.jpg"
                    title="Predictions"
                    subtitle="Round 6 Telstra MVP prediction made"
                    badge="✓ Complete"
                    badgeColor="green"
                    ctaButton="Check predictions"
                  />
                  <ContentCard
                    image="/images/cards/profile-upgrade.jpg"
                    title="Upgrade your profile"
                    subtitle="Complete profile data to earn points!"
                    progressPercent={30}
                    badge="+200 pts available"
                    ctaButton="Complete profile data"
                  />
                  <ContentCard
                    image="/images/cards/prize-wheel.png"
                    title="Prize Wheel"
                    subtitle="Spin to win exclusive rewards"
                    badge="🎰 5 spins available"
                    ctaButton="Spin Now →"
                    ctaStyle="centered"
                  />
                </div>
              </section>

              {/* SECTION 2: FANTASY & TIPPING */}
              <section>
                <SectionHeader
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  }
                  title="FANTASY & TIPPING"
                  seeAllLink="#"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ContentCard
                    image="/images/cards/fantasy-get-started.jpeg"
                    title="Test your knowledge and earn points"
                    subtitle="Get into Tipping & Fantasy"
                    badge="+50 pts"
                    badgeColor="gold"
                    ctaButton="Get Started →"
                    ctaStyle="wide"
                  />
                  <ContentCard
                    image="/images/cards/tipping.jpeg"
                    title="Tipping"
                    subtitle="Tips made for upcoming weekend fixtures"
                    progressRing={{ current: 6, total: 8 }}
                    badge="Round 6"
                    ctaButton="Finish tips"
                  />
                  <ContentCard
                    image="/images/cards/fantasy-team.jpg"
                    title="Fantasy"
                    subtitle="Trades made and team set"
                    statusIndicator="✓ Team Ready"
                    badge="12,847 pts"
                    ctaButton="Check team"
                  />
                </div>
              </section>

              {/* SECTION 3: WATCH */}
              <section>
                <SectionHeader
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  }
                  title="WATCH"
                  seeAllLink="#"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <ContentCard
                    image="/images/cards/ben-hunt-highlights.jpeg"
                    title="Ben Hunt stuns in Premiership performance"
                    subtitle="Grand Final Highlights"
                    badge="▶ 12 min"
                    ctaStyle="subtitle"
                  />
                  <ContentCard
                    image="/images/cards/broncos-storm-replay.jpg"
                    title="Extended Highlights: Broncos vs Storm"
                    subtitle="Grand Final Full Replay"
                    badge="▶ 45 min"
                    ctaStyle="subtitle"
                  />
                  <ContentCard
                    image="/images/cards/top-performers.avif"
                    title="Top Performers from Premiership"
                    subtitle="Stats Overview"
                    badge="📊 Stats"
                    ctaStyle="subtitle"
                  />
                </div>
              </section>
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

      {/* Right Sidebar */}
      <RightSidebar user={user} />
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
