"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Star, 
  Trophy, 
  TrendingUp, 
  Shirt, 
  Plane, 
  Star as StarIcon, 
  Users, 
  ShoppingBag, 
  Calendar, 
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Utensils
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const landingVideoPath = "/landing/landing vidoe.mp4";

  useEffect(() => {
    // Preload video when component mounts
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

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

  const prizes = [
    {
      id: 1,
      title: "SIGNED TEAM JERSEY",
      description: "Authenticated signatures from your favourite squad",
      icon: Shirt,
      color: "emerald",
      iconColor: "text-emerald-400",
      borderGradient: "from-emerald-500/50 to-emerald-400/30",
      bgGradient: "from-emerald-500/10 to-transparent",
    },
    {
      id: 2,
      title: "GRAND FINAL PACKAGE",
      description: "Flights, accommodation, and tickets to the biggest game of the year",
      icon: Plane,
      color: "gold",
      iconColor: "text-amber-400",
      borderGradient: "from-amber-500/60 to-yellow-400/40",
      bgGradient: "from-amber-500/15 to-transparent",
    },
    {
      id: 3,
      title: "VIP TEAM ACCESS",
      description: "Behind-the-scenes access to your favourite club",
      icon: StarIcon,
      color: "purple",
      iconColor: "text-purple-400",
      borderGradient: "from-purple-500/50 to-pink-400/30",
      bgGradient: "from-purple-500/10 to-transparent",
    },
    {
      id: 4,
      title: "MATCH DAY HOSPITALITY",
      description: "Premium box experience with food and drinks",
      icon: Utensils,
      color: "amber",
      iconColor: "text-amber-300",
      borderGradient: "from-amber-500/50 to-orange-400/30",
      bgGradient: "from-amber-500/10 to-transparent",
    },
    {
      id: 5,
      title: "PLAYER MEET & GREET",
      description: "Get up close with NRL stars",
      icon: Users,
      color: "emerald",
      iconColor: "text-emerald-300",
      borderGradient: "from-emerald-400/50 to-teal-400/30",
      bgGradient: "from-emerald-500/10 to-transparent",
    },
    {
      id: 6,
      title: "$500 NRL SHOP SPREE",
      description: "Deck yourself out in official gear",
      icon: ShoppingBag,
      color: "blue",
      iconColor: "text-blue-400",
      borderGradient: "from-blue-500/50 to-cyan-400/30",
      bgGradient: "from-blue-500/10 to-transparent",
    },
    {
      id: 7,
      title: "SEASON PASS",
      description: "Every home game for the entire season",
      icon: Calendar,
      color: "red",
      iconColor: "text-red-400",
      borderGradient: "from-red-500/50 to-orange-400/30",
      bgGradient: "from-red-500/10 to-transparent",
    },
    {
      id: 8,
      title: "TRAINING SESSION ACCESS",
      description: "Watch your team prepare behind closed doors",
      icon: Activity,
      color: "indigo",
      iconColor: "text-indigo-400",
      borderGradient: "from-indigo-500/50 to-purple-400/30",
      bgGradient: "from-indigo-500/10 to-transparent",
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoScrolling) return;

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
    }, 4000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, prizes.length]);

  // Scroll carousel to current index
  useEffect(() => {
    if (carouselRef.current) {
      // Each card is 1/3 of container width (matching grid columns)
      const containerWidth = carouselRef.current.offsetWidth;
      const cardWidth = containerWidth / 3;
      carouselRef.current.scrollTo({
        left: currentPrizeIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [currentPrizeIndex]);

  const handlePrevPrize = () => {
    setIsAutoScrolling(false);
    setCurrentPrizeIndex((prev) => (prev - 1 + prizes.length) % prizes.length);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNextPrize = () => {
    setIsAutoScrolling(false);
    setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next
      handleNextPrize();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous
      handlePrevPrize();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };


  // Show video first (if available and not ended/errored)
  if (!videoEnded && !videoError) {
    return (
      <div 
        className="h-screen flex items-center justify-center relative overflow-hidden bg-black cursor-pointer"
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
        {/* Keep background black during loading - no flash */}
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
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            videoCanPlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={landingVideoPath} type="video/mp4" />
        </video>
        {/* Skip hint */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm transition-opacity duration-300 ${
          videoCanPlay ? 'opacity-100' : 'opacity-0'
        }`}>
          Click anywhere to skip
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/landing/choose-team.png"
          alt="Landing Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex-shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-nrl-green via-emerald-400 to-nrl-green bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              NRL Player +
            </span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white max-w-3xl mx-auto mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            A new way to play
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-semibold text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            Get closer to the game and the players like never before
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Value Propositions Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-2 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Card 1: Earn */}
              <div className="px-4 py-3 relative">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Complete Activities, Earn Points</h3>
                <p className="text-sm text-white/85 text-center leading-normal">
                  Predict matches, play fantasy, engage with content and watch your points grow
                </p>
                {/* Vertical divider on right */}
                <div className="hidden md:block absolute top-0 right-0 bottom-0 w-px bg-white/25"></div>
              </div>

              {/* Card 2: Compete */}
              <div className="px-4 py-3 relative">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Climb the Leaderboards</h3>
                <p className="text-sm text-white/85 text-center leading-normal">
                  Compete against fans across Australia for weekly glory and bragging rights
                </p>
                {/* Vertical divider on right */}
                <div className="hidden md:block absolute top-0 right-0 bottom-0 w-px bg-white/25"></div>
              </div>

              {/* Card 3: Level Up */}
              <div className="px-4 py-3 relative">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Rise Through Fan Tiers</h3>
                <p className="text-sm text-white/85 text-center leading-normal">
                  From Rookie to Legend - unlock exclusive rewards at every level
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prize Carousel Section - Middle of page with generous spacing */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col">
          <div className="max-w-7xl mx-auto flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 text-white" />
              <h2 className="text-base font-bold text-white">Compete for Glory and Prizes</h2>
            </div>
            <p className="text-center text-white/85 mb-2 text-sm flex-shrink-0">
              Top fans win incredible rewards every week
            </p>

            {/* Carousel Container */}
            <div className="relative flex flex-col">
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevPrize}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPrize}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Carousel */}
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth w-full"
                onMouseEnter={() => setIsAutoScrolling(false)}
                onMouseLeave={() => setIsAutoScrolling(true)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {prizes.map((prize) => {
                  const Icon = prize.icon;
                  return (
                    <div
                      key={prize.id}
                      className="flex-shrink-0 px-4 py-3 snap-center w-full md:w-1/3 relative group"
                      style={{ minWidth: 'calc(100% / 3)' }}
                    >
                      {/* Gradient border wrapper */}
                      <div className={`relative p-[2px] rounded-lg bg-gradient-to-r ${prize.borderGradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                        <div className="px-4 py-3 rounded-lg bg-black/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex items-center justify-center mb-2">
                            <Icon className={`w-5 h-5 ${prize.iconColor} drop-shadow-lg`} />
                          </div>
                          <h3 className="text-sm font-bold text-white mb-1 text-center">{prize.title}</h3>
                          <p className="text-sm text-white/85 text-center leading-normal">{prize.description}</p>
                          
                          {/* Shimmer effect on hover */}
                          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-1.5 mt-1 flex-shrink-0">
                {prizes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoScrolling(false);
                      setCurrentPrizeIndex(index);
                      setTimeout(() => setIsAutoScrolling(true), 5000);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentPrizeIndex
                        ? "bg-nrl-green w-6"
                        : "bg-white/30 hover:bg-white/50 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof + CTA Section - Combined at bottom */}
        <section className="px-4 sm:px-6 lg:px-8 py-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold text-white mb-1">
              Join 50,000+ NRL fans already playing
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-white/85 mb-4">
              <span className="text-sm">2.5M points earned</span>
              <span className="text-sm">·</span>
              <span className="text-sm">100K predictions made</span>
              <span className="text-sm">·</span>
              <span className="text-sm">$50K in prizes won</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to become the ultimate fan?
            </h2>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-nrl-green hover:bg-nrl-green/90 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.4),0_0_120px_rgba(34,197,94,0.2)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_100px_rgba(34,197,94,0.5),0_0_150px_rgba(34,197,94,0.3)] hover:scale-105 flex items-center gap-3 mx-auto border-2 border-nrl-green/50 hover:border-nrl-green/80"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/75 mt-1 text-sm">
              Free to play · Win real prizes
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
