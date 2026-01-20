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

  useEffect(() => {
    // Randomly select a video on mount
    const randomIndex = Math.floor(Math.random() * VIDEO_FILES.length);
    setSelectedVideo(VIDEO_FILES[randomIndex]);
  }, []);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  };

  const handleVideoError = () => {
    console.error("Error loading background video:", selectedVideo);
    // Try next video if current one fails
    const currentIndex = VIDEO_FILES.indexOf(selectedVideo);
    if (currentIndex < VIDEO_FILES.length - 1) {
      setSelectedVideo(VIDEO_FILES[currentIndex + 1]);
    }
  };

  if (!selectedVideo) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={selectedVideo}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
      />
      
      {/* Dark Overlay for Content Readability - stronger gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
      
      {/* Additional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
