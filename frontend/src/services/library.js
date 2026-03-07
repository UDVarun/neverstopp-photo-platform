import { getDefaultAvatarSvg } from "../utils/defaultAvatar"

const keyForUser = (userId) => `my-library:${userId}`

export const getLibraryImages = (userId) => {
  if (!userId) return []

  try {
    const raw = localStorage.getItem(keyForUser(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveLibraryImages = (userId, images) => {
  localStorage.setItem(keyForUser(userId), JSON.stringify(images))
  window.dispatchEvent(new Event("library-updated"))
}

const fileToImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Invalid image file"))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error("Failed to read image"))
    reader.readAsDataURL(file)
  })

const imageToDataUrl = (img, maxSide = 1800, quality = 0.84) => {
  const ratio = Math.min(1, maxSide / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * ratio))
  const height = Math.max(1, Math.round(img.height * ratio))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0, width, height)
  return {
    width,
    height,
    dataUrl: canvas.toDataURL("image/jpeg", quality)
  }
}

export const addImageToLibrary = async ({ userId, file, userName }) => {
  if (!userId) throw new Error("Please log in first")
  if (!file) throw new Error("No image selected")
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed")
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be less than 10MB")

  const current = getLibraryImages(userId)
  if (current.length >= 60) throw new Error("Library limit reached (60 images)")

  const img = await fileToImage(file)
  const { width, height, dataUrl } = imageToDataUrl(img)

  const entry = {
    id: `lib-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    alt_description: file.name,
    width,
    height,
    user: {
      name: userName || "You",
      profile_image: { medium: getDefaultAvatarSvg(userName || "You") }
    },
    urls: {
      small: dataUrl,
      regular: dataUrl,
      full: dataUrl
    }
  }

  try {
    saveLibraryImages(userId, [entry, ...current])
    return entry
  } catch {
    throw new Error("Storage full. Remove some images and try again.")
  }
}

export const removeImageFromLibrary = ({ userId, imageId }) => {
  if (!userId) return false
  const current = getLibraryImages(userId)
  const next = current.filter((item) => item.id !== imageId)
  if (next.length === current.length) return false
  saveLibraryImages(userId, next)
  return true
}
