"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";
import Navigation, { NavSection } from "./Navigation";

interface DashboardProps {
  user: any;
}

// Mock data matching spec
const mockDashboardData = {
  user: {
    firstName: "James",
    lastName: "Mitchell",
    teamId: "broncos",
    teamName: "Broncos",
    teamColor: "#73003c",
    memberSince: 2024
  },
  status: {
    tier: "Diehard",
    tierColor: "#c0c0c0",
    currentPoints: 9753,
    nextTierThreshold: 10000,
    nextTierName: "Legend",
    nextTierBenefit: "VIP lottery + meet & greet access"
  },
  streak: {
    current: 23,
    longest: 31,
    status: "active", // "active" | "at_risk" | "broken"
    lastActivityDate: "2026-01-19"
  },
  todayQuest: {
    id: "tuesday-prediction-r5",
    title: "Tuesday Prediction",
    description: "Total points: Broncos vs Roosters?",
    pointsValue: 100,
    multiplier: 2,
    sponsorBadge: "Telstra Tuesday",
    status: "available", // "available" | "complete" | "expired"
    expiresAt: "2026-01-21T20:00:00Z"
  },
  matesActivity: [
    {
      id: "act-1",
      mateName: "Dave",
      avatarUrl: null,
      tier: "Supporter",
      activityType: "tipped",
      activityText: "submitted tips — 7/8 this round",
      timestamp: "2026-01-19T10:00:00Z",
      isCompetitive: false
    },
    {
      id: "act-2",
      mateName: "Emma",
      avatarUrl: null,
      tier: "Diehard",
      activityType: "passed_user",
      activityText: "passed you — you're now #4 in The Office Comp",
      timestamp: "2026-01-19T08:00:00Z",
      isCompetitive: true
    },
    {
      id: "act-3",
      mateName: "Sarah",
      avatarUrl: null,
      tier: "Legend",
      activityType: "streak",
      activityText: "hit a 15-week streak 🔥",
      timestamp: "2026-01-18T14:00:00Z",
      isCompetitive: false
    }
  ],
  tipping: {
    currentRoundCorrect: 6,
    currentRoundTotal: 8,
    overallRank: 847,
    streak: 12,
    status: "set"
  },
  fantasy: {
    totalPoints: 12847,
    rank: 2341,
    teamStatus: "set"
  },
  clubRank: {
    rank: 847,
    percentile: 12,
    movement: 23,
    movementPeriod: "this week"
  },
  news: [
    {
      id: "news-1",
      category: "Broncos",
      title: "Broncos sign new halfback for 2026",
      imageUrl: "/images/news-1.jpg"
    },
    {
      id: "news-2",
      category: "Highlights",
      title: "Top tries from Round 4",
      imageUrl: "/images/news-2.jpg"
    }
  ]
};

export default function DashboardNew({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  
  // Use user data or fall back to mock data
  const dashboardData = user ? {
    user: {
      firstName: user.name?.split(' ')[0] || "Fan",
      lastName: user.name?.split(' ').slice(1).join(' ') || "",
      teamId: user.teamData?.id || user.team?.toLowerCase() || "broncos",
      teamName: user.team || "Broncos",
      teamColor: user.teamData?.primaryColor || "#73003c",
      memberSince: user.memberSince || 2024
    },
    status: {
      tier: user.tier || "Rookie",
      tierColor: TIERS.find(t => t.name === (user.tier || "Rookie"))?.color || "#6b7280",
      currentPoints: user.points || 0,
      nextTierThreshold: (() => {
        const currentTier = TIERS.find(t => t.name === (user.tier || "Rookie"));
        const nextTier = TIERS.find(t => t.minPoints > (user.points || 0));
        return nextTier?.minPoints || 250;
      })(),
      nextTierName: (() => {
        const nextTier = TIERS.find(t => t.minPoints > (user.points || 0));
        return nextTier?.name || "Bronze";
      })(),
      nextTierBenefit: (() => {
        const nextTier = TIERS.find(t => t.minPoints > (user.points || 0));
        return nextTier?.reward || "Exclusive content";
      })()
    },
    streak: {
      current: user.streak || 0,
      longest: 31,
      status: user.streak > 0 ? "active" : "broken",
      lastActivityDate: new Date().toISOString().split('T')[0]
    },
    todayQuest: mockDashboardData.todayQuest,
    matesActivity: mockDashboardData.matesActivity,
    tipping: mockDashboardData.tipping,
    fantasy: mockDashboardData.fantasy,
    clubRank: mockDashboardData.clubRank,
    news: mockDashboardData.news
  } : mockDashboardData;

  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === dashboardData.user.teamName) || NRL_TEAMS[0];

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Header - Spec: G'day [FirstName] 👋 with club logo */}
      <header className="bg-transparent sticky top-0 z-20 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">
              G'day {dashboardData.user.firstName} 👋
            </h1>
          </div>
          <div className="relative w-8 h-8">
            {teamData && (
              <Image
                src={teamData.logoUrl}
                alt={teamData.name}
                fill
                className="object-contain"
                unoptimized
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Mobile-first layout */}
      <main className="px-5 pb-32">
        {activeSection === "home" && (
          <div className="space-y-4">
            {/* Status Card */}
            <StatusCard data={dashboardData.status} teamData={teamData} />
            
            {/* Streak + Quest Row */}
            <div className="grid grid-cols-2 gap-4">
              <StreakCounter data={dashboardData.streak} />
              <TodaysQuestCard data={dashboardData.todayQuest} teamData={teamData} />
            </div>

            {/* Mates Activity */}
            <MatesActivity data={dashboardData.matesActivity} />

            {/* Tips & Fantasy Cards */}
            <div className="grid grid-cols-2 gap-3">
              <TipsCard data={dashboardData.tipping} teamData={teamData} />
              <FantasyCard data={dashboardData.fantasy} teamData={teamData} />
            </div>

            {/* Club Rank */}
            <ClubRankCard data={dashboardData.clubRank} teamData={teamData} />

            {/* News Carousel */}
            <NewsCarousel data={dashboardData.news} />
          </div>
        )}
      </main>

      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
}

// Status Card Component
function StatusCard({ data, teamData }: { data: any; teamData: any }) {
  const progressPercent = data.nextTierThreshold > 0 
    ? Math.min((data.currentPoints / data.nextTierThreshold) * 100, 100)
    : 100;
  const pointsToNext = Math.max(0, data.nextTierThreshold - data.currentPoints);

  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      {/* Tier Badge Row */}
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: data.tierColor }}
        >
          <span className="text-lg">⭐</span>
        </div>
        <span 
          className="text-sm font-bold uppercase"
          style={{ color: data.tierColor }}
        >
          {data.tier}
        </span>
      </div>

      {/* Points Display */}
      <div className="mb-4">
        <div className="text-5xl font-bold text-white mb-1">
          {data.currentPoints.toLocaleString()}
        </div>
        <div className="text-sm text-nrl-text-secondary">points</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: data.tierColor
            }}
          />
        </div>
        <div className="text-sm text-nrl-text-secondary">
          {pointsToNext} pts to {data.nextTierName}
        </div>
      </div>

      {/* Benefit Preview */}
      <div className="flex items-center gap-2 text-xs text-nrl-text-muted">
        <span>🔒</span>
        <span>{data.nextTierName} unlocks: {data.nextTierBenefit}</span>
      </div>
    </div>
  );
}

// Streak Counter Component
function StreakCounter({ data }: { data: any }) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light flex flex-col items-center justify-center">
      <div className="text-3xl mb-2 animate-pulse">🔥</div>
      <div className="text-4xl font-bold text-white mb-1">{data.current}</div>
      <div className="text-xs text-nrl-text-secondary">day streak</div>
      {data.longest > data.current && (
        <div className="text-xs text-nrl-text-muted mt-2">
          Longest: {data.longest} days
        </div>
      )}
    </div>
  );
}

// Today's Quest Card Component
function TodaysQuestCard({ data, teamData }: { data: any; teamData: any }) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light">
      {data.sponsorBadge && (
        <div className="text-xs font-bold uppercase text-nrl-text-muted mb-2">
          {data.sponsorBadge} • {data.multiplier}x points
        </div>
      )}
      <div className="text-base font-bold text-white mb-1">{data.title}</div>
      <div className="text-xs text-nrl-text-secondary mb-3">{data.description}</div>
      <div className="text-sm font-semibold mb-3" style={{ color: teamData?.primaryColor || "#00A651" }}>
        +{data.pointsValue} pts
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

// Mates Activity Component
function MatesActivity({ data }: { data: any[] }) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-5 border border-nrl-border-light max-h-[280px] overflow-y-auto">
      <h3 className="text-sm font-bold uppercase text-nrl-text-secondary mb-4 tracking-wider">
        Mates
      </h3>
      <div className="space-y-3">
        {data.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 pb-3 border-b border-nrl-border-light last:border-0 ${
              activity.isCompetitive ? "bg-orange-500/10 border-l-4 border-l-orange-500 pl-3" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-sm"
              style={{
                background: `linear-gradient(135deg, ${activity.tier === "Legend" ? "#FFB800" : activity.tier === "Diehard" ? "#c0c0c0" : "#CD7F32"} 0%, transparent 100%)`
              }}
            >
              {activity.mateName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-bold text-white">{activity.mateName}</span>{" "}
                {activity.activityType === "passed_user" && "⚡ "}
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

// Tips Card Component
function TipsCard({ data, teamData }: { data: any; teamData: any }) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Tipping</h3>
        <span className="text-xl">🎯</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        {data.currentRoundCorrect}/{data.currentRoundTotal} this round
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #{data.overallRank} overall
      </div>
      <div className="text-xs text-nrl-amber mb-3">
        🔥 {data.streak}-week streak
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
function FantasyCard({ data, teamData }: { data: any; teamData: any }) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Fantasy</h3>
        <span className="text-xl">🏈</span>
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        {data.totalPoints.toLocaleString()} pts
      </div>
      <div className="text-xs text-nrl-text-secondary mb-1">
        #{data.rank.toLocaleString()} rank
      </div>
      <div className="text-xs text-nrl-green mb-3">
        Team Set ✓
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

// Club Rank Card Component
function ClubRankCard({ data, teamData }: { data: any; teamData: any }) {
  return (
    <div className="bg-nrl-dark-card rounded-xl p-4 border border-nrl-border-light">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">#{data.rank}</span>
          <span className="text-sm text-nrl-text-secondary">
            Top {data.percentile}% of {teamData?.name || "Broncos"} fans
          </span>
        </div>
        {data.movement > 0 && (
          <span className="text-xs font-bold text-green-500">↑ {data.movement}</span>
        )}
      </div>
    </div>
  );
}

// News Carousel Component
function NewsCarousel({ data }: { data: any[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold uppercase text-nrl-text-secondary mb-3 tracking-wider">
        For You
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[280px] h-40 rounded-xl bg-nrl-dark-hover border border-nrl-border-light relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <div className="text-xs font-bold uppercase text-white mb-1 bg-black/30 px-2 py-1 rounded inline-block">
                {item.category}
              </div>
              <div className="text-sm font-bold text-white line-clamp-2">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
