"use client";

import { useState } from "react";

interface BroadcastQRProps {
  onComplete: (data: any) => void;
}

export default function BroadcastQR({ onComplete }: BroadcastQRProps) {
  const [phone, setPhone] = useState("");
  const [prediction, setPrediction] = useState("");

  const handleContinue = () => {
    onComplete({
      entryPoint: "broadcast-qr",
      phone,
      prediction,
      context: "live-game",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nrl-dark via-nrl-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 text-center space-y-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center text-5xl">
              📺
            </div>
            <h1 className="text-3xl font-bold mb-2">Predict the margin</h1>
            <p className="text-gray-400 text-lg">
              Lock in your prediction and earn points
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

            <div>
              <label className="block text-sm font-medium mb-2 text-left">Margin prediction</label>
              <input
                type="text"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                placeholder="e.g., Broncos by 12"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-nrl-green focus:ring-2 focus:ring-nrl-green/20"
              />
            </div>

            <button
              onClick={handleContinue}
              disabled={!phone || !prediction}
              className="w-full bg-nrl-green text-white font-bold py-4 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Lock in prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
