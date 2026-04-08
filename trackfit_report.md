# TRACKFIT: WEB-BASED FITNESS & GYM MANAGEMENT SYSTEM

---

## 1. Introduction

TrackFit is a full-stack web application designed to bridge the gap between gym owners and their members through a unified digital platform. It enables automated gym membership management, real-time fitness tracking, AI-assisted coaching, and personalized nutrition logging — all accessible through a clean, modern web interface from any device.

---

## 2. Problem Statement

Traditional gym management relies heavily on manual processes — paper registers, verbal communication, and in-person attendance tracking. Members have no central platform to log workouts, monitor progress, or track their subscription status. Gym owners lack digital tools to manage members efficiently, renew subscriptions, or communicate plan details. This results in operational inefficiencies, missed renewals, and a poor member experience.

---

## 3. Aim and Objectives

The aim of this project is to develop a comprehensive web-based fitness and gym management system that serves both gym owners and members from a single platform.

**Objectives include:**
- Enable gym owners to manage members, send invitations, and handle subscriptions digitally
- Allow users to track real-time fitness data including weight, nutrition, and personal records (PRs)
- Provide an AI coaching feature for personalized fitness guidance
- Implement a secure role-based authentication system for owners and members
- Build a responsive, modern UI accessible from any device

---

## 4. Proposed Solution

TrackFit proposes a two-sided web platform with separate dashboards for gym owners and members. Gym owners can add members by email or User ID, set subscription plans (fee and duration), and monitor all linked members. Members receive in-app gym invitations, can accept or decline, and track their health metrics independently. A shared data model ensures subscription status, link approvals, and fitness data stay in sync in real time.

---

## 5. Methodology

The system follows a **client-server architecture**:

1. **Authentication** — Users and gym owners register and log in separately. JWTs stored as HTTP cookies secure all API routes.
2. **Gym Onboarding** — An owner sends an invitation (email or ID). A pending [OwnerUser](file:///c:/personal/coding/Web%20Devlopment/Projects/track_Fit/frontend/src/pages/OwnerUsers.jsx#34-232) link and a pending subscription are created. The user sees the invitation on their dashboard and must accept it to activate membership.
3. **Fitness Tracking** — Members independently log weight, nutrition macros, steps, and personal records through dedicated pages. Data is stored per-user in MongoDB and visualized with interactive charts.
4. **AI Coaching** — A dedicated AI Coach page provides personalized workout and nutrition guidance powered by a language model API.
5. **Dashboard Aggregation** — The user dashboard fetches all data in parallel (profile, subscription, weight, PRs, nutrition, pending invitations) and presents a unified daily overview.

---

## 6. Technologies Used

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Framer Motion, Recharts, React Router |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcrypt, HTTP Cookies |
| **AI Integration** | Gemini / OpenAI API (AI Coach feature) |
| **State / Data Fetching** | Axios, React Hooks |
| **Package Management** | NPM, Vite (dev server) |

---

## 7. Key Features

### For Gym Owners
- Secure owner registration and login
- Add members by **email** or **User ID**
- Set custom subscription plans (fee + duration presets or custom)
- View all members with link status, subscription status, and days remaining
- View detailed member profile (body stats, subscription timeline)
- Renew subscriptions or remove members
- Real-time member list with search and filter

### For Members (Users)
- User registration with fitness profile (age, gender, height, weight, frequency)
- **User Dashboard** — greeting, gym membership card with countdown ring, today's nutrition, weight trend chart, top PRs, and profile snapshot
- In-app **gym invitation cards** — accept or decline with plan details shown
- **Weight Tracker** — log daily weights, visualize trends, delete entries
- **Nutrition Logger** — track daily calories, protein, carbs, fats, and steps
- **PR Tracker** — log and update personal records per exercise
- **AI Coach** — get personalized fitness and nutrition advice
- **Profile Page** — view/edit profile, copy User ID, manage gym requests
- Sidebar navigation with logout

---

## 8. System Architecture

```
Browser (React SPA)
       │
       ▼
Express REST API  ←→  MongoDB Atlas
       │
       ├── /api/users      → Auth, profile, subscription, gym requests
       ├── /api/gymOwner   → Owner auth, member management, subscriptions
       ├── /api/weight     → Weight logs
       ├── /api/nutrition  → Nutrition logs
       ├── /api/pr         → Personal records
       └── /api/ai         → AI coach queries
```

---

## 9. Advantages

- **Paperless Gym Management** — eliminates manual registers and verbal communication
- **User Consent Flow** — members must accept gym invitations; owners cannot view data without approval
- **Unified Platform** — one app for owners and members with role-based dashboards
- **Real-time Fitness Insights** — interactive charts for weight trends and calorie history
- **AI-Powered Coaching** — personalized guidance without needing a personal trainer
- **Secure by Design** — JWT auth, cookie-based sessions, middleware-protected routes
- **Responsive & Modern UI** — works on any device with smooth animations

---

## 10. Applications

- **Fitness Gyms** — manage memberships, renewals, and member health data
- **Personal Trainers** — monitor client progress and assign plans
- **Health-Conscious Individuals** — track nutrition, weight, and PRs independently
- **Corporate Wellness Programs** — manage employee fitness subscriptions
- **Home Fitness Enthusiasts** — maintain a self-managed fitness journal

---

## 11. Future Scope

- Mobile app (React Native) for iOS and Android
- QR code check-in for gym attendance tracking
- Payment gateway integration for online subscription renewal
- Push notifications for subscription expiry reminders
- Workout plan builder with AI-generated routines
- Analytics dashboard for gym owners (revenue, retention, active members)

---

## 12. Conclusion

TrackFit is a comprehensive, full-stack web application that modernizes gym management and personal fitness tracking. By integrating a consent-based gym invitation system, real-time fitness logging, AI coaching, and role-separated dashboards, it delivers a complete digital solution for both gym operators and their members. TrackFit demonstrates how modern web technologies can transform traditional fitness management into an efficient, data-driven, and user-friendly experience.

---

*Developed using React.js · Node.js · MongoDB · Express.js*
