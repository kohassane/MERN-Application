import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import CompetitionsPage from './pages/competitions/CompetitionsPage'
import CalendrierPage from './pages/competitions/CalendrierPage'
import DisciplinesPage from './pages/competitions/DisciplinesPage'
import BoutiquePage from './pages/boutique/BoutiquePage'
import EvenementsPage from './pages/evenements/EvenementsPage'
import LicencesPage from './pages/licences/LicencesPage'
import DocumentsPage from './pages/documents/DocumentsPage'
import AboutPage from './pages/oissu/AboutPage'
import MediaPage from './pages/medias/MediaPage'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import ASEDashboard from './pages/dashboard/ASEDashboard'
import OfficialDashboard from './pages/dashboard/OfficialDashboard'
import DelegateDashboard from './pages/dashboard/DelegateDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Auth pages (no layout) */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Public pages with layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/competitions" element={<Layout><CompetitionsPage /></Layout>} />
          <Route path="/calendrier" element={<Layout><CalendrierPage /></Layout>} />
          <Route path="/resultats" element={<Layout><CalendrierPage /></Layout>} />
          <Route path="/disciplines" element={<Layout><DisciplinesPage /></Layout>} />
          <Route path="/evenements" element={<Layout><EvenementsPage /></Layout>} />
          <Route path="/boutique" element={<Layout><BoutiquePage /></Layout>} />
          <Route path="/documents" element={<Layout><DocumentsPage /></Layout>} />
          <Route path="/oissu" element={<Layout><AboutPage /></Layout>} />
          <Route path="/medias" element={<Layout><MediaPage /></Layout>} />

          {/* Protected: students */}
          <Route path="/dashboard/etudiant" element={
            <ProtectedRoute roles={["etudiant"]}>
              <Layout><StudentDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Protected: ASE president */}
          <Route path="/dashboard/ase" element={
            <ProtectedRoute roles={["president_ase"]}>
              <Layout><ASEDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Protected: official */}
          <Route path="/dashboard/officiel" element={
            <ProtectedRoute roles={["officiel"]}>
              <Layout><OfficialDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Protected: delegate */}
          <Route path="/dashboard/delegue" element={
            <ProtectedRoute roles={["delegue"]}>
              <Layout><DelegateDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Protected: admin */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={["admin"]}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* Licences (requires auth) */}
          <Route path="/mes-licences" element={
            <ProtectedRoute>
              <Layout><LicencesPage /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
