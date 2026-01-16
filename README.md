# NRL Fan Engagement Platform

A modern Next.js 14 demo application showcasing an NRL Fan Engagement Platform concept. This is a high-fidelity interactive prototype demonstrating a unified fan experience with status, progression, and rewards.

## Features

### Premium Onboarding System
- **Multiple Entry Points**: 
  - Stadium QR: "I Was There" badge claim
  - Broadcast QR: Live game predictions
  - Tipping Invite: Social competition entry
  - Content: Article-based sign-up
- **Emotional "Pick Your Club" Moment**: 
  - Explosive team selection with animations
  - Team colors and fan count celebration
  - Crowd roar effect and welcome messages
- **Progressive Profiling**: 
  - Emotional first, admin later
  - Step-by-step data capture
  - SMS verification with rewards
  - Progressive disclosure of fields

### Fan Dashboard
- **Premium UI**: NBA.com-level design quality
- **Team-Personalized**: Dynamic colors based on selected team
- **Fan Score**: Real-time points with tier progression
- **Status Cards**: Fantasy & Tipping integration
- **Quests & Missions**: Daily, weekly, and seasonal quests
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

## Testing Entry Points

To test different onboarding entry points, add `?entry=` to the URL:

- **Stadium QR**: `http://localhost:3000?entry=stadium-qr`
- **Broadcast QR**: `http://localhost:3000?entry=broadcast-qr`
- **Tipping Invite**: `http://localhost:3000?entry=tipping-invite`
- **Content**: `http://localhost:3000?entry=content`
- **Direct**: `http://localhost:3000` (default)

For tipping invite with custom data:
`http://localhost:3000?entry=tipping-invite&inviter=Dave&comp=The%20Office%20Comp`

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
