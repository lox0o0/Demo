"use client";

import { useState } from "react";
import { TIERS } from "@/lib/mockData";
import FanScore from "./FanScore";
import QuestsPanel from "./QuestsPanel";
import StatusCards from "./StatusCards";
import ActivityFeed from "./ActivityFeed";
import Navigation from "./Navigation";

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "quests" | "social" | "profile">("home");

  const teamData = user?.teamData;
  const teamColors = teamData 
    ? { primary: teamData.primaryColor, secondary: teamData.secondaryColor }
    : { primary: "#00A651", secondary: "#FFB800" };

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Premium background with team colors */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${teamColors.primary} 0%, transparent 50%),
                       radial-gradient(circle at 80% 50%, ${teamColors.secondary} 0%, transparent 50%),
                       linear-gradient(to bottom, #0d0d0d 0%, #000000 100%)`,
        }}
      />
      <div className="relative z-10">
        {/* Premium Header */}
        <header className="glass-strong border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {teamData && (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`,
                    }}
                  >
                    {teamData.emoji}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome back, {user?.name || "Fan"}! 👋
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">{user?.team}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {user?.streak > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-nrl-amber/30">
                    <span className="text-xl fire-animation">🔥</span>
                    <span className="font-bold text-nrl-amber">{user.streak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
          {activeTab === "home" && (
            <div className="space-y-6">
              <FanScore user={user} />
              <StatusCards user={user} />
              <QuestsPanel user={user} />
              <ActivityFeed />
            </div>
          )}

          {activeTab === "quests" && (
            <div className="space-y-6">
              <QuestsPanel user={user} expanded />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <ActivityFeed expanded />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <ProfileView user={user} />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

function ProfileView({ user }: { user: any }) {
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return user.points >= t.minPoints && (!nextTier || user.points < nextTier.minPoints);
  }) || TIERS[0];

  const nextTier = TIERS.find((t) => t.minPoints > user.points) || TIERS[TIERS.length - 1];
  const pointsToNext = nextTier.minPoints - user.points;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center text-4xl border-4 border-nrl-amber">
          {user?.name?.charAt(0) || "F"}
        </div>
        <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
        <p className="text-gray-400 mb-4">{user?.team} • Member since {user?.memberSince}</p>
        <div className="inline-block px-4 py-2 bg-nrl-amber/20 text-nrl-amber rounded-full font-semibold">
          {currentTier.name} Tier
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-nrl-green">{user?.lifetimePoints || 0}</div>
            <div className="text-sm text-gray-400">Lifetime Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user?.streak || 0}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-400">Games Attended</div>
          </div>
          <div>
            <div className="text-2xl font-bold">#847</div>
            <div className="text-sm text-gray-400">Tipping Rank</div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Progress to {nextTier.name}</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-2">
            <span>{user?.points || 0} points</span>
            <span>{nextTier.minPoints} points</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-nrl-green to-nrl-amber h-3 rounded-full transition-all"
              style={{
                width: `${Math.min((user?.points / nextTier.minPoints) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-400">
          {pointsToNext} points to unlock: {nextTier.reward}
        </p>
      </div>
    </div>
  );
}
