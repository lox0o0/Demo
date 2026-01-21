"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Info, Gift, Shirt, Ticket, Star } from "lucide-react";
import { TIERS } from "@/lib/mockData";

interface LeaderboardsProps {
  user: any;
}

type LeaderboardTab = "fan-tier" | "tipping" | "fantasy";

interface FanTierEntry {
  rank: number;
  player: string;
  tier: string;
  points: number;
  movement: number | null; // positive = up, negative = down, null = no change
}

interface TippingEntry {
  rank: number;
  player: string;
  correct: string; // "45/49"
  accuracy: number; // percentage
  streak: number;
  movement: number | null;
}

interface FantasyEntry {
  rank: number;
  player: string;
  totalPts: number;
  weekPts: number;
  captain: string;
  movement: number | null;
}

export default function Leaderboards({ user }: LeaderboardsProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("fan-tier");

  // Mock data for Fan Tier leaderboard
  const fanTierData: FanTierEntry[] = [
    { rank: 1, player: "ChampionFan", tier: "LEGEND", points: 12450, movement: 5 },
    { rank: 2, player: "EliteSupporter", tier: "LEGEND", points: 11890, movement: 2 },
    { rank: 3, player: "TrueBeliever", tier: "LEGEND", points: 11200, movement: -1 },
    { rank: 4, player: "DieHardDoug", tier: "DIEHARD", points: 9800, movement: 47 },
    { rank: 5, player: "BroncosBeast", tier: "DIEHARD", points: 9540, movement: 12 },
    { rank: 6, player: "QLDForever", tier: "DIEHARD", points: 8920, movement: null },
    { rank: 7, player: "StormChaser", tier: "DIEHARD", points: 8100, movement: -3 },
    { rank: 8, player: "PanthersPower", tier: "DIEHARD", points: 7850, movement: 8 },
    { rank: 9, player: "RoostersRage", tier: "DIEHARD", points: 7200, movement: -2 },
    { rank: 10, player: "SharksSharp", tier: "DIEHARD", points: 6800, movement: 15 },
  ];

  // Mock data for Tipping leaderboard
  const tippingData: TippingEntry[] = [
    { rank: 1, player: "TippingKing", correct: "45/49", accuracy: 92, streak: 8, movement: null },
    { rank: 2, player: "PredictorPro", correct: "44/49", accuracy: 90, streak: 5, movement: 1 },
    { rank: 3, player: "OracleFan", correct: "43/49", accuracy: 88, streak: 3, movement: -1 },
    { rank: 4, player: "SharpShooter", correct: "42/49", accuracy: 86, streak: 4, movement: 3 },
    { rank: 5, player: "BettingBoss", correct: "41/49", accuracy: 84, streak: 2, movement: 2 },
    { rank: 6, player: "NostradamuNRL", correct: "41/49", accuracy: 84, streak: 6, movement: -2 },
    { rank: 7, player: "TipMaster", correct: "40/49", accuracy: 82, streak: 4, movement: 1 },
    { rank: 8, player: "RoundWinner", correct: "39/49", accuracy: 80, streak: 2, movement: -1 },
    { rank: 9, player: "LuckyLad", correct: "38/49", accuracy: 78, streak: 1, movement: 3 },
    { rank: 10, player: "GameGuru", correct: "37/49", accuracy: 76, streak: 5, movement: -3 },
  ];

  // Mock data for Fantasy leaderboard
  const fantasyData: FantasyEntry[] = [
    { rank: 1, player: "FantasyGuru", totalPts: 4521, weekPts: 456, captain: "Cleary", movement: 2 },
    { rank: 2, player: "DreamTeamDan", totalPts: 4498, weekPts: 423, captain: "Munster", movement: -1 },
    { rank: 3, player: "CoachCarl", totalPts: 4456, weekPts: 398, captain: "Tedesco", movement: -1 },
    { rank: 4, player: "SquadMaster", totalPts: 4389, weekPts: 445, captain: "Hynes", movement: 4 },
    { rank: 5, player: "LineupLegend", totalPts: 4320, weekPts: 412, captain: "Cleary", movement: null },
    { rank: 6, player: "TradeKing", totalPts: 4287, weekPts: 389, captain: "DCE", movement: 1 },
    { rank: 7, player: "BenchBoss", totalPts: 4200, weekPts: 375, captain: "Ponga", movement: -2 },
    { rank: 8, player: "CaptainCool", totalPts: 4156, weekPts: 398, captain: "Hughes", movement: 3 },
    { rank: 9, player: "RookieRuler", totalPts: 4100, weekPts: 365, captain: "Walsh", movement: -1 },
    { rank: 10, player: "VeteranVic", totalPts: 4050, weekPts: 350, captain: "Cleary", movement: 2 },
  ];

  // User's position (mock - in real app, this would come from API)
  const userFanTierRank = 847;
  const userFanTierPoints = 1900;
  const userFanTierTier = "SILVER";
  const userFanTierMovement = 23;
  const userFanTierPointsBehind = 275;
  const userFanTierPlayerAhead = "QLD4Life";

  const userTippingRank = 156;
  const userTippingCorrect = "32/49";
  const userTippingAccuracy = 65;
  const userTippingStreak = 2;
  const userTippingMovement = -5;

  const userFantasyRank = 234;
  const userFantasyTotalPts = 3850;
  const userFantasyWeekPts = 312;
  const userFantasyCaptain = "Cleary";
  const userFantasyMovement = 8;

  const getTierColor = (tierName: string) => {
    const tier = TIERS.find(t => t.name.toUpperCase() === tierName.toUpperCase());
    return tier?.color || "#C0C0C0";
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <Trophy className="w-3.5 h-3.5 text-amber-500/70" />;
  };

  const renderMovement = (movement: number | null) => {
    if (movement === null) {
      return <span className="text-gray-500 inline-flex items-center justify-center gap-0.5 text-xs"><Minus className="w-3 h-3" /> —</span>;
    }
    if (movement > 0) {
      return <span className="text-emerald-400 inline-flex items-center justify-center gap-0.5 text-xs"><TrendingUp className="w-3 h-3" /> ↑ {movement}</span>;
    }
    return <span className="text-red-400 inline-flex items-center justify-center gap-0.5 text-xs"><TrendingDown className="w-3 h-3" /> ↓ {Math.abs(movement)}</span>;
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image - Leaderboards specific */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/leaderboards/leaderboards.webp"
          alt="Leaderboards Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark Overlay for Content Readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-2 relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <Trophy className="w-5 h-5 text-white" />
          <h1 className="text-xl font-bold text-white">Leaderboards</h1>
        </div>
        <p className="text-nrl-text-secondary text-xs">See how you stack up against other fans</p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 relative z-10">
        <div className="flex gap-2 border-b-2 border-white/20">
          <button
            onClick={() => setActiveTab("fan-tier")}
            className={`px-4 py-1.5 text-sm font-bold transition-all ${
              activeTab === "fan-tier"
                ? "text-nrl-green border-b-3 border-nrl-green"
                : "text-nrl-text-secondary hover:text-nrl-text-primary"
            }`}
          >
            Fan Tier
          </button>
          <button
            onClick={() => setActiveTab("tipping")}
            className={`px-4 py-1.5 text-sm font-bold transition-all ${
              activeTab === "tipping"
                ? "text-nrl-green border-b-3 border-nrl-green"
                : "text-nrl-text-secondary hover:text-nrl-text-primary"
            }`}
          >
            Tipping
          </button>
          <button
            onClick={() => setActiveTab("fantasy")}
            className={`px-4 py-1.5 text-sm font-bold transition-all ${
              activeTab === "fantasy"
                ? "text-nrl-green border-b-3 border-nrl-green"
                : "text-nrl-text-secondary hover:text-nrl-text-primary"
            }`}
          >
            Fantasy
          </button>
        </div>
      </div>

      {/* Selected Tab Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 relative z-10">
        <h2 className="text-xl font-bold text-white">
          {activeTab === "fan-tier" && "Fan Tier Rankings"}
          {activeTab === "tipping" && "Tipping Competition"}
          {activeTab === "fantasy" && "Fantasy League"}
        </h2>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 relative z-10">
        {activeTab === "fan-tier" && (
          <FanTierLeaderboard
            data={fanTierData}
            userRank={userFanTierRank}
            userPoints={userFanTierPoints}
            userTier={userFanTierTier}
            userMovement={userFanTierMovement}
            pointsBehind={userFanTierPointsBehind}
            playerAhead={userFanTierPlayerAhead}
            getTierColor={getTierColor}
            getMedalIcon={getMedalIcon}
            renderMovement={renderMovement}
            user={user}
          />
        )}

        {activeTab === "tipping" && (
          <TippingLeaderboard
            data={tippingData}
            userRank={userTippingRank}
            userCorrect={userTippingCorrect}
            userAccuracy={userTippingAccuracy}
            userStreak={userTippingStreak}
            userMovement={userTippingMovement}
            getMedalIcon={getMedalIcon}
            renderMovement={renderMovement}
            user={user}
          />
        )}

        {activeTab === "fantasy" && (
          <FantasyLeaderboard
            data={fantasyData}
            userRank={userFantasyRank}
            userTotalPts={userFantasyTotalPts}
            userWeekPts={userFantasyWeekPts}
            userCaptain={userFantasyCaptain}
            userMovement={userFantasyMovement}
            getMedalIcon={getMedalIcon}
            renderMovement={renderMovement}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

// Prize Banner Component
function PrizeBanner({ title, prize, countdown, countdownLabel }: { title: string; prize: string; countdown: string; countdownLabel?: string }) {
  // Determine icon based on prize type
  const getPrizeIcon = () => {
    const prizeLower = prize.toLowerCase();
    if (prizeLower.includes("jersey") || prizeLower.includes("jersey")) {
      return <Shirt className="w-4 h-4 text-amber-300" />;
    }
    if (prizeLower.includes("voucher") || prizeLower.includes("shop")) {
      return <Ticket className="w-4 h-4 text-amber-300" />;
    }
    if (prizeLower.includes("vip") || prizeLower.includes("experience") || prizeLower.includes("game day")) {
      return <Star className="w-4 h-4 text-amber-300" />;
    }
    return <Gift className="w-4 h-4 text-amber-300" />;
  };

  return (
    <div className="mb-3 p-3 rounded-lg backdrop-blur-md bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-500/20 border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 animate-pulse"></div>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border-2 border-amber-400/50 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-amber-300" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-1 tracking-wide">{title}</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 shadow-lg">
              {getPrizeIcon()}
            </div>
            <span className="text-sm font-bold text-amber-200">{prize}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-amber-400/30">
            <span className="text-nrl-text-secondary text-xs">
              {countdownLabel || "Resets in"}: <span className="text-white font-bold text-sm">{countdown}</span>
            </span>
            <button className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 rounded-lg text-amber-200 hover:text-white font-semibold text-xs flex items-center gap-1 transition-all">
              Learn More <Info className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Position Card
function UserPositionCard({ 
  rank, 
  movement, 
  points, 
  tier, 
  pointsBehind, 
  playerAhead,
  getTierColor,
  renderMovement,
  customContent 
}: {
  rank: number;
  movement: number;
  points: number;
  tier: string;
  pointsBehind?: number;
  playerAhead?: string;
  getTierColor: (tier: string) => string;
  renderMovement: (movement: number | null) => JSX.Element;
  customContent?: React.ReactNode;
}) {
  return (
    <div className="mb-3 p-3 rounded-lg backdrop-blur-md bg-background/45 border-2 border-nrl-green/50 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white mb-0.5">Your Position</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-nrl-green">#{rank}</span>
            {renderMovement(movement)}
          </div>
        </div>
        {customContent || (
          <div className="text-right">
            <div className="text-lg font-bold text-white">{points > 0 ? `${points.toLocaleString()} pts` : ""}</div>
            {tier && (
              <div 
                className="text-xs font-semibold mt-0.5"
                style={{ color: getTierColor(tier) }}
              >
                {tier}
              </div>
            )}
          </div>
        )}
      </div>
      {pointsBehind && playerAhead && (
        <div className="pt-2 border-t border-white/10 text-xs text-nrl-text-secondary">
          {pointsBehind.toLocaleString()} points behind #{rank - 1} - {playerAhead}
        </div>
      )}
    </div>
  );
}

// Fan Tier Leaderboard
function FanTierLeaderboard({
  data,
  userRank,
  userPoints,
  userTier,
  userMovement,
  pointsBehind,
  playerAhead,
  getTierColor,
  getMedalIcon,
  renderMovement,
  user,
}: {
  data: FanTierEntry[];
  userRank: number;
  userPoints: number;
  userTier: string;
  userMovement: number;
  pointsBehind: number;
  playerAhead: string;
  getTierColor: (tier: string) => string;
  getMedalIcon: (rank: number) => JSX.Element;
  renderMovement: (movement: number | null) => JSX.Element;
  user?: any;
}) {
  // Filter data: show top 5, then skip to user's position
  const top5 = data.filter(entry => entry.rank <= 5);
  const showEllipsis = userRank > 6; // Show ellipsis if user is not in top 5

  return (
    <>
      <PrizeBanner 
        title="TOP 5 THIS MONTH WIN"
        prize="Signed Team Jersey"
        countdown="3d 14h 22m"
      />
      
      <UserPositionCard
        rank={userRank}
        movement={userMovement}
        points={userPoints}
        tier={userTier}
        pointsBehind={pointsBehind}
        playerAhead={playerAhead}
        getTierColor={getTierColor}
        renderMovement={renderMovement}
      />

      <div className="rounded-xl backdrop-blur-md bg-background/45 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Rank</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Player</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Tier</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Points</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Movement</th>
              </tr>
            </thead>
            <tbody>
              {/* Top 5 */}
              {top5.map((entry) => {
                const isTop5 = entry.rank <= 5;
                return (
                  <tr
                    key={entry.rank}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""
                    }`}
                  >
                    <td className="py-1.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-3 text-center font-medium text-sm text-white">{entry.player}</td>
                    <td className="py-1.5 px-3 text-center">
                      <span 
                        className="font-semibold text-xs"
                        style={{ color: getTierColor(entry.tier) }}
                      >
                        {entry.tier}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">
                      {entry.points.toLocaleString()} pts
                    </td>
                    <td className="py-1.5 px-3 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                  </tr>
                );
              })}
              
              {/* Ellipsis row */}
              {showEllipsis && (
                <tr className="border-b border-white/5">
                  <td colSpan={5} className="py-1.5 px-3 text-center">
                    <span className="text-nrl-text-secondary text-sm">...</span>
                  </td>
                </tr>
              )}
              
              {/* User's position row */}
              {showEllipsis && user && (
                <tr className="bg-nrl-green/10 border-l-2 border-l-nrl-green border-b border-white/5">
                  <td className="py-1.5 px-3 text-center">
                    <span className="font-semibold text-sm text-nrl-green">#{userRank}</span>
                  </td>
                  <td className="py-1.5 px-3 text-center font-medium text-sm text-nrl-green">{user.name || "You"}</td>
                  <td className="py-1.5 px-3 text-center">
                    <span 
                      className="font-semibold text-xs"
                      style={{ color: getTierColor(userTier) }}
                    >
                      {userTier}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">
                    {userPoints.toLocaleString()} pts
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    {renderMovement(userMovement)}
                  </td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Tipping Leaderboard
function TippingLeaderboard({
  data,
  userRank,
  userCorrect,
  userAccuracy,
  userStreak,
  userMovement,
  getMedalIcon,
  renderMovement,
  user,
}: {
  data: TippingEntry[];
  userRank: number;
  userCorrect: string;
  userAccuracy: number;
  userStreak: number;
  userMovement: number;
  getMedalIcon: (rank: number) => JSX.Element;
  renderMovement: (movement: number | null) => JSX.Element;
  user?: any;
}) {
  return (
    <>
      <PrizeBanner 
        title="TOP 5 THIS MONTH WIN"
        prize="$100 NRL Shop Voucher"
        countdown="2d 6h"
        countdownLabel="Round ends in"
      />
      
      <UserPositionCard
        rank={userRank}
        movement={userMovement}
        points={0}
        tier=""
        getTierColor={() => ""}
        renderMovement={renderMovement}
        customContent={
          <div className="text-right">
            <div className="text-lg font-bold text-white">{userCorrect}</div>
            <div className="text-sm text-nrl-text-secondary mt-1">{userAccuracy}% accuracy</div>
            <div className="text-sm text-nrl-text-secondary">Streak: {userStreak}</div>
          </div>
        }
      />

      <div className="rounded-xl backdrop-blur-md bg-background/45 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Rank</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Player</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Correct</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Accuracy</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Streak</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Movement</th>
              </tr>
            </thead>
            <tbody>
              {/* Top 5 */}
              {(() => {
                const top5 = data.filter(entry => entry.rank <= 5);
                const showEllipsis = userRank > 6;
                const userArea = showEllipsis 
                  ? data.filter(entry => entry.rank >= userRank - 2 && entry.rank <= userRank + 2)
                  : [];
                
                return (
                  <>
                    {top5.map((entry) => {
                      const isTop5 = entry.rank <= 5;
                      return (
                        <tr
                          key={entry.rank}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""
                          }`}
                        >
                          <td className="py-1.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {isTop5 && getMedalIcon(entry.rank)}
                              <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                            </div>
                          </td>
                          <td className="py-1.5 px-3 text-center font-medium text-sm text-white">{entry.player}</td>
                          <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">{entry.correct}</td>
                          <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">{entry.accuracy}%</td>
                          <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">{entry.streak}</td>
                          <td className="py-1.5 px-3 text-center">
                            {renderMovement(entry.movement)}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Ellipsis row */}
                    {showEllipsis && (
                      <tr className="border-b border-white/5">
                        <td colSpan={6} className="py-1.5 px-3 text-center">
                          <span className="text-nrl-text-secondary text-sm">...</span>
                        </td>
                      </tr>
                    )}
                    
                    {/* User's position row */}
                    {showEllipsis && user && (
                      <tr className="bg-nrl-green/10 border-l-2 border-l-nrl-green border-b border-white/5">
                        <td className="py-1.5 px-3 text-center">
                          <span className="font-semibold text-sm text-nrl-green">#{userRank}</span>
                        </td>
                        <td className="py-1.5 px-3 text-center font-medium text-sm text-nrl-green">{user.name || "You"}</td>
                        <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">{userCorrect}</td>
                        <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">{userAccuracy}%</td>
                        <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">{userStreak}</td>
                        <td className="py-1.5 px-3 text-center">
                          {renderMovement(userMovement)}
                        </td>
                      </tr>
                    )}
                    
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Fantasy Leaderboard
function FantasyLeaderboard({
  data,
  userRank,
  userTotalPts,
  userWeekPts,
  userCaptain,
  userMovement,
  getMedalIcon,
  renderMovement,
  user,
}: {
  data: FantasyEntry[];
  userRank: number;
  userTotalPts: number;
  userWeekPts: number;
  userCaptain: string;
  userMovement: number;
  getMedalIcon: (rank: number) => JSX.Element;
  renderMovement: (movement: number | null) => JSX.Element;
  user?: any;
}) {
  // Filter data: show top 5, then skip to user's position
  const top5 = data.filter(entry => entry.rank <= 5);
  const showEllipsis = userRank > 6;

  return (
    <>
      <PrizeBanner 
        title="TOP 5 THIS MONTH WIN"
        prize="Game Day VIP Experience"
        countdown="4d 12h"
        countdownLabel="Week ends in"
      />
      
      <UserPositionCard
        rank={userRank}
        movement={userMovement}
        points={userTotalPts}
        tier=""
        getTierColor={() => ""}
        renderMovement={renderMovement}
        customContent={
          <div className="text-right">
            <div className="text-base font-bold text-white">{userTotalPts.toLocaleString()} pts</div>
            <div className="text-xs text-nrl-text-secondary mt-0.5">Week: {userWeekPts} pts</div>
            <div className="text-xs text-nrl-text-secondary">Captain: {userCaptain}</div>
          </div>
        }
      />

      <div className="rounded-xl backdrop-blur-md bg-background/45 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Rank</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Player</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Total Pts</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Week Pts</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Captain</th>
                <th className="text-center py-1.5 px-3 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Movement</th>
              </tr>
            </thead>
            <tbody>
              {/* Top 5 */}
              {top5.map((entry) => {
                const isTop5 = entry.rank <= 5;
                return (
                  <tr
                    key={entry.rank}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""
                    }`}
                  >
                    <td className="py-1.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-3 text-center font-medium text-sm text-white">{entry.player}</td>
                    <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">{entry.totalPts.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-center font-semibold text-sm text-white">{entry.weekPts}</td>
                    <td className="py-1.5 px-3 text-center font-medium text-sm text-white">{entry.captain}</td>
                    <td className="py-1.5 px-3 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                  </tr>
                );
              })}
              
              {/* Ellipsis row */}
              {showEllipsis && (
                <tr className="border-b border-white/5">
                  <td colSpan={6} className="py-1.5 px-3 text-center">
                    <span className="text-nrl-text-secondary text-sm">...</span>
                  </td>
                </tr>
              )}
              
              {/* User's position row */}
              {showEllipsis && user && (
                <tr className="bg-nrl-green/10 border-l-2 border-l-nrl-green border-b border-white/5">
                  <td className="py-1.5 px-3 text-center">
                    <span className="font-semibold text-sm text-nrl-green">#{userRank}</span>
                  </td>
                  <td className="py-1.5 px-3 text-center font-medium text-sm text-nrl-green">{user.name || "You"}</td>
                  <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">{userTotalPts.toLocaleString()}</td>
                  <td className="py-1.5 px-3 text-center font-semibold text-sm text-nrl-green">{userWeekPts}</td>
                  <td className="py-1.5 px-3 text-center font-medium text-sm text-nrl-green">{userCaptain}</td>
                  <td className="py-1.5 px-3 text-center">
                    {renderMovement(userMovement)}
                  </td>
                </tr>
              )}
                    
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
