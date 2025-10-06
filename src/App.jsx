import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import LoginPage from "./pages/LoginPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import PublicBookingPage from "./pages/PublicBookingPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header />}

      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<PublicBookingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas de Admin (Protegidas) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
