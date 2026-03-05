import { useEffect } from "react"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {

  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // If already logged in, go straight to home
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true })
    }
  }, [user, authLoading])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Auth state change in AuthContext will update `user`,
    // and the useEffect above will navigate to "/"
    navigate("/", { replace: true })
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#fff",
    fontSize: "14px",
    letterSpacing: "-0.1px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  }

  // Don't render the form while checking auth state
  if (authLoading) return null

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #080808 60%)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "260px",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.15,
          background: "linear-gradient(135deg, #fff 0%, #777 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "380px",
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "20px",
          padding: "44px 36px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="4" y1="22" x2="4" y2="15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "600", textAlign: "center", marginBottom: "6px", letterSpacing: "-0.5px" }}>
          Welcome back
        </h1>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px", textAlign: "center", marginBottom: "28px", letterSpacing: "-0.1px" }}>
          Sign in to NeverStop
        </p>

        {error && (
          <div
            style={{
              fontSize: "13px",
              marginBottom: "18px",
              padding: "11px 14px",
              borderRadius: "10px",
              textAlign: "center",
              background: "rgba(255,70,70,0.08)",
              border: "1px solid rgba(255,70,70,0.2)",
              color: "#ff8080",
              letterSpacing: "-0.1px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.28)"; e.target.style.background = "rgba(255,255,255,0.07)" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.05)" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.28)"; e.target.style.background = "rgba(255,255,255,0.07)" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.05)" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "4px",
              borderRadius: "10px",
              background: loading ? "rgba(255,255,255,0.45)" : "#fff",
              color: "#000",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "-0.2px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.15s, opacity 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.015)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", marginTop: "22px", color: "rgba(255,255,255,0.32)", letterSpacing: "-0.1px" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: "500" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}