import Navbar from "./Navbar"

export default function Layout({ children }) {

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* NAVBAR ONLY HERE */}
      <Navbar />

      <main className="pt-6">
        {children}
      </main>

    </div>
  )
}