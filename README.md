# NRL Fan Engagement Platform

A modern Next.js 14 demo application showcasing an NRL Fan Engagement Platform concept. This is a high-fidelity interactive prototype demonstrating a unified fan experience with status, progression, and rewards.

## Features

- **Onboarding Flow**: Frictionless sign-up with team selection and instant personalization
- **Fan Dashboard**: Real-time fan score, tier progression, and quick-access cards
- **Quests & Missions**: Daily, weekly, and seasonal quests with point rewards
- **Status & Progression**: Tier system (Rookie → Bronze → Silver → Gold → Legend)
- **Fantasy & Tipping Integration**: Status cards showing current performance
- **Social Features**: Activity feed, leagues, and leaderboards
- **Profile Page**: Badge collection, stats, and progress tracking

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **React 18**

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main entry point
│   └── globals.css     # Global styles
├── components/
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Onboarding.tsx  # Sign-up flow
│   ├── FanScore.tsx    # Fan score display
│   ├── QuestsPanel.tsx # Quests & missions
│   ├── StatusCards.tsx # Fantasy & Tipping cards
│   ├── ActivityFeed.tsx # Social activity feed
│   └── Navigation.tsx  # Bottom navigation
└── lib/
    └── mockData.ts     # Mock data for demo
```

## Design Principles

- **Premium sports membership portal** aesthetic (not gaming/gambling)
- **Dark theme** with NRL green accents
- **Glass morphism** UI elements
- **Mobile-first** responsive design
- **Earned achievement** tone (not lottery/gambling)

## Demo Data

All data is mocked for demonstration purposes. User state is stored in localStorage.

## License

This is a demo/prototype project.
