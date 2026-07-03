import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import TopBar from './components/TopBar.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import Data from './pages/Data.jsx'
import History from './pages/History.jsx'
import Filter from './pages/Filter.jsx'
import Profile from './pages/Profile.jsx'
import Notification from './pages/Notification.jsx'
import Account from './pages/Account.jsx'
import Device from './pages/Device.jsx'

function AppShell({ children }) {
  return (
    <div className="md:flex md:min-h-screen">
      <NavBar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <main className="max-w-4xl mx-auto px-5 py-6 pb-24 md:pb-10 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/home" element={<AppShell><Home /></AppShell>} />
      <Route path="/data" element={<AppShell><Data /></AppShell>} />
      <Route path="/history" element={<AppShell><History /></AppShell>} />
      <Route path="/filter" element={<AppShell><Filter /></AppShell>} />
      <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
      <Route path="/settings/notification" element={<AppShell><Notification /></AppShell>} />
      <Route path="/settings/account" element={<AppShell><Account /></AppShell>} />
      <Route path="/settings/device" element={<AppShell><Device /></AppShell>} />
    </Routes>
  )
}
