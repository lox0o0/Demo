"use client";

import { useState } from "react";
import Image from "next/image";
import { NRL_TEAMS, Team } from "@/lib/data/teams";
import { EntryPoint } from "@/lib/onboardingTypes";
import { SocialIcon, SOCIAL_LOGOS } from "@/lib/icons";

interface SnappyOnboardingProps {
  entryPoint: EntryPoint;
  entryData?: any;
  onComplete: (userData: any) => void;
  initialTeam?: Team | null; // Allow passing pre-selected team
}

const SOCIAL_PLATFORMS = [
  { id: "facebook", name: "Facebook", points: 25, color: "#1877F2" },
  { id: "tiktok", name: "TikTok", points: 30, color: "#000000" },
  { id: "instagram", name: "Instagram", points: 25, color: "#E4405F" },
  { id: "x", name: "X (Twitter)", points: 20, color: "#000000" },
];

export default function SnappyOnboarding({ entryPoint, entryData, onComplete, initialTeam = null }: SnappyOnboardingProps) {
  // If initialTeam is provided, skip club selection and go straight to social step
  const [step, setStep] = useState<"club" | "social" | "complete">(initialTeam ? "social" : "club");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(initialTeam);
  const [connectedSocials, setConnectedSocials] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setStep("social");
  };

  const handleSocialToggle = (platformId: string) => {
    setConnectedSocials((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const calculatePoints = () => {
    let points = 50; // Base welcome bonus
    connectedSocials.forEach((id) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === id);
      if (platform) points += platform.points;
    });
    return points;
  };

  const calculateProfileCompletion = (socialsToCount: string[] = connectedSocials) => {
    let completion = 20; // Base (team selected)
    if (name) completion += 15;
    if (email) completion += 15;
    completion += socialsToCount.length * 12.5; // Each social = 12.5%
    return Math.min(completion, 100);
  };

  const handleSkip = () => {
    if (selectedTeam) {
      // When skipping, don't include social connection points - only base welcome bonus
      const basePoints = 50; // Base welcome bonus only
      const emptySocials: string[] = []; // Explicitly empty for skip
      const userData = {
        name: name || "Fan",
        email: email || "",
        team: selectedTeam.name,
        teamData: selectedTeam,
        fanScore: basePoints,
        tier: "Rookie",
        points: basePoints,
        lifetimePoints: basePoints,
        memberSince: new Date().getFullYear(),
        streak: 0,
        connectedSocials: emptySocials, // Empty array matches the base points calculation
        profileCompletion: calculateProfileCompletion(emptySocials), // Calculate with empty socials
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  const handleComplete = () => {
    if (selectedTeam) {
      const userData = {
        name: name || "Fan",
        email: email || "",
        team: selectedTeam.name,
        teamData: selectedTeam,
        fanScore: calculatePoints(),
        tier: "Rookie",
        points: calculatePoints(),
        lifetimePoints: calculatePoints(),
        memberSince: new Date().getFullYear(),
        streak: 0,
        connectedSocials,
        profileCompletion: calculateProfileCompletion(),
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  if (step === "club") {
    return (
      <div className="min-h-screen bg-nrl-dark flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-nrl-green to-white bg-clip-text text-transparent">
              Pick Your Club
            </h1>
            <p className="text-nrl-text-secondary text-lg">Choose your team to get started</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {NRL_TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className="group relative overflow-hidden bg-nrl-dark-card rounded-xl p-4 hover:scale-105 transition-all duration-300 border border-nrl-border-light hover:border-nrl-border-medium"
                style={{
                  background: `linear-gradient(135deg, ${team.primaryColor}10 0%, ${team.secondaryColor}10 100%)`,
                }}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={team.logoUrl}
                      alt={team.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="font-bold text-sm text-nrl-text-primary">{team.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "social" && selectedTeam) {
    const totalPoints = calculatePoints();
    const profileCompletion = calculateProfileCompletion();
    const pointsFromSocials = connectedSocials.reduce((sum, id) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === id);
      return sum + (platform?.points || 0);
    }, 0);

    return (
      <div className="min-h-screen bg-nrl-dark flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-nrl-dark-card rounded-2xl p-8 border border-nrl-border-light">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src={selectedTeam.logoUrl}
                  alt={selectedTeam.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h2 className="text-2xl font-bold text-nrl-text-primary mb-2">
                Welcome to {selectedTeam.name}!
              </h2>
              <p className="text-nrl-text-secondary">
                Connect your socials for bonus points
              </p>
            </div>

            {/* Quick Name/Email (Optional) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="bg-nrl-dark-hover border border-nrl-border-light rounded-xl px-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted focus:outline-none focus:border-nrl-green"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="bg-nrl-dark-hover border border-nrl-border-light rounded-xl px-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted focus:outline-none focus:border-nrl-green"
              />
            </div>

            {/* Social Connection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-nrl-text-secondary uppercase tracking-wider mb-4">
                Connect Social Accounts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isConnected = connectedSocials.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handleSocialToggle(platform.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isConnected
                          ? "bg-nrl-green/10 border-nrl-green"
                          : "bg-nrl-dark-hover border-nrl-border-light hover:border-nrl-border-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            <SocialIcon platform={platform.id} size={32} />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-nrl-text-primary text-sm">
                              {platform.name}
                            </div>
                            <div className="text-xs text-nrl-green font-bold">
                              +{platform.points} pts
                            </div>
                          </div>
                        </div>
                        {isConnected && (
                          <div className="w-5 h-5 rounded-full bg-nrl-green flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Points Summary */}
            <div className="bg-nrl-dark-hover rounded-xl p-4 mb-6 border border-nrl-border-light">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-nrl-text-secondary">Total Points</span>
                <span className="text-2xl font-black text-nrl-green">{totalPoints}</span>
              </div>
              <div className="space-y-1 text-xs text-nrl-text-muted">
                <div className="flex justify-between">
                  <span>Welcome bonus</span>
                  <span className="text-nrl-green">+50 pts</span>
                </div>
                {pointsFromSocials > 0 && (
                  <div className="flex justify-between">
                    <span>Social connections</span>
                    <span className="text-nrl-green">+{pointsFromSocials} pts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion & Vegas Draw */}
            <div className="bg-gradient-to-r from-nrl-green/20 to-nrl-amber/20 rounded-xl p-4 mb-6 border border-nrl-green/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-nrl-text-primary">
                  Profile Completion
                </span>
                <span className="text-lg font-bold text-nrl-green">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-nrl-dark-hover rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-nrl-green to-nrl-amber h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-xs text-nrl-text-secondary">
                {profileCompletion >= 80 ? (
                  <span className="text-nrl-green font-semibold">
                    ✓ You're eligible for the Vegas 2027 tickets draw!
                  </span>
                ) : (
                  <span>
                    Reach <span className="font-semibold text-nrl-green">80%</span> to enter the
                    <span className="font-bold text-nrl-amber"> Vegas 2027 tickets draw</span>
                  </span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 bg-nrl-dark-hover border border-nrl-border-light text-nrl-text-secondary font-semibold py-3 rounded-xl hover:bg-nrl-dark-hover/80 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-nrl-green text-white font-bold py-3 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
