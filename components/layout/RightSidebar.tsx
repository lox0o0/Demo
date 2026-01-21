"use client";

import Image from "next/image";
import { TIERS } from "@/lib/mockData";
import { Trophy, Star, Ticket, Shirt, Award, Crown, Check, Heart, Building2, Plane, Hotel, Gift, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-3">
      {/* Profile Header - Compact Design */}
      <div className="pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0">
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border border-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform">
              {teamData ? (
                <Image
                  src={teamData.logoUrl}
                  alt={teamData.name}
                  width={40}
                  height={40}
                  className="aspect-square h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0) || "F"}
                  </span>
                </div>
              )}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-0.5 leading-tight">{user?.name || "Fan"}</h3>
            <div className="flex items-center gap-1.5 mb-1">
              <div 
                className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold backdrop-blur-md text-white border text-xs"
                style={{
                  backgroundColor: `${currentTier.color || '#C0C0C0'}33`,
                  borderColor: `${currentTier.color || '#C0C0C0'}80`,
                }}
              >
                {currentTier.name} Tier
              </div>
            </div>
            <div>
              <div className="text-white/60 text-[10px] mb-0 leading-tight">Current Points</div>
              <div className="text-white font-bold text-base leading-tight">{userPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Prizes row (3 columns) */}
      <div className="grid grid-cols-1 gap-1.5 mb-2">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <Shirt className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/60 mb-0 leading-tight">Recent prize earned</div>
            <div className="text-xs font-semibold text-white leading-tight">Signed Broncos Jersey</div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/60 mb-0 leading-tight">Recent prize earned</div>
            <div className="text-xs font-semibold text-white leading-tight">Home Ground Tickets</div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center">
              <Gift className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/60 mb-0 leading-tight">Recent prize earned</div>
            <div className="text-xs font-semibold text-white leading-tight">$10 KFC Voucher</div>
          </div>
        </div>
      </div>

      {/* Claim More Rewards CTA */}
      <div className="pt-2 border-t border-white/10">
        <button className="w-full bg-gradient-to-r from-nrl-green/20 to-nrl-green/10 hover:from-nrl-green/30 hover:to-nrl-green/20 border-2 border-nrl-green/50 rounded-lg p-2 flex items-center justify-between group transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-nrl-green/20 border border-nrl-green/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-4 h-4 text-nrl-green" />
            </div>
            <div className="text-sm font-bold text-white">Claim More Rewards</div>
          </div>
          <ArrowRight className="w-4 h-4 text-nrl-green group-hover:translate-x-1 transition-transform" />
        </button>
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

  // Calculate next tier and progress
  const nextTier = TIERS.find((t) => t.minPoints > userPoints);
  const pointsToNext = nextTier ? nextTier.minPoints - userPoints : 0;
  const tierRange = nextTier && currentTier ? nextTier.minPoints - currentTier.minPoints : 0;
  const progressToNext = tierRange > 0 ? ((userPoints - currentTier.minPoints) / tierRange) * 100 : 0;
  // Show progress bar when progressing to next tier (not at max tier and has progress)
  const showProgressBar = nextTier && progressToNext > 0 && progressToNext < 100;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-4">
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Fan Journey</h3>
      
      {/* Progress Bar - Show when progressing to next tier */}
      {showProgressBar && nextTier && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/80">
              {pointsToNext} pts to {nextTier.name}
            </span>
            <span className="text-xs text-white/60">
              {userPoints} / {nextTier.minPoints} pts
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden relative" style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(progressToNext, 100)}%`,
                background: `linear-gradient(to right, ${tierColors[currentTier.name] || currentTier.color}, ${tierColors[nextTier.name] || nextTier.color})`,
                boxShadow: `0 0 8px ${tierColors[nextTier.name] || nextTier.color}60`,
              }}
            />
          </div>
        </div>
      )}
      
      {/* Reduced height container with flexbox layout */}
      <div className="relative" style={{ minHeight: '400px' }}>
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

        {/* Tier Rows - using flexbox with reduced gaps */}
        <div className="flex flex-col pl-10" style={{ gap: '32px' }}>
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
