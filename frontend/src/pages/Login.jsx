import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    navigate("/")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 60%)"
      }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #fff 0%, #888 100%)" }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "24px",
          padding: "48px 40px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
          backdropFilter: "blur(40px)"
        }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #fff 0%, #ccc 100%)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1
          className="text-white text-2xl font-semibold text-center mb-1"
          style={{ letterSpacing: "-0.5px" }}
        >
          Welcome back
        </h1>

        <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          Sign in to NeverStop
        </p>

        {error && (
          <div
            className="text-sm mb-5 px-4 py-3 rounded-xl text-center"
            style={{
              background: "rgba(255,80,80,0.1)",
              border: "1px solid rgba(255,80,80,0.25)",
              color: "#ff8080"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.35)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.35)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              background: loading ? "rgba(255,255,255,0.5)" : "#fff",
              color: "#000",
              fontWeight: "600",
              fontSize: "15px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              transition: "transform 0.15s, opacity 0.15s",
              letterSpacing: "-0.2px"
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.01)" }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

        </form>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: "500" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.8)"}
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}