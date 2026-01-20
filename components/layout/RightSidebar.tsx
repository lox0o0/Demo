"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Flame, ChevronDown, Copy, Minus, Gift } from "lucide-react";

interface RightSidebarProps {
  user: any;
}

export default function RightSidebar({ user }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"quests" | "leaderboard" | "achievements">("quests");
  
  const userPoints = user?.points || 0;
  const teamData = user?.teamData;
  
  // Calculate current tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  // Calculate progress for Fan Journey
  const maxTier = TIERS[TIERS.length - 1];
  const maxPoints = maxTier.minPoints;
  const progressPercent = Math.min((userPoints / maxPoints) * 100, 100);

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "BroncosFan23", points: 12450, xp: 1250, players: 847 },
    { rank: 2, name: "QLD4Life", points: 11890, xp: 890, players: 1203 },
    { rank: 3, name: "MaroonArmy", points: 11200, xp: 675, players: 542 },
    { rank: 4, name: "StormChaser", points: 10800, xp: 450, players: 892 },
    { rank: 5, name: user?.name || "You", points: userPoints, xp: 380, players: 234, isUser: true },
  ];

  // Mock achievements
  const achievements = [
    { id: "first-quest", name: "First Quest", icon: "🏆", earned: true },
    { id: "speed-runner", name: "Speed Runner", icon: "⚡", earned: true },
    { id: "collector", name: "Collector", icon: "💎", earned: true },
    { id: "explorer", name: "Explorer", icon: "🗺️", earned: false },
    { id: "master", name: "Master", icon: "👑", earned: false },
  ];

  // Mock quest data
  const questData = [
    { game: "Broncos Fantasy", position: 3, xp: 1250, players: 847 },
    { game: "Tipping Challenge", position: 12, xp: 890, players: 1203 },
    { game: "MVP Predictions", position: 8, xp: 675, players: 542 },
  ];

  return (
    <aside className="fixed right-0 top-0 h-full border-l border-white/20 bg-transparent backdrop-blur-md shadow-xl z-30 transition-all duration-300 ease-in-out transform w-80 translate-x-0 overflow-auto">
      <div className="bg-transparent overflow-auto h-full">
        <div className="pt-6 bg-transparent">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors text-white/80 hover:bg-transparent hover:text-white/80 h-8 w-8 focus:outline-none">
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-16 h-16 border border-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  {teamData ? (
                    <Image
                      src={teamData.logoUrl}
                      alt={teamData.name}
                      width={64}
                      height={64}
                      className="aspect-square h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {user?.name?.charAt(0) || "F"}
                      </span>
                    </div>
                  )}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{user?.name || "Fan"}</h3>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs">
                        {currentTier.name} Tier
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-6 w-6 text-white/60 hover:text-white hover:bg-white/10">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Current Points:</span>
                        <span className="text-white font-semibold text-sm font-mono">{userPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4">
            <div className="mt-4">
              <div role="tablist" className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-2 gap-2">
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("quests")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-xs font-medium transition-all text-white/80 ${
                    activeTab === "quests" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Quests
                </button>
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("leaderboard")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-xs font-medium transition-all text-white/80 ${
                    activeTab === "leaderboard" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("achievements")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-xs font-medium transition-all text-white/80 ${
                    activeTab === "achievements" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Achievements
                </button>
              </div>

              {/* Quests Tab Content - Fan Journey Tier Rewards */}
              {activeTab === "quests" && (
                <div className="mt-4">
                  <FanJourneyTierRewards userPoints={userPoints} currentTier={currentTier} />
                </div>
              )}

              {/* Leaderboard Tab Content */}
              {activeTab === "leaderboard" && (
                <div className="mt-4">
                  <div className="relative overflow-auto h-[500px] w-full">
                    <div className="h-full w-full rounded-[inherit] overflow-hidden scroll">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-white/5 border-white/20">
                              <th className="h-12 px-4 text-left align-middle font-medium text-white/80 text-xs">
                                Rank
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-white/80 text-xs">
                                Fan
                              </th>
                              <th className="h-12 px-4 align-middle font-medium text-white/80 text-xs text-right">
                                Points
                              </th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {leaderboardData.map((entry) => (
                              <tr
                                key={entry.rank}
                                className={`border-b transition-colors border-white/10 hover:bg-white/5 ${
                                  entry.isUser ? "bg-white/5" : ""
                                }`}
                              >
                                <td className="p-4 align-middle py-3">
                                  <div className="text-xs font-medium text-white">#{entry.rank}</div>
                                </td>
                                <td className="p-4 align-middle py-3">
                                  <div className="text-xs font-medium text-white">{entry.name}</div>
                                  {entry.isUser && (
                                    <div className="text-white/60 text-xs">You</div>
                                  )}
                                </td>
                                <td className="p-4 align-middle text-right py-3">
                                  <div className="text-xs font-medium text-white">
                                    {entry.points.toLocaleString()}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Tab Content */}
              {activeTab === "achievements" && (
                <div className="mt-4">
                  <FanJourneyTierRewards userPoints={userPoints} currentTier={currentTier} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Fan Journey Tier Rewards Component
function FanJourneyTierRewards({ userPoints, currentTier }: { userPoints: number; currentTier: any }) {
  const maxTier = TIERS[TIERS.length - 1];
  const maxPoints = maxTier.minPoints;
  
  // Calculate progress fill height
  const progressPercent = Math.min((userPoints / maxPoints) * 100, 100);
  
  // Get reward icons for each tier
  const getRewardIcon = (tierName: string) => {
    if (tierName === "Silver") return <Shirt className="w-3 h-3" />;
    if (tierName === "Gold") return <Shirt className="w-3 h-3" />;
    if (tierName === "Platinum") return <Ticket className="w-3 h-3" />;
    if (tierName === "Diehard") return <Award className="w-3 h-3" />;
    if (tierName === "Legend") return <Crown className="w-3 h-3" />;
    return <Gift className="w-3 h-3" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-4">
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Fan Journey</h3>
      
      {/* Vertical Progress Bar Container */}
      <div className="relative">
        {/* Progress Fill Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700/50">
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-cyan-500 transition-all duration-1000 ease-out"
            style={{ height: `${progressPercent}%` }}
          >
            {/* Shine animation on progress fill */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
              style={{
                animation: 'shimmer 2s ease-in-out infinite',
                backgroundSize: '100% 200%',
              }}
            />
          </div>
        </div>

        {/* Tier Markers */}
        <div className="space-y-6 relative">
          {TIERS.map((tier, index) => {
            const isCurrentTier = tier.name === currentTier.name;
            const isReached = userPoints >= tier.minPoints;
            const tierPosition = (tier.minPoints / maxPoints) * 100;
            
            return (
              <div key={tier.name} className="relative flex items-start gap-3">
                {/* Tier Circle Marker */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrentTier
                        ? "shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse-glow"
                        : isReached
                        ? ""
                        : "border-white/20 bg-white/5"
                    }`}
                    style={
                      isCurrentTier
                        ? { 
                            borderColor: "#22c55e", 
                            backgroundColor: "rgba(34, 197, 94, 0.2)",
                            boxShadow: "0 0 12px rgba(34, 197, 94, 0.6)"
                          }
                        : isReached
                        ? { 
                            borderColor: tier.color, 
                            backgroundColor: `${tier.color}33`
                          }
                        : {}
                    }
                  >
                    {isReached ? (
                      <Star className="w-4 h-4 text-white" fill="currentColor" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                    )}
                  </div>
                </div>

                {/* Tier Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase ${
                        isCurrentTier ? "" : isReached ? "" : "text-white/60"
                      }`}
                      style={
                        isCurrentTier 
                          ? { color: "#22c55e" } 
                          : isReached 
                          ? { color: tier.color } 
                          : {}
                      }
                    >
                      {tier.name}
                    </span>
                    {isCurrentTier && (
                      <div 
                        className="px-2 py-0.5 rounded text-[10px] font-semibold animate-pulse-glow"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.2)",
                          borderColor: "rgba(34, 197, 94, 0.5)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          color: "#22c55e"
                        }}
                      >
                        YOU ARE HERE
                      </div>
                    )}
                  </div>
                  
                  {/* Points threshold */}
                  <div className="text-[10px] text-white/60 mb-1">
                    {tier.minPoints.toLocaleString()} pts
                  </div>
                  
                  {/* Reward description */}
                  <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                    {getRewardIcon(tier.name)}
                    <span>{tier.reward || tier.access}</span>
                  </div>
                  
                  {/* Legend tier special callout */}
                  {tier.name === "Legend" && isReached && (
                    <div 
                      className="mt-2 px-2 py-1 rounded text-[10px] flex items-center gap-1"
                      style={{
                        background: "linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.1))",
                        borderColor: "rgba(255, 184, 0, 0.4)",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        color: "#FFB800"
                      }}
                    >
                      <Trophy className="w-3 h-3" />
                      <span className="font-semibold">Grand Final Pack</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
