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

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-4">
      {/* Profile Header - Old Design */}
      <div className="p-4 border-b border-white/10 mb-4">
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
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">{user?.name || "Fan"}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs">
                    {currentTier.name} Tier
                  </div>
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

      {/* Stats grid (2x2) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <div className="text-xl font-bold text-white">{lifetimePoints.toLocaleString()}</div>
          <div className="text-xs text-white/60 uppercase mt-1">Lifetime Points</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <div className="text-xl font-bold text-white">{gamesAttended}</div>
          <div className="text-xs text-white/60 uppercase mt-1">Games Attended</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <div className="text-xl font-bold text-white">{tippingRank}</div>
          <div className="text-xs text-white/60 uppercase mt-1">Tipping Rank</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <div className="text-xl font-bold text-white">{badgesEarned}</div>
          <div className="text-xs text-white/60 uppercase mt-1">Badges Earned</div>
        </div>
      </div>

      {/* Trophy Case section */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-sm font-semibold text-white/80 mb-3">Trophy Case</div>
        <div className="flex justify-between">
          {trophies.map((trophy: { id: string; name: string; icon: any; earned: boolean }) => {
            const Icon = trophy.icon;
            return (
              <div key={trophy.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
                    trophy.earned
                      ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                      : "border-white/20 bg-white/5 text-white/40"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs text-center leading-tight ${
                    trophy.earned ? "text-white/80" : "text-white/40"
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
          {TIERS.map((tier) => {
            const isCurrentTier = tier.name === currentTier.name;
            const isReached = userPoints >= tier.minPoints;
            
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
                            borderColor: tier.color === "gray" ? "#6b7280" : tier.color, 
                            backgroundColor: `${tier.color === "gray" ? "#6b7280" : tier.color}33`
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
                          ? { color: tier.color === "gray" ? "#6b7280" : tier.color } 
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
