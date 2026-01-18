"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import EntryPointRouter from "@/components/onboarding/EntryPointRouter";

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is onboarded (in real app, this would be from localStorage/auth)
    // For demo purposes, you can add ?reset=1 to URL to clear onboarding
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      localStorage.removeItem("nrl_onboarded");
      localStorage.removeItem("nrl_user");
      setIsOnboarded(false);
      setUser(null);
      return;
    }
    
    const onboarded = localStorage.getItem("nrl_onboarded");
    const userData = localStorage.getItem("nrl_user");
    
    if (onboarded === "true" && userData) {
      try {
        const parsed = JSON.parse(userData);
        // Validate user data has required fields
        if (parsed && parsed.team) {
          setIsOnboarded(true);
          setUser(parsed);
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
  };

  if (!isOnboarded) {
    return <EntryPointRouter onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard user={user} />;
}
