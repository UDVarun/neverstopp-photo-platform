import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { getProfileFromUser, imageFileToAvatarDataUrl, updateUserProfile } from "../services/profile"
import { getDefaultAvatarSvg } from "../utils/defaultAvatar"

export default function Settings() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const fileRef = useRef(null)

  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) return
    const profile = getProfileFromUser(user)
    setFullName(profile.fullName)
    setBio(profile.bio)
    setAvatarUrl(profile.avatarUrl)
  }, [user])

  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    try {
      const dataUrl = await imageFileToAvatarDataUrl(file)
      setAvatarUrl(dataUrl)
    } catch (err) {
      setError(err.message || "Failed to process image")
    } finally {
      e.target.value = ""
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError("")
    setSuccess("")
    try {
      await updateUserProfile({ user, fullName, bio, avatarUrl })
      await refreshUser?.()
      setSuccess("Profile updated successfully.")
    } catch (err) {
      setError(err.message || "Could not update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login", { replace: true })
  }

  const fallbackAvatar = getDefaultAvatarSvg(fullName || user?.email || "User")

  return (
    <div className="min-h-screen bg-[#0d0f12] px-4 py-6 sm:px-5 md:px-7 md:py-8">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-5 md:mb-7">
          <p className="text-xs tracking-[0.2em] text-white/45">ACCOUNT</p>
          <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-white/60">Update your profile and account preferences.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[320px_1fr] md:gap-6">
          <section className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 md:p-5">
            <h2 className="text-sm font-semibold text-white/85">Profile Card</h2>
            <div className="mt-4 flex flex-col items-center">
              <img
                src={avatarUrl || fallbackAvatar}
                alt="profile"
                className="h-28 w-28 rounded-full object-cover ring-2 ring-white/15"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = fallbackAvatar
                  setAvatarUrl("")
                }}
              />
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-white">{fullName || "Unnamed user"}</p>
                <p className="text-xs text-white/55">{user?.email}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/16"
              >
                Change photo
              </button>
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="rounded-full border border-white/20 bg-transparent px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
              >
                Remove
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />

            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="text-xs text-white/55">Quick action</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/8 px-3 py-2 text-sm text-white transition hover:bg-white/14"
              >
                Log out
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/12 bg-white/[0.03] p-4 md:p-6">
            <h2 className="text-sm font-semibold text-white/85">Edit Profile</h2>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-white/75">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/15 bg-white/7 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/75">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  maxLength={220}
                  placeholder="Tell people a little about you..."
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/7 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                />
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-white/45">This appears on your public profile.</p>
                  <p className="text-xs text-white/45">{bio.length}/220</p>
                </div>
              </div>

              {error && <div className="rounded-lg border border-red-400/35 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>}
              {success && <div className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{success}</div>}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const profile = getProfileFromUser(user)
                    setFullName(profile.fullName)
                    setBio(profile.bio)
                    setAvatarUrl(profile.avatarUrl)
                    setError("")
                    setSuccess("")
                  }}
                  className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
