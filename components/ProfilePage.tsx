"use client";

import { useState } from "react";
import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { NRL_TEAMS } from "@/lib/data/teams";

interface ProfilePageProps {
  user: any;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const profileCompletion = user?.profileCompletion || 0;
  const userPoints = user?.points || 0;
  
  // Calculate tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];
  
  const nextTier = TIERS.find(t => t.minPoints > currentTier.minPoints) || TIERS[TIERS.length - 1];
  const pointsToNext = Math.max(0, nextTier.minPoints - userPoints);
  const progressPercent = nextTier.minPoints > currentTier.minPoints
    ? Math.min(((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100, 100)
    : 100;

  return (
    <div className="min-h-screen bg-nrl-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Identity Card, Tier Progress, Profile Completion */}
          <div className="lg:col-span-1 space-y-6">
            {/* Identity Card */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || "F"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name || "Fan"}</h2>
                  <p className="text-sm text-nrl-text-secondary">{user?.team || "No team"}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-nrl-text-secondary">Email</span>
                  <span className="text-white">{user?.email || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nrl-text-secondary">Member Since</span>
                  <span className="text-white">{user?.memberSince || new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Tier Progress</h3>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: currentTier.color }}
                >
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase" style={{ color: currentTier.color }}>
                    {currentTier.name} Tier
                  </div>
                  <div className="text-xs text-nrl-text-secondary">{userPoints.toLocaleString()} points</div>
                </div>
              </div>
              <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: currentTier.color 
                  }}
                />
              </div>
              <div className="text-xs text-nrl-text-secondary">
                {pointsToNext > 0 ? `${pointsToNext} points to ${nextTier.name}` : "Max tier reached"}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Profile Completion</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-nrl-text-secondary">Progress</span>
                <span className="text-sm font-bold text-nrl-green">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-4">
                <div
                  className="h-2 rounded-full transition-all bg-gradient-to-r from-nrl-green to-nrl-amber"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={user?.dob ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                    {user?.dob ? '✓' : '○'}
                  </span>
                  <span className="text-nrl-text-secondary">DOB</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={user?.gender ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                    {user?.gender ? '✓' : '○'}
                  </span>
                  <span className="text-nrl-text-secondary">Gender</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={user?.homeGround ? 'text-nrl-green' : 'text-nrl-text-muted'}>
                    {user?.homeGround ? '✓' : '○'}
                  </span>
                  <span className="text-nrl-text-secondary">Home Ground</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Badges, Mates, Season Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Badges */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "I Was There", desc: "Attended 5/7 Broncos games", icon: "🎟️" },
                  { name: "Dedicated", desc: "10 week streak", icon: "🔥" },
                  { name: "Top Fan", desc: "Top 12% of Broncos fans", icon: "⭐" },
                ].map((badge, idx) => (
                  <div key={idx} className="bg-nrl-dark-hover rounded-xl p-3 text-center border border-nrl-border-light">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-semibold text-white">{badge.name}</div>
                    <div className="text-[10px] text-nrl-text-muted mt-1">{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mates */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Mates</h3>
              <div className="space-y-3">
                {[
                  { name: "Dave", activity: "just completed tipping (7/8)", time: "2h ago" },
                  { name: "Sarah", activity: "hit a 15-week streak", time: "5h ago" },
                  { name: "Mike", activity: "reached Gold tier!", time: "1d ago" },
                ].map((mate, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b border-nrl-border-light last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center font-semibold text-sm text-white">
                      {mate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{mate.name}</div>
                      <div className="text-xs text-nrl-text-secondary">{mate.activity}</div>
                      <div className="text-[10px] text-nrl-text-muted">{mate.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Stats */}
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Season Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{user?.lifetimePoints || 0}</div>
                  <div className="text-xs text-nrl-text-secondary">Lifetime Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5/7</div>
                  <div className="text-xs text-nrl-text-secondary">Games Attended</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">#847</div>
                  <div className="text-xs text-nrl-text-secondary">Tipping Rank</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="text-xs text-nrl-text-secondary">Week Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h3 className="text-lg font-bold text-white mb-4">Leaderboards</h3>
              <div className="bg-nrl-dark-hover rounded-xl p-4 mb-4 border border-nrl-border-light">
                <div className="text-3xl font-bold text-nrl-green mb-2">#847</div>
                <div className="text-sm text-white font-semibold mb-1">Top 12% of Broncos fans</div>
                <div className="text-xs text-nrl-text-secondary">Up 23 places this week</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-nrl-text-secondary mb-2">Top Fans This Week</div>
                {[
                  { rank: 1, name: "BroncosFan23", points: "12,450", change: "+5" },
                  { rank: 2, name: "QLD4Life", points: "11,890", change: "+2" },
                  { rank: 3, name: "MaroonArmy", points: "11,200", change: "-1" },
                ].map((fan, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-nrl-border-light last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-nrl-green/20 flex items-center justify-center text-xs font-bold text-nrl-green">
                        {fan.rank}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{fan.name}</div>
                        <div className="text-xs text-nrl-text-secondary">{fan.points} pts</div>
                      </div>
                    </div>
                    <div className={`text-xs font-semibold ${fan.change.startsWith('+') ? 'text-nrl-green' : 'text-nrl-text-muted'}`}>
                      {fan.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
