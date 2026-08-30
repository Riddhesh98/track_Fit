import { Routes, Route } from 'react-router-dom'

// Auth pages
import RegisterUser from './pages/auth/RegisterUser'
import LoginUser from './pages/auth/LoginUser'

// User pages
import UserDashboard from './pages/user/UserDashboard'
import NutritionPage from './pages/user/NutritionPage'
import NutritionEdit from './pages/user/NutritionEdit'
import WeightTrack from './pages/user/WeightTrack'
import Profile from './pages/user/Profile'
import PRTrack from './pages/user/PRTrack'
import AICoach from './pages/user/AICoach'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RegisterUser />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/nutrition" element={<NutritionPage />} />
      <Route path="/nutrition/edit/:id" element={<NutritionEdit />} />
      <Route path="/weight" element={<WeightTrack />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pr" element={<PRTrack />} />
      <Route path="/ai-coach" element={<AICoach />} />
    </Routes>
  )
}

export default App
