import { Routes, Route } from 'react-router-dom'
import ChooseRegister from './pages/ChooseRegister'
import RegisterUser from './pages/RegisterUser'
import RegisterOwner from './pages/RegisterOwner'
import LoginUser from './pages/LoginUser'
import LoginOwner from './pages/LoginOwner'
import UserDashboard from './pages/UserDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerUsers from './pages/OwnerUsers'
import UserDetails from './pages/UserDetails'
import AddUser from './pages/AddUser'
import OwnerSubscription from './pages/OwnerSubscription'
import NutritionPage from './pages/NutritionPage'
import NutritionEdit from './pages/NutritionEdit'
import WeightTrack from './pages/WeightTrack'
import Profile from './pages/Profile'
import PRTrack from './pages/PRTrack'
import AICoach from './pages/AICoach'

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
