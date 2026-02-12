import { Routes, Route } from 'react-router-dom'
import ChooseRegister from './pages/ChooseRegister'
import RegisterUser from './pages/RegisterUser'
import RegisterOwner from './pages/RegisterOwner'
import LoginUser from './pages/LoginUser'
import LoginOwner from './pages/LoginOwner'
import UserDashboard from './pages/UserDashboard'
import { OwnerDashboard } from './pages/OwnerDashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChooseRegister />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/login-owner" element={<LoginOwner />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
    </Routes>
  )
}

export default App
