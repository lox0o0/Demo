"use client";

import { useState } from "react";
import Image from "next/image";
import { Team } from "@/lib/data/teams";
import { EntryPoint } from "@/lib/onboardingTypes";

interface ProgressiveProfileProps {
  team: Team;
  entryPoint: EntryPoint;
  entryData?: any;
  onComplete: (userData: any) => void;
}

export default function ProgressiveProfile({
  team,
  entryPoint,
  entryData,
  onComplete,
}: ProgressiveProfileProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: entryData?.phone || "",
    phoneVerified: false,
    smsReminders: false,
  });

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2);
    } else if (step === 2) {
      // Phone verification step
      if (formData.phone) {
        setFormData({ ...formData, phoneVerified: true });
        setStep(3);
      }
    } else if (step === 3) {
      // Complete onboarding
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phoneVerified: formData.phoneVerified,
        team: team.name,
        teamData: team,
        fanScore: 50, // Welcome bonus
        tier: "Rookie",
        points: 50,
        lifetimePoints: 50,
        memberSince: new Date().getFullYear(),
        streak: 0,
        smsReminders: formData.smsReminders,
        entryPoint,
        entryData,
      };
      onComplete(userData);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${team.primaryColor}05 0%, ${team.secondaryColor}05 100%)`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 space-y-6">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-nrl-green to-nrl-amber h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={team.logoUrl}
                    alt={team.name}
                    fill
                    className="object-contain"
                    style={{ filter: `drop-shadow(0 0 20px ${team.primaryColor}40)` }}
                    unoptimized
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
                <p className="text-gray-400">
                  Just a few details to personalize your {team.name} experience
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-nrl-green focus:ring-2 focus:ring-nrl-green/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-nrl-green focus:ring-2 focus:ring-nrl-green/20"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.email}
                className="w-full bg-nrl-green text-white font-bold py-4 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="text-2xl font-bold mb-2">SMS reminders?</h2>
                <p className="text-gray-400 text-sm">
                  Get notified about game day, tips, and exclusive {team.name} content
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="04XX XXX XXX"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-nrl-green focus:ring-2 focus:ring-nrl-green/20"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-nrl-green/10 rounded-xl border border-nrl-green/20">
                  <input
                    type="checkbox"
                    id="sms"
                    checked={formData.smsReminders}
                    onChange={(e) => setFormData({ ...formData, smsReminders: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/5"
                  />
                  <label htmlFor="sms" className="flex-1 text-sm">
                    <span className="font-semibold">Enable SMS reminders</span>
                    <p className="text-xs text-gray-400 mt-1">
                      Get 50 Telstra credits when you verify your number
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.phone}
                  className="flex-1 bg-nrl-green text-white font-bold py-3 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                <p className="text-gray-400">
                  Welcome to the {team.name} community
                </p>
              </div>

              <div className="p-4 bg-nrl-green/10 rounded-xl border border-nrl-green/20">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Welcome bonus:</span>
                    <span className="font-bold text-nrl-green">+50 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Badge unlocked:</span>
                    <span className="font-bold">🎖️ Rookie</span>
                  </div>
                  {formData.phoneVerified && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mobile verified:</span>
                      <span className="font-bold text-nrl-green">+50 Telstra credits</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-nrl-green text-white font-bold py-4 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
