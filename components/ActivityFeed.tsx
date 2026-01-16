"use client";

import { MOCK_MATES } from "@/lib/mockData";

interface ActivityFeedProps {
  expanded?: boolean;
}

export default function ActivityFeed({ expanded = false }: ActivityFeedProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Mates Activity</h2>
      <div className="space-y-4">
        {MOCK_MATES.map((mate, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center font-semibold">
              {mate.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-semibold">{mate.name}</span>{" "}
                <span className="text-gray-400">{mate.activity}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{mate.time}</div>
            </div>
            <button className="text-nrl-green hover:text-nrl-green/80 transition-colors">
              👏
            </button>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Your League</h3>
          <div className="space-y-2">
            <div className="p-3 bg-nrl-green/10 rounded-lg border border-nrl-green/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">Gold League</span>
                  <p className="text-xs text-gray-400">You're #3 — 49 pts behind 2nd</p>
                </div>
                <span className="text-nrl-amber font-bold">#3</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 p-3">
              Top 3 promote • Bottom 3 relegate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
