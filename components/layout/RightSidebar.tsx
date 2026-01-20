"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Flame, ChevronDown, Copy, Minus } from "lucide-react";

interface RightSidebarProps {
  user: any;
}

export default function RightSidebar({ user }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"quests" | "leaderboard" | "achievements">("quests");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(["achievements", "my-quests"]));
  
  const userPoints = user?.points || 0;
  const teamData = user?.teamData;
  
  // Calculate current tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  const toggleAccordion = (id: string) => {
    const newOpen = new Set(openAccordions);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenAccordions(newOpen);
  };

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
              <div role="tablist" className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-1">
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("quests")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all text-white/80 ${
                    activeTab === "quests" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Quests
                </button>
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("leaderboard")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all text-white/80 ${
                    activeTab === "leaderboard" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  type="button"
                  role="tab"
                  onClick={() => setActiveTab("achievements")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all text-white/80 ${
                    activeTab === "achievements" ? "bg-white/20 text-white shadow-sm" : ""
                  }`}
                >
                  Achievements
                </button>
              </div>

              {/* Quests Tab Content */}
              {activeTab === "quests" && (
                <div className="mt-4 space-y-3">
                  {/* Weekly Leaderboard Accordion */}
                  <div className="border-b border-white/20">
                    <h3 className="flex">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("weekly-leaderboard")}
                        className="flex flex-1 items-center justify-between font-medium transition-all text-white/80 text-xs hover:text-white hover:font-medium py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span>Weekly Leaderboard</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openAccordions.has("weekly-leaderboard") ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    {openAccordions.has("weekly-leaderboard") && (
                      <div className="pb-4 pt-2">
                        <div className="text-white/80 text-xs">Coming soon...</div>
                      </div>
                    )}
                  </div>

                  {/* Gems Balance Accordion */}
                  <div className="border-b border-white/20">
                    <h3 className="flex">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("gems")}
                        className="flex flex-1 items-center justify-between font-medium transition-all text-white/80 text-xs hover:text-white hover:font-medium py-2"
                      >
                        <div className="flex items-center justify-between w-full mr-4">
                          <span>Points Balance</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-white" />
                            <span className="text-white text-xs">{userPoints.toLocaleString()}</span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openAccordions.has("gems") ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    {openAccordions.has("gems") && (
                      <div className="pb-4 pt-2">
                        <div className="text-white/80 text-xs">Total points earned this season</div>
                      </div>
                    )}
                  </div>

                  {/* Achievements Accordion */}
                  <div className="border-b border-white/20">
                    <h3 className="flex">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("achievements")}
                        className="flex flex-1 items-center justify-between font-medium transition-all text-white/80 text-xs hover:text-white hover:font-medium py-2"
                      >
                        Achievements
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openAccordions.has("achievements") ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    {openAccordions.has("achievements") && (
                      <div className="pb-4 pt-2">
                        <div className="flex justify-between gap-2">
                          {achievements.map((achievement) => (
                            <div key={achievement.id} className="flex flex-col items-center gap-1">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                                  achievement.earned
                                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                                    : "border-white/20 bg-white/5 text-white/40"
                                }`}
                              >
                                {achievement.icon}
                              </div>
                              <span
                                className={`text-xs text-center leading-tight ${
                                  achievement.earned ? "text-white/80" : "text-white/40"
                                }`}
                              >
                                {achievement.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* My Quests Accordion */}
                  <div className="border-b border-white/20">
                    <h3 className="flex">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("my-quests")}
                        className="flex flex-1 items-center justify-between font-medium transition-all text-white/80 text-xs hover:text-white py-2"
                      >
                        My Quests
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            openAccordions.has("my-quests") ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    {openAccordions.has("my-quests") && (
                      <div className="pb-4 pt-2">
                        <div className="relative overflow-auto h-[400px] w-full">
                          <div className="h-full w-full rounded-[inherit] overflow-hidden scroll">
                            <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                  <tr className="border-b transition-colors hover:bg-white/5 border-white/20">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-white/80 text-xs">
                                      Game
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-white/80 text-xs text-right">
                                      Position
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                  {questData.map((quest, idx) => (
                                    <tr
                                      key={idx}
                                      className="border-b transition-colors border-white/10 hover:bg-white/5"
                                    >
                                      <td className="p-4 align-middle py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10">
                                            <Trophy className="w-5 h-5 text-yellow-400" />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="text-xs font-medium truncate text-white">
                                              {quest.game}
                                            </div>
                                            <div className="text-white/60 text-xs flex items-center gap-1">
                                              <Star className="w-2.5 h-2.5" />
                                              {quest.xp} XP
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-4 align-middle text-right py-3">
                                        <div className="text-xs font-medium text-white">#{quest.position}</div>
                                        <div className="text-white/60 text-xs flex items-center justify-end gap-1">
                                          <span>{quest.players} players</span>
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
                  </div>
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
                <div className="mt-4 space-y-3">
                  <div className="pb-4 pt-2">
                    <div className="flex justify-between gap-2 flex-wrap">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="flex flex-col items-center gap-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                              achievement.earned
                                ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                                : "border-white/20 bg-white/5 text-white/40"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <span
                            className={`text-xs text-center leading-tight ${
                              achievement.earned ? "text-white/80" : "text-white/40"
                            }`}
                          >
                            {achievement.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
