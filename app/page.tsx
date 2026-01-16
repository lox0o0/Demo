"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import EntryPointRouter from "@/components/onboarding/EntryPointRouter";

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is onboarded (in real app, this would be from localStorage/auth)
    const onboarded = localStorage.getItem("nrl_onboarded");
    const userData = localStorage.getItem("nrl_user");
    
    if (onboarded === "true" && userData) {
      setIsOnboarded(true);
      setUser(JSON.parse(userData));
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
