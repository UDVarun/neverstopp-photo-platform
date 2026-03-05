import { useNavigate, useLocation } from "react-router-dom"

export default function Categories() {

  const navigate = useNavigate()
  const location = useLocation()

  const categories = [
    "Nature",
    "Wallpapers",
    "Travel",
    "Architecture",
    "People",
    "Animals",
    "Technology",
    "Food",
    "Fashion",
    "Sports"
  ]

  const params = new URLSearchParams(location.search)
  const active = params.get("q") || ""

  const handleClick = (category) => {
    navigate(`/?q=${category.toLowerCase()}`)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-6 pb-4 border-b border-gray-800">

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">

        {categories.map(cat => {

          const isActive =
            active.toLowerCase() === cat.toLowerCase()

          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className={`
                whitespace-nowrap
                text-sm
                px-4 py-2
                rounded-full
                transition
                ${isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white hover:bg-[#222]"
                }
              `}
            >
              {cat}
            </button>
          )

        })}

      </div>

    </div>
  )
}