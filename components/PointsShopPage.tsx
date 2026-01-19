"use client";

import { useState } from "react";
import { generateMockStreakData, type StreakData } from "@/lib/streakData";
import { NRL_TEAMS } from "@/lib/data/teams";
// Note: PrizeWheel component needs to be extracted from DashboardNew.tsx
// For now, this will show a placeholder - the actual wheel will be implemented

interface PointsShopPageProps {
  user: any;
}

export default function PointsShopPage({ user }: PointsShopPageProps) {
  const teamData = user?.teamData || NRL_TEAMS.find(t => t.name === user?.team) || NRL_TEAMS[0];
  const userPoints = user?.points || 0;
  const streakData = generateMockStreakData(user);
  const [showWheel, setShowWheel] = useState(false);

  const shopItems = [
    { id: 1, name: "NRL Hat", points: 1000, image: "🧢", description: "Official NRL team hat" },
    { id: 2, name: "Team Jersey", points: 1500, image: "👕", description: "Official team jersey" },
    { id: 3, name: "Game Ticket", points: 2000, image: "🎟️", description: "Single game ticket" },
    { id: 4, name: "Signed Jersey", points: 3000, image: "⭐", description: "Signed team jersey" },
    { id: 5, name: "VIP Game Ticket", points: 5000, image: "👑", description: "VIP experience ticket" },
    { id: 6, name: "Premiership Package", points: 10000, image: "🏆", description: "Flights + Ticket + Accommodation" },
  ];

  return (
    <div className="min-h-screen bg-nrl-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shop Items */}
          <div className="space-y-6">
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h2 className="text-2xl font-bold text-white mb-2">Points Shop</h2>
              <p className="text-sm text-nrl-text-secondary mb-6">
                Redeem your points for exclusive rewards
              </p>
              
              <div className="space-y-4">
                {shopItems.map((item) => {
                  const canAfford = userPoints >= item.points;
                  
                  return (
                    <div
                      key={item.id}
                      className={`bg-nrl-dark-hover rounded-xl p-4 border ${
                        canAfford ? 'border-nrl-green/50' : 'border-nrl-border-light'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-xs text-nrl-text-secondary mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-nrl-green">{item.points.toLocaleString()} points</span>
                            {!canAfford && (
                              <span className="text-xs text-nrl-text-muted">
                                ({item.points - userPoints} more needed)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          disabled={!canAfford}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                            canAfford
                              ? 'bg-nrl-green text-white hover:bg-nrl-green/90'
                              : 'bg-nrl-dark-card text-nrl-text-muted cursor-not-allowed border border-nrl-border-light'
                          }`}
                        >
                          {canAfford ? 'Redeem' : 'Not Enough'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Prize Wheel */}
          <div className="space-y-6">
            <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
              <h2 className="text-2xl font-bold text-white mb-2">Weekly Prize Wheel</h2>
              <p className="text-sm text-nrl-text-secondary mb-6">
                Spin to win prizes! Spins earned from your streak.
              </p>
              
              {streakData.spins.available > 0 ? (
                <div className="text-center">
                  <div className="text-4xl mb-4">🎰</div>
                  <div className="text-3xl font-bold text-nrl-green mb-2">
                    {streakData.spins.available} Spins Available
                  </div>
                  <div className="text-sm text-nrl-text-secondary mb-6">
                    Your {streakData.fanStreak.currentWeeks}-week streak gives you {streakData.spins.baseSpins} base spins
                    {streakData.spins.bonusSpins > 0 && ` + ${streakData.spins.bonusSpins} bonus spins`}
                  </div>
                  <button
                    onClick={() => setShowWheel(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    Spin the Wheel
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <div className="text-lg font-semibold text-white mb-2">No Spins Available</div>
                  <div className="text-sm text-nrl-text-secondary mb-4">
                    Start a streak to earn weekly spins!
                  </div>
                  <div className="text-xs text-nrl-text-muted space-y-1">
                    <div>🔥 1-4 weeks = 1 spin</div>
                    <div>🔥 5-10 weeks = 2 spins</div>
                    <div>🔥 11-25 weeks = 3 spins</div>
                    <div>🔥 26+ weeks = 4+ spins</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prize Wheel Modal - TODO: Extract PrizeWheel component from DashboardNew */}
      {showWheel && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowWheel(false)}>
          <div className="bg-black rounded-2xl p-8 max-w-2xl w-full text-center">
            <h2 className="text-2xl font-bold text-white mb-4">🎁 Weekly Prize Wheel</h2>
            <p className="text-nrl-text-secondary mb-4">Prize Wheel component will be extracted here</p>
            <button
              onClick={() => setShowWheel(false)}
              className="px-6 py-2 bg-nrl-dark-hover border border-nrl-border-light text-white font-bold rounded-lg hover:border-nrl-green transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
