"use client";

interface NavigationProps {
  activeTab: "home" | "quests" | "social" | "profile";
  setActiveTab: (tab: "home" | "quests" | "social" | "profile") => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: "home" as const, label: "Home", icon: "🏠" },
    { id: "quests" as const, label: "Quests", icon: "🎯" },
    { id: "social" as const, label: "Social", icon: "👥" },
    { id: "profile" as const, label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10">
      <div className="max-w-4xl mx-auto flex items-center justify-around p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? "text-nrl-green bg-nrl-green/10"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
