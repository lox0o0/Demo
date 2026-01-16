"use client";

interface StatusCardsProps {
  user: any;
}

export default function StatusCards({ user }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Tipping Card */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Tipping</h3>
          <span className="text-2xl">🎯</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            6/8 correct this round
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">#847</span>
            <span className="text-xs text-gray-400">overall</span>
          </div>
          <div className="flex items-center gap-2 text-nrl-amber">
            <span className="text-sm fire-animation">🔥</span>
            <span className="text-sm font-semibold">12-week streak</span>
          </div>
        </div>
        <button className="mt-4 w-full bg-nrl-green/20 text-nrl-green font-semibold py-2 rounded-lg hover:bg-nrl-green/30 transition-colors text-sm">
          Make Tips →
        </button>
      </div>

      {/* Fantasy Card */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Fantasy</h3>
          <span className="text-2xl">⚽</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            12,847 pts
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">#2,341</span>
            <span className="text-xs text-gray-400">rank</span>
          </div>
          <div className="flex items-center gap-2 text-nrl-green">
            <span className="text-sm">✓</span>
            <span className="text-sm font-semibold">Team Set</span>
          </div>
        </div>
        <button className="mt-4 w-full bg-nrl-green/20 text-nrl-green font-semibold py-2 rounded-lg hover:bg-nrl-green/30 transition-colors text-sm">
          Set Team →
        </button>
      </div>
    </div>
  );
}
