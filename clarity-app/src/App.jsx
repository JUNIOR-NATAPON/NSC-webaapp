import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import TopBar from './components/TopBar.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import DataPage from './pages/DataPage.jsx'
import Profile from './pages/Profile.jsx'

function AppShell({ title, children }) {
  return (
    <div className="md:flex md:min-h-screen">
      <NavBar />
      <div className="flex-1 min-w-0">
        <TopBar title={title} />
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
      <Route
        path="/home"
        element={
          <AppShell title="Clarity">
            <Home />
          </AppShell>
        }
      />
      <Route
        path="/data"
        element={
          <AppShell title="Clarity">
            <DataPage />
          </AppShell>
        }
      />
      <Route
        path="/filter"
        element={
          <AppShell title="Clarity">
            <DataPage variant="filter" />
          </AppShell>
        }
      />
      <Route
        path="/profile"
        element={
          <AppShell title="Clarity">
            <Profile />
          </AppShell>
        }
      />
    </Routes>
  )
}
