"use client";

import { useState, useEffect } from "react";

interface TippingInviteProps {
  onComplete: (data: any) => void;
}

export default function TippingInvite({ onComplete }: TippingInviteProps) {
  const [inviterName, setInviterName] = useState("Dave");
  const [compName, setCompName] = useState("The Office Comp");

  // In real app, this would come from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviter = params.get("inviter");
    const comp = params.get("comp");
    if (inviter) setInviterName(inviter);
    if (comp) setCompName(comp);
  }, []);

  const handleContinue = () => {
    onComplete({
      entryPoint: "tipping-invite",
      inviterName,
      compName,
      context: "social",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nrl-dark via-nrl-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 text-center space-y-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-nrl-green to-nrl-amber flex items-center justify-center">
              <span className="text-xs font-bold text-white uppercase tracking-tight">INVITE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-nrl-green">{inviterName}</span> invited you
            </h1>
            <p className="text-gray-400 text-lg">
              Join <span className="text-nrl-amber font-semibold">{compName}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-nrl-green/10 rounded-xl border border-nrl-green/20">
              <p className="text-sm text-gray-300">
                Make your tips and compete with your mates. You'll be ranked #13 when you join!
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-nrl-green text-white font-bold py-4 rounded-xl hover:bg-nrl-green/90 transition-all transform hover:scale-[1.02] text-lg"
            >
              Join Competition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
