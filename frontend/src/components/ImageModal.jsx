import { useEffect } from "react"
import { isFavorite, toggleFavorite } from "../services/favorites"
import { useState } from "react"
import { getDefaultAvatarSvg } from "../utils/defaultAvatar"

export default function ImageModal({
  photo,
  images = [],
  setSelected = () => {},
  onClose
}) {
  if (!photo) return null

  const index = images.findIndex((i) => i.id === photo.id)

  const prevImage = () => {
    if (index > 0) {
      setSelected(images[index - 1])
    }
  }

  const nextImage = () => {
    if (index >= 0 && index < images.length - 1) {
      setSelected(images[index + 1])
    }
  }

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }

    window.addEventListener("keydown", keyHandler)
    return () => window.removeEventListener("keydown", keyHandler)
  })

  const handleDownload = async () => {
    try {
      if (photo.links?.download_location) {
        await fetch(photo.links.download_location)
      }

      const fullImage = photo.urls?.full || photo.urls?.regular || photo.urls?.small
      if (!fullImage) return

      const response = await fetch(fullImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${photo.id}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.log("Download error:", err)
    }
  }

  const showArrows = images.length > 1 && index !== -1
  const activeImage = photo.urls?.full || photo.urls?.regular || photo.urls?.small
  const fallbackAvatar = getDefaultAvatarSvg(photo.user?.name || "User")
  const [liked, setLiked] = useState(false)

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

  const handleLike = () => {
    const nextLiked = toggleFavorite(photo)
    setLiked(nextLiked)
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6" onClick={onClose}>
      <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 md:mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
            <img
              src={photo.user?.profile_image?.medium || fallbackAvatar}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full"
              alt="user"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = fallbackAvatar
              }}
            />
            <div className="text-white text-sm md:text-base truncate max-w-[160px] sm:max-w-[220px] md:max-w-none">{photo.user?.name || "Unknown"}</div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleLike}
              className={`text-white px-4 py-2 rounded-lg border ${
                liked
                  ? "bg-[#e0315b] border-[#e0315b]"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              } text-sm md:text-base`}
            >
              {liked ? "Unlike" : "Like"}
            </button>
            <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base">
              Download
            </button>
          </div>
        </div>

        {showArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-white/90 bg-black/45 hover:bg-black/60 w-10 h-10 rounded-full text-2xl disabled:opacity-40"
              disabled={index <= 0}
              aria-label="Previous image"
            >
              {"<"}
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-white/90 bg-black/45 hover:bg-black/60 w-10 h-10 rounded-full text-2xl disabled:opacity-40"
              disabled={index >= images.length - 1}
              aria-label="Next image"
            >
              {">"}
            </button>
          </>
        )}

        <img src={activeImage} className="w-full max-h-[76vh] sm:max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg" alt="preview" />
      </div>
    </div>
  )
}
