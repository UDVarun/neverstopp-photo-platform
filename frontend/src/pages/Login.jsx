import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true })
    }
  }, [authLoading, user, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (signInError) {
      setError(signInError.message || "Invalid email or password")
      setLoading(false)
      return
    }

    navigate("/", { replace: true })
  }

  const handleOAuth = async (provider) => {
    setError("")
    setSocialLoading(provider)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })

    if (oauthError) {
      setError(oauthError.message || "Social login failed")
      setSocialLoading("")
    }
  }

  if (authLoading) return null

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  }

  const socialBtn = {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "11px 12px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 30% 0%, #1d2a45 0%, #070707 52%, #070707 100%)", padding: "30px 16px" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "22px", padding: "30px 24px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ marginBottom: "18px" }}>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", letterSpacing: "0.3px" }}>NeverStop Photos</div>
          <h1 style={{ margin: "6px 0 6px", color: "#fff", fontSize: "26px" }}>Sign in</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>Your session stays signed in on this device.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(255,90,90,0.14)", border: "1px solid rgba(255,90,90,0.32)", color: "#ffc6c6", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", marginBottom: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: "10px" }}>
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} style={fieldStyle} />
          <button type="submit" disabled={loading || !!socialLoading} style={{ ...socialBtn, background: "#fff", color: "#080808", marginTop: "2px" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", flex: 1 }} />
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>OR</span>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", flex: 1 }} />
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          <button onClick={() => handleOAuth("google")} disabled={loading || !!socialLoading} style={socialBtn}>
            {socialLoading === "google" ? "Connecting Google..." : "Continue with Google"}
          </button>
          <button onClick={() => handleOAuth("github")} disabled={loading || !!socialLoading} style={socialBtn}>
            {socialLoading === "github" ? "Connecting GitHub..." : "Continue with GitHub"}
          </button>
        </div>

        <p style={{ margin: "16px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.62)", textAlign: "center" }}>
          New here?{" "}
          <Link to="/signup" style={{ color: "#fff", textDecoration: "none", fontWeight: "600" }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
