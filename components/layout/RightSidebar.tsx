"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Check, Heart, Building2, Plane, Hotel } from "lucide-react";

interface RightSidebarProps {
  user: any;
}

export default function RightSidebar({ user }: RightSidebarProps) {
  const userPoints = user?.points || 0;
  const teamData = user?.teamData;
  
  // Calculate current tier
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return userPoints >= t.minPoints && (!nextTier || userPoints < nextTier.minPoints);
  }) || TIERS[0];

  // Mock stats
  const lifetimePoints = user?.lifetimePoints || userPoints;
  const gamesAttended = "5/7";
  const tippingRank = "#847";
  const badgesEarned = 3;

  // Trophy case badges
  const trophies = [
    { id: "i-was-there", name: "I Was There", icon: Building2, earned: true },
    { id: "dedicated", name: "Dedicated", icon: Heart, earned: true },
    { id: "top-fan", name: "Top Fan", icon: Star, earned: true },
  ];

  return (
    <aside className="fixed right-0 top-0 h-full border-l border-white/20 bg-transparent backdrop-blur-md shadow-xl z-30 transition-all duration-300 ease-in-out transform w-80 translate-x-0 overflow-auto">
      <div className="bg-transparent overflow-auto h-full">
        <div className="p-6 space-y-6" style={{ position: 'sticky', top: '20px' }}>
          {/* Top Section: Current Tier Stats Card */}
          <CurrentTierStatsCard 
            user={user}
            teamData={teamData}
            currentTier={currentTier}
            userPoints={userPoints}
            lifetimePoints={lifetimePoints}
            gamesAttended={gamesAttended}
            tippingRank={tippingRank}
            badgesEarned={badgesEarned}
            trophies={trophies}
          />

          {/* Bottom Section: Fan Journey Progression */}
          <FanJourneyProgression 
            userPoints={userPoints}
            currentTier={currentTier}
          />
        </div>
      </div>
    </aside>
  );
}

// Current Tier Stats Card
function CurrentTierStatsCard({ 
  user, 
  teamData, 
  currentTier, 
  userPoints, 
  lifetimePoints, 
  gamesAttended, 
  tippingRank, 
  badgesEarned,
  trophies 
}: any) {
  const firstName = user?.name?.split(' ')[0] || "Fan";
  
  // Get tier badge gradient
  const getTierBadgeStyle = (tierName: string) => {
    if (tierName === "Legend") {
      return "bg-gradient-to-r from-yellow-500 to-amber-400 text-black";
    }
    if (tierName === "Gold") {
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black";
    }
    if (tierName === "Silver") {
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-black";
    }
    if (tierName === "Bronze") {
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
    }
    return "bg-gray-600 text-white";
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        {teamData && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={teamData.logoUrl}
              alt={teamData.name}
              width={48}
              height={48}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{firstName}</h3>
          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${getTierBadgeStyle(currentTier.name)}`}>
            {currentTier.name.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Current Points display */}
      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-1">Current Points:</div>
        <div className="text-2xl font-bold text-white">{userPoints.toLocaleString()}</div>
      </div>

      {/* Stats grid (2x2) */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{lifetimePoints.toLocaleString()}</div>
          <div className="text-xs text-gray-400 uppercase mt-1">Lifetime Points</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{gamesAttended}</div>
          <div className="text-xs text-gray-400 uppercase mt-1">Games Attended</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{tippingRank}</div>
          <div className="text-xs text-gray-400 uppercase mt-1">Tipping Rank</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{badgesEarned}</div>
          <div className="text-xs text-gray-400 uppercase mt-1">Badges Earned</div>
        </div>
      </div>

      {/* Trophy Case section */}
      <div className="mt-6">
        <div className="text-sm font-semibold text-gray-300 mb-3">Trophy Case</div>
        <div className="flex justify-between mt-3">
          {trophies.map((trophy: { id: string; name: string; icon: any; earned: boolean }) => {
            const Icon = trophy.icon;
            return (
              <div key={trophy.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    trophy.earned
                      ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                      : "bg-gray-800/50 border-2 border-gray-700/50 opacity-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      trophy.earned ? "text-yellow-400" : "text-gray-600"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs text-center ${
                    trophy.earned ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  {trophy.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Fan Journey Progression
function FanJourneyProgression({ userPoints, currentTier }: { userPoints: number; currentTier: any }) {
  const isMaxTier = currentTier.name === "Legend" && userPoints >= currentTier.minPoints;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
        FAN JOURNEY
      </div>

      {/* Vertical timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />

        {/* Tiers */}
        <div className="space-y-6">
          {TIERS.map((tier, index) => {
            const isCurrent = tier.name === currentTier.name;
            const isCompleted = userPoints >= tier.minPoints;
            const isLegend = tier.name === "Legend";

            return (
              <div key={tier.name} className="relative">
                {/* Circle indicator */}
                <div
                  className="absolute left-0 transform -translate-x-1/2"
                  style={{ left: '16px' }}
                >
                  {isCurrent && isLegend ? (
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/50 to-amber-500/50 animate-ping" />
                    </div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: isCompleted ? (tier.color || "#6b7280") : "#374151",
                        border: isCompleted ? "none" : "2px solid #4b5563"
                      }}
                    >
                      {isCompleted && !isCurrent && (
                        <Check className="w-2 h-2 text-white m-0.5" />
                      )}
                    </div>
                  )}
                </div>

                {/* Tier info */}
                <div
                  className={`ml-6 ${
                    isCurrent && isLegend
                      ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-l-2 border-yellow-500 p-4 rounded-r-xl"
                      : isCompleted
                      ? "opacity-80"
                      : ""
                  }`}
                >
                  {/* Tier name */}
                  <div className="flex items-center gap-2 mb-1">
                    {isCurrent && isLegend ? (
                      <>
                        <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                          {tier.name}
                        </span>
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold">
                          YOU ARE HERE
                        </span>
                      </>
                    ) : (
                      <span className={`text-sm font-semibold ${isCompleted ? "text-gray-400" : "text-gray-500"}`}>
                        {tier.name}
                      </span>
                    )}
                  </div>

                  {/* Points */}
                  <div className={`text-xs mb-1 ${isCompleted ? "text-gray-500" : "text-gray-600"}`}>
                    {tier.minPoints.toLocaleString()} pts
                  </div>

                  {/* Prize */}
                  {isCurrent && isLegend ? (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        YOUR REWARD:
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
                        <div className="text-white font-semibold">Premiership Package</div>
                        <div className="space-y-1.5 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-yellow-400" />
                            <span>Return flights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-yellow-400" />
                            <span>Grand Final tickets</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hotel className="w-4 h-4 text-yellow-400" />
                            <span>3-night accommodation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-xs ${isCompleted ? "text-gray-500" : "text-gray-600"}`}>
                      {tier.reward || tier.access}
                    </div>
                  )}

                  {/* Status */}
                  {isCompleted && !isCurrent && (
                    <div className="text-xs text-gray-500 mt-1">✓ Complete</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom celebration for max tier */}
        {isMaxTier && (
          <div className="mt-6 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">MAXIMUM TIER ACHIEVED</span>
            </div>
            <div className="text-sm text-gray-300">You're a true legend!</div>
          </div>
        )}
      </div>
    </div>
  );
}
