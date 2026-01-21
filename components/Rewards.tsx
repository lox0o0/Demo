"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Gift, 
  Check, 
  DollarSign, 
  Utensils, 
  Shirt, 
  Users, 
  Phone, 
  Ticket, 
  Calendar,
  Copy,
  X,
  Sparkles
} from "lucide-react";

interface RewardsProps {
  user: any;
  onNavigate?: (section: string) => void;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: any;
  source: string;
  wonDate: string;
  expiresDate?: string;
  claimBeforeDate?: string;
  type: "claimable" | "claimed";
  claimedDate?: string;
  ageRestricted?: boolean;
  rewardType?: "tier" | "experience" | "standard";
  status?: string;
  details?: string;
}

export default function Rewards({ user, onNavigate }: RewardsProps) {
  const [claimableRewards, setClaimableRewards] = useState<Reward[]>([
    {
      id: "4",
      title: "Broncos Training Session Access",
      description: "Access for you + 1 mate\nRed Hill Training Facility",
      icon: Users,
      source: "Weekly Draw",
      wonDate: "12 Jan 2026",
      type: "claimable",
      rewardType: "experience",
    },
    {
      id: "3",
      title: "Signed Broncos Jersey",
      description: "2026 Squad Authenticated Signatures",
      icon: Shirt,
      source: "Gold Tier Reward",
      wonDate: "15 Jan 2026",
      claimBeforeDate: "30 Jun 2026",
      type: "claimable",
      rewardType: "tier",
    },
    {
      id: "2",
      title: "$10 KFC Voucher",
      description: "$10 off your next KFC order",
      icon: Utensils,
      source: "Prize Wheel",
      wonDate: "18 Jan 2026",
      expiresDate: "28 Feb 2026",
      type: "claimable",
    },
    {
      id: "1",
      title: "$10 Sportsbet Credit",
      description: "Use on any sports betting market",
      icon: DollarSign,
      source: "Prize Wheel",
      wonDate: "19 Jan 2026",
      expiresDate: "19 Feb 2026",
      type: "claimable",
      ageRestricted: true,
    },
  ]);

  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([
    {
      id: "5",
      title: "Telstra Phone Plan",
      description: "20% off for 12 months",
      icon: Phone,
      source: "Prize Wheel",
      wonDate: "5 Jan 2026",
      claimedDate: "6 Jan 2026",
      type: "claimed",
      status: "Activated on account ending ***482",
    },
    {
      id: "6",
      title: "Broncos Cap",
      description: "Official 2026 Members Cap",
      icon: Shirt,
      source: "Silver Tier Reward",
      wonDate: "3 Jan 2026",
      claimedDate: "4 Jan 2026",
      type: "claimed",
      status: "Shipped to: 123 Example St, Brisbane\nTracking: AU12345678 (tap to track)",
    },
    {
      id: "7",
      title: "Suncorp Stadium Home Game Tickets",
      description: "Broncos vs Roosters · Suncorp Stadium\n15 March 2026 · 2 x General Admission",
      icon: Ticket,
      source: "Weekly Draw",
      wonDate: "1 Jan 2026",
      claimedDate: "2 Jan 2026",
      type: "claimed",
      status: "Tickets in Apple Wallet (tap to view)",
    },
  ]);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaimClick = (reward: Reward) => {
    if (reward.ageRestricted) {
      setSelectedReward(reward);
      setShowAgeModal(true);
    } else {
      setSelectedReward(reward);
      setShowClaimModal(true);
    }
  };

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    if (selectedReward) {
      setShowClaimModal(true);
    }
  };

  const handleConfirmClaim = () => {
    if (selectedReward) {
      // Move reward from claimable to claimed
      setClaimableRewards(prev => prev.filter(r => r.id !== selectedReward.id));
      setClaimedRewards(prev => [
        {
          ...selectedReward,
          type: "claimed",
          claimedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        ...prev
      ]);
      setShowClaimModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSelectedReward(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/rewards/rewards-background.jpeg"
          alt="Rewards Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-2 relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <Gift className="w-5 h-5 text-white" />
          <h1 className="text-xl font-bold text-white">My Rewards</h1>
        </div>
        <p className="text-nrl-text-secondary text-xs">Claim your prizes and view reward history</p>
      </div>

      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 relative z-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Want more prizes?</h3>
              <p className="text-xs text-white/60">3 spins available · Weekly draw closes in 2d 14h</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate?.("dashboard")}
                className="px-3 py-1.5 bg-nrl-green/20 hover:bg-nrl-green/30 border border-nrl-green/50 rounded-lg text-nrl-green hover:text-white font-semibold text-xs transition-all"
              >
                Spin the Wheel
              </button>
              <button
                onClick={() => onNavigate?.("dashboard")}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-300 hover:text-white font-semibold text-xs transition-all"
              >
                Enter Weekly Draw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Claimable Rewards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-white" />
                <h2 className="text-base font-bold text-white">Claim Rewards</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-xs font-semibold text-amber-300 animate-pulse">
                  {claimableRewards.length} available
                </span>
              </div>
            </div>

            {claimableRewards.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
                <p className="text-white/60 mb-2">No prizes to claim right now</p>
                <p className="text-xs text-white/40 mb-4">Keep spinning the wheel and entering draws!</p>
                <button
                  onClick={() => onNavigate?.("dashboard")}
                  className="px-4 py-2 bg-nrl-green/20 hover:bg-nrl-green/30 border border-nrl-green/50 rounded-lg text-nrl-green font-semibold text-sm transition-all"
                >
                  Go to Locker Room
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {claimableRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onClaim={() => handleClaimClick(reward)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Claimed Rewards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white" />
                <h2 className="text-base font-bold text-white">Claimed</h2>
                <span className="px-2 py-0.5 bg-nrl-green/20 border border-nrl-green/50 rounded text-xs font-semibold text-nrl-green">
                  {claimedRewards.length} claimed
                </span>
              </div>
            </div>

            {claimedRewards.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
                <p className="text-white/60 mb-2">You haven't claimed any rewards yet</p>
                <p className="text-xs text-white/40">Your claimed prizes will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {claimedRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onClaim={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Age Verification Modal */}
      {showAgeModal && selectedReward && (
        <AgeVerificationModal
          reward={selectedReward}
          onConfirm={handleAgeConfirm}
          onClose={() => {
            setShowAgeModal(false);
            setSelectedReward(null);
          }}
        />
      )}

      {/* Claim Modal */}
      {showClaimModal && selectedReward && (
        <ClaimModal
          reward={selectedReward}
          onConfirm={handleConfirmClaim}
          onClose={() => {
            setShowClaimModal(false);
            setSelectedReward(null);
          }}
        />
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(20)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute w-4 h-4 text-amber-400 animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>
            <div className="bg-nrl-green/90 backdrop-blur-md border-2 border-nrl-green rounded-lg p-6 text-center">
              <Check className="w-12 h-12 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-lg">Reward Claimed!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reward Card Component
function RewardCard({ reward, onClaim }: { reward: Reward; onClaim: () => void }) {
  const Icon = reward.icon;
  const isClaimable = reward.type === "claimable";
  const borderColor = isClaimable ? "border-amber-500/50" : "border-nrl-green/50";
  const opacity = isClaimable ? "opacity-100" : "opacity-80";

  return (
    <div
      className={`bg-white/5 backdrop-blur-md border-l-4 ${borderColor} border border-white/20 rounded-lg p-3 hover:shadow-lg transition-all ${opacity} ${
        isClaimable ? "hover:scale-[1.02] cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isClaimable ? "bg-amber-500/20 border border-amber-500/50" : "bg-nrl-green/20 border border-nrl-green/50"
          }`}>
            <Icon className={`w-4 h-4 ${isClaimable ? "text-amber-400" : "text-nrl-green"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-white">{reward.title}</h3>
              {reward.ageRestricted && (
                <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-[10px] font-semibold text-red-400">
                  18+
                </span>
              )}
              {reward.rewardType === "tier" && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-[10px] font-semibold text-amber-300">
                  TIER REWARD
                </span>
              )}
              {reward.rewardType === "experience" && (
                <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded text-[10px] font-semibold text-blue-300">
                  EXPERIENCE
                </span>
              )}
              {!isClaimable && (
                <span className="px-1.5 py-0.5 bg-nrl-green/20 border border-nrl-green/50 rounded text-[10px] font-semibold text-nrl-green flex items-center gap-1">
                  CLAIMED <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 whitespace-pre-line">{reward.description}</p>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-white/50 mb-2">
        Won: {reward.source} · {reward.wonDate}
        {reward.expiresDate && `\nExpires: ${reward.expiresDate}`}
        {reward.claimBeforeDate && `\nClaim before: ${reward.claimBeforeDate}`}
        {reward.claimedDate && `\nClaimed: ${reward.claimedDate}`}
      </div>

      {reward.status && (
        <div className="text-[10px] text-white/60 whitespace-pre-line mb-2">
          {reward.status}
        </div>
      )}

      {isClaimable && (
        <button
          onClick={onClaim}
          className="w-full mt-2 px-3 py-1.5 bg-nrl-green/20 hover:bg-nrl-green/30 border border-nrl-green/50 rounded-lg text-nrl-green hover:text-white font-semibold text-xs transition-all"
        >
          {reward.ageRestricted
            ? "CONFIRM AGE TO CLAIM"
            : reward.rewardType === "experience"
            ? "CLAIM & SELECT DATE"
            : "CLAIM REWARD"}
        </button>
      )}

      {isClaimable && reward.ageRestricted && (
        <p className="text-[10px] text-white/40 mt-1">Must be 18+ to claim this reward</p>
      )}
    </div>
  );
}

// Age Verification Modal
function AgeVerificationModal({
  reward,
  onConfirm,
  onClose,
}: {
  reward: Reward;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-white mb-2">Age Verification Required</h3>
        <p className="text-sm text-white/70 mb-4">
          This reward is restricted to users 18 years or older.
        </p>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-nrl-green focus:ring-nrl-green"
            />
            <span className="text-sm text-white">I confirm I am 18 years or older</span>
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={confirmed ? onConfirm : undefined}
            disabled={!confirmed}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              confirmed
                ? "bg-nrl-green/20 hover:bg-nrl-green/30 border border-nrl-green/50 text-nrl-green hover:text-white cursor-pointer"
                : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// Claim Modal
function ClaimModal({
  reward,
  onConfirm,
  onClose,
}: {
  reward: Reward;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("ABC123XYZ");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-white mb-2">Claim Reward</h3>
        <div className="mb-4">
          <p className="text-sm font-semibold text-white mb-1">{reward.title}</p>
          <p className="text-xs text-white/70">{reward.description}</p>
        </div>

        {reward.rewardType === "experience" ? (
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-nrl-green"
            />
          </div>
        ) : reward.rewardType === "tier" ? (
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Shipping Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-nrl-green resize-none"
              rows={3}
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Reward Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                readOnly
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-semibold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-nrl-green/20 hover:bg-nrl-green/30 border border-nrl-green/50 rounded-lg text-nrl-green hover:text-white font-semibold text-sm transition-all"
          >
            Confirm Claim
          </button>
        </div>
      </div>
    </div>
  );
}
