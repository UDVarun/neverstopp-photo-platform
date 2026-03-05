import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [search, setSearch] = useState("")
  const [shrink, setShrink] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const isTyping = useRef(false)   // true only when the user is TYPING, not URL-sync

  const suggestions = [
    "Nature", "Cars", "People", "Travel", "Technology",
    "Animals", "Architecture", "Food", "Space", "City", "Fashion", "Sports"
  ]

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(search.toLowerCase()) && s.toLowerCase() !== search.toLowerCase()
  )

  /* Navbar shrink on scroll */
  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Sync search with URL — programmatic, never triggers debounced navigation */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlQuery = params.get("q") || ""
    isTyping.current = false          // mark as not user-typed
    setSearch(urlQuery)
    setShowSuggestions(false)         // always hide suggestions on URL change
  }, [location.search])

  /* Debounced search — only fires when the user is actively typing */
  useEffect(() => {
    if (!isTyping.current) return     // skip URL-synced changes

    const delay = setTimeout(() => {
      if (search.trim()) {
        navigate(`/?q=${search.trim()}`)
      } else {
        navigate("/")
      }
    }, 400)
    return () => clearTimeout(delay)
  }, [search])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const handleInputChange = (e) => {
    isTyping.current = true
    setSearch(e.target.value)
    setShowSuggestions(true)
  }

  const selectSuggestion = (s) => {
    isTyping.current = false
    setSearch(s)
    setShowSuggestions(false)
    navigate(`/?q=${s.toLowerCase()}`)
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transition: "padding 0.3s",
        padding: shrink ? "8px 0" : "14px 0",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", gap: "24px" }}>

        {/* LEFT: Brand + Favorites */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px", flexShrink: 0 }}>
          <Link
            to="/"
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: "17px",
              letterSpacing: "-0.6px",
              textDecoration: "none",
            }}
          >
            NeverStop
          </Link>

          <Link
            to="/favorites"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "14px",
              fontWeight: "400",
              textDecoration: "none",
              transition: "color 0.18s",
              letterSpacing: "-0.1px",
            }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
          >
            Favorites
          </Link>
        </div>

        {/* CENTER: Search */}
        <div style={{ flex: 1, maxWidth: "540px", position: "relative" }}>
          <div style={{ position: "relative" }}>
            {/* Search icon */}
            <svg
              style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", opacity: 0.38, pointerEvents: "none" }}
              width="15" height="15" viewBox="0 0 24 24" fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              value={search}
              onChange={handleInputChange}
              onFocus={() => { if (search && filtered.length > 0) setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search photos…"
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: "14px",
                letterSpacing: "-0.1px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onFocusCapture={e => {
                e.target.style.background = "rgba(255,255,255,0.10)"
                e.target.style.borderColor = "rgba(255,255,255,0.22)"
              }}
              onBlurCapture={e => {
                e.target.style.background = "rgba(255,255,255,0.07)"
                e.target.style.borderColor = "rgba(255,255,255,0.10)"
              }}
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && search && filtered.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: "rgba(16,16,16,0.98)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.75)",
                backdropFilter: "blur(24px)",
                zIndex: 100
              }}
            >
              {filtered.map(s => (
                <div
                  key={s}
                  onMouseDown={() => selectSuggestion(s)}
                  style={{
                    padding: "11px 18px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    letterSpacing: "-0.1px",
                    cursor: "pointer",
                    transition: "background 0.12s, color 0.12s",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)"
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "auto" }}>

          {user ? (
            <>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "12px",
                  flexShrink: 0,
                  letterSpacing: "0",
                }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                  padding: "7px 15px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  letterSpacing: "-0.1px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  fontWeight: "400",
                  textDecoration: "none",
                  transition: "color 0.18s",
                  letterSpacing: "-0.1px",
                  padding: "7px 4px",
                }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
              >
                Login
              </Link>

              <Link
                to="/signup"
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "8px 18px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "opacity 0.18s, transform 0.15s",
                  letterSpacing: "-0.2px",
                  display: "inline-block",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = "0.85"
                  e.currentTarget.style.transform = "scale(1.025)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>
    </div>
  )
}