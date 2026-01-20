"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Check, Heart, Building2, Plane, Hotel, Gift, Sparkles } from "lucide-react";

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
  
  // Calculate which tiers are reached
  const getTierStatus = (tier: any) => {
    const isReached = userPoints >= tier.minPoints;
    const isCurrentTier = tier.name === currentTier.name;
    return { isReached, isCurrentTier };
  };
  
  // Tier colors
  const tierColors: Record<string, string> = {
    Rookie: "#6b7280",      // gray
    Bronze: "#CD7F32",      // bronze
    Silver: "#C0C0C0",       // silver
    Gold: "#FFD700",         // gold
    Platinum: "#E5E4E2",     // platinum
    Diehard: "#8B0000",      // maroon
    Legend: "#FFB800",       // gold/yellow
  };
  
  // Calculate progress line fill - fills from bottom to current tier position
  // Each tier takes up equal space (100% / total tiers)
  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
  const totalTiers = TIERS.length;
  // Calculate position: (tier index + 1) / total tiers * 100%
  // Add 0.5 to center the marker on the filled portion
  const progressPercent = currentTierIndex >= 0 
    ? ((currentTierIndex + 0.5) / totalTiers) * 100 
    : 0;
  
  // Get reward icons
  const getRewardIcon = (tierName: string) => {
    if (tierName === "Silver") return <Shirt className="w-3 h-3" />;
    if (tierName === "Gold") return <Shirt className="w-3 h-3" />;
    if (tierName === "Platinum") return <Ticket className="w-3 h-3" />;
    if (tierName === "Diehard") return <Award className="w-3 h-3" />;
    if (tierName === "Legend") return <Crown className="w-4 h-4" />;
    return <Gift className="w-3 h-3" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-4">
      <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Fan Journey</h3>
      
      {/* Fixed height container with flexbox layout */}
      <div className="relative" style={{ minHeight: '600px' }}>
        {/* Vertical Progress Line - positioned on left, centered for markers */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: '32px' }}>
          {/* Background track (gray) - full height */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-700/50" 
            style={{ transform: 'translateX(-50%)' }}
          />
          
          {/* Filled portion - colored from TOP down to current tier */}
          <div
            className="absolute left-1/2 top-0 w-1 transition-all duration-1000 ease-out"
            style={{
              height: `${progressPercent}%`,
              transform: 'translateX(-50%)',
              background: `linear-gradient(to bottom, 
                #6b7280 0%,
                #CD7F32 16%,
                #C0C0C0 33%,
                #FFD700 50%,
                #E5E4E2 66%,
                #8B0000 83%,
                #FFB800 100%
              )`,
            }}
          />
        </div>

        {/* Tier Rows - using flexbox with explicit gaps */}
        <div className="flex flex-col pl-10" style={{ gap: '48px' }}>
          {TIERS.map((tier, index) => {
            const { isReached, isCurrentTier } = getTierStatus(tier);
            const tierColor = tierColors[tier.name] || "#6b7280";
            
            return (
              <div key={tier.name} className="flex items-start gap-4 relative">
                {/* Tier Marker - centered on the progress line */}
                <div 
                  className="absolute left-0 flex items-center justify-center"
                  style={{ 
                    left: '0px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrentTier ? "animate-pulse-glow" : ""
                    }`}
                    style={
                      isReached
                        ? {
                            borderColor: tierColor,
                            backgroundColor: tierColor,
                            boxShadow: isCurrentTier 
                              ? `0 0 16px ${tierColor}, 0 0 24px ${tierColor}80`
                              : `0 0 4px ${tierColor}60`,
                            margin: '0 auto', // Center the marker
                          }
                        : {
                            borderColor: "#6b7280",
                            backgroundColor: "transparent",
                            margin: '0 auto', // Center the marker
                          }
                    }
                  >
                    {isReached ? (
                      <Star 
                        className="w-3 h-3 text-white" 
                        fill="white"
                        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                    )}
                  </div>
                </div>

                {/* Tier Info - properly spaced, no overlap */}
                <div className="flex-1 min-w-0">
                  {/* Tier Name Row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold uppercase"
                      style={
                        isCurrentTier
                          ? { color: tierColor }
                          : isReached
                          ? { color: tierColor }
                          : { color: "#9ca3af" }
                      }
                    >
                      {tier.name}
                    </span>
                    {isCurrentTier && (
                      <div 
                        className="px-2 py-0.5 rounded text-[10px] font-semibold animate-pulse-glow"
                        style={{
                          backgroundColor: `${tierColor}33`,
                          borderColor: `${tierColor}80`,
                          borderWidth: "1px",
                          borderStyle: "solid",
                          color: tierColor,
                          boxShadow: `0 0 8px ${tierColor}40`,
                        }}
                      >
                        YOU ARE HERE
                      </div>
                    )}
                  </div>
                  
                  {/* Points Row */}
                  <div className="text-[10px] text-white/60 mb-2">
                    {tier.minPoints.toLocaleString()} pts
                  </div>
                  
                  {/* Prize Row */}
                  <div className={`flex items-center gap-1.5 text-[10px] ${
                    isReached ? "text-white/80" : "text-white/50"
                  }`}>
                    {getRewardIcon(tier.name)}
                    <span>{tier.reward || tier.access}</span>
                  </div>
                  
                  {/* Legend tier special callout */}
                  {tier.name === "Legend" && (
                    <div className="mt-3 px-2 py-1.5 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 border border-yellow-400/40 rounded text-[10px]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Plane className="w-3 h-3 text-yellow-300" />
                        <Hotel className="w-3 h-3 text-yellow-300" />
                        <Ticket className="w-3 h-3 text-yellow-300" />
                      </div>
                      <div className="text-yellow-200 font-semibold">
                        Complete VIP Experience
                      </div>
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
