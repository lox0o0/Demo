"use client";

import { useState } from "react";

interface StadiumQRProps {
  onComplete: (data: any) => void;
}

export default function StadiumQR({ onComplete }: StadiumQRProps) {
  const [phone, setPhone] = useState("");

  const handleContinue = () => {
    onComplete({
      entryPoint: "stadium-qr",
      phone,
      context: "stadium",
      badge: "I Was There",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nrl-dark via-nrl-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 text-center space-y-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center">
              <span className="text-xs font-bold text-white uppercase tracking-tight">TICKET</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">You're at the game!</h1>
            <p className="text-gray-400 text-lg">
              Claim your <span className="text-nrl-amber font-semibold">"I Was There"</span> badge
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-left">Enter your mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="04XX XXX XXX"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-nrl-green focus:ring-2 focus:ring-nrl-green/20"
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!phone}
              className="w-full bg-nrl-green text-white font-bold py-4 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Continue
            </button>
          </div>

          <p className="text-xs text-gray-500">
            We'll send you a verification code to confirm your attendance
          </p>
        </div>
      </div>
    </div>
  );
}
