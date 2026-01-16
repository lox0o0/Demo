"use client";

import { useState, useEffect } from "react";
import StadiumQR from "./entry-points/StadiumQR";
import BroadcastQR from "./entry-points/BroadcastQR";
import TippingInvite from "./entry-points/TippingInvite";
import ContentEntry from "./entry-points/ContentEntry";
import PickYourClub from "./PickYourClub";
import { EntryPoint } from "@/lib/onboardingTypes";

interface EntryPointRouterProps {
  onComplete: (userData: any) => void;
}

export default function EntryPointRouter({ onComplete }: EntryPointRouterProps) {
  const [entryPoint, setEntryPoint] = useState<EntryPoint | null>(null);
  const [showClubPicker, setShowClubPicker] = useState(false);
  const [entryData, setEntryData] = useState<any>(null);

  // In a real app, this would detect entry point from URL params, QR code data, etc.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entry = params.get("entry") as EntryPoint;
    
    if (entry && ["stadium-qr", "broadcast-qr", "tipping-invite", "content"].includes(entry)) {
      setEntryPoint(entry);
    } else {
      // Default to direct entry for demo
      setEntryPoint("direct");
    }
  }, []);

  const handleEntryComplete = (data: any) => {
    setEntryData(data);
    setShowClubPicker(true);
  };

  if (showClubPicker) {
    return (
      <PickYourClub 
        entryPoint={entryPoint || "direct"}
        entryData={entryData}
        onComplete={onComplete}
      />
    );
  }

  switch (entryPoint) {
    case "stadium-qr":
      return <StadiumQR onComplete={handleEntryComplete} />;
    case "broadcast-qr":
      return <BroadcastQR onComplete={handleEntryComplete} />;
    case "tipping-invite":
      return <TippingInvite onComplete={handleEntryComplete} />;
    case "content":
      return <ContentEntry onComplete={handleEntryComplete} />;
    default:
      return <PickYourClub entryPoint="direct" onComplete={onComplete} />;
  }
}
