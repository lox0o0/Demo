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
    <div className="bg-nrl-dark-card rounded-2xl p-6 border border-nrl-border-light">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-nrl-text-primary">Quests & Missions</h2>
        <div className="text-sm text-nrl-text-secondary">
          {dailyQuests.filter(q => q.completed).length + weeklyQuests.filter(q => q.completed).length} / {dailyQuests.length + weeklyQuests.length} completed
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-nrl-text-secondary mb-4 uppercase tracking-wider">
          Daily Quests
        </h3>
        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                quest.completed
                  ? "bg-nrl-green/10 border-nrl-green/30"
                  : "bg-nrl-dark-hover border-nrl-border-light hover:border-nrl-border-medium"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => handleQuestComplete(quest.id, quest.points)}
                    className="w-6 h-6 rounded-lg border-2 border-nrl-border-medium bg-nrl-dark-hover checked:bg-nrl-green checked:border-nrl-green cursor-pointer"
                  />
                </div>
                <span className={`font-medium ${quest.completed ? "line-through text-nrl-text-muted" : "text-nrl-text-primary"}`}>
                  {quest.title}
                </span>
              </div>
              <span className={`font-bold px-3 py-1 rounded-lg ${
                quest.completed 
                  ? "bg-nrl-green/20 text-nrl-green" 
                  : "bg-nrl-green/10 text-nrl-green"
              }`}>
                +{quest.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-nrl-text-secondary mb-4 uppercase tracking-wider">
          Weekly Quests
        </h3>
        <div className="space-y-3">
          {weeklyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                quest.completed
                  ? "bg-nrl-green/10 border-nrl-green/30"
                  : "bg-nrl-dark-hover border-nrl-border-light hover:border-nrl-border-medium"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => handleQuestComplete(quest.id, quest.points)}
                    className="w-6 h-6 rounded-lg border-2 border-nrl-border-medium bg-nrl-dark-hover checked:bg-nrl-green checked:border-nrl-green cursor-pointer"
                  />
                </div>
                <span className={`font-medium ${quest.completed ? "line-through text-nrl-text-muted" : "text-nrl-text-primary"}`}>
                  {quest.title}
                </span>
              </div>
              <span className={`font-bold px-3 py-1 rounded-lg ${
                quest.completed 
                  ? "bg-nrl-green/20 text-nrl-green" 
                  : "bg-nrl-green/10 text-nrl-green"
              }`}>
                +{quest.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-nrl-border-light">
          <h3 className="text-xs font-bold text-nrl-text-secondary mb-4 uppercase tracking-wider">
            Seasonal Quests
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-nrl-dark-hover rounded-xl border border-nrl-border-light">
              <span className="text-nrl-text-primary font-medium">Attend a game</span>
              <span className="text-nrl-green font-semibold">+200 pts</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-nrl-dark-hover rounded-xl border border-nrl-border-light">
              <span className="text-nrl-text-primary font-medium">Refer a mate</span>
              <span className="text-nrl-green font-semibold">+100 pts</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-nrl-green/10 rounded-xl border border-nrl-green/30">
              <div>
                <span className="font-semibold text-nrl-text-primary">Complete the Telstra Challenge</span>
                <p className="text-xs text-nrl-text-secondary mt-1">Watch 5 highlights this week</p>
              </div>
              <span className="text-nrl-green font-semibold">+50 pts + Credits</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
