"use client";

import { useState, useEffect, useCallback } from "react";
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
  // If initialTeam is provided, skip club selection and go straight to sign-in step
  const [step, setStep] = useState<"club" | "celebration" | "signin" | "social-connections" | "complete">(initialTeam ? "signin" : "club");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(initialTeam);
  const [connectedSocials, setConnectedSocials] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [hasAuth, setHasAuth] = useState(false);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    // Show celebration for Broncos, otherwise go straight to sign-in
    if (team.name === "Broncos") {
      setStep("celebration");
    } else {
      setStep("signin");
    }
  };

  const handleCelebrationComplete = useCallback(() => {
    // Move to sign-in step after celebration
    setStep("signin");
  }, []);

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

  const calculateProfileCompletion = (
    socialsToCount: string[] = connectedSocials,
    overrideName?: string,
    overrideEmail?: string
  ) => {
    let completion = 20; // Base (team selected)
    // Use override values if provided, otherwise use state
    const finalName = overrideName !== undefined ? overrideName : name;
    const finalEmail = overrideEmail !== undefined ? overrideEmail : email;
    if (finalName) completion += 15;
    if (finalEmail) completion += 15;
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

  const handleComplete = (overrideName?: string, overrideEmail?: string) => {
    if (selectedTeam) {
      // Use override values if provided (for immediate auth callbacks), otherwise use state
      const finalName = overrideName !== undefined ? overrideName : (name || "Fan");
      const finalEmail = overrideEmail !== undefined ? overrideEmail : (email || "");
      
      const userData = {
        name: finalName,
        email: finalEmail,
        team: selectedTeam.name,
        teamData: selectedTeam,
        fanScore: calculatePoints(),
        tier: "Rookie",
        points: calculatePoints(),
        lifetimePoints: calculatePoints(),
        memberSince: new Date().getFullYear(),
        streak: 0,
        connectedSocials,
        profileCompletion: calculateProfileCompletion(connectedSocials, overrideName, overrideEmail),
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
                  <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform duration-300 bg-white/5 rounded-xl p-2 border border-nrl-border-light">
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

  // Sign-in step - initial authentication
  if (step === "signin" && selectedTeam) {
    const isBroncos = selectedTeam.name === "Broncos";
    const broncosBackgroundPath = "/broncos/premership.webp";
    
    // Calculate profile completion: 0% if nothing, 20% if Google/Apple selected or email typed
    const profileCompletion = (hasAuth || email.trim() !== "") ? 20 : 0;

    const handleGoogleSignIn = () => {
      // In a real app, this would trigger Google OAuth
      // For now, simulate getting user data
      const googleName = "User"; // Would come from Google
      const googleEmail = "user@gmail.com"; // Would come from Google
      // Update state for UI consistency, but pass values directly to handleComplete
      setName(googleName);
      setEmail(googleEmail);
      setHasAuth(true);
      // Go straight to main page
      handleComplete(googleName, googleEmail);
    };

    const handleAppleSignIn = () => {
      // In a real app, this would trigger Apple Sign In
      // For now, simulate getting user data
      const appleName = "User"; // Would come from Apple
      const appleEmail = "user@icloud.com"; // Would come from Apple
      // Update state for UI consistency, but pass values directly to handleComplete
      setName(appleName);
      setEmail(appleEmail);
      setHasAuth(true);
      // Go straight to main page
      handleComplete(appleName, appleEmail);
    };

    const handleBuildFanProfile = () => {
      // Move to social connections step
      setStep("social-connections");
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // hasAuth will be false by default, email.trim() check handles the 20% completion
                  }}
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
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleSkip}
                className="flex-1 bg-nrl-dark-hover border border-nrl-border-light text-nrl-text-secondary font-semibold py-3 rounded-xl hover:bg-nrl-dark-hover/80 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleBuildFanProfile}
                className="flex-1 bg-nrl-green text-white font-bold py-3 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02]"
              >
                Build fan profile
              </button>
            </div>

            {/* Profile Completion Bar */}
            <div className="bg-nrl-dark-hover rounded-xl p-4 border border-nrl-border-light">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-nrl-text-primary">
                  Profile Completion
                </span>
                <span className="text-lg font-bold text-nrl-green">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-nrl-dark rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-nrl-green to-nrl-amber h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Social connections step - shows social platform connections with background
  if (step === "social-connections" && selectedTeam) {
    const isBroncos = selectedTeam.name === "Broncos";
    const broncosBackgroundPath = "/broncos/premership.webp";
    const totalPoints = calculatePoints();
    const profileCompletion = calculateProfileCompletion();
    const pointsFromSocials = connectedSocials.reduce((sum, id) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === id);
      return sum + (platform?.points || 0);
    }, 0);

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
        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-nrl-dark-card/95 backdrop-blur-sm rounded-2xl p-8 border border-nrl-border-light">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-4">
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

            {/* Profile Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-nrl-text-secondary uppercase tracking-wider mb-2">
                Profile Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full bg-white/10 border border-nrl-border-light rounded-xl px-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted focus:outline-none focus:border-nrl-green focus:bg-white/15 transition-all"
              />
              {username.trim() !== "" && (
                <p className="mt-2 text-sm text-nrl-green font-medium">
                  Username available
                </p>
              )}
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
                          <div className="w-10 h-10 flex items-center justify-center">
                            <SocialIcon platform={platform.id} size={40} />
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
                onClick={() => handleComplete()}
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
