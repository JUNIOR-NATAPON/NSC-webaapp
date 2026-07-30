import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import TopBar from './components/TopBar.jsx'
import Home from './pages/Home.jsx'
import Data from './pages/Data.jsx'
import History from './pages/History.jsx'
import Filter from './pages/Filter.jsx'
import Profile from './pages/Profile.jsx'
import Notification from './pages/Notification.jsx'
import Account from './pages/Account.jsx'
import Device from './pages/Device.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

function AppShell({ children, title }) {
  const { pathname } = useLocation()
  return (
    <div className="md:flex md:min-h-screen">
      <NavBar />
      <div className="flex-1 min-w-0">
        <TopBar title={title} />
        <main
          key={pathname}
          className="animate-page-in max-w-4xl lg:max-w-5xl mx-auto px-5 py-6 pb-24 md:pb-10 md:px-10 md:py-10 lg:px-14 lg:py-14"
        >
          {children}
        </main>
      </div>
    </div>
  )
}

// No login, no Firebase, no device required — every route is open so you
// can browse the whole app with sample data. Login/Sign Up are included as
// static visual references only; their forms don't actually do anything here.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/home" element={<AppShell title="Home"><Home /></AppShell>} />
      <Route path="/data" element={<AppShell title="Data"><Data /></AppShell>} />
      <Route path="/history" element={<AppShell title="History"><History /></AppShell>} />
      <Route path="/filter" element={<AppShell title="Filter"><Filter /></AppShell>} />
      <Route path="/profile" element={<AppShell title="Profile"><Profile /></AppShell>} />
      <Route path="/settings/notification" element={<AppShell title="Notification"><Notification /></AppShell>} />
      <Route path="/settings/account" element={<AppShell title="Account"><Account /></AppShell>} />
      <Route path="/settings/device" element={<AppShell title="Device"><Device /></AppShell>} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
