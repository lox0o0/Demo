"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { NRL_TEAMS, Team } from "@/lib/data/teams";
import { EntryPoint } from "@/lib/onboardingTypes";
import SnappyOnboarding from "./SnappyOnboarding";

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
              setImgSrc(`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#1a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="24" font-weight="bold">${alt.charAt(0)}</text></svg>`)}`);
            } else {
              // SVG fallback also failed, show text fallback
              setHasError(true);
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-nrl-dark-card rounded-lg border border-nrl-border-light">
          <span className="text-nrl-text-primary font-bold text-lg">{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}

interface PickYourClubProps {
  entryPoint: EntryPoint;
  entryData?: any;
  onComplete: (userData: any) => void;
}

export default function PickYourClub({ entryPoint, entryData, onComplete }: PickYourClubProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // For direct entry, use SnappyOnboarding which handles the full flow
  // For other entry points that already collected data, we could show celebration first
  if (entryPoint === "direct" || !entryData) {
    return (
      <SnappyOnboarding
        entryPoint={entryPoint}
        entryData={entryData}
        onComplete={onComplete}
      />
    );
  }

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    // Quick celebration, then move to social step
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowProfile(true);
    }, 2000); // Reduced from 4000ms for snappier flow
  };

  if (showProfile && selectedTeam) {
    // Use the new snappy onboarding for social connection
    // Pass the selected team so user doesn't have to select again
    return (
      <SnappyOnboarding
        entryPoint={entryPoint}
        entryData={entryData}
        onComplete={onComplete}
        initialTeam={selectedTeam}
      />
    );
  }

  if (showCelebration && selectedTeam) {
    return <TeamCelebration team={selectedTeam} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nrl-dark via-nrl-dark to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-nrl-green to-white bg-clip-text text-transparent">
            Pick Your Club
          </h1>
          <p className="text-xl text-gray-400">Choose your team to get started</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {NRL_TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team)}
              className="group relative overflow-hidden bg-nrl-dark-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-nrl-border-light hover:border-nrl-border-medium"
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor}10 0%, ${team.secondaryColor}10 100%)`,
              }}
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4 transform group-hover:scale-110 transition-transform duration-300 bg-white/5 rounded-xl p-2 border border-nrl-border-light">
                  <TeamLogoWithFallback
                    src={team.logoUrl}
                    alt={team.name}
                  />
                </div>
                <div className="font-bold text-lg text-nrl-text-primary">{team.name}</div>
                <div className="text-xs text-nrl-text-secondary mt-1">
                  {team.fanCount.toLocaleString()} fans
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${team.primaryColor}20 0%, ${team.secondaryColor}20 100%)`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamCelebration({ team, onComplete }: { team: Team; onComplete?: () => void }) {
  const [showStats, setShowStats] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isBroncos = team.name === "Broncos";
  
  // Broncos-specific assets
  const broncosVideoPath = "/broncos/splash-video.mp4";
  const broncosBackgroundPath = "/broncos/premership.webp";
  
  // Check if video exists (we'll handle this gracefully)
  const hasVideo = isBroncos;
  const hasBackground = isBroncos;

  useEffect(() => {
    // Preload video when component mounts
    if (hasVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [hasVideo]);

  useEffect(() => {
    // If no video or video ended/errored, show stats after delay
    if (!hasVideo || videoEnded || videoError) {
      const timer = setTimeout(() => setShowStats(true), hasVideo ? 500 : 1500);
      return () => clearTimeout(timer);
    }
  }, [hasVideo, videoEnded, videoError]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setVideoLoading(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoading(false);
  };

  const handleCanPlay = () => {
    setVideoCanPlay(true);
    setVideoLoading(false);
  };

  const handleLoadStart = () => {
    setVideoLoading(true);
  };

  // Auto-advance to next step after celebration (for SnappyOnboarding integration)
  useEffect(() => {
    if (onComplete && showStats) {
      // Wait a bit after stats show, then call onComplete to advance
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Show celebration for 3 seconds after stats appear
      return () => clearTimeout(timer);
    }
  }, [showStats, onComplete]);

  // Show video first for Broncos (if available)
  if (isBroncos && hasVideo && !videoEnded && !videoError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black cursor-pointer"
        onClick={handleVideoEnd}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleVideoEnd();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Click to skip video"
      >
        {/* Keep background black during loading - no flash of background image */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          onCanPlay={handleCanPlay}
          onLoadStart={handleLoadStart}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoCanPlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={broncosVideoPath} type="video/mp4" />
          {/* Fallback if video format not supported */}
        </video>
        {/* Overlay gradient for smooth transition */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: videoEnded ? 1 : 0,
            background: `linear-gradient(135deg, ${team.primaryColor}CC 0%, ${team.secondaryColor}CC 100%)`,
          }}
        />
        {/* Skip hint */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm transition-opacity duration-300 ${
          videoCanPlay ? 'opacity-100' : 'opacity-0'
        }`}>
          Click anywhere to skip
        </div>
      </div>
    );
  }

  // Main celebration screen with background image
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000"
      style={{
        background: hasBackground && isBroncos
          ? `linear-gradient(135deg, ${team.primaryColor}CC 0%, ${team.secondaryColor}CC 100%), url(${broncosBackgroundPath})`
          : `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
        backgroundSize: hasBackground ? 'cover' : 'auto',
        backgroundPosition: hasBackground ? 'center' : 'auto',
        backgroundBlendMode: hasBackground ? 'overlay' : 'normal',
      }}
    >
      {/* Confetti/particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
        {/* Explosive team logo */}
        <div
          className="relative w-48 h-48 md:w-64 md:h-64 mx-auto transform animate-bounce-in"
          style={{ animation: "bounceIn 0.8s ease-out" }}
        >
          <Image
            src={team.logoUrl}
            alt={team.name}
            fill
            className="object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>

        {/* Welcome message */}
        <div className="space-y-4">
          <h1
            className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl"
            style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}
          >
            {team.welcomeMessage}
          </h1>
          
          {showStats && (
            <div
              className="space-y-2 text-white/90"
              style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
            >
              <p className="text-2xl md:text-3xl font-bold">
                You're one of {team.fanCount.toLocaleString()} {team.name} fans
              </p>
              <p className="text-xl md:text-2xl font-semibold">
                {team.chant}
              </p>
            </div>
          )}
        </div>

        {/* Badge unlock animation */}
        {showStats && (
          <div
            className="mt-8 glass rounded-2xl p-6 border-2 border-white/30"
            style={{ animation: "fadeInUp 0.8s ease-out 0.9s both" }}
          >
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">BADGE</div>
            <div className="text-xl font-bold text-white">Welcome Badge Unlocked!</div>
            <div className="text-sm text-white/80 mt-1">+50 points awarded</div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.7;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
