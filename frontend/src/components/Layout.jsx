import Navbar from "./Navbar"
import SideRail from "./SideRail"

export default function Layout({ children }) {

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* NAVBAR ONLY HERE */}
      <Navbar />
      <SideRail />

      <main className="pt-4 md:pt-6 md:pl-[86px]">
        {children}
      </main>

    </div>
  )
}
