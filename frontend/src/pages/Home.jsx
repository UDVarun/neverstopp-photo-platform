import { useState, useEffect, useRef, useCallback } from "react"
import { useLocation } from "react-router-dom"
import api from "../services/api"

import Categories from "../components/Categories"
import ImageCard from "../components/ImageCard"
import ImageModal from "../components/ImageModal"
import SkeletonGrid from "../components/SkeletonGrid"

import { preloadImages } from "../utils/preload"

export default function Home() {

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const query = params.get("q") || "nature"

  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const observerRef = useRef()
  const isFetching = useRef(false)

  // When query changes, reset everything
  useEffect(() => {
    setImages([])
    setPage(1)
    setLoading(true)
    setHasMore(true)
    isFetching.current = false
  }, [query])

  // Fetch images when page or query changes
  useEffect(() => {
    const loadImages = async () => {
      if (isFetching.current || !hasMore) return
      isFetching.current = true

      try {
        const res = await api.get(`/photos?q=${query}&page=${page}`)
        const results = res.data.results || []

        if (results.length === 0) {
          setHasMore(false)
        } else {
          preloadImages(results)
          setImages(prev => {
            const ids = new Set(prev.map(i => i.id))
            const unique = results.filter(i => !ids.has(i.id))
            return [...prev, ...unique]
          })
        }
      } catch (err) {
        console.log(err)
      }

      setLoading(false)
      isFetching.current = false
    }

    loadImages()
  }, [page, query])

  // Infinite scroll — only activate after images are loaded
  const sentinelRef = useCallback(node => {
    if (!node) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetching.current && hasMore) {
        setPage(p => p + 1)
      }
    }, { rootMargin: "400px" })

    observer.observe(node)
    observerRef.current = observer
    return () => observer.disconnect()
  }, [hasMore])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      <Categories />

      <div className="max-w-[1600px] mx-auto px-4 py-6 sm:px-5 md:px-7 md:py-8">

        {loading && images.length === 0 ? (
          <SkeletonGrid />
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {images.map(photo => (
              <ImageCard
                key={photo.id}
                photo={photo}
                onClick={setSelected}
              />
            ))}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {!loading && hasMore && (
          <div ref={sentinelRef} className="h-20 mt-4" />
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
