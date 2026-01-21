"use client";

import { useState, useEffect } from "react"; // useEffect imported for modal visibility logic
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
import SponsorActivityCard from "./cards/SponsorActivityCard";
import BackgroundVideo from "./BackgroundVideo";
import HeroCarousel from "./HeroCarousel";
import TierProgressModal from "./TierProgressModal";
import Leaderboards from "./Leaderboards";
import Rewards from "./Rewards";

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  const [activeSubSection, setActiveSubSection] = useState<LatestSubSection | StatsSubSection | SocialSubSection | undefined>(undefined);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const teamColors = teamData 
    ? { primary: teamData.primaryColor, secondary: teamData.secondaryColor }
    : { primary: "#00A651", secondary: "#FFB800" };

  // Demo: Override user points for different pages
  // Check if user has upgraded to Silver tier (from sessionStorage or state)
  const [lockerRoomUser, setLockerRoomUser] = useState(() => {
    // Check if user has upgraded tier
    const upgradedPoints = sessionStorage.getItem('userUpgradedPoints');
    if (upgradedPoints) {
      return { ...user, points: parseInt(upgradedPoints), lifetimePoints: parseInt(upgradedPoints) };
    }
    return { ...user, points: 950, lifetimePoints: 950 };
  });
  
  // Home page: Use updated points if user has upgraded, otherwise 950
  const homeUser = { ...user, points: lockerRoomUser.points, lifetimePoints: lockerRoomUser.points };

  // Calculate tier info for progress modal
  const userPoints = homeUser?.points || 0;
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];
  
  const nextTier = TIERS.find((t) => t.minPoints > userPoints);
  const pointsToNext = nextTier ? nextTier.minPoints - userPoints : 0;

  // Show modal once after onboarding is complete, then never again after CTA is clicked
  useEffect(() => {
    // Don't show modal if user just completed a tier upgrade
    const tierUpgradeJustCompleted = sessionStorage.getItem('tierUpgradeJustCompleted');
    if (tierUpgradeJustCompleted === 'true') {
      sessionStorage.removeItem('tierUpgradeJustCompleted');
      setShowProgressModal(false);
      return;
    }
    
    // Check if modal was permanently dismissed (after clicking CTA)
    const permanentlyDismissed = localStorage.getItem('tierProgressModalDismissedPermanently');
    if (permanentlyDismissed === 'true') {
      setShowProgressModal(false);
      return;
    }
    
    // Removed: Bronze Tier pop-up after onboarding - moved to carousel instead
    setShowProgressModal(false);
  }, [activeSection]);

  const handleDismissModal = () => {
    setShowProgressModal(false);
    // Permanently dismiss - never show again
    localStorage.setItem('tierProgressModalDismissedPermanently', 'true');
  };

  const handleCompleteProfile = () => {
    setShowProgressModal(false);
    // Permanently dismiss - never show again after CTA is clicked
    localStorage.setItem('tierProgressModalDismissedPermanently', 'true');
    // Navigate to profile completion or locker room
    setActiveSection("dashboard");
    // Store flag to highlight profile completion section
    sessionStorage.setItem('highlightProfileCompletion', 'true');
  };


  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0b] flex">
      {/* Left Sidebar */}
      <LeftSidebar 
        activeSection={activeSection} 
        onNavigate={(section) => setActiveSection(section as NavSection)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[70px] mr-[280px] overflow-hidden relative">
        {/* Background Video - only on home section, fixed to viewport */}
        {activeSection === "home" && <BackgroundVideo />}

        {/* Scrollable Content - ensure it's above video */}
        <main className="flex-1 overflow-y-auto pl-8 pr-6 py-6 relative z-10" style={{ position: 'relative' }}>
          {activeSection === "home" && (
            <div className="space-y-12 max-w-[95%] relative">
              {/* HERO CAROUSEL */}
              <section>
                <HeroCarousel onNavigate={(section) => setActiveSection(section as NavSection)} user={homeUser} />
              </section>

              {/* SECTION 1: FANTASY & TIPPING */}
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
                    image="/images/cards/tipping.jpg"
                    title="Tipping"
                    subtitle="Tips made for upcoming weekend fixtures"
                    badge="+35 pts"
                    badgeColor="gold"
                    ctaButton="Finish tips"
                  />
                  <ContentCard
                    image="/images/cards/fantasy-team.jpg"
                    title="Fantasy"
                    subtitle="Trades made and team set"
                    badge="+40 pts"
                    badgeColor="gold"
                    ctaButton="Check team"
                  />
                </div>
              </section>

              {/* SECTION 2: ACTIVITIES */}
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
                    badge="+50 pts"
                    badgeColor="gold"
                    ctaButton="View your pick"
                    completed={true}
                  />
                  <ContentCard
                    image="/images/cards/profile-upgade.jpg"
                    title="Upgrade your profile"
                    subtitle="Complete profile data to earn points!"
                    progressPercent={30}
                    badge="+45 pts"
                    badgeColor="gold"
                    ctaButton="Complete profile data"
                  />
                  <ContentCard
                    image="/images/cards/prize-wheel.png"
                    title="Prize Wheel"
                    subtitle="Spin to win exclusive rewards"
                    badge="+60 pts"
                    badgeColor="gold"
                    ctaButton="Spin Now →"
                    ctaStyle="centered"
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
                    badge="+25 pts"
                    badgeColor="gold"
                    ctaStyle="subtitle"
                  />
                  <ContentCard
                    image="/images/cards/broncos-storm-replay.jpg"
                    title="Extended Highlights: Broncos vs Storm"
                    subtitle="Grand Final Full Replay"
                    badge="+30 pts"
                    badgeColor="gold"
                    ctaStyle="subtitle"
                  />
                  <ContentCard
                    image="/images/cards/top-performers.avif"
                    title="Top Performers from Premiership"
                    subtitle="Stats Overview"
                    badge="+28 pts"
                    badgeColor="gold"
                    ctaStyle="subtitle"
                  />
                </div>
              </section>

              {/* SECTION 4: SPONSOR ACTIVITIES */}
              <section>
                <SectionHeader
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  }
                  title="SPONSOR ACTIVITIES"
                  seeAllLink="#"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <SponsorActivityCard
                    image="/images/cards/KFC.png"
                    title="Game Day Meal Deal"
                    description="Order any meal via KFC app using code NRLPLAYER at checkout"
                    benefit="Free upgrade to Large + 50 pts"
                    availability="Ends: Sunday 9pm"
                    ctaText="Open KFC App"
                    points="+50 pts"
                  />
                  <SponsorActivityCard
                    image="/images/cards/telstra.png"
                    title="Stay Connected"
                    description="Complete a 2-min plan comparison quiz and see exclusive NRL member offers"
                    benefit="10GB Bonus Data + 30 pts"
                    availability="Available: Ongoing"
                    ctaText="Start Quiz"
                    points="+30 pts"
                  />
                  <SponsorActivityCard
                    image="/images/cards/Ampol.webp"
                    title="Fuel Up Friday"
                    description="Visit any Ampol station and scan the QR code at the pump using the Ampol app"
                    benefit="10c/L off (max 60L) + 40 pts"
                    availability="Available: Fridays only"
                    ctaText="Get QR Code"
                    points="+40 pts"
                  />
                </div>
              </section>
            </div>
          )}
          
          {activeSection === "dashboard" && (
            <DashboardNew 
              user={lockerRoomUser} 
              hideNavigation={true}
              onNavigate={(section) => setActiveSection(section)}
              onUserPointsUpdate={(newPoints: number) => {
                setLockerRoomUser((prev: any) => ({ ...prev, points: newPoints, lifetimePoints: newPoints }));
              }}
            />
          )}

          {activeSection === "leaderboards" && (
            <Leaderboards user={user} />
          )}

          {activeSection === "rewards" && (
            <Rewards user={user} onNavigate={(section) => setActiveSection(section as NavSection)} />
          )}

          {/* Default fallback for any unrecognized sections */}
          {!["home", "dashboard", "leaderboards", "rewards"].includes(activeSection) && (
            <div className="text-center py-20">
              <p className="text-nrl-text-secondary">Section not found: {activeSection}</p>
            </div>
          )}
        </main>
      </div>

      {/* Right Sidebar - consistent across all pages */}
      <RightSidebar 
        user={
          activeSection === "home" ? homeUser : 
          activeSection === "dashboard" ? lockerRoomUser : 
          activeSection === "leaderboards" ? homeUser :
          activeSection === "rewards" ? homeUser :
          user
        }
        onNavigate={(section) => setActiveSection(section as NavSection)}
      />

      {/* Tier Progress Modal */}
      {showProgressModal && activeSection === "home" && nextTier && (
        <TierProgressModal
          userPoints={userPoints}
          currentTier={currentTier}
          nextTier={nextTier}
          pointsToNext={pointsToNext}
          onDismiss={handleDismissModal}
          onCompleteProfile={handleCompleteProfile}
        />
      )}
    </div>
  );
}

function ProfileView({ user, teamData }: { user: any; teamData: any }) {
  // Demo: Override points for Home page to show Silver tier (1,000 points)
  const demoUser = { ...user, points: 1000, lifetimePoints: 1000 };
  const userPoints = demoUser?.points || 0;
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
            <div className="text-2xl font-bold text-nrl-green">{demoUser?.lifetimePoints || 0}</div>
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
          {isMaxTier ? `${currentTier.name} Tier - Maximum Achieved!` : `Progress to ${nextTier?.name || currentTier.name}`}
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
