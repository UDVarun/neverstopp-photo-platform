import { useState, useEffect, useRef } from "react"
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
  const query = params.get("q") || ""

  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const observerRef = useRef()

  const loadImages = async () => {

    try {

      const res = await api.get(
        `/photos?q=${query}&page=${page}`
      )

      preloadImages(res.data.results)

      setImages(prev => {
        const ids = new Set(prev.map(i => i.id))
        const unique = res.data.results.filter(i => !ids.has(i.id))
        return [...prev, ...unique]
      })

    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  /* RESET WHEN QUERY CHANGES */
  useEffect(() => {
    setImages([])
    setPage(1)
    setLoading(true)
  }, [query])

  useEffect(() => {
    loadImages()
  }, [page, query])

  /* INFINITE SCROLL */
  useEffect(() => {

    const observer =
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1)
        }
      })

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()

  }, [])

  return (
    <div className="bg-[#111] min-h-screen">

      <Categories setImages={setImages} setPage={setPage} />

      <div className="max-w-[1600px] mx-auto px-8 py-10">

        {loading && images.length === 0 ? (
          <SkeletonGrid />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
            {images.map(photo => (
              <ImageCard
                key={photo.id}
                photo={photo}
                onClick={setSelected}
              />
            ))}
          </div>
        )}

        <div ref={observerRef} className="h-20" />

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