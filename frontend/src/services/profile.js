import { supabase } from "../lib/supabase"

const localKey = (userId) => `profile:${userId}`

const safeParse = (value, fallback = {}) => {
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === "object" ? parsed : fallback
  } catch {
    return fallback
  }
}

export const getLocalProfile = (userId) => {
  if (!userId) return {}
  return safeParse(localStorage.getItem(localKey(userId)))
}

export const getProfileFromUser = (user) => {
  if (!user) return { fullName: "", bio: "", avatarUrl: "" }
  const local = getLocalProfile(user.id)
  return {
    fullName: local.fullName || user.user_metadata?.full_name || "",
    bio: local.bio || user.user_metadata?.bio || "",
    avatarUrl: local.avatarUrl || user.user_metadata?.avatar_url || ""
  }
}

const saveLocalProfile = (userId, profile) => {
  localStorage.setItem(localKey(userId), JSON.stringify(profile))
  window.dispatchEvent(new Event("profile-updated"))
}

export const imageFileToAvatarDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Only image files are allowed"))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Profile photo must be under 5MB"))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxSide = 512
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * ratio))
        const height = Math.max(1, Math.round(img.height * ratio))
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      img.onerror = () => reject(new Error("Invalid image file"))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })

export const updateUserProfile = async ({ user, fullName, bio, avatarUrl }) => {
  if (!user?.id) throw new Error("Not authenticated")

  const normalized = {
    fullName: fullName.trim(),
    bio: bio.trim(),
    avatarUrl: avatarUrl || ""
  }

  saveLocalProfile(user.id, normalized)

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: normalized.fullName,
      bio: normalized.bio,
      avatar_url: normalized.avatarUrl
    }
  })

  if (error) {
    // Keep local profile even when metadata write fails.
    throw new Error(error.message || "Failed to update profile")
  }

  return normalized
}
