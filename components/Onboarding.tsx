"use client";

import { useState } from "react";
import { NRL_TEAMS } from "@/lib/mockData";

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setStep(2);
  };

  const handleSignUp = () => {
    const userData = {
      name: name || "Fan",
      email,
      team: selectedTeam,
      fanScore: 50, // Welcome bonus
      tier: "Rookie",
      points: 50,
      lifetimePoints: 50,
      memberSince: new Date().getFullYear(),
      streak: 0,
    };
    onComplete(userData);
  };

  return (
    <div className="min-h-screen bg-nrl-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">Welcome to NRL</h1>
              <p className="text-gray-400">Pick your team to get started</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {NRL_TEAMS.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.name)}
                  className="glass p-4 rounded-lg hover:bg-white/10 transition-all text-left"
                >
                  <div className="text-2xl mb-1">{team.emoji}</div>
                  <div className="text-sm font-medium">{team.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass rounded-2xl p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-gray-400 text-sm">
                Join the {selectedTeam} community
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-nrl-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-nrl-green"
                />
              </div>
              <button
                onClick={handleSignUp}
                className="w-full bg-nrl-green text-white font-semibold py-3 rounded-lg hover:bg-nrl-green/90 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-400 text-sm py-2"
              >
                ← Back
              </button>
            </div>
            <div className="mt-6 p-4 bg-nrl-green/10 rounded-lg border border-nrl-green/20">
              <p className="text-sm text-nrl-green">
                ✨ Welcome bonus: 50 points + Rookie badge unlocked!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
