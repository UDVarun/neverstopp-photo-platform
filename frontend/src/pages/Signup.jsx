import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Signup() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true })
    }
  }, [authLoading, user, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    const normalizedEmail = email.trim().toLowerCase()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/`
      }
    })

    if (signUpError) {
      const message = signUpError.message?.toLowerCase() || ""
      if (message.includes("already") || message.includes("registered")) {
        setError("This email is already registered. Please sign in instead.")
      } else {
        setError(signUpError.message || "Unable to create account")
      }
      setLoading(false)
      return
    }

    const hasIdentity = Array.isArray(data?.user?.identities) && data.user.identities.length > 0
    if (!hasIdentity) {
      setError("This email is already registered. Please sign in instead.")
      setLoading(false)
      return
    }

    if (data.session) {
      navigate("/", { replace: true })
      return
    }

    const { error: autoLoginError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    })

    if (!autoLoginError) {
      navigate("/", { replace: true })
      return
    }

    setInfo("Account created. Please confirm your email, then sign in.")
    setLoading(false)
  }

  const handleOAuth = async (provider) => {
    setError("")
    setInfo("")
    setSocialLoading(provider)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })

    if (oauthError) {
      setError(oauthError.message || "Social sign up failed")
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
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 30% 0%, #153d30 0%, #070707 52%, #070707 100%)", padding: "30px 16px" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "22px", padding: "30px 24px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ marginBottom: "18px" }}>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", letterSpacing: "0.3px" }}>NeverStop Photos</div>
          <h1 style={{ margin: "6px 0 6px", color: "#fff", fontSize: "26px" }}>Create account</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>One email can register one account.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(255,90,90,0.14)", border: "1px solid rgba(255,90,90,0.32)", color: "#ffc6c6", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", marginBottom: "14px" }}>
            {error}
          </div>
        )}

        {info && (
          <div style={{ background: "rgba(115,255,181,0.12)", border: "1px solid rgba(115,255,181,0.28)", color: "#c9ffe4", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", marginBottom: "14px" }}>
            {info}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: "10px" }}>
          <input type="text" placeholder="Full name" required value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
          <input type="password" placeholder="Password (min 6 chars)" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} style={fieldStyle} />
          <button type="submit" disabled={loading || !!socialLoading} style={{ ...socialBtn, background: "#fff", color: "#080808", marginTop: "2px" }}>
            {loading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: "600" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
