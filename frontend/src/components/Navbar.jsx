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

  /* Sync search with URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get("q") || "")
  }, [location.search])

  /* Debounced search */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search) {
        navigate(`/?q=${search}`)
      } else {
        navigate("/")
      }
    }, 500)
    return () => clearTimeout(delay)
  }, [search])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const selectSuggestion = (s) => {
    setSearch(s)
    setShowSuggestions(false)
    navigate(`/?q=${s}`)
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transition: "padding 0.3s",
        padding: shrink ? "10px 0" : "16px 0",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-6">

        {/* LEFT: Brand + Favorites */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link
            to="/"
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: "18px",
              letterSpacing: "-0.5px",
              textDecoration: "none"
            }}
          >
            NeverStop
          </Link>

          <Link
            to="/favorites"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "14px",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
          >
            Favorites
          </Link>
        </div>

        {/* CENTER: Search */}
        <div className="relative flex-1 max-w-[520px]" style={{ position: "relative" }}>
          <div style={{ position: "relative" }}>
            {/* Search icon */}
            <svg
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search photos…"
              style={{
                width: "100%",
                padding: "11px 16px 11px 44px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, background 0.2s"
              }}
              onFocusCapture={e => {
                e.target.style.background = "rgba(255,255,255,0.11)"
                e.target.style.borderColor = "rgba(255,255,255,0.25)"
              }}
              onBlurCapture={e => {
                e.target.style.background = "rgba(255,255,255,0.08)"
                e.target.style.borderColor = "rgba(255,255,255,0.12)"
              }}
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && search && filtered.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "rgba(18,18,18,0.97)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
                backdropFilter: "blur(20px)",
                zIndex: 100
              }}
            >
              {filtered.map(s => (
                <div
                  key={s}
                  onMouseDown={() => selectSuggestion(s)}
                  style={{
                    padding: "12px 18px",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Auth */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fff 0%, #bbb 100%)",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "13px",
                    flexShrink: 0
                  }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.65)",
                  padding: "8px 14px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.target.style.background = "rgba(255,255,255,0.10)"
                  e.target.style.color = "#fff"
                }}
                onMouseLeave={e => {
                  e.target.style.background = "rgba(255,255,255,0.06)"
                  e.target.style.color = "rgba(255,255,255,0.65)"
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
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
              >
                Login
              </Link>

              <Link
                to="/signup"
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "9px 18px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "opacity 0.2s, transform 0.15s"
                }}
                onMouseEnter={e => { e.target.style.opacity = "0.88"; e.target.style.transform = "scale(1.02)" }}
                onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = "scale(1)" }}
              >
                Sign up
              </Link>
            </>
          )}

        </div>

      </div>
    </div>
  )
}