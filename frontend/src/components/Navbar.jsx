import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { logoutUser } from "../services/auth"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [search, setSearch] = useState("")
  const [shrink, setShrink] = useState(false)

  /* NAVBAR SHRINK ON SCROLL */
  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 40)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* SYNC SEARCH WITH URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get("q") || ""
    setSearch(q)
  }, [location.search])

  /* DEBOUNCED SEARCH */
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
    await logoutUser()
    navigate("/")
  }

  /* STATIC SUGGESTIONS */
  const suggestions = [
    "Nature",
    "Cars",
    "People",
    "Travel",
    "Technology",
    "Animals",
    "Architecture",
    "Food",
    "Space",
    "City"
  ]

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={`
        sticky top-0 z-50
        bg-[#111]
        border-b border-gray-800
        transition-all duration-300
        ${shrink ? "py-2" : "py-4"}
      `}
    >
      <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="text-white text-xl font-semibold tracking-wide"
          >
            NeverStop
          </Link>

          <Link
            to="/favorites"
            className="text-gray-400 hover:text-white transition"
          >
            Favorites
          </Link>

        </div>

        {/* SEARCH SECTION */}
        <div className="relative">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search high-resolution photos"
            className="
              bg-[#1a1a1a]
              w-[420px]
              px-6 py-3
              rounded-full
              border border-gray-700
              text-white
              outline-none
              focus:border-gray-400
              focus:ring-1 focus:ring-gray-400
              transition
            "
          />

          {/* SUGGESTIONS DROPDOWN */}
          {search && filteredSuggestions.length > 0 && (

            <div className="
              absolute top-14 w-full
              bg-[#1a1a1a]
              rounded-xl
              border border-gray-700
              shadow-xl
              overflow-hidden
              z-50
            ">

              {filteredSuggestions.map(s => (

                <div
                  key={s}
                  onClick={() => {
                    setSearch(s)
                    navigate(`/?q=${s}`)
                  }}
                  className="
                    px-5 py-3
                    text-gray-300
                    hover:bg-[#222]
                    cursor-pointer
                    transition
                  "
                >
                  {s}
                </div>

              ))}

            </div>

          )}

        </div>

        {/* RIGHT SIDE AUTH */}
        <div className="flex items-center gap-5">

          {user ? (
            <>
              <div className="flex items-center gap-3">

                <div className="
                  w-9 h-9
                  bg-white
                  text-black
                  flex items-center justify-center
                  rounded-full
                  font-semibold
                ">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                <span className="text-gray-400 text-sm">
                  {user.email}
                </span>

              </div>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                  bg-white text-black
                  px-4 py-2
                  rounded-lg
                  font-medium
                  hover:opacity-90
                  transition
                "
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