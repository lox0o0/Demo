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
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [preClubEmail, setPreClubEmail] = useState("");
  const [selectedAuthMethod, setSelectedAuthMethod] = useState<"google" | "apple" | "email" | null>(null);
  const [buildProfileEmail, setBuildProfileEmail] = useState("");

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
      // Use username if provided, otherwise fall back to name or "Fan"
      const finalName = username.trim() || name || "Fan";
      const userData = {
        name: finalName,
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
        profileCompletion: calculateProfileCompletion(emptySocials, username.trim() || undefined, email || undefined), // Calculate with empty socials, include email if present
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  const handleComplete = (overrideName?: string, overrideEmail?: string) => {
    if (selectedTeam) {
      // Handle authentication if selected in build profile step
      let finalName = overrideName !== undefined 
        ? overrideName 
        : (username.trim() || name || "Fan");
      let finalEmail = overrideEmail !== undefined ? overrideEmail : (email || "");

      // If auth method was selected in build profile, authenticate now
      if (selectedAuthMethod === "google") {
        finalName = finalName || "User";
        finalEmail = finalEmail || "user@gmail.com";
      } else if (selectedAuthMethod === "apple") {
        finalName = finalName || "User";
        finalEmail = finalEmail || "user@icloud.com";
      } else if (selectedAuthMethod === "email" && buildProfileEmail.trim() !== "") {
        finalEmail = buildProfileEmail.trim();
        if (!finalName || finalName === "Fan") {
          // Extract name from email if no name provided
          const emailName = buildProfileEmail.split("@")[0];
          finalName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
      }
      
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
        profileCompletion: calculateProfileCompletion(connectedSocials, finalName !== "Fan" ? finalName : undefined, finalEmail || undefined),
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  // Progress stepper component - defined at component level for use across all steps
  const ProgressStepper = ({ currentStep }: { currentStep: 1 | 2 | 3 }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          currentStep >= 1 ? 'bg-nrl-amber text-nrl-dark' : 'bg-nrl-border-light text-nrl-text-muted'
        }`}>
          1
        </div>
        <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-nrl-amber' : 'bg-nrl-border-light'}`}></div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          currentStep >= 2 ? 'bg-nrl-amber text-nrl-dark' : 'bg-nrl-border-light text-nrl-text-muted'
        }`}>
          2
        </div>
        <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-nrl-amber' : 'bg-nrl-border-light'}`}></div>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        currentStep >= 3 ? 'bg-nrl-amber text-nrl-dark' : 'bg-nrl-border-light text-nrl-text-muted'
      }`}>
        3
      </div>
    </div>
  );

  // Show celebration screen for Broncos
  if (step === "celebration" && selectedTeam) {
    return <TeamCelebration team={selectedTeam} onComplete={handleCelebrationComplete} />;
  }

  // Pre-club sign-in handlers - fast track to dashboard
  const handlePreClubGoogleSignIn = () => {
    const googleName = "User";
    const googleEmail = "user@gmail.com";
    // Complete onboarding immediately with 15% completion (team not selected yet)
    const userData = {
      name: googleName,
      email: googleEmail,
      team: "", // No team selected yet
      teamData: null,
      fanScore: 0,
      tier: "Rookie",
      points: 0,
      lifetimePoints: 0,
      memberSince: new Date().getFullYear(),
      streak: 0,
      connectedSocials: [],
      profileCompletion: 15, // 15% for email/name only
      entryPoint,
      entryData,
    };
    onComplete(userData);
  };

  const handlePreClubAppleSignIn = () => {
    const appleName = "User";
    const appleEmail = "user@icloud.com";
    // Complete onboarding immediately with 15% completion (team not selected yet)
    const userData = {
      name: appleName,
      email: appleEmail,
      team: "", // No team selected yet
      teamData: null,
      fanScore: 0,
      tier: "Rookie",
      points: 0,
      lifetimePoints: 0,
      memberSince: new Date().getFullYear(),
      streak: 0,
      connectedSocials: [],
      profileCompletion: 15, // 15% for email/name only
      entryPoint,
      entryData,
    };
    onComplete(userData);
  };

  const handlePreClubEmailContinue = () => {
    if (preClubEmail.trim() !== "") {
      setEmail(preClubEmail);
      // Continue to team selection - they can build their profile
      // Don't complete onboarding yet
    }
  };

  if (step === "club") {
    // Filter teams based on search query
    const filteredTeams = NRL_TEAMS.filter((team) =>
      team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-nrl-dark flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <ProgressStepper currentStep={1} />
          
          {/* Pre-club Sign-in Options */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <p className="text-sm text-nrl-text-secondary/70 mb-4">Sign in to get started</p>
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={handlePreClubGoogleSignIn}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                  aria-label="Sign in with Google"
                >
                  <AuthIcon provider="google" size={28} />
                </button>
                <button
                  onClick={handlePreClubAppleSignIn}
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-xl border border-white/20"
                  aria-label="Sign in with Apple"
                >
                  <AuthIcon provider="apple" size={28} />
                </button>
              </div>
              <div className="relative max-w-md mx-auto">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={preClubEmail}
                  onChange={(e) => {
                    setPreClubEmail(e.target.value);
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-nrl-dark-card border border-nrl-border-light rounded-xl pl-11 pr-4 py-2.5 text-sm text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-amber focus:ring-2 focus:ring-nrl-amber/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && preClubEmail.trim() !== "") {
                      handlePreClubEmailContinue();
                    }
                  }}
                />
              </div>
              {/* Continue button under email */}
              {preClubEmail.trim() !== "" && (
                <div className="mt-3 max-w-md mx-auto">
                  <button
                    onClick={handlePreClubEmailContinue}
                    className="w-full bg-nrl-amber text-nrl-dark font-bold py-2.5 rounded-xl hover:bg-nrl-amber/90 transition-all transform hover:scale-[1.02] text-sm"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="text-center mb-6">
            <p className="text-base text-nrl-text-primary/90 font-medium">
              Earn rewards, unlock experiences, get closer to your team.
            </p>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-nrl-amber via-white to-nrl-amber bg-clip-text text-transparent">
              Pick Your Club
            </h1>
            <p className="text-nrl-text-secondary/70 text-lg">Choose your team to get started</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                placeholder="Search for your team..."
                className="w-full bg-nrl-dark-card border border-nrl-border-light rounded-xl pl-12 pr-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-amber focus:ring-2 focus:ring-nrl-amber/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className="group relative overflow-hidden bg-nrl-dark-card rounded-xl p-4 hover:scale-105 transition-all duration-300 border border-nrl-border-light hover:border-opacity-0"
                  style={{
                    background: `linear-gradient(135deg, ${team.primaryColor}10 0%, ${team.secondaryColor}10 100%)`,
                  }}
                >
                  {/* Hover glow effect in team colors */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: `radial-gradient(circle, ${team.primaryColor}40 0%, transparent 70%)`,
                    }}
                  />
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
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-nrl-text-muted">
                No teams found matching "{teamSearchQuery}"
              </div>
            )}
          </div>
          
          {/* Change later message */}
          <div className="text-center mt-6">
            <p className="text-sm text-nrl-text-secondary/60">You can change this later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sign-in step - initial authentication
  if (step === "signin" && selectedTeam) {
    const isBroncos = selectedTeam.name === "Broncos";
    const broncosBackgroundPath = "/broncos/premership.webp";
    
    // Calculate profile completion: 10% base (team selected), 20% if authenticated
    const profileCompletion = (hasAuth || email.trim() !== "") ? 20 : 10;
    const teamPrimaryColor = selectedTeam.primaryColor;

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
          filter: 'brightness(0.92)', // Darken background images 8% for modal clarity
        }}
      >
        <div className="w-full max-w-md relative z-10">
          <div className="bg-nrl-dark-card/95 backdrop-blur-sm rounded-2xl p-8 border border-nrl-border-light">
            <ProgressStepper currentStep={2} />
            
            {/* Profile Completion Bar - Show after team selection */}
            <div className="bg-nrl-dark-hover rounded-xl p-4 border border-nrl-border-light mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-nrl-text-primary">
                  Profile Completion
                </span>
                <span className="text-lg font-bold" style={{ color: teamPrimaryColor }}>{profileCompletion}%</span>
              </div>
              <div className="w-full bg-nrl-dark rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${profileCompletion}%`,
                    background: `linear-gradient(to right, ${teamPrimaryColor}, ${selectedTeam.secondaryColor})`
                  }}
                />
              </div>
            </div>

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
                <span className="text-nrl-text-secondary/70 text-sm">or: enter email</span>
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
                  className="w-full bg-white/10 border border-nrl-border-light rounded-xl pl-12 pr-12 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-green focus:bg-white/15 transition-all"
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
                className="flex-1 bg-nrl-dark-hover border border-nrl-border-light text-nrl-text-secondary/80 font-semibold py-3 rounded-xl hover:bg-nrl-dark-hover/80 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleBuildFanProfile}
                className="flex-1 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                style={{
                  backgroundColor: teamPrimaryColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Build fan profile
              </button>
            </div>
            {/* Value prop under Build fan profile */}
            <div className="text-center">
              <p className="text-sm text-nrl-amber font-medium">
                Start earning points
              </p>
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
          filter: 'brightness(0.92)', // Darken background images 8% for modal clarity
        }}
      >
        <div className="w-full max-w-2xl relative z-10">
          <div className="bg-nrl-dark-card/95 backdrop-blur-sm rounded-2xl p-8 border border-nrl-border-light">
            <ProgressStepper currentStep={3} />
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
              <h2 className="text-2xl font-black text-nrl-text-primary mb-2">
                Welcome to {selectedTeam.name}!
              </h2>
              <p className="text-nrl-text-secondary/70">
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
                className="w-full bg-white/10 border border-nrl-border-light rounded-xl px-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-green focus:bg-white/15 transition-all"
              />
              {username.trim() !== "" && (
                <p className="mt-2 text-sm text-nrl-green font-medium">
                  Username available
                </p>
              )}
            </div>

            {/* Sign-in Options */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-nrl-text-secondary uppercase tracking-wider mb-4">
                Sign In
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Google */}
                <button
                  onClick={() => setSelectedAuthMethod(selectedAuthMethod === "google" ? null : "google")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedAuthMethod === "google"
                      ? "bg-nrl-green/10 border-nrl-green"
                      : "bg-nrl-dark-hover border-nrl-border-light hover:border-opacity-50"
                  }`}
                  style={{
                    borderColor: selectedAuthMethod === "google" ? undefined : "#4285F4",
                    borderWidth: selectedAuthMethod === "google" ? '2px' : '1px',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
                      <AuthIcon provider="google" size={32} />
                    </div>
                    <div className="text-xs font-semibold text-nrl-text-primary">Google</div>
                    {selectedAuthMethod === "google" && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-nrl-green flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Apple */}
                <button
                  onClick={() => setSelectedAuthMethod(selectedAuthMethod === "apple" ? null : "apple")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedAuthMethod === "apple"
                      ? "bg-nrl-green/10 border-nrl-green"
                      : "bg-nrl-dark-hover border-nrl-border-light hover:border-opacity-50"
                  }`}
                  style={{
                    borderColor: selectedAuthMethod === "apple" ? undefined : "#000000",
                    borderWidth: selectedAuthMethod === "apple" ? '2px' : '1px',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black border border-white/20">
                      <AuthIcon provider="apple" size={32} />
                    </div>
                    <div className="text-xs font-semibold text-nrl-text-primary">Apple</div>
                    {selectedAuthMethod === "apple" && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-nrl-green flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={() => setSelectedAuthMethod(selectedAuthMethod === "email" ? null : "email")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedAuthMethod === "email"
                      ? "bg-nrl-green/10 border-nrl-green"
                      : "bg-nrl-dark-hover border-nrl-border-light hover:border-opacity-50"
                  }`}
                  style={{
                    borderColor: selectedAuthMethod === "email" ? undefined : "#808080",
                    borderWidth: selectedAuthMethod === "email" ? '2px' : '1px',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10">
                      <svg className="w-6 h-6 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold text-nrl-text-primary">Email</div>
                    {selectedAuthMethod === "email" && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-nrl-green flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Email input (shown when email is selected) */}
              {selectedAuthMethod === "email" && (
                <div className="mt-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={buildProfileEmail}
                      onChange={(e) => setBuildProfileEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/10 border border-nrl-border-light rounded-xl pl-12 pr-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-green focus:bg-white/15 transition-all"
                    />
                  </div>
                </div>
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
                      className={`relative p-5 rounded-xl border-2 transition-all ${
                        isConnected
                          ? "bg-nrl-green/10 border-nrl-green"
                          : "bg-nrl-dark-hover hover:border-opacity-50"
                      }`}
                      style={{
                        borderColor: isConnected ? undefined : platform.color,
                        borderWidth: isConnected ? '2px' : '1px',
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{
                          backgroundColor: isConnected ? `${platform.color}20` : `${platform.color}10`,
                        }}>
                          <SocialIcon platform={platform.id} size={48} />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-nrl-text-primary text-sm mb-1">
                            {platform.name}
                          </div>
                          <div className="text-xs text-nrl-green font-bold">
                            +{platform.points} pts
                          </div>
                        </div>
                        {isConnected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-nrl-green flex items-center justify-center">
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
                className="flex-1 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                style={{
                  backgroundColor: selectedTeam.primaryColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
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
