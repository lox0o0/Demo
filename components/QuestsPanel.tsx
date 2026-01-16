"use client";

import { useState } from "react";
import { DAILY_QUESTS, WEEKLY_QUESTS } from "@/lib/mockData";

interface QuestsPanelProps {
  user: any;
  expanded?: boolean;
}

export default function QuestsPanel({ user, expanded = false }: QuestsPanelProps) {
  const [dailyQuests, setDailyQuests] = useState(DAILY_QUESTS);
  const [weeklyQuests, setWeeklyQuests] = useState(WEEKLY_QUESTS);

  const handleQuestComplete = (questId: number, points: number) => {
    // Update quest as completed
    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );
    setWeeklyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );
    // In real app, this would update user points
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Quests & Missions</h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Daily Quests
        </h3>
        <div className="space-y-2">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={quest.completed}
                  onChange={() => handleQuestComplete(quest.id, quest.points)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5"
                />
                <span className={quest.completed ? "line-through text-gray-500" : ""}>
                  {quest.title}
                </span>
              </div>
              <span className="text-nrl-green font-semibold">+{quest.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Weekly Quests
        </h3>
        <div className="space-y-2">
          {weeklyQuests.map((quest) => (
            <div
              key={quest.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={quest.completed}
                  onChange={() => handleQuestComplete(quest.id, quest.points)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5"
                />
                <span className={quest.completed ? "line-through text-gray-500" : ""}>
                  {quest.title}
                </span>
              </div>
              <span className="text-nrl-green font-semibold">+{quest.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Seasonal Quests
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span>Attend a game</span>
              <span className="text-nrl-green font-semibold">+200 pts</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span>Refer a mate</span>
              <span className="text-nrl-green font-semibold">+100 pts</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-nrl-green/30">
              <div>
                <span className="font-semibold">Complete the Telstra Challenge</span>
                <p className="text-xs text-gray-400">Watch 5 highlights this week</p>
              </div>
              <span className="text-nrl-green font-semibold">+50 pts + Credits</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
