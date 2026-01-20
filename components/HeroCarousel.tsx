"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Trophy, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
    icon: <Trophy className="w-16 h-16 text-yellow-400" />,
    headline: "WIN WEEKLY PRIZES",
    subtext: "Win a share of $10,000 in weekly prizes — the higher your fan tier, the better the prize!",
    ctaText: "Enter Prize Draw",
  },
  {
    id: 2,
    icon: <UserCircle className="w-16 h-16 text-emerald-400" />,
    headline: "BUILD FAN PROFILE",
    subtext: "Build your profile and increase your fan tier.",
    ctaText: "Complete Profile",
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
    <section className="space-y-6 w-full" style={{ height: "35vh", minHeight: "300px", maxHeight: "500px" }}>
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
                  <div className="rounded-lg text-card-foreground shadow-sm hover:border-gray-700 transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10 group cursor-pointer bg-transparent border-0 w-full h-full">
                    <div className="p-0 relative bg-transparent h-full">
                      <div className="relative h-full w-full bg-transparent overflow-hidden p-6 flex flex-col items-start justify-end space-y-4">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#1a1a1d] to-[#0a0a0b]" />
                        
                        {/* Icon or Logo */}
                        {slide.icon ? (
                          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                            {slide.icon}
                          </div>
                        ) : slide.logo ? (
                          <div className="relative z-10 w-1/4 max-h-32 transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={slide.logo}
                              alt={slide.headline}
                              width={128}
                              height={128}
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : null}

                        {/* Content */}
                        <div className="flex flex-col items-start text-left text-white space-y-3 relative z-10">
                          <h3 className="text-xl font-bold">{slide.headline}</h3>
                          <p className="text-base text-white/80 max-w-md leading-relaxed">{slide.subtext}</p>
                          <button
                            onClick={slide.ctaAction}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300"
                          >
                            {slide.ctaText}
                          </button>
                        </div>

                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
                      ? "bg-purple-400 w-6 h-2"
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
