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
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0"
      }}
    >
      <div
        className="max-w-[1600px] mx-auto"
        style={{ padding: "0 24px", overflowX: "auto" }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "10px 0",
            whiteSpace: "nowrap"
          }}
        >
          {categories.map(cat => {
            const isActive = active === cat.toLowerCase()

            return (
              <button
                key={cat}
                onClick={() => handleClick(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "400",
                  border: isActive ? "1px solid rgba(255,255,255,0.9)" : "1px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  letterSpacing: isActive ? "-0.1px" : "0"
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)"
                    e.currentTarget.style.background = "transparent"
                  }
                }}
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