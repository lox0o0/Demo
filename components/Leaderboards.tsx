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
  const userFanTierPoints = 5000;
  const userFanTierTier = "DIEHARD";
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
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <Trophy className="w-4 h-4 text-amber-500/70" />;
  };

  const renderMovement = (movement: number | null) => {
    if (movement === null) {
      return <span className="text-gray-500 flex items-center gap-0.5 text-xs"><Minus className="w-3 h-3" /> —</span>;
    }
    if (movement > 0) {
      return <span className="text-emerald-400 flex items-center gap-0.5 text-xs"><TrendingUp className="w-3 h-3" /> ↑ {movement}</span>;
    }
    return <span className="text-red-400 flex items-center gap-0.5 text-xs"><TrendingDown className="w-3 h-3" /> ↓ {Math.abs(movement)}</span>;
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image - using same pattern as Locker Room */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/locker-room/background.webp"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-6 h-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Leaderboards</h1>
        </div>
        <p className="text-nrl-text-secondary text-sm">See how you stack up against other fans</p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative z-10">
        <div className="flex gap-2 border-b-2 border-white/20">
          <button
            onClick={() => setActiveTab("fan-tier")}
            className={`px-5 py-2.5 text-base font-bold transition-all ${
              activeTab === "fan-tier"
                ? "text-nrl-green border-b-3 border-nrl-green"
                : "text-nrl-text-secondary hover:text-nrl-text-primary"
            }`}
          >
            Fan Tier
          </button>
          <button
            onClick={() => setActiveTab("tipping")}
            className={`px-5 py-2.5 text-base font-bold transition-all ${
              activeTab === "tipping"
                ? "text-nrl-green border-b-3 border-nrl-green"
                : "text-nrl-text-secondary hover:text-nrl-text-primary"
            }`}
          >
            Tipping
          </button>
          <button
            onClick={() => setActiveTab("fantasy")}
            className={`px-5 py-2.5 text-base font-bold transition-all ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative z-10">
        <h2 className="text-2xl font-bold text-white">
          {activeTab === "fan-tier" && "Fan Tier Rankings"}
          {activeTab === "tipping" && "Tipping Competition"}
          {activeTab === "fantasy" && "Fantasy League"}
        </h2>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
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
      return <Shirt className="w-5 h-5 text-amber-300" />;
    }
    if (prizeLower.includes("voucher") || prizeLower.includes("shop")) {
      return <Ticket className="w-5 h-5 text-amber-300" />;
    }
    if (prizeLower.includes("vip") || prizeLower.includes("experience") || prizeLower.includes("game day")) {
      return <Star className="w-5 h-5 text-amber-300" />;
    }
    return <Gift className="w-5 h-5 text-amber-300" />;
  };

  return (
    <div className="mb-4 p-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-500/20 border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 animate-pulse"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border-2 border-amber-400/50 flex items-center justify-center shadow-lg">
            <Trophy className="w-7 h-7 text-amber-300" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{title}</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-400/20 border-2 border-amber-400/40 shadow-lg">
              {getPrizeIcon()}
            </div>
            <span className="text-lg font-bold text-amber-200">{prize}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-amber-400/30">
            <span className="text-nrl-text-secondary text-sm">
              {countdownLabel || "Resets in"}: <span className="text-white font-bold text-base">{countdown}</span>
            </span>
            <button className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 rounded-lg text-amber-200 hover:text-white font-semibold text-sm flex items-center gap-1.5 transition-all">
              Learn More <Info className="w-3.5 h-3.5" />
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
    <div className="mb-4 p-4 rounded-xl backdrop-blur-md bg-background/45 border-2 border-nrl-green/50 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Your Position</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-nrl-green">#{rank}</span>
            {renderMovement(movement)}
          </div>
        </div>
        {customContent || (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{points > 0 ? `${points.toLocaleString()} pts` : ""}</div>
            {tier && (
              <div 
                className="text-sm font-semibold mt-1"
                style={{ color: getTierColor(tier) }}
              >
                {tier}
              </div>
            )}
          </div>
        )}
      </div>
      {pointsBehind && playerAhead && (
        <div className="pt-4 border-t border-white/10 text-sm text-nrl-text-secondary">
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
}) {
  // Filter data: show top 5, then skip to user's position area
  const top5 = data.filter(entry => entry.rank <= 5);
  const showEllipsis = userRank > 6; // Show ellipsis if user is not in top 5
  const userArea = showEllipsis 
    ? data.filter(entry => entry.rank >= userRank - 2 && entry.rank <= userRank + 2)
    : [];

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
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-nrl-text-secondary font-semibold">Rank</th>
                <th className="text-left py-4 px-6 text-nrl-text-secondary font-semibold">Player</th>
                <th className="text-left py-4 px-6 text-nrl-text-secondary font-semibold">Tier</th>
                <th className="text-right py-4 px-6 text-nrl-text-secondary font-semibold">Points</th>
                <th className="text-center py-4 px-6 text-nrl-text-secondary font-semibold">Movement</th>
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
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 font-medium text-sm text-white">{entry.player}</td>
                    <td className="py-2 px-4">
                      <span 
                        className="font-semibold text-xs"
                        style={{ color: getTierColor(entry.tier) }}
                      >
                        {entry.tier}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-sm text-white">
                      {entry.points.toLocaleString()} pts
                    </td>
                    <td className="py-2 px-4 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                  </tr>
                );
              })}
              
              {/* Ellipsis row */}
              {showEllipsis && (
                <tr className="border-b border-white/5">
                  <td colSpan={5} className="py-2 px-4 text-center">
                    <span className="text-nrl-text-secondary text-base">...</span>
                  </td>
                </tr>
              )}
              
              {/* User area (entries around user's position) */}
              {userArea.map((entry) => {
                const isUser = entry.rank === userRank;
                const isTop5 = entry.rank <= 5;
                return (
                  <tr
                    key={entry.rank}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      isUser ? "bg-nrl-green/10 border-l-2 border-l-nrl-green" : ""
                    } ${isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""}`}
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className={`font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className={`py-2 px-4 font-medium text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.player}
                    </td>
                    <td className="py-2 px-4">
                      <span 
                        className="font-semibold text-xs"
                        style={{ color: getTierColor(entry.tier) }}
                      >
                        {entry.tier}
                      </span>
                    </td>
                    <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.points.toLocaleString()} pts
                    </td>
                    <td className="py-2 px-4 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                  </tr>
                );
              })}
              
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User's name at bottom */}
      {showEllipsis && user && (
        <div className="mt-6 p-6 rounded-xl backdrop-blur-md bg-nrl-green/10 border-2 border-nrl-green/50 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-nrl-text-secondary text-base">Your position:</span>
            <span className="text-nrl-green font-bold text-2xl">{user.name || "You"}</span>
          </div>
        </div>
      )}
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
}: {
  data: TippingEntry[];
  userRank: number;
  userCorrect: string;
  userAccuracy: number;
  userStreak: number;
  userMovement: number;
  getMedalIcon: (rank: number) => JSX.Element;
  renderMovement: (movement: number | null) => JSX.Element;
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
                <th className="text-left py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Rank</th>
                <th className="text-left py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Player</th>
                <th className="text-right py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Correct</th>
                <th className="text-right py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Accuracy</th>
                <th className="text-right py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Streak</th>
                <th className="text-center py-5 px-6 text-nrl-text-secondary font-bold text-sm uppercase tracking-wider">Movement</th>
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
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-1.5">
                              {isTop5 && getMedalIcon(entry.rank)}
                              <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4 font-medium text-sm text-white">{entry.player}</td>
                          <td className="py-2 px-4 text-right font-semibold text-sm text-white">{entry.correct}</td>
                          <td className="py-2 px-4 text-right font-semibold text-sm text-white">{entry.accuracy}%</td>
                          <td className="py-2 px-4 text-right font-semibold text-sm text-white">{entry.streak}</td>
                          <td className="py-2 px-4 text-center">
                            {renderMovement(entry.movement)}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Ellipsis row */}
                    {showEllipsis && (
                      <tr className="border-b border-white/5">
                        <td colSpan={6} className="py-2 px-4 text-center">
                          <span className="text-nrl-text-secondary text-base">...</span>
                        </td>
                      </tr>
                    )}
                    
                    {/* User area */}
                    {userArea.map((entry) => {
                      const isUser = entry.rank === userRank;
                      const isTop5 = entry.rank <= 5;
                      return (
                        <tr
                          key={entry.rank}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            isUser ? "bg-nrl-green/10 border-l-2 border-l-nrl-green" : ""
                          } ${isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""}`}
                        >
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-1.5">
                              {isTop5 && getMedalIcon(entry.rank)}
                              <span className={`font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                                #{entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className={`py-2 px-4 font-medium text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                            {entry.player}
                          </td>
                          <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                            {entry.correct}
                          </td>
                          <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                            {entry.accuracy}%
                          </td>
                          <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                            {entry.streak}
                          </td>
                          <td className="py-2 px-4 text-center">
                            {renderMovement(entry.movement)}
                          </td>
                        </tr>
                      );
                    })}
                    
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User's name at bottom */}
      {(() => {
        const showEllipsis = userRank > 6;
        return showEllipsis && user ? (
          <div className="mt-4 p-4 rounded-xl backdrop-blur-md bg-nrl-green/10 border-2 border-nrl-green/50 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-nrl-text-secondary text-sm">Your position:</span>
              <span className="text-nrl-green font-bold text-lg">{user.name || "You"}</span>
            </div>
          </div>
        ) : null;
      })()}
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
}: {
  data: FantasyEntry[];
  userRank: number;
  userTotalPts: number;
  userWeekPts: number;
  userCaptain: string;
  userMovement: number;
  getMedalIcon: (rank: number) => JSX.Element;
  renderMovement: (movement: number | null) => JSX.Element;
}) {
  // Filter data: show top 5, then skip to user's position area
  const top5 = data.filter(entry => entry.rank <= 5);
  const showEllipsis = userRank > 6;
  const userArea = showEllipsis 
    ? data.filter(entry => entry.rank >= userRank - 2 && entry.rank <= userRank + 2)
    : [];

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
                <th className="text-left py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Rank</th>
                <th className="text-left py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Player</th>
                <th className="text-right py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Total Pts</th>
                <th className="text-right py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Week Pts</th>
                <th className="text-left py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Captain</th>
                <th className="text-center py-2.5 px-4 text-nrl-text-secondary font-bold text-xs uppercase tracking-wider">Movement</th>
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
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className="font-semibold text-sm text-white">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 font-medium text-sm text-white">{entry.player}</td>
                    <td className="py-2 px-4 text-right font-semibold text-sm text-white">{entry.totalPts.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right font-semibold text-sm text-white">{entry.weekPts}</td>
                    <td className="py-2 px-4 font-medium text-sm text-white">{entry.captain}</td>
                    <td className="py-2 px-4 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                  </tr>
                );
              })}
              
              {/* Ellipsis row */}
              {showEllipsis && (
                <tr className="border-b border-white/5">
                  <td colSpan={6} className="py-2 px-4 text-center">
                    <span className="text-nrl-text-secondary text-base">...</span>
                  </td>
                </tr>
              )}
              
                    {/* User area */}
                    {userArea.map((entry) => {
                      const isUser = entry.rank === userRank;
                      const isTop5 = entry.rank <= 5;
                      return (
                        <tr
                          key={entry.rank}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            isUser ? "bg-nrl-green/10 border-l-2 border-l-nrl-green" : ""
                          } ${isTop5 ? "bg-amber-500/5 border-l-2 border-l-amber-500" : ""}`}
                        >
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        {isTop5 && getMedalIcon(entry.rank)}
                        <span className={`font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className={`py-2 px-4 font-medium text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.player}
                    </td>
                    <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.totalPts.toLocaleString()}
                    </td>
                    <td className={`py-2 px-4 text-right font-semibold text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.weekPts}
                    </td>
                    <td className={`py-2 px-4 font-medium text-sm ${isUser ? "text-nrl-green" : "text-white"}`}>
                      {entry.captain}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {renderMovement(entry.movement)}
                    </td>
                        </tr>
                      );
                    })}
                    
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User's name at bottom */}
      {showEllipsis && user && (
        <div className="mt-4 p-4 rounded-xl backdrop-blur-md bg-nrl-green/10 border-2 border-nrl-green/50 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="text-nrl-text-secondary text-sm">Your position:</span>
            <span className="text-nrl-green font-bold text-lg">{user.name || "You"}</span>
          </div>
        </div>
      )}
    </>
  );
}
