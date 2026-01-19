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
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setHasTriedFallback(false);
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
            if (!hasTriedFallback) {
              // Try SVG fallback first
              setHasTriedFallback(true);
              setImgSrc(`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold">${alt.charAt(0)}</text></svg>`)}`);
            } else {
              // SVG fallback also failed, show text fallback
              setHasError(true);
            }
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
  // If initialTeam is provided, skip welcome and go straight to sign-in step
  const [step, setStep] = useState<"welcome" | "club" | "celebration" | "signin" | "social-connections" | "complete">(initialTeam ? "signin" : "welcome");
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

  // Helper function to check if a name is a placeholder (not a real user-provided name)
  const isPlaceholderName = (name: string | undefined | null): boolean => {
    if (!name) return true;
    const lowerName = name.trim().toLowerCase();
    return lowerName === "fan" || lowerName === "user" || lowerName === "";
  };

  // Helper function to check if an email is a placeholder (not a real user-provided email)
  const isPlaceholderEmail = (email: string | undefined | null): boolean => {
    if (!email) return true;
    const lowerEmail = email.trim().toLowerCase();
    return lowerEmail === "user@gmail.com" || lowerEmail === "user@icloud.com" || lowerEmail === "";
  };

  const calculateProfileCompletion = (
    socialsToCount: string[] = connectedSocials,
    overrideName?: string,
    overrideEmail?: string,
    includeAuthSelection?: boolean,
    hasTeam: boolean = true
  ) => {
    let completion = hasTeam ? 20 : 0; // Base (20% if team selected, 0% if no team)
    // Use override values if provided, otherwise use state
    const finalName = overrideName !== undefined ? overrideName : name;
    const finalEmail = overrideEmail !== undefined ? overrideEmail : email;
    
    // Count authentication: only if we have a real name (not placeholder) or real email (not placeholder)
    const hasRealName = finalName && !isPlaceholderName(finalName);
    const hasRealEmail = finalEmail && !isPlaceholderEmail(finalEmail);
    
    if (hasRealName || hasRealEmail) {
      completion += 30; // Combined auth bonus (name + email together = 30%)
    } else if (includeAuthSelection && selectedAuthMethod) {
      // If auth method is selected but not yet completed, still count it
      completion += 30;
    }
    
    // Each social connection = 10% (4 socials = 40%)
    completion += socialsToCount.length * 10;
    
    // Additional profile fields can add up to 10% more (DOB, gender, home ground, etc.)
    // This allows reaching 100% completion (20% team + 30% auth + 40% socials + 10% additional = 100%)
    // For now, we'll cap at 100% to allow for future additional fields
    return Math.min(completion, 100);
  };

  const handleSkip = () => {
    if (selectedTeam) {
      // When skipping, don't include social connection points - only base welcome bonus
      const basePoints = 50; // Base welcome bonus only
      const emptySocials: string[] = []; // Explicitly empty for skip
      // Use username if provided, otherwise fall back to name or "Fan"
      let finalName = username.trim() || name || "Fan";
      // For profile completion calculation, use username or name (but not "Fan" fallback)
      let nameForCompletion = username.trim() || name || undefined;
      
      // Determine final email: use buildProfileEmail if email auth was selected, otherwise use email state
      let finalEmail = email || "";
      if (selectedAuthMethod === "email" && buildProfileEmail.trim() !== "") {
        finalEmail = buildProfileEmail.trim();
        // Extract name from email if no real name provided (check for placeholder names)
        if (!nameForCompletion || isPlaceholderName(finalName)) {
          const emailName = buildProfileEmail.split("@")[0];
          finalName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          // Set nameForCompletion to the extracted name so it counts toward profile completion
          nameForCompletion = finalName;
        }
      }
      
      const userData = {
        name: finalName,
        email: finalEmail,
        team: selectedTeam.name,
        teamData: selectedTeam,
        fanScore: basePoints,
        tier: "Rookie",
        points: basePoints,
        lifetimePoints: basePoints,
        memberSince: new Date().getFullYear(),
        streak: 0,
        connectedSocials: emptySocials, // Empty array matches the base points calculation
        profileCompletion: calculateProfileCompletion(emptySocials, nameForCompletion, finalEmail || undefined), // Use finalEmail which includes buildProfileEmail if applicable
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  const handleComplete = (overrideName?: string, overrideEmail?: string) => {
    if (selectedTeam) {
      // Validate email authentication: if email is selected as auth method, email must be provided
      if (selectedAuthMethod === "email" && buildProfileEmail.trim() === "") {
        // Don't proceed if email auth is selected but email is empty
        return;
      }

      // Handle authentication if selected in build profile step
      let finalName = overrideName !== undefined 
        ? overrideName 
        : (username.trim() || name || "Fan");
      let finalEmail = overrideEmail !== undefined ? overrideEmail : (email || "");

      // If auth method was selected in build profile, authenticate now
      // Note: We only set placeholder values for display purposes, but don't count them for profile completion
      if (selectedAuthMethod === "google") {
        // Only set placeholders if we don't have real values (for display purposes)
        // But these won't count toward profile completion if they're placeholders
        if (!finalName || isPlaceholderName(finalName)) {
          finalName = "User"; // Placeholder for display
        }
        if (!finalEmail || isPlaceholderEmail(finalEmail)) {
          finalEmail = "user@gmail.com"; // Placeholder for display
        }
      } else if (selectedAuthMethod === "apple") {
        // Only set placeholders if we don't have real values (for display purposes)
        if (!finalName || isPlaceholderName(finalName)) {
          finalName = "User"; // Placeholder for display
        }
        if (!finalEmail || isPlaceholderEmail(finalEmail)) {
          finalEmail = "user@icloud.com"; // Placeholder for display
        }
      } else if (selectedAuthMethod === "email" && buildProfileEmail.trim() !== "") {
        finalEmail = buildProfileEmail.trim();
        if (!finalName || isPlaceholderName(finalName)) {
          // Extract name from email if no name provided
          const emailName = buildProfileEmail.split("@")[0];
          finalName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
      }
      
      // Only count name/email for profile completion if they're not placeholders
      const nameForCompletion = finalName && !isPlaceholderName(finalName) ? finalName : undefined;
      const emailForCompletion = finalEmail && !isPlaceholderEmail(finalEmail) ? finalEmail : undefined;
      
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
        profileCompletion: calculateProfileCompletion(connectedSocials, nameForCompletion, emailForCompletion),
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  // Welcome page handlers
  const handleWelcomeGoogleSignIn = () => {
    // Fast sign-in: go straight to dashboard, no team selected
    // Note: In a real implementation, Google OAuth would provide actual user name/email
    // For demo purposes, we use placeholders but don't count them for profile completion
    const googleName = "User"; // Would come from Google OAuth (could be null if user doesn't share name)
    const googleEmail = "user@gmail.com"; // Would come from Google OAuth
    // Calculate profile completion: 0% (no team) + 0% (placeholder name/email don't count) = 0%
    // In real app, if Google provides real email, we'd pass it and get 30%
    const profileCompletion = calculateProfileCompletion([], undefined, undefined, false, false);
    const userData = {
      name: googleName,
      email: googleEmail,
      team: "", // No team selected in fast sign-in
      teamData: null,
      fanScore: 50, // Base welcome bonus
      tier: "Rookie",
      points: 50,
      lifetimePoints: 50,
      memberSince: new Date().getFullYear(),
      streak: 0,
      connectedSocials: [],
      profileCompletion, // Use calculated value for consistency
      entryPoint,
      entryData,
    };
    onComplete(userData);
  };

  const handleWelcomeAppleSignIn = () => {
    // Fast sign-in: go straight to dashboard, no team selected
    // Note: In a real implementation, Apple Sign In would provide actual user name/email
    // For demo purposes, we use placeholders but don't count them for profile completion
    const appleName = "User"; // Would come from Apple Sign In (could be null if user doesn't share name)
    const appleEmail = "user@icloud.com"; // Would come from Apple Sign In
    // Calculate profile completion: 0% (no team) + 0% (placeholder name/email don't count) = 0%
    // In real app, if Apple provides real email, we'd pass it and get 30%
    const profileCompletion = calculateProfileCompletion([], undefined, undefined, false, false);
    const userData = {
      name: appleName,
      email: appleEmail,
      team: "", // No team selected in fast sign-in
      teamData: null,
      fanScore: 50, // Base welcome bonus
      tier: "Rookie",
      points: 50,
      lifetimePoints: 50,
      memberSince: new Date().getFullYear(),
      streak: 0,
      connectedSocials: [],
      profileCompletion, // Use calculated value for consistency
      entryPoint,
      entryData,
    };
    onComplete(userData);
  };

  const handleWelcomeEmailContinue = () => {
    // Set email and move to club selection
    if (preClubEmail.trim() !== "") {
      setEmail(preClubEmail.trim());
      setStep("club");
    }
  };

  const handleBuildProfile = () => {
    // Move to club selection step to build full profile
    setStep("club");
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


  // Welcome page - initial entry point
  if (step === "welcome") {
    const backgroundImagePath = "/broncos/nrlimage1.jpeg";

    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url(${backgroundImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.65)', // Less darkening to show more background
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-nrl-dark-card rounded-2xl p-8 border-2 border-nrl-amber/60 shadow-2xl" style={{
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), 0 0 60px rgba(251, 191, 36, 0.25)',
            backgroundColor: 'rgba(17, 24, 39, 0.98)', // More solid dark background
          }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-nrl-amber via-white to-nrl-amber bg-clip-text text-transparent">
                Welcome
              </h1>
            </div>

            {/* Fast Sign-in Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-nrl-text-primary mb-4 text-center">
                Fast sign-in
              </h2>
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={handleWelcomeGoogleSignIn}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                  aria-label="Sign in with Google"
                >
                  <AuthIcon provider="google" size={32} />
                </button>
                <button
                  onClick={handleWelcomeAppleSignIn}
                  className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-xl border border-white/20"
                  aria-label="Sign in with Apple"
                >
                  <AuthIcon provider="apple" size={32} />
                </button>
              </div>
              <div className="relative mb-3">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-nrl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={preClubEmail}
                  onChange={(e) => setPreClubEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-nrl-dark-card border border-nrl-border-light rounded-xl pl-11 pr-4 py-2.5 text-sm text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:border-nrl-amber focus:ring-2 focus:ring-nrl-amber/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && preClubEmail.trim() !== "") {
                      handleWelcomeEmailContinue();
                    }
                  }}
                />
              </div>
              {preClubEmail.trim() !== "" && (
                <button
                  onClick={handleWelcomeEmailContinue}
                  className="w-full bg-nrl-amber text-nrl-dark font-bold py-2.5 rounded-xl hover:bg-nrl-amber/90 transition-all transform hover:scale-[1.02] text-sm mb-4"
                >
                  Continue
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-nrl-border-light"></div>
              <span className="text-sm text-nrl-text-secondary/70">or</span>
              <div className="flex-1 h-px bg-nrl-border-light"></div>
            </div>

            {/* Build Profile Option */}
            <button
              onClick={handleBuildProfile}
              className="w-full bg-nrl-dark-hover border-2 border-nrl-amber text-nrl-text-primary font-bold py-4 rounded-xl hover:bg-nrl-amber/10 transition-all transform hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="text-lg mb-1">Build profile</div>
                <div className="text-sm text-nrl-text-secondary/80 font-normal">
                  Earn rewards, unlock experiences, get closer to your team.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "club") {
    // Filter teams based on search query
    const filteredTeams = NRL_TEAMS.filter((team) =>
      team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-nrl-dark flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <ProgressStepper currentStep={1} />

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
    
    // Calculate profile completion using the proper function
    // Team selection = 20% base, authentication = +30%
    // So: 20% (team only) or 50% (team + auth)
    const profileCompletion = calculateProfileCompletion(
      [], // No socials connected yet at this step
      undefined, // No name override
      email.trim() !== "" ? email : undefined, // Use email if provided
      false, // Don't include auth selection flag
      true // Team is selected
    );
    const teamPrimaryColor = selectedTeam.primaryColor;

    const handleGoogleSignIn = () => {
      // In a real app, this would trigger Google OAuth
      // For now, simulate getting user data
      // Note: In a real implementation, Google OAuth would provide actual user name/email
      // For demo purposes, we use placeholders but don't count them for profile completion
      const googleName = "User"; // Would come from Google OAuth (could be null if user doesn't share name)
      const googleEmail = "user@gmail.com"; // Would come from Google OAuth
      // Update state for UI consistency, but pass undefined for name since it's a placeholder
      // This ensures profile completion only counts real authentication, not placeholder values
      setName(googleName);
      setEmail(googleEmail);
      setHasAuth(true);
      // Pass undefined for name since "User" is a placeholder and shouldn't count for profile completion
      // Only pass email if it's a real email (in real app, Google would provide real email)
      handleComplete(undefined, googleEmail); // Don't count placeholder name
    };

    const handleAppleSignIn = () => {
      // In a real app, this would trigger Apple Sign In
      // For now, simulate getting user data
      // Note: In a real implementation, Apple Sign In would provide actual user name/email
      // For demo purposes, we use placeholders but don't count them for profile completion
      const appleName = "User"; // Would come from Apple (could be null if user doesn't share name)
      const appleEmail = "user@icloud.com"; // Would come from Apple Sign In
      // Update state for UI consistency, but pass undefined for name since it's a placeholder
      // This ensures profile completion only counts real authentication, not placeholder values
      setName(appleName);
      setEmail(appleEmail);
      setHasAuth(true);
      // Pass undefined for name since "User" is a placeholder and shouldn't count for profile completion
      // Only pass email if it's a real email (in real app, Apple would provide real email)
      handleComplete(undefined, appleEmail); // Don't count placeholder name
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
    // Include auth selection in completion calculation (even if not yet completed)
    const profileCompletion = calculateProfileCompletion(connectedSocials, undefined, undefined, true);
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
                      className={`w-full bg-white/10 border rounded-xl pl-12 pr-4 py-3 text-nrl-text-primary placeholder:text-nrl-text-muted/60 focus:outline-none focus:bg-white/15 transition-all ${
                        buildProfileEmail.trim() === "" 
                          ? "border-red-500/50 focus:border-red-500" 
                          : "border-nrl-border-light focus:border-nrl-green"
                      }`}
                    />
                  </div>
                  {buildProfileEmail.trim() === "" && (
                    <p className="mt-2 text-xs text-red-400">
                      Please enter your email to continue
                    </p>
                  )}
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
                    Congratulations! You are in the draw for Vegas 2027 tickets!
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
                disabled={selectedAuthMethod === "email" && buildProfileEmail.trim() === ""}
                className="flex-1 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: selectedTeam.primaryColor,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.opacity = '1';
                  }
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
