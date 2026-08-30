# TrackFit 🏋️‍♂️🥗🤖

> **TrackFit** is a modern, high-performance Fitness & AI Coaching Web Application built to help athletes and fitness enthusiasts track body weight progression, log daily nutrition & macros, record personal records (PRs), and receive instant AI-powered workout & diet guidance.

---

## ✨ Key Features

- **📊 Dynamic Weight Analytics**: Track body weight history over time with interactive **Recharts** area charts and progress statistics.
- **🥗 Nutrition & Macro Logger**: Log and monitor daily intake of Calories, Protein, Carbohydrates, Fats, and daily step counts with 7-day trend visualizations.
- **🏆 Personal Best (PR) Lift Tracker**: Keep an ongoing record of top personal lifts (Bench Press, Barbell Squat, Deadlift, Overhead Press) with rep counts.
- **🤖 AI Fitness Coach (Google Gemini AI)**: Chat with an AI Coach for instant, personalized advice on workout splits, nutrition plans, recovery, and exercise form.
- **👤 Athlete Profile**: Store physical stats (Height, Weight, Age, Gender, Workout Frequency) to customize goals and tracking.
- **🔐 Secure Authentication**: JWT cookie-based authentication and `bcrypt` password hashing for high security.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Smooth Glassmorphism UI)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) (ES Modules)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose ORM](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT), `bcrypt`, `cookie-parser`
- **AI Integration**: `@google/genai` (Google Gemini 2.5 Flash / 1.5 Flash API)

---

## 📁 Repository Structure

```
track_Fit/
├── backend/
│   ├── src/
│   │   ├── Controllers/     # Logic for Users, AI, Nutrition, PR, and Weight
│   │   ├── Models/          # Mongoose Schemas (User, Nutrition, PR, Weight)
│   │   ├── Routes/          # Express API Endpoints
│   │   ├── Middleware/      # JWT User Authentication Middleware
│   │   ├── dataBase/        # MongoDB Connection Handler
│   │   └── app.js           # Express App Configuration
│   ├── .env.example         # Template for environment variables
│   ├── server.js            # Node Server Entry Point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components & layout wrappers (UserLayout)
│   │   ├── pages/           # Pages (Auth, Dashboard, Nutrition, Weight, PR, AI Coach, Profile)
│   │   ├── App.jsx          # Route Definitions
│   │   └── main.jsx         # React Entry Point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/track_Fit
USER_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend development server:
```bash
npm run dev
```
The API server will run at `http://localhost:3000`.

---

### 3. Frontend Setup

In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 📡 Key API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/users/signup` | `POST` | Register a new Athlete |
| **Auth** | `/api/users/login` | `POST` | Login Athlete |
| **Auth** | `/api/users/logout` | `POST` | Logout Athlete |
| **User Profile** | `/api/users/me` | `GET` | Fetch authenticated user data |
| **Weight** | `/api/weight/data` | `GET` / `POST` | Track and fetch weight history |
| **Nutrition** | `/api/nutrition/last10days` | `GET` / `POST` | Log & view daily nutrition logs |
| **PR Tracking** | `/api/pr/all` | `GET` / `POST` | Manage Personal Record lifts |
| **AI Coach** | `/api/ai/ask` | `POST` | Query the Gemini AI Fitness Assistant |

---

## 🤝 Author & License

Developed by **Riddhesh Ghadi** 

