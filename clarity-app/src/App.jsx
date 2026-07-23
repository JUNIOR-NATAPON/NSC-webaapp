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
import { useAuth } from './context/AuthContext.jsx'

function AppShell({ children }) {
  return (
    <div className="md:flex md:min-h-screen">
      <NavBar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <main className="max-w-4xl lg:max-w-5xl mx-auto px-5 py-6 pb-24 md:pb-10 md:px-10 md:py-10 lg:px-14 lg:py-14">
          {children}
        </main>
      </div>
    </div>
  )
}

// Blocks access to app pages until Firebase confirms a signed-in user.
// Also handles the loading flash on refresh (auth state isn't known
// synchronously) so we don't bounce a logged-in user to /login by mistake.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Sends an already-logged-in user straight to /home instead of showing
// them the login screen again.
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/home" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />

      <Route path="/home" element={<ProtectedRoute><AppShell><Home /></AppShell></ProtectedRoute>} />
      <Route path="/data" element={<ProtectedRoute><AppShell><Data /></AppShell></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><AppShell><History /></AppShell></ProtectedRoute>} />
      <Route path="/filter" element={<ProtectedRoute><AppShell><Filter /></AppShell></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppShell><Profile /></AppShell></ProtectedRoute>} />
      <Route
        path="/settings/notification"
        element={<ProtectedRoute><AppShell><Notification /></AppShell></ProtectedRoute>}
      />
      <Route
        path="/settings/account"
        element={<ProtectedRoute><AppShell><Account /></AppShell></ProtectedRoute>}
      />
      <Route
        path="/settings/device"
        element={<ProtectedRoute><AppShell><Device /></AppShell></ProtectedRoute>}
      />
    </Routes>
  )
}
