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

  return (
    <div className="min-h-screen bg-nrl-dark">
      {/* Background with gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-nrl-dark via-nrl-dark to-black opacity-90 z-0" />
      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                Welcome back, {user?.name || "Fan"}! 👋
              </h1>
              <p className="text-sm text-gray-400">{user?.team}</p>
            </div>
            <div className="flex items-center gap-4">
              {user?.streak > 0 && (
                <div className="flex items-center gap-2 text-nrl-amber">
                  <span className="text-xl fire-animation">🔥</span>
                  <span className="font-semibold">{user.streak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-4 pb-20">
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
