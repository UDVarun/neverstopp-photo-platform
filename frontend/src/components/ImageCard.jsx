import { useEffect, useState } from "react"
import { isFavorite, toggleFavorite } from "../services/favorites"

export default function ImageCard({ photo, onClick = () => {} }) {
  const [liked, setLiked] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const sync = () => setLiked(isFavorite(photo.id))
    sync()
    window.addEventListener("favorites-updated", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("favorites-updated", sync)
      window.removeEventListener("storage", sync)
    }
  }, [photo.id])

  const likeHandler = (e) => {
    e.stopPropagation()
    const nextLiked = toggleFavorite(photo)
    setLiked(nextLiked)
  }

  const paddingBottom = `${(photo.height / photo.width) * 100}%`

  return (
    <div
      className="break-inside-avoid group relative cursor-pointer"
      style={{ marginBottom: "12px", borderRadius: "12px", overflow: "hidden" }}
      onClick={() => onClick(photo)}
    >
      <div style={{ position: "relative", width: "100%", paddingBottom }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: photo.color || "#1a1a1a",
            borderRadius: "12px",
            transition: "opacity 0.4s ease",
            opacity: loaded ? 0 : 1
          }}
        />

        <img
          src={photo.urls.small}
          alt={photo.alt_description || "photo"}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease, filter 0.25s"
          }}
          className="group-hover:brightness-90"
        />

        <button
          onClick={likeHandler}
          aria-label={liked ? "Unlike photo" : "Like photo"}
          title={liked ? "Unlike" : "Like"}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "999px",
            border: liked ? "1px solid rgba(255,80,120,0.55)" : "1px solid rgba(255,255,255,0.24)",
            background: liked
              ? "linear-gradient(135deg, rgba(236,72,124,0.95) 0%, rgba(190,24,93,0.95) 100%)"
              : "rgba(8,8,8,0.52)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: liked
              ? "0 10px 25px rgba(190,24,93,0.35)"
              : "0 10px 25px rgba(0,0,0,0.35)",
            transition: "opacity 0.18s, transform 0.12s, background 0.2s, border-color 0.2s"
          }}
          className="z-20 opacity-0 group-hover:opacity-100"
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)" }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "10px",
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.58) 100%)",
            opacity: 0,
            transition: "opacity 0.2s"
          }}
          className="group-hover:opacity-100"
        >
          <span
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: "11px",
              fontWeight: "500",
              letterSpacing: "-0.1px",
              textShadow: "0 1px 5px rgba(0,0,0,0.8)"
            }}
          >
            {photo.user?.name || "Unknown photographer"}
          </span>
        </div>
      </div>
    </div>
  )
}
