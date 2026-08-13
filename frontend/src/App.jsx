import { Routes, Route } from 'react-router-dom'

// Auth pages
import ChooseRegister from './pages/auth/ChooseRegister'
import RegisterUser from './pages/auth/RegisterUser'
import RegisterOwner from './pages/auth/RegisterOwner'
import LoginUser from './pages/auth/LoginUser'
import LoginOwner from './pages/auth/LoginOwner'

// User pages
import UserDashboard from './pages/user/UserDashboard'
import NutritionPage from './pages/user/NutritionPage'
import NutritionEdit from './pages/user/NutritionEdit'
import WeightTrack from './pages/user/WeightTrack'
import Profile from './pages/user/Profile'
import PRTrack from './pages/user/PRTrack'
import AICoach from './pages/user/AICoach'

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerUsers from './pages/owner/OwnerUsers'
import UserDetails from './pages/owner/UserDetails'
import AddUser from './pages/owner/AddUser'
import OwnerSubscription from './pages/owner/OwnerSubscription'

const App = () => {
  return (
    <Routes>
      <Route path="" element={<RegisterUser />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/login-owner" element={<LoginOwner />} />
      <Route path="/nutrition" element={<NutritionPage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />

      {/* Owner Dashboard routes */}
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/users" element={<OwnerUsers />} />
      <Route path="/owner/users/:id" element={<UserDetails />} />
      <Route path="/owner/add-user" element={<AddUser />} />
      <Route path="/owner/subscription" element={<OwnerSubscription />} />
      <Route path="/owner/subscription/:userId" element={<OwnerSubscription />} />

      <Route path="/nutrition/edit/:id" element={<NutritionEdit />} />
      <Route path="/weight" element={<WeightTrack />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pr" element={<PRTrack />} />
      <Route path="/ai-coach" element={<AICoach />} />
    </Routes>
  )
}

export default App
