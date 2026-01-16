"use client";

interface StatusCardsProps {
  user: any;
}

export default function StatusCards({ user }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tipping Card */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Tipping</h3>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nrl-green/20 to-nrl-green/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🎯
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">6/8</span> correct this round
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nrl-green">#847</span>
            <span className="text-xs text-gray-400 font-medium">overall</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-nrl-amber/10 rounded-lg border border-nrl-amber/20 w-fit">
            <span className="text-lg fire-animation">🔥</span>
            <span className="text-sm font-bold text-nrl-amber">12-week streak</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-nrl-green to-nrl-green/80 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-nrl-green/20 transition-all transform hover:scale-[1.02] text-sm">
          Make Tips →
        </button>
      </div>

      {/* Fantasy Card */}
      <div className="glass-strong rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Fantasy</h3>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nrl-amber/20 to-nrl-amber/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ⚽
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">12,847</span> pts
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nrl-amber">#2,341</span>
            <span className="text-xs text-gray-400 font-medium">rank</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-nrl-green/10 rounded-lg border border-nrl-green/20 w-fit">
            <span className="text-sm text-nrl-green">✓</span>
            <span className="text-sm font-bold text-nrl-green">Team Set</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-nrl-amber to-nrl-amber/80 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-nrl-amber/20 transition-all transform hover:scale-[1.02] text-sm">
          Set Team →
        </button>
      </div>
    </div>
  );
}
