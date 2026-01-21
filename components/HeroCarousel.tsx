"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Trophy, Target, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  icon?: React.ReactNode;
  logo?: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaAction?: () => void;
}

const slides: Slide[] = [
  {
    id: 1,
    icon: <Trophy className="w-12 h-12 text-yellow-400" />,
    headline: "WIN WEEKLY PRIZES",
    subtext: "Win a share of $10,000 in weekly prizes — the higher your fan tier, the better the prize!",
    ctaText: "Enter Prize Draw",
  },
  {
    id: 2,
    icon: <Target className="w-12 h-12 text-white/80" strokeWidth={2} />,
    headline: "PREDICTIONS",
    subtext: "Test your knowledge against other fans and predict the MVP for the upcoming round!",
    ctaText: "Make Prediction",
  },
  {
    id: 3,
    logo: "/locker-room/nrl-fantasy-logo.png",
    headline: "NRL FANTASY",
    subtext: "It's round 6. Make sure your trades are made and team is set for the weekend!",
    ctaText: "Manage Team",
  },
  {
    id: 4,
    logo: "/locker-room/nrl-tipping-logo.png",
    headline: "NRL TIPPING",
    subtext: "There are multiple games this round, ensure your tips are made for this weekend!",
    ctaText: "Finish Tips",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Update carousel transform
  useEffect(() => {
    if (carouselRef.current && containerRef.current) {
      const slideWidth = containerRef.current.offsetWidth;
      const translateX = -currentSlide * slideWidth;
      carouselRef.current.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
    }
  }, [currentSlide]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current && containerRef.current) {
        const slideWidth = containerRef.current.offsetWidth;
        const translateX = -currentSlide * slideWidth;
        carouselRef.current.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="space-y-6 w-full" style={{ height: "48vh", minHeight: "400px", maxHeight: "650px" }}>
      <div className="relative w-full h-full">
        <div className="relative w-full h-full" role="region" aria-roledescription="carousel">
          <div ref={containerRef} className="overflow-hidden h-full rounded-lg" style={{ width: "100%" }}>
            <div
              ref={carouselRef}
              className="flex h-full"
              style={{ 
                transform: "translate3d(0px, 0px, 0px)",
                transition: "transform 500ms ease-out",
                width: `${slides.length * 100}%`
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 opacity-100 visible h-full"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  <div className="p-2 bg-gradient-to-br from-white/5 to-white/2 rounded-lg backdrop-blur-sm border border-white/15 group hover:scale-105 transition-transform duration-500 ease-out hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer w-full h-full">
                    <div className="rounded-lg text-card-foreground shadow-sm relative border-0 cursor-pointer h-full bg-transparent overflow-visible">
                      <div className="p-0 h-full relative overflow-hidden rounded-lg">
                        {/* Hover Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 animate-pulse"></div>
                        </div>
                        
                        {/* Content Container */}
                        <div className="relative h-full w-full overflow-hidden p-6 flex flex-col items-start justify-end space-y-4">
                          {/* Icon or Logo */}
                          {slide.icon ? (
                            <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                              {slide.icon}
                            </div>
                          ) : slide.logo ? (
                            <div className="relative z-10 w-1/4 max-h-24 transition-transform duration-300 group-hover:scale-105">
                              <Image
                                src={slide.logo}
                                alt={slide.headline}
                                width={102}
                                height={102}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          ) : null}

                          {/* Content */}
                          <div className="flex flex-col items-start text-left text-white space-y-4 relative z-10">
                            <h3 className="text-base font-bold">{slide.headline}</h3>
                            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">{slide.subtext}</p>
                            <button
                              onClick={slide.ctaAction}
                              className="group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold h-11 px-6 bg-gray-900/90 hover:bg-gray-800/95 text-white border-2 border-yellow-400/50 hover:border-yellow-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                            >
                              {slide.ctaText}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={prevSlide}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-8 w-8 rounded-full bg-gray-800/80 border-gray-600/60 hover:bg-gray-700/90 backdrop-blur-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-emerald-400 w-6 h-2"
                      : "bg-gray-600 hover:bg-gray-500 w-2 h-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-8 w-8 rounded-full bg-gray-800/80 border-gray-600/60 hover:bg-gray-700/90 backdrop-blur-md"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
