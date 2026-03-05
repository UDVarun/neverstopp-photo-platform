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
        padding: "0",
        background: "rgba(8,8,8,0.92)",
      }}
    >
      <div
        style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 28px", overflowX: "auto" }}
      >
        <div
          style={{
            display: "flex",
            gap: "2px",
            padding: "10px 0",
            whiteSpace: "nowrap",
          }}
        >
          {categories.map(cat => {
            const isActive = active === cat.toLowerCase()

            return (
              <button
                key={cat}
                onClick={() => handleClick(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "100px",
                  fontSize: "13.5px",
                  fontWeight: isActive ? "600" : "400",
                  border: isActive
                    ? "1.5px solid rgba(255,255,255,0.85)"
                    : "1.5px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.09)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.42)",
                  cursor: "pointer",
                  transition: "all 0.16s",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.1px",
                  lineHeight: "1.4",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.88)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.42)"
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