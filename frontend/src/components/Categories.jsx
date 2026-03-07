import { useNavigate, useLocation } from "react-router-dom"

const categories = [
  "Nature", "Wallpapers", "Travel", "Architecture",
  "People", "Animals", "Technology", "Food", "Fashion", "Sports"
]

export default function Categories() {

  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const active = (params.get("q") || "").toLowerCase()

  const handleClick = (cat) => {
    navigate(`/?q=${cat.toLowerCase()}`)
  }

  return (
    <div className="border-b border-white/10 bg-[rgba(8,8,8,0.92)]">
      <div className="mx-auto max-w-[1600px] overflow-x-auto px-4 md:px-7">
        <div className="flex gap-1 py-2.5 whitespace-nowrap">
          {categories.map(cat => {
            const isActive = active === cat.toLowerCase()

            return (
              <button
                key={cat}
                onClick={() => handleClick(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition md:px-4 md:text-sm ${
                  isActive
                    ? "border-white/80 bg-white/10 text-white font-semibold"
                    : "border-transparent text-white/45 hover:text-white/90 hover:bg-white/6"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
