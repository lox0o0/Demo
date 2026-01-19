"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import Navigation, { NavSection } from "./Navigation";

interface DashboardProps {
  user: any;
  hideNavigation?: boolean;
}

// Calculate tier based on points and profile completion
const calculateTier = (points: number, profileCompletion: number) => {
  // If profile completion is 100%, give Bronze tier (250 points)
  if (profileCompletion >= 100) {
    return TIERS.find(t => t.name === "Bronze") || TIERS[1];
  }
  
  // Otherwise calculate based on points
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return points >= t.minPoints && (!nextTier || points < nextTier.minPoints);
  }) || TIERS[0];
  
  return currentTier;
};

export default function DashboardNew({ user, hideNavigation = false }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  
  // Get user data
  const profileCompletion = user?.profileCompletion || 0;
  // If profile completion is 100%, give Bronze tier (250 points minimum)
  const userPoints = profileCompletion >= 100 
    ? Math.max(user?.points || 0, 250) 
    : (user?.points || 0);
  const currentTier = calculateTier(userPoints, profileCompletion);
  const nextTier = TIERS.find(t => t.minPoints > currentTier.minPoints) || TIERS[TIERS.length - 1];
  const pointsToNext = Math.max(0, nextTier.minPoints - userPoints);
  const progressPercent = nextTier.minPoints > currentTier.minPoints
    ? Math.min(((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)
    : 100;

  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const firstName = user?.name?.split(' ')[0] || "Fan";

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Navigation at top */}
      {!hideNavigation && (
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      )}

      {/* Main Content - Horizontal layout */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${hideNavigation ? 'pt-6' : 'pt-24'}`}>
        {activeSection === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Today's Activity */}
            <div className="lg:col-span-1 space-y-6">
              <TodaysActivity user={user} teamData={teamData} />
            </div>

            {/* Middle Column - Main Dashboard Content */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card with Streak */}
              <StatusCard 
                tier={currentTier}
                points={userPoints}
                progressPercent={progressPercent}
                pointsToNext={pointsToNext}
                nextTier={nextTier}
                streak={user?.streak || 0}
                profileCompletion={profileCompletion}
                teamData={teamData}
              />
              
              {/* Today's Quest */}
              <TodaysQuestCard teamData={teamData} />
              
              {/* Season Favourite Picks */}
              <SeasonFavouritePicks user={user} />
            </div>

            {/* Right Column - Mates, Points Shop, etc */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Completion */}
              <ProfileCompletion user={user} profileCompletion={profileCompletion} />
              
              {/* Mates Activity */}
              <MatesActivity />
              
              {/* Points Shop */}
              <PointsShopCard points={userPoints} teamData={teamData} />
              
              {/* Tips & Fantasy Cards */}
              <div className="grid grid-cols-2 gap-3">
                <TipsCard teamData={teamData} />
                <FantasyCard teamData={teamData} />
              </div>
            </div>
          </div>
        )}

        {/* Other sections */}
        {activeSection !== "dashboard" && (
          <div className="text-center py-20">
            <p className="text-nrl-text-secondary">Coming soon: {activeSection}</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Status Card Component with Streak
function StatusCard({ tier, points, progressPercent, pointsToNext, nextTier, streak, profileCompletion, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      {/* Tier Badge Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: tier.color }}
          >
            <span className="text-lg">⭐</span>
          </div>
          <span 
            className="text-sm font-bold uppercase"
            style={{ color: tier.color }}
          >
            {tier.name}
          </span>
        </div>
        
        {/* Streak in profile card */}
        {streak > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-sm font-bold text-nrl-amber">{streak}</span>
          </div>
        )}
      </div>

      {/* Points Display */}
      <div className="mb-4">
        <div className="text-5xl font-bold text-white mb-1">
          {points.toLocaleString()}
        </div>
        <div className="text-sm text-nrl-text-secondary">points</div>
      </div>

      {/* Profile Completion */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-nrl-text-secondary">Profile Completion</span>
          <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-nrl-dark-hover rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nrl-green to-nrl-amber"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: tier.color
            }}
          />
        </div>
        <div className="text-sm text-nrl-text-secondary">
          {pointsToNext} pts to {nextTier.name}
        </div>
      </div>

      {/* Benefit Preview */}
      <div className="flex items-center gap-2 text-xs text-nrl-text-muted">
        <span>🔒</span>
        <span>{nextTier.name} unlocks: {nextTier.access || nextTier.reward}</span>
      </div>
    </div>
  );
}

// Today's Activity Component
function TodaysActivity({ user, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h3 className="text-lg font-bold text-white mb-4">Today's Activity</h3>
      
      <div className="space-y-4">
        {/* Refer a friend */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Refer a friend</div>
              <div className="text-xs text-nrl-text-secondary">Earn points for each referral</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>

        {/* Watch recent highlights */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Watch recent highlights</div>
              <div className="text-xs text-nrl-text-secondary">Top tries from this week</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>

        {/* Pick rival team */}
        <button className="w-full bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 text-left hover:border-nrl-green transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Pick rival team</div>
              <div className="text-xs text-nrl-text-secondary">Compare stats vs your team</div>
            </div>
            <span className="text-nrl-green font-bold">→</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// Today's Quest Card
function TodaysQuestCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="text-xs font-bold uppercase text-nrl-text-muted mb-2">
        TELSTRA TUESDAY • 2X POINTS
      </div>
      <div className="text-base font-bold text-white mb-1">Tuesday Prediction</div>
      <div className="text-xs text-nrl-text-secondary mb-3">Total points: Broncos vs Roosters?</div>
      <div className="text-sm font-semibold mb-3" style={{ color: teamData?.primaryColor || "#00A651" }}>
        +100 pts
      </div>
      <button
        className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-all"
        style={{ backgroundColor: teamData?.primaryColor || "#00A651" }}
      >
        Make Prediction →
      </button>
    </div>
  );
}

// Season Favourite Picks
function SeasonFavouritePicks({ user }: any) {
  const picks = user?.seasonPicks || [];
  
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Season Favourite Picks</h3>
        {picks.length < 3 && (
          <button className="text-xs text-nrl-green font-semibold">Pick 3 players →</button>
        )}
      </div>
      
      {picks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-nrl-text-secondary mb-3">Pick 3 favourite players</p>
          <p className="text-xs text-nrl-text-muted">Scored by fantasy data • Locked for season</p>
        </div>
      ) : (
        <div className="space-y-3">
          {picks.map((pick: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-nrl-dark-hover rounded-lg">
              <div>
                <div className="text-sm font-semibold text-white">{pick.name}</div>
                <div className="text-xs text-nrl-text-secondary">{pick.position} • {pick.team}</div>
              </div>
              <div className="text-sm font-bold text-nrl-green">{pick.points || 0} pts</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile Completion Component with Dropdown
function ProfileCompletion({ user, profileCompletion }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check which socials are missing (assuming 4 total: facebook, tiktok, instagram, x)
  const allSocials = ["facebook", "tiktok", "instagram", "x"];
  const connectedSocials = user?.connectedSocials || [];
  const missingSocials = allSocials.filter(social => !connectedSocials.includes(social));

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Profile Completion</h3>
        <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-nrl-green to-nrl-amber"
          style={{ width: `${profileCompletion}%` }}
        />
      </div>

      {/* Dropdown */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 hover:border-nrl-green transition-colors"
        >
          <span className="text-sm font-semibold text-white">Complete Profile for Points</span>
          <span className={`text-nrl-green transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="mt-2 bg-nrl-dark-hover border border-nrl-border-light rounded-xl p-4 space-y-3">
            {/* DOB */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={user?.dob ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.dob ? '✓' : '○'}
                </span>
                <span className="text-sm text-nrl-text-secondary">DOB</span>
              </div>
              {!user?.dob && (
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Add →
                </button>
              )}
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={user?.gender ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.gender ? '✓' : '○'}
                </span>
                <span className="text-sm text-nrl-text-secondary">Gender</span>
              </div>
              {!user?.gender ? (
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    M
                  </button>
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    F
                  </button>
                  <button className="text-xs px-2 py-1 bg-nrl-dark-card border border-nrl-border-light rounded hover:border-nrl-green transition-colors">
                    Rather not say
                  </button>
                </div>
              ) : (
                <span className="text-xs text-nrl-text-secondary">{user.gender}</span>
              )}
            </div>

            {/* Home Ground Stadium */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={user?.homeGround ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                  {user?.homeGround ? '✓' : '○'}
                </span>
                <span className="text-sm text-nrl-text-secondary">Home Ground Stadium</span>
              </div>
              {!user?.homeGround && (
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Set →
                </button>
              )}
            </div>

            {/* Connect Socials */}
            {missingSocials.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-nrl-text-muted">○</span>
                  <span className="text-sm text-nrl-text-secondary">Connect socials</span>
                </div>
                <button className="text-xs text-nrl-green font-semibold hover:underline">
                  Connect →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mates Activity Component
function MatesActivity() {
  const matesActivity = [
    {
      id: "act-1",
      mateName: "Dave",
      activityText: "submitted tips — 7/8 this round",
      timestamp: "2026-01-19T10:00:00Z",
      isCompetitive: false
    },
    {
      id: "act-2",
      mateName: "Emma",
      activityText: "passed you — you're now #4 in The Office Comp",
      timestamp: "2026-01-19T08:00:00Z",
      isCompetitive: true
    }
  ];

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light max-h-[400px] overflow-y-auto">
      <h3 className="text-sm font-bold uppercase text-nrl-text-secondary mb-4 tracking-wider">
        Mates
      </h3>
      <div className="space-y-3">
        {matesActivity.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 pb-3 border-b border-nrl-border-light last:border-0 ${
              activity.isCompetitive ? "bg-orange-500/10 border-l-4 border-l-orange-500 pl-3" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-sm">
              {activity.mateName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-white">{activity.mateName}</span>{" "}
                {activity.isCompetitive && "⚡ "}
                <span className="text-nrl-text-secondary">{activity.activityText}</span>
              </div>
              <div className="text-xs text-nrl-text-muted mt-1">
                {new Date(activity.timestamp).toLocaleDateString()}
              </div>
            </div>
            <button className="text-xs border border-nrl-border-light px-2 py-1 rounded hover:bg-nrl-green/20 transition-colors">
              Nice!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Points Shop Card
function PointsShopCard({ points, teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-nrl-text-secondary mb-1">Overall Points</div>
          <div className="text-3xl font-bold text-white">{points.toLocaleString()}</div>
        </div>
      </div>
      <button
        className="w-full bg-nrl-dark-hover border-2 border-nrl-green text-nrl-green font-bold py-3 rounded-xl hover:bg-nrl-green/10 transition-colors"
      >
        Points Shop →
      </button>
    </div>
  );
}

// Tips Card Component
function TipsCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Tipping</h3>
        <span className="text-xl">🎯</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        6/8 this round
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #847 overall
      </div>
      <a 
        href="#" 
        className="text-xs font-bold"
        style={{ color: teamData?.primaryColor || "#00A651" }}
      >
        Make Tips →
      </a>
    </div>
  );
}

// Fantasy Card Component
function FantasyCard({ teamData }: any) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Fantasy</h3>
        <span className="text-xl">🏈</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        12,847 pts
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #2,341 rank
      </div>
      <a 
        href="#" 
        className="text-xs font-bold"
        style={{ color: teamData?.primaryColor || "#00A651" }}
      >
        View Team →
      </a>
    </div>
  );
}
