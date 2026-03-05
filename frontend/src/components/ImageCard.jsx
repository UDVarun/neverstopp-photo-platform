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

    return (
        <div
            className="break-inside-avoid group relative cursor-pointer"
            style={{ marginBottom: "14px" }}
            onClick={() => onClick(photo)}
        >
            {/* Skeleton placeholder shown until image loads */}
            {!loaded && (
                <div
                    style={{
                        width: "100%",
                        paddingBottom: `${(photo.height / photo.width) * 100}%`,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                    }}
                />
            )}

            <img
                src={photo.urls.small}
                alt={photo.alt_description || photo.description || "photo"}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                style={{
                    width: "100%",
                    display: loaded ? "block" : "none",
                    borderRadius: "12px",
                    transition: "filter 0.25s",
                }}
                className="group-hover:brightness-75"
            />

            {/* Hover overlay */}
            {loaded && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "12px",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        padding: "12px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                    }}
                    className="group-hover:opacity-100"
                >
                    {/* Photographer credit */}
                    <span
                        style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "11px",
                            fontWeight: "500",
                            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                            letterSpacing: "-0.1px",
                            maxWidth: "70%",
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
                            background: liked ? "rgba(255,60,60,0.85)" : "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(8px)",
                            border: "none",
                            borderRadius: "100px",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: "13px",
                            transition: "transform 0.15s, background 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {liked ? "❤️" : "🤍"}
                    </button>
                </div>
            )}
        </div>
    )
}