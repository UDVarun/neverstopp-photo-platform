import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Favorites from "./pages/Favorites"
import Library from "./pages/Library"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {

  return (
    <Layout>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploaded"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/library" element={<Navigate to="/uploaded" replace />} />

      </Routes>

    </Layout>
  )
}
