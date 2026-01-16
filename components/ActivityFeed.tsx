"use client";

import { MOCK_MATES } from "@/lib/mockData";

interface ActivityFeedProps {
  expanded?: boolean;
}

export default function ActivityFeed({ expanded = false }: ActivityFeedProps) {
  return (
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <h2 className="text-xl font-bold mb-4 text-nrl-text-primary">Mates Activity</h2>
      <div className="space-y-4">
        {MOCK_MATES.map((mate, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 bg-nrl-dark-hover rounded-xl border border-nrl-border-light">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center font-semibold">
              {mate.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-semibold text-nrl-text-primary">{mate.name}</span>{" "}
                <span className="text-nrl-text-secondary">{mate.activity}</span>
              </div>
              <div className="text-xs text-nrl-text-muted mt-1">{mate.time}</div>
            </div>
            <button className="text-nrl-green hover:text-nrl-green/80 transition-colors">
              👏
            </button>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-nrl-border-light">
          <h3 className="text-lg font-semibold mb-4 text-nrl-text-primary">Your League</h3>
          <div className="space-y-3">
            <div className="p-4 bg-nrl-green/10 rounded-xl border border-nrl-green/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-nrl-text-primary">Gold League</span>
                  <p className="text-xs text-nrl-text-secondary mt-1">You're #3 — 49 pts behind 2nd</p>
                </div>
                <span className="text-nrl-amber font-bold">#3</span>
              </div>
            </div>
            <div className="text-sm text-nrl-text-secondary p-3">
              Top 3 promote • Bottom 3 relegate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
