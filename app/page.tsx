"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import EntryPointRouter from "@/components/onboarding/EntryPointRouter";
import LandingPage from "@/components/LandingPage";
import PickYourClub from "@/components/onboarding/PickYourClub";

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLandingPage, setShowLandingPage] = useState(true);

  useEffect(() => {
    // Check if user is onboarded (in real app, this would be from localStorage/auth)
    // For demo purposes, you can add ?reset=1 to URL to clear onboarding
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      localStorage.removeItem("nrl_onboarded");
      localStorage.removeItem("nrl_user");
      localStorage.removeItem("landing_page_seen");
      setIsOnboarded(false);
      setUser(null);
      setShowLandingPage(true);
      return;
    }
    
    // For demo: Always start from landing page when opened from Vercel
    // Clear landing_page_seen flag on every page load to ensure landing page always shows
    localStorage.removeItem("landing_page_seen");
    setShowLandingPage(true);
    
    // Still check if user is onboarded (for session continuity)
    const onboarded = localStorage.getItem("nrl_onboarded");
    const userData = localStorage.getItem("nrl_user");
    
    if (onboarded === "true" && userData) {
      try {
        const parsed = JSON.parse(userData);
        // Validate user data has required fields (name or email)
        // Allow users without team (fast sign-in flow)
        if (parsed && (parsed.name || parsed.email)) {
          setIsOnboarded(true);
          setUser(parsed);
          // Don't skip landing page - always show it first
        }
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem("nrl_onboarded");
        localStorage.removeItem("nrl_user");
      }
    }
  }, []);

  const handleOnboardingComplete = (userData: any) => {
    setIsOnboarded(true);
    setUser(userData);
    localStorage.setItem("nrl_onboarded", "true");
    localStorage.setItem("nrl_user", JSON.stringify(userData));
    localStorage.setItem("landing_page_seen", "true");
    // Set flag to show tier progress modal once after onboarding
    sessionStorage.setItem("onboardingJustCompleted", "true");
  };

  const [showTeamSelection, setShowTeamSelection] = useState(false);

  const handleGetStarted = () => {
    localStorage.setItem("landing_page_seen", "true");
    setShowLandingPage(false);
    setShowTeamSelection(true);
  };

  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!isOnboarded) {
    // If coming from landing page, go directly to team selection
    if (showTeamSelection) {
      return <PickYourClub entryPoint="direct" onComplete={handleOnboardingComplete} />;
    }
    // Otherwise use the entry point router for other entry points
    return <EntryPointRouter onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard user={user} />;
}
