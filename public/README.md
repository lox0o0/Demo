# Public Assets Directory

This directory contains all static assets that are publicly accessible.

## Directory Structure

### `/images/`
- Card images, thumbnails, and general image assets
- Subdirectories:
  - `cards/` - Content card images

### `/videos/`
- Background videos for the home page
- Format: MP4 files
- Files: `home-bg-1.mp4` through `home-bg-5.mp4`

### `/locker-room/`
- Background images and assets for the Locker Room (Dashboard) page
- Files:
  - `background.webp` - Main background image for Locker Room and Leaderboards pages

### `/team-logos/`
- Team logo images (PNG, SVG, JPG formats)

### `/social-logos/`
- Social media platform logos

### `/auth-logos/`
- Authentication provider logos (Google, Apple)

### `/broncos/`
- Team-specific assets for Broncos

## Adding Background Images

To add a new background image:

1. **For page backgrounds**: Save in `/public/` or a subdirectory (e.g., `/public/leaderboards/background.webp`)
2. **For card images**: Save in `/public/images/cards/`
3. **For team assets**: Save in `/public/[team-name]/` or `/public/team-logos/`

### Recommended Formats:
- **Backgrounds**: `.webp` (best compression) or `.jpg` (compatibility)
- **Logos**: `.svg` (scalable) or `.png` (with transparency)
- **Photos**: `.webp` or `.jpg`

### Usage in Code:
```tsx
import Image from "next/image";

<Image
  src="/your-folder/your-image.webp"
  alt="Description"
  fill
  className="object-cover"
  priority
  unoptimized
/>
```

## File Naming Conventions

- Use lowercase with hyphens: `background-image.webp`
- Be descriptive: `leaderboards-background.webp`
- Keep file sizes optimized for web
