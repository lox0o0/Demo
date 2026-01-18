"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NRL_TEAMS, Team } from "@/lib/data/teams";
import { EntryPoint } from "@/lib/onboardingTypes";
import { SocialIcon, SOCIAL_LOGOS, AuthIcon } from "@/lib/icons";
import { TeamCelebration } from "./PickYourClub";

// Team logo component with error handling
function TeamLogoWithFallback({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {!hasError ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-contain"
          unoptimized
          onError={() => {
            setHasError(true);
            // Fallback to a placeholder or team initial
            setImgSrc(`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold">${alt.charAt(0)}</text></svg>`)}`);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-nrl-dark-card rounded-lg border border-nrl-border-light">
          <span className="text-nrl-text-primary font-bold text-sm">{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}

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
  const [step, setStep] = useState<"club" | "celebration" | "social" | "complete">(initialTeam ? "social" : "club");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(initialTeam);
  const [connectedSocials, setConnectedSocials] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    // Show celebration for Broncos, otherwise go straight to social
    if (team.name === "Broncos") {
      setStep("celebration");
    } else {
      setStep("social");
    }
  };

  const handleCelebrationComplete = () => {
    // Move to social step after celebration
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

  // Show celebration screen for Broncos
  if (step === "celebration" && selectedTeam) {
    return <TeamCelebration team={selectedTeam} onComplete={handleCelebrationComplete} />;
  }

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
                    <TeamLogoWithFallback
                      src={team.logoUrl}
                      alt={team.name}
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
    const isBroncos = selectedTeam.name === "Broncos";
    const broncosBackgroundPath = "/broncos/premership.webp";

    const handleGoogleSignIn = () => {
      // In a real app, this would trigger Google OAuth
      // For now, simulate getting user data
      setName("User"); // Would come from Google
      setEmail("user@gmail.com"); // Would come from Google
      handleComplete();
    };

    const handleAppleSignIn = () => {
      // In a real app, this would trigger Apple Sign In
      // For now, simulate getting user data
      setName("User"); // Would come from Apple
      setEmail("user@icloud.com"); // Would come from Apple
      handleComplete();
    };

    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          background: isBroncos
            ? `linear-gradient(135deg, ${selectedTeam.primaryColor}CC 0%, ${selectedTeam.secondaryColor}CC 100%), url(${broncosBackgroundPath})`
            : `linear-gradient(135deg, ${selectedTeam.primaryColor} 0%, ${selectedTeam.secondaryColor} 100%)`,
          backgroundSize: isBroncos ? 'cover' : 'auto',
          backgroundPosition: isBroncos ? 'center' : 'auto',
          backgroundBlendMode: isBroncos ? 'overlay' : 'normal',
        }}
      >
        <div className="w-full max-w-md relative z-10">
          <div className="bg-nrl-dark-card/95 backdrop-blur-sm rounded-2xl p-8 border border-nrl-border-light">
            {/* Connect with Gmail or Apple */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-nrl-text-primary mb-4">
                Connect with Gmail or Apple
              </h3>
              <div className="flex justify-center gap-4 mb-4">
                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  aria-label="Sign in with Google"
                >
                  <AuthIcon provider="google" size={32} />
                </button>
                {/* Apple Button */}
                <button
                  onClick={handleAppleSignIn}
                  className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-white/20"
                  aria-label="Sign in with Apple"
                >
                  <AuthIcon provider="apple" size={32} />
                </button>
              </div>
            </div>

            {/* Or: enter email */}
            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-nrl-text-secondary text-sm">or: enter email</span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Loxley.davies@gmail.com"
                  className="w-full bg-white/10 border border-nrl-border-light rounded-xl pl-12 pr-12 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted focus:outline-none focus:border-nrl-green focus:bg-white/15 transition-all"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
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
