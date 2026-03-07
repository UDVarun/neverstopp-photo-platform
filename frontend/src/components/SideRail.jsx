import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function SideRail() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const items = [
    {
      to: "/favorites",
      label: "Favorites",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      to: "/uploaded",
      label: "Uploaded",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 16V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 10l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ]

  const bottomItem = {
    to: "/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.76l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05a1.6 1.6 0 0 0-1.76-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.08a1.6 1.6 0 0 0-1-1.47 1.6 1.6 0 0 0-1.76.32l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05a1.6 1.6 0 0 0 .32-1.76 1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.08a1.6 1.6 0 0 0 1.47-1 1.6 1.6 0 0 0-.32-1.76l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05a1.6 1.6 0 0 0 1.76.32h.02a1.6 1.6 0 0 0 .98-1.47V3a2 2 0 1 1 4 0v.08a1.6 1.6 0 0 0 .98 1.47h.02a1.6 1.6 0 0 0 1.76-.32l.05-.05a2 2 0 0 1 2.83 2.83l-.05.05a1.6 1.6 0 0 0-.32 1.76v.02a1.6 1.6 0 0 0 1.47.98H21a2 2 0 1 1 0 4h-.08a1.6 1.6 0 0 0-1.47.98V15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <aside className="fixed bottom-4 left-3 z-40 hidden md:block">
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/50 p-2 backdrop-blur-xl">
        {items.map((item) => {
          const active = location.pathname === item.to
          return (
            <div key={item.to} className="group relative">
              <Link
                to={item.to}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  active
                    ? "border-white/35 bg-white/15 text-white"
                    : "border-transparent bg-white/5 text-white/70 hover:bg-white/12 hover:text-white"
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </Link>

              <span className="pointer-events-none absolute left-[54px] top-1/2 -translate-y-1/2 rounded-md border border-white/12 bg-black/85 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </div>
          )
        })}

        <div className="my-1 h-px bg-white/10" />

        <div className="group relative">
          <Link
            to={bottomItem.to}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
              location.pathname === bottomItem.to
                ? "border-white/35 bg-white/15 text-white"
                : "border-transparent bg-white/5 text-white/70 hover:bg-white/12 hover:text-white"
            }`}
            aria-label={bottomItem.label}
          >
            {bottomItem.icon}
          </Link>

          <span className="pointer-events-none absolute left-[54px] top-1/2 -translate-y-1/2 rounded-md border border-white/12 bg-black/85 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {bottomItem.label}
          </span>
        </div>
      </div>
    </aside>
  )
}
