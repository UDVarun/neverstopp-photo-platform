import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getProfileFromUser } from "../services/profile"
import { getDefaultAvatarSvg } from "../utils/defaultAvatar"

export default function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [search, setSearch] = useState("")
  const [shrink, setShrink] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
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

  /* Sync search with URL - programmatic, never triggers debounced navigation */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlQuery = params.get("q") || ""
    isTyping.current = false          // mark as not user-typed
    setSearch(urlQuery)
    setShowSuggestions(false)         // always hide suggestions on URL change
  }, [location.search])

  /* Debounced search - only fires when the user is actively typing */
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

  useEffect(() => {
    const syncProfile = () => {
      const profile = getProfileFromUser(user)
      setAvatarUrl(profile.avatarUrl || "")
    }
    syncProfile()
    window.addEventListener("profile-updated", syncProfile)
    window.addEventListener("storage", syncProfile)
    return () => {
      window.removeEventListener("profile-updated", syncProfile)
      window.removeEventListener("storage", syncProfile)
    }
  }, [user])

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

  const fallbackAvatar = getDefaultAvatarSvg(user?.user_metadata?.full_name || user?.email || "User")

  return (
    <div
      className={`sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,8,8,0.92)] backdrop-blur-2xl transition-all ${
        shrink ? "py-2" : "py-3"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 md:flex-nowrap md:gap-5 md:px-7">
        <div className="flex items-center gap-4 md:gap-7">
          <Link to="/" className="text-base font-bold tracking-[-0.02em] text-white md:text-[17px]">
            NeverStop
          </Link>
        </div>

        <div className="relative order-3 w-full md:order-none md:max-w-[560px] md:flex-1">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-45"
              viewBox="0 0 24 24"
              fill="none"
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
              placeholder="Search photos..."
              className="w-full rounded-full border border-white/15 bg-white/8 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/12"
            />
          </div>

          {showSuggestions && search && filtered.length > 0 && (
            <div className="absolute mt-2 w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-xl border border-white/12 bg-[rgba(16,16,16,0.98)] shadow-2xl md:w-full">
              {filtered.map((s) => (
                <div
                  key={s}
                  onMouseDown={() => selectSuggestion(s)}
                  className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/8 hover:text-white"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-45">
                    <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2.5 md:gap-3">
          {user ? (
            <Link to="/settings" aria-label="Open settings">
              <img
                src={avatarUrl || fallbackAvatar}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = fallbackAvatar
                  setAvatarUrl("")
                }}
              />
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-1 py-1 text-sm text-white/65 transition hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:opacity-85 md:px-5 md:py-2 md:text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
