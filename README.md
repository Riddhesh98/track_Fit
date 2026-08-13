# TrackFit 🏋️‍♂️🥗

> **TrackFit** is a modern, full-stack Gym & Fitness Management Platform engineered for gym owners, personal trainers, and fitness enthusiasts. It combines robust member and subscription management for gym owners with personalized nutrition, weight, PR tracking, and an **AI-powered Fitness Coach** for users.

---

## ✨ Features

### 🏢 Gym Owner Portal
- **Member Roster Management**: Add new gym members, view member lists, and access detailed individual profiles.
- **Subscription Tracking**: Monitor member subscription plans, active/inactive statuses, and expiration dates.
- **Dashboard Analytics**: Real-time overview of total members, active subscriptions, and key membership insights.

### 👤 User / Member Features
- **Member Dashboard**: High-level summary of active fitness stats, daily goals, and progress.
- **Nutrition & Macro Tracking**: Log meals, edit nutrition goals, and monitor daily intake of Calories, Protein, Carbohydrates, and Fats.
- **Weight & Progress Tracking**: Track weight changes over time with interactive trend charts powered by Recharts.
- **Personal Records (PR) Tracker**: Keep record of top lifts (Bench Press, Squat, Deadlift, Overhead Press, etc.) and fitness achievements.

### 🤖 AI Fitness Coach (Powered by Gemini AI)
- AI-driven fitness assistance leveraging Google Gemini AI for customized workout routines, diet suggestions, form tips, and health Q&A.

### 🔐 Security & Architecture
- **Dual Role Authentication**: Dedicated authentication flows for Gym Owners and Users.
- **JWT & Password Hashing**: Secure cookie/header-based authentication with `bcrypt` encryption.
- **RESTful Architecture**: Clean, modular route-controller-model architecture in Node.js/Express.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Analytics & Data Vis**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) (ES Modules)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT), `bcrypt`, `cookie-parser`
- **AI Integration**: `@google/genai` / `@google/generative-ai` (Google Gemini)
- **Development**: `nodemon`, `dotenv`

---

## 📁 Repository Structure

```
track_Fit/
├── backend/
│   ├── src/
│   │   ├── Controllers/     # Logic for Users, Owners, AI, Nutrition, PR, Weight
│   │   ├── Models/          # Mongoose Schemas (User, GymOwner, Nutrition, PR, Weight, etc.)
│   │   ├── Routes/          # Express API Endpoints
│   │   ├── Middleware/      # Auth & Role verification middlewares
│   │   ├── dataBase/        # MongoDB connection setup
│   │   └── app.js           # Express app configuration
│   ├── .env.example         # Template for environment variables
│   ├── server.js            # Node server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components & layout wrappers (UserLayout, OwnerLayout)
│   │   ├── pages/           # Pages divided into auth, user, and owner sub-directories
│   │   ├── api/             # Axios instances and API services
│   │   ├── App.jsx          # Route definitions
│   │   └── main.jsx         # Application entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Google Gemini API Key](https://aistudio.google.com/) (for AI Coach features)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Riddhesh98/track_Fit.git
cd track_Fit
```

---

### 2. Backend Setup
Navigate to the `backend` folder, install dependencies, configure environment variables, and start the development server:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder (or copy from `.env.example`):
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/track_Fit
USER_SECRET=your_user_jwt_secret_key
GYM_OWNER_SECRET=your_owner_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Run the backend development server:
```bash
npm run dev
```
The backend API server will run on `http://localhost:3000`.

---

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` folder, install dependencies, and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
The frontend application will run on `http://localhost:5173`.

---

## 📡 API Endpoint Overview

| Module | Route Endpoint | Description |
| :--- | :--- | :--- |
| **Auth & User** | `/api/v1/user/register` | User Registration |
| **Auth & User** | `/api/v1/user/login` | User Login |
| **Gym Owner** | `/api/v1/gym-owner/register` | Gym Owner Registration |
| **Gym Owner** | `/api/v1/gym-owner/login` | Gym Owner Login |
| **Gym Owner** | `/api/v1/gym-owner/users` | Manage members |
| **Nutrition** | `/api/v1/nutrition` | Log & get daily nutrition records |
| **Weight** | `/api/v1/weight` | Log weight history & progress |
| **PR Tracking** | `/api/v1/pr` | Manage personal best records |
| **AI Coach** | `/api/v1/ai` | Interact with Gemini AI Coach |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the repository issues or open a pull request.

---

## 📄 License

This project is licensed under the ISC License.
