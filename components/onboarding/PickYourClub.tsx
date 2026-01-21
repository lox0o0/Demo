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
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    // Show celebration first (video + splashback picture for Broncos)
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowProfile(true);
    }, 2000);
  };

  if (showProfile && selectedTeam) {
    // Use SnappyOnboarding for all entry points (revert to old flow)
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

  // Progress stepper component
  const ProgressStepper = ({ currentStep }: { currentStep: 1 | 2 | 3 }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
          currentStep >= 1 ? 'bg-nrl-amber text-nrl-dark shadow-lg shadow-nrl-amber/50' : 'bg-white/10 text-white/40'
        }`}>
          1
        </div>
        <div className={`h-1 w-12 transition-all ${currentStep >= 2 ? 'bg-nrl-amber' : 'bg-white/10'}`}></div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
          currentStep >= 2 ? 'bg-nrl-amber text-nrl-dark shadow-lg shadow-nrl-amber/50' : 'bg-white/10 text-white/40'
        }`}>
          2
        </div>
        <div className={`h-1 w-12 transition-all ${currentStep >= 3 ? 'bg-nrl-amber' : 'bg-white/10'}`}></div>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
        currentStep >= 3 ? 'bg-nrl-amber text-nrl-dark shadow-lg shadow-nrl-amber/50' : 'bg-white/10 text-white/40'
      }`}>
        3
      </div>
    </div>
  );

  // Filter teams based on search query
  const filteredTeams = NRL_TEAMS.filter(team =>
    team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  const backgroundImagePath = "/broncos/nrlimage1.jpeg";
  
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#000' }}>
      {/* Background Image as absolute positioned element */}
      <div 
        className="fixed inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `url(${backgroundImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Light overlay for text readability */}
      <div 
        className="fixed inset-0" 
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))',
          zIndex: 1,
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative" style={{ zIndex: 2, position: 'relative' }}>
        <div className="w-full max-w-5xl mx-auto">
          {/* Progress Stepper */}
          <ProgressStepper currentStep={1} />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-nrl-amber via-white to-nrl-amber bg-clip-text text-transparent drop-shadow-2xl">
              Pick Your Club
            </h1>
            <p className="text-white/80 text-lg font-medium">Choose your team to get started</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                placeholder="Search for your team..."
                className="w-full glass rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:border-nrl-amber/50 focus:ring-2 focus:ring-nrl-amber/20 transition-all backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.6)',
                }}
              />
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className="group relative overflow-hidden glass rounded-xl p-5 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/30"
                  style={{
                    background: `linear-gradient(135deg, ${team.primaryColor}15 0%, ${team.secondaryColor}15 100%)`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    backgroundColor: 'rgba(20, 20, 20, 0.7)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${team.primaryColor}50`;
                    e.currentTarget.style.borderColor = `${team.primaryColor}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
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
                    <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform duration-300 bg-white/10 rounded-xl p-2.5 border border-white/20 backdrop-blur-sm">
                      <TeamLogoWithFallback
                        src={team.logoUrl}
                        alt={team.name}
                      />
                    </div>
                    <div className="font-bold text-sm text-white mb-1 drop-shadow-lg">{team.name}</div>
                    <div className="text-xs text-white/60 font-medium">
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/60 text-lg">No teams found matching "{teamSearchQuery}"</p>
              </div>
            )}
          </div>
          
          {/* Change later message */}
          <div className="text-center">
            <p className="text-sm text-white/50">You can change this later.</p>
          </div>
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
          ? `linear-gradient(135deg, ${team.primaryColor}BB 0%, ${team.secondaryColor}BB 100%), url(${broncosBackgroundPath})`
          : `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
        backgroundSize: hasBackground ? 'cover' : 'auto',
        backgroundPosition: hasBackground ? 'center' : 'auto',
        backgroundBlendMode: hasBackground ? 'multiply' : 'normal',
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

      <div className="relative z-10 text-center space-y-16 max-w-3xl mx-auto px-4">
        {/* Explosive team logo */}
        <div
          className="relative w-56 h-56 md:w-80 md:h-80 mx-auto transform animate-bounce-in"
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

        {/* Stats section */}
        {showStats && (
          <div
            className="space-y-6 text-white"
            style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
          >
            <p className="text-2xl md:text-4xl font-bold tracking-tight" style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.7)' }}>
              You're one of {team.fanCount.toLocaleString()} {team.name} fans
            </p>
            <p className="text-xl md:text-3xl font-semibold text-white/95 tracking-wide" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)' }}>
              {team.chant}
            </p>
          </div>
        )}

        {/* Badge unlock animation - Enhanced with premium styling */}
        {showStats && (
          <div
            className="mt-10 glass-strong rounded-3xl p-8 border border-white/20 mx-auto max-w-md"
            style={{ 
              animation: "fadeInUp 0.8s ease-out 0.9s both",
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="text-xs font-bold text-white/90 uppercase tracking-[0.15em] mb-3 letter-spacing-wider">
              BADGE UNLOCKED
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Badge
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-lg font-bold text-emerald-400" style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
                +50 points
              </span>
              <span className="text-sm text-white/70">awarded</span>
            </div>
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
