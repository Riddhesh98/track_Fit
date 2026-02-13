import { Routes, Route } from 'react-router-dom'
import ChooseRegister from './pages/ChooseRegister'
import RegisterUser from './pages/RegisterUser'
import RegisterOwner from './pages/RegisterOwner'
import LoginUser from './pages/LoginUser'
import LoginOwner from './pages/LoginOwner'
import UserDashboard from './pages/UserDashboard'
import { OwnerDashboard } from './pages/OwnerDashboard'
import NutritionPage from './pages/NutritionPage'
import NutritionEdit from './pages/NutritionEdit'
import WeightTrack from './pages/WeightTrack'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChooseRegister />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/login-owner" element={<LoginOwner />} />
      <Route path="/nutrition" element={<NutritionPage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />

      <Route path="/nutrition/edit/:id" element={<NutritionEdit />} />

      <Route path="/weight" element={<WeightTrack />} />
    </Routes>
  )
}

export default App
