import { useEffect, useRef, useState } from "react"
import ImageModal from "../components/ImageModal"
import { useAuth } from "../context/AuthContext"
import { addImageToLibrary, getLibraryImages, removeImageFromLibrary } from "../services/library"
import { getProfileFromUser } from "../services/profile"

export default function Library() {
  const { user } = useAuth()
  const userId = user?.id
  const profile = getProfileFromUser(user)
  const userName = profile.fullName || user?.email?.split("@")[0] || "You"
  const fileInputRef = useRef(null)

  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!userId) return
    setImages(getLibraryImages(userId))

    const sync = () => setImages(getLibraryImages(userId))
    window.addEventListener("library-updated", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("library-updated", sync)
      window.removeEventListener("storage", sync)
    }
  }, [userId])

  const onPickFile = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploading(true)
    setError("")
    try {
      await addImageToLibrary({ userId, file, userName })
      e.target.value = ""
    } catch (err) {
      setError(err.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (imageId) => {
    if (!userId) return
    removeImageFromLibrary({ userId, imageId })
    if (selected?.id === imageId) setSelected(null)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 py-6 sm:px-5 md:px-7 md:py-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6 rounded-2xl border border-white/12 bg-white/[0.03] p-4 sm:p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">Uploaded</h1>
              <p className="mt-1 text-sm text-white/60">Upload your own images and build your personal collection.</p>
            </div>

            <button
              onClick={onPickFile}
              disabled={uploading}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Add Image"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          {error && (
            <div className="mt-3 rounded-lg border border-red-400/35 bg-red-400/10 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          )}
        </div>

        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-14 text-center text-white/60">
            Your library is empty. Click <span className="text-white">Add Image</span> to upload.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {images.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-xl border border-white/8">
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "library image"}
                  className="w-full cursor-pointer object-cover"
                  onClick={() => setSelected(image)}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-0 transition group-hover:opacity-100" />

                <button
                  onClick={() => setSelected(image)}
                  className="absolute left-2 bottom-2 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
                >
                  Fullscreen
                </button>

                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-[#e0315b] px-3 py-1.5 text-xs text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageModal
        photo={selected}
        images={images}
        setSelected={setSelected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
