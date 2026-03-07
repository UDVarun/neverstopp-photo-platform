const palette = [
  ["#1d4ed8", "#0f172a"],
  ["#0f766e", "#111827"],
  ["#7c3aed", "#1f2937"],
  ["#be123c", "#111827"],
  ["#b45309", "#111827"],
  ["#0891b2", "#0f172a"]
]

const hashString = (value) => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const initialFrom = (value = "") => {
  const trimmed = value.trim()
  if (!trimmed) return "U"
  return trimmed.charAt(0).toUpperCase()
}

export const getDefaultAvatarSvg = (seed = "User") => {
  const hash = hashString(seed)
  const [start, end] = palette[hash % palette.length]
  const initial = initialFrom(seed)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" fill="none"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${start}"/><stop offset="100%" stop-color="${end}"/></linearGradient></defs><rect width="256" height="256" rx="128" fill="url(#g)"/><circle cx="128" cy="128" r="86" fill="rgba(255,255,255,0.08)"/><text x="50%" y="53%" text-anchor="middle" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="96" font-weight="700" dy=".3em">${initial}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const DEFAULT_AVATAR_SVG = getDefaultAvatarSvg("User")
