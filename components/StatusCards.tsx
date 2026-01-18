"use client";

interface StatusCardsProps {
  user: any;
}

export default function StatusCards({ user }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tipping Card */}
      <div className="bg-nrl-dark-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group border border-nrl-border-light hover:border-nrl-border-medium">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Tipping</h3>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nrl-green/20 to-nrl-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xs font-bold text-nrl-green">TIP</span>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="text-sm text-nrl-text-secondary">
            <span className="font-semibold text-nrl-text-primary">6/8</span> correct this round
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nrl-green">#847</span>
            <span className="text-xs text-nrl-text-secondary font-medium">overall</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-nrl-amber/10 rounded-lg border border-nrl-amber/20 w-fit">
            <span className="text-xs font-bold text-nrl-amber fire-animation">STREAK</span>
            <span className="text-sm font-bold text-nrl-amber">12-week streak</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-nrl-green to-nrl-green/80 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-nrl-green/20 transition-all transform hover:scale-[1.02] text-sm">
          Make Tips →
        </button>
      </div>

      {/* Fantasy Card */}
      <div className="bg-nrl-dark-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group border border-nrl-border-light hover:border-nrl-border-medium">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Fantasy</h3>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nrl-amber/20 to-nrl-amber/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xs font-bold text-nrl-amber">FAN</span>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="text-sm text-nrl-text-secondary">
            <span className="font-semibold text-nrl-text-primary">12,847</span> pts
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nrl-amber">#2,341</span>
            <span className="text-xs text-nrl-text-secondary font-medium">rank</span>
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
