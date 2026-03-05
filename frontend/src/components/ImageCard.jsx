import { useState, useEffect } from "react"
import { toggleFavorite, isFavorite } from "../services/favorites"

export default function ImageCard({ photo, onClick }) {

    const [liked, setLiked] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLiked(isFavorite(photo.id))
    }, [photo.id])

    const likeHandler = (e) => {
        e.stopPropagation()
        toggleFavorite(photo)
        setLiked(prev => !prev)
    }

    // Aspect ratio from Unsplash metadata — no layout shift
    const paddingBottom = `${(photo.height / photo.width) * 100}%`

    return (
        <div
            className="break-inside-avoid group relative cursor-pointer"
            style={{ marginBottom: "12px", borderRadius: "12px", overflow: "hidden" }}
            onClick={() => onClick(photo)}
        >
            {/* Colored placeholder using Unsplash's dominant color — shows instantly */}
            <div style={{ position: "relative", width: "100%", paddingBottom }}>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: photo.color || "#1a1a1a",
                        borderRadius: "12px",
                        transition: "opacity 0.4s ease",
                        opacity: loaded ? 0 : 1,
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
                        transition: "opacity 0.4s ease, filter 0.25s",
                    }}
                    className="group-hover:brightness-75"
                />

                {/* Hover overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "12px",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        padding: "10px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                    }}
                    className="group-hover:opacity-100"
                >
                    {/* Photographer name */}
                    <span
                        style={{
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "11px",
                            fontWeight: "500",
                            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                            letterSpacing: "-0.1px",
                            maxWidth: "65%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {photo.user?.name}
                    </span>

                    {/* Like button */}
                    <button
                        onClick={likeHandler}
                        style={{
                            background: liked ? "rgba(220,50,50,0.88)" : "rgba(0,0,0,0.52)",
                            backdropFilter: "blur(8px)",
                            border: "none",
                            borderRadius: "100px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "12px",
                            transition: "transform 0.15s, background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {liked ? "❤️" : "🤍"}
                    </button>
                </div>
            </div>
        </div>
    )
}