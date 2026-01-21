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
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prizes = [
    {
      id: 1,
      title: "SIGNED TEAM JERSEY",
      description: "Authenticated signatures from your favourite squad",
      icon: Shirt,
    },
    {
      id: 2,
      title: "GRAND FINAL PACKAGE",
      description: "Flights, accommodation, and tickets to the biggest game of the year",
      icon: Plane,
    },
    {
      id: 3,
      title: "VIP TEAM ACCESS",
      description: "Behind-the-scenes access to your favourite club",
      icon: StarIcon,
    },
    {
      id: 4,
      title: "MATCH DAY HOSPITALITY",
      description: "Premium box experience with food and drinks",
      icon: Utensils,
    },
    {
      id: 5,
      title: "PLAYER MEET & GREET",
      description: "Get up close with NRL stars",
      icon: Users,
    },
    {
      id: 6,
      title: "$500 NRL SHOP SPREE",
      description: "Deck yourself out in official gear",
      icon: ShoppingBag,
    },
    {
      id: 7,
      title: "SEASON PASS",
      description: "Every home game for the entire season",
      icon: Calendar,
    },
    {
      id: 8,
      title: "TRAINING SESSION ACCESS",
      description: "Watch your team prepare behind closed doors",
      icon: Activity,
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
      const cardWidth = 192; // Approximate card width (180px) + gap (12px)
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
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex-shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-nrl-green via-emerald-400 to-nrl-green bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              NRL Player +
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            A new way to play. Get closer to the game and the players like never before
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Value Propositions Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-2 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: Earn */}
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-2 mx-auto">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Complete Activities, Earn Points</h3>
                <p className="text-xs text-white/70 text-center leading-tight">
                  Predict matches, play fantasy, engage with content and watch your points grow
                </p>
              </div>

              {/* Card 2: Compete */}
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center mb-2 mx-auto">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Climb the Leaderboards</h3>
                <p className="text-xs text-white/70 text-center leading-tight">
                  Compete against fans across Australia for weekly glory and bragging rights
                </p>
              </div>

              {/* Card 3: Level Up */}
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-nrl-green/20 border border-nrl-green/50 flex items-center justify-center mb-2 mx-auto">
                  <TrendingUp className="w-5 h-5 text-nrl-green" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 text-center">Rise Through Fan Tiers</h3>
                <p className="text-xs text-white/70 text-center leading-tight">
                  From Rookie to Legend - unlock exclusive rewards at every level
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-1 flex-shrink-0">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold text-white mb-1">
              Join 50,000+ NRL fans already playing
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-white/70">
              <span className="text-xs">2.5M points earned</span>
              <span className="text-xs">·</span>
              <span className="text-xs">100K predictions made</span>
              <span className="text-xs">·</span>
              <span className="text-xs">$50K in prizes won</span>
            </div>
          </div>
        </section>

        {/* Prize Carousel Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-1 flex-1 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 justify-center flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-white" />
              <h2 className="text-base font-bold text-white">Compete for Glory and Prizes</h2>
            </div>
            <p className="text-center text-white/70 mb-1 text-xs flex-shrink-0">
              Top fans win incredible rewards every week
            </p>

            {/* Carousel Container */}
            <div className="relative flex-1 flex flex-col">
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
                className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth w-full flex-1"
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
                      className="flex-shrink-0 w-[180px] bg-white/5 backdrop-blur-md border border-white/20 rounded-md p-1 hover:scale-105 hover:shadow-xl transition-all duration-300 snap-center"
                    >
                      <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-0.5 mx-auto">
                        <Icon className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                      <h3 className="text-[10px] font-bold text-white mb-0 text-center leading-tight">{prize.title}</h3>
                      <p className="text-[10px] text-white/70 text-center leading-tight mt-0.5">{prize.description}</p>
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
      </div>

      {/* Bottom CTA Section */}
      <section className="relative z-10 flex-shrink-0 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            Ready to become the ultimate fan?
          </h2>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-nrl-green hover:bg-nrl-green/90 text-white font-bold text-sm rounded-lg transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Join Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-white/60 mt-1 text-xs">
            Free to play · Win real prizes
          </p>
        </div>
      </section>
    </div>
  );
}
