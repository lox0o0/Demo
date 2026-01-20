"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_FILES = [
  "/videos/home-bg-1.mp4",
  "/videos/home-bg-2.mp4",
  "/videos/home-bg-3.mp4",
  "/videos/home-bg-4.mp4",
  "/videos/home-bg-5.mp4",
];

interface BackgroundVideoProps {
  className?: string;
}

export default function BackgroundVideo({ className = "" }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Randomly select a video on mount
    const randomIndex = Math.floor(Math.random() * VIDEO_FILES.length);
    const videoPath = VIDEO_FILES[randomIndex];
    setSelectedVideo(videoPath);
    console.log("Background video selected:", videoPath);
  }, []);

  useEffect(() => {
    // Ensure video plays when it's ready
    if (videoRef.current && selectedVideo && !hasError) {
      const video = videoRef.current;
      
      const tryPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playing successfully");
              setIsLoaded(true);
            })
            .catch((error) => {
              console.log("Video autoplay prevented:", error);
              // Try again after user interaction
            });
        }
      };

      if (video.readyState >= 2) {
        tryPlay();
      } else {
        video.addEventListener('canplay', tryPlay, { once: true });
        video.addEventListener('loadeddata', tryPlay, { once: true });
      }

      return () => {
        video.removeEventListener('canplay', tryPlay);
        video.removeEventListener('loadeddata', tryPlay);
      };
    }
  }, [selectedVideo, hasError]);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video play error:", error);
      });
    }
  };

  const handleVideoError = (e: any) => {
    console.error("Error loading background video:", selectedVideo, e);
    setHasError(true);
    // Try next video if current one fails
    const currentIndex = VIDEO_FILES.indexOf(selectedVideo);
    if (currentIndex < VIDEO_FILES.length - 1) {
      setSelectedVideo(VIDEO_FILES[currentIndex + 1]);
      setHasError(false);
    }
  };

  if (!selectedVideo) {
    return (
      <div className={`fixed inset-0 bg-[#0a0a0b] pointer-events-none ${className}`} style={{ zIndex: 0 }} />
    );
  }

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} 
      style={{ zIndex: 0 }}
    >
      {/* Fallback background color */}
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000`}
        src={selectedVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onError={handleVideoError}
        onPlay={() => {
          console.log("Video started playing");
          setIsLoaded(true);
        }}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      
      {/* Dark Overlay for Content Readability - lighter to show video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/40" />
      
      {/* Additional subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/8" />
    </div>
  );
}
