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

      {/* Stats row (3 columns) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 text-center border border-white/10">
          <div className="text-lg font-bold text-white">{gamesAttended}</div>
          <div className="text-xs text-white/60 uppercase mt-0.5">Games Attended</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 text-center border border-white/10">
          <div className="text-lg font-bold text-white">{tippingRank}</div>
          <div className="text-xs text-white/60 uppercase mt-0.5">Tipping Rank</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 text-center border border-white/10">
          <div className="text-lg font-bold text-white">{badgesEarned}</div>
          <div className="text-xs text-white/60 uppercase mt-0.5">Badges Earned</div>
        </div>
      </div>

      {/* Trophy Case section - Celebratory */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-sm font-semibold text-white/80 mb-2">Trophy Case</div>
        <div className="flex justify-between gap-2">
          {trophies.map((trophy: { id: string; name: string; icon: any; earned: boolean }) => {
            const Icon = trophy.icon;
            return (
              <div 
                key={trophy.id} 
                className="flex flex-col items-center gap-1.5 flex-1 group relative"
              >
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center border-2 relative overflow-hidden transition-all duration-300 ${
                    trophy.earned
                      ? "border-amber-400/60 bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] group-hover:scale-110"
                      : "border-white/20 bg-white/5 text-white/40"
                  }`}
                >
                  {/* Shimmer effect on hover */}
                  {trophy.earned && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"
                        style={{
                          transform: 'translateX(-100%)',
                          animation: 'shimmerSweep 1.5s ease-in-out infinite',
                        }}
                      />
                    </div>
                  )}
                  <Icon className="w-7 h-7 relative z-10" />
                  {/* Checkmark indicator */}
                  {trophy.earned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white/90 shadow-lg z-20">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs text-center leading-tight font-medium ${
                    trophy.earned ? "text-amber-300" : "text-white/40"
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
            
            // Find next unlockable tier (first tier after current that's not reached)
            const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
            const isNextUnlockable = !isReached && !isCurrentTier && index === currentTierIndex + 1;
            const isLegend = tier.name === "Legend";
            
            return (
              <div key={tier.name} className="flex items-start gap-4 relative">
                {/* Tier Marker - centered on the progress line (at 16px from parent container left) */}
                <div 
                  className="absolute flex items-center justify-center"
                  style={{ 
                    left: '-36px', // Tier row at 40px, progress bar center at 16px, so circle center needs to be at -24px from tier row. Container is 24px wide, so left edge at -36px puts center at -24px ✓
                    top: '50%',
                    transform: 'translateY(-50%)', // Center vertically only
                    width: '24px',
                    height: '24px',
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrentTier ? "animate-pulse-glow" : ""
                    } ${isLegend && !isReached ? "animate-pulse" : ""}`}
                    style={
                      isReached
                        ? {
                            borderColor: tierColor,
                            backgroundColor: tierColor,
                            boxShadow: isCurrentTier 
                              ? `0 0 16px ${tierColor}, 0 0 24px ${tierColor}80`
                              : `0 0 4px ${tierColor}60`,
                          }
                        : isLegend
                        ? {
                            borderColor: "#FFB800",
                            backgroundColor: "transparent",
                            boxShadow: "0 0 12px rgba(255, 184, 0, 0.6)",
                            background: "linear-gradient(45deg, rgba(255, 184, 0, 0.2), rgba(255, 215, 0, 0.2))",
                            backgroundClip: "padding-box",
                          }
                        : {
                            borderColor: "#6b7280",
                            backgroundColor: "transparent",
                          }
                    }
                  >
                    {isReached ? (
                      <Star 
                        className="w-4 h-4 text-white" 
                        fill="white"
                        style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                    )}
                  </div>
                  {/* Legend tier animated gradient border */}
                  {isLegend && !isReached && (
                    <div 
                      className="absolute inset-0 rounded-full border-2"
                      style={{
                        borderImage: "linear-gradient(45deg, #FFB800, #FFD700, #FFB800) 1",
                        borderImageSlice: 1,
                        animation: "spin 3s linear infinite",
                        filter: "blur(1px)",
                        opacity: 0.6,
                      }}
                    />
                  )}
                </div>

                {/* Tier Info - properly spaced, no overlap */}
                <div className={`flex-1 min-w-0 ${isNextUnlockable ? "bg-white/5 rounded-lg px-3 py-2 border border-white/20" : ""}`}>
                  {/* Tier Name Row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: tierColor }} // Always use tier color
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
                    {isNextUnlockable && (
                      <div 
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.2)",
                          borderColor: "rgba(34, 197, 94, 0.5)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          color: "#22c55e",
                        }}
                      >
                        UP NEXT
                      </div>
                    )}
                  </div>
                  
                  {/* Points Row */}
                  <div className="text-[10px] text-white/60 mb-2">
                    {tier.minPoints.toLocaleString()} pts
                  </div>
                  
                  {/* Prize Row - Enhanced for current tier */}
                  {isCurrentTier ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-yellow-300 mt-2 px-3 py-2 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 border border-yellow-400/50 rounded-lg"
                      style={{
                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)',
                        filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                      }}
                    >
                      <div style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))' }}>
                        {getRewardIcon(tier.name)}
                      </div>
                      <span className="text-yellow-200">{tier.reward || tier.access}</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[10px] ${
                      isReached ? "text-white/80" : "text-white/50"
                    }`}>
                      {getRewardIcon(tier.name)}
                      <span>{tier.reward || tier.access}</span>
                    </div>
                  )}
                  
                  {/* Legend tier special callout with sparkle effect */}
                  {isLegend && (
                    <div 
                      className="mt-3 px-3 py-2 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 border-2 border-yellow-400/60 rounded-lg relative overflow-hidden"
                      style={{
                        boxShadow: isReached 
                          ? "0 0 20px rgba(255, 184, 0, 0.6), 0 0 40px rgba(255, 184, 0, 0.3), inset 0 0 20px rgba(255, 184, 0, 0.1)"
                          : "0 0 12px rgba(255, 184, 0, 0.4)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      {/* Animated gradient border effect */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-50"
                        style={{
                          background: "linear-gradient(45deg, transparent, rgba(255, 184, 0, 0.3), transparent)",
                          backgroundSize: "200% 200%",
                          animation: "shimmer 3s ease-in-out infinite",
                        }}
                      />
                      {/* Sparkle effect overlay */}
                      {!isReached && (
                        <div className="absolute inset-0 opacity-40 pointer-events-none">
                          <Sparkles 
                            className="absolute top-1 left-2 w-2 h-2 text-yellow-300 animate-pulse" 
                            style={{ animationDelay: '0s' }}
                          />
                          <Sparkles 
                            className="absolute top-3 right-4 w-1.5 h-1.5 text-yellow-200 animate-pulse" 
                            style={{ animationDelay: '0.5s' }}
                          />
                          <Sparkles 
                            className="absolute bottom-2 left-1/2 w-2 h-2 text-amber-300 animate-pulse" 
                            style={{ animationDelay: '1s' }}
                          />
                          <Sparkles 
                            className="absolute top-1/2 right-2 w-1.5 h-1.5 text-yellow-300 animate-pulse" 
                            style={{ animationDelay: '1.5s' }}
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1 relative z-10">
                        <Plane className="w-3 h-3 text-yellow-300" />
                        <Hotel className="w-3 h-3 text-yellow-300" />
                        <Ticket className="w-3 h-3 text-yellow-300" />
                      </div>
                      <div className="text-yellow-200 font-semibold text-xs relative z-10">
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
