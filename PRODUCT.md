# Product

## Platform

web

## Users

Individual fitness enthusiasts, athletes, and gym-goers who want a sleek, standalone platform to log daily nutrition, track weight progression over time, record personal record (PR) lifts, and consult an AI fitness coach.

## Product Purpose

TrackFit provides a high-performance, dark-themed personal fitness tracker and intelligent assistant. It empowers users to monitor their health trends visually and optimize their workout routine without unnecessary complexity or bloated enterprise management features.

## Positioning

A sleek, athlete-centric web application combining macro tracking, interactive data analytics, personal record tracking, and real-time AI fitness coaching in a unified, modern interface.

## Operating Context

Used daily on mobile and desktop web browsers in post-workout, meal-logging, or daily fitness check-in settings where quick input, scannable data visualization, and instant feedback are critical.

## Capabilities and Constraints

- **Weight Analytics**: 14-day interactive area chart tracking weight trends (powered by Recharts).
- **Nutrition & Macros**: Daily logging and 7-day trend summaries for Calories, Protein, Carbohydrates, Fats, and Step count.
- **PR Tracking**: Exercise-specific personal best lift logging (weight, reps, date) with leaderboard views.
- **AI Coach**: Real-time interactive chat assistant leveraging Google Gemini API (`@google/genai`) for workout and diet advice.
- **Authentication**: JWT-based session security with bcrypt password encryption.

## Brand Commitments

- **Aesthetic**: Modern high-contrast dark theme (deep zinc `#0f0f11` base, vibrant indigo `#6366f1` highlights, ambient glassmorphism).
- **Typography**: Bold, high-energy sans-serif headers with clean, readable data displays.

## Evidence on Hand

- Fully functional backend REST API (`/api/users`, `/api/weight`, `/api/nutrition`, `/api/pr`, `/api/ai`).
- React 19 + Vite frontend with Tailwind CSS, Framer Motion, and Recharts.
- Seeded database state with active athlete profile (`Alex River`).

## Product Principles

1. **Athlete First**: Direct focus on individual fitness progression, speed, and privacy.
2. **Visual Clarity**: High-density stats presented through clean graphs, progress indicators, and chips.
3. **Instant Intelligence**: Seamless AI assistance for immediate fitness guidance.
