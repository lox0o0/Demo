"use client";

import { TIERS } from "@/lib/mockData";

interface FanScoreProps {
  user: any;
}

export default function FanScore({ user }: FanScoreProps) {
  const currentTier = TIERS.find((t, i) => {
    const nextTier = TIERS[i + 1];
    return user.points >= t.minPoints && (!nextTier || user.points < nextTier.minPoints);
  }) || TIERS[0];

  const nextTier = TIERS.find((t) => t.minPoints > user.points) || TIERS[TIERS.length - 1];
  const pointsToNext = nextTier.minPoints - user.points;
  const progressPercent = Math.min((user.points / nextTier.minPoints) * 100, 100);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Fan Score</h2>
          <div className="text-4xl font-bold text-nrl-green">{user?.points || 0}</div>
        </div>
        <div className="text-right">
          <div className="inline-block px-4 py-2 bg-nrl-amber/20 text-nrl-amber rounded-full font-semibold text-sm">
            {currentTier.name}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{pointsToNext} pts to {nextTier.name}</span>
          <span>{nextTier.reward}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-nrl-green to-nrl-amber h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <span className="text-white font-semibold">{user?.lifetimePoints || 0}</span> lifetime points
      </div>
    </div>
  );
}
