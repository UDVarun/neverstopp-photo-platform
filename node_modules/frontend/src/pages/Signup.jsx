import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Signup() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    /* DIRECT LOGIN SUCCESS */
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="w-full max-w-md p-10 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#111] shadow-2xl border border-white/10 backdrop-blur-xl">

        <h1 className="text-white text-3xl font-semibold mb-2 text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Join NeverStop and explore premium visuals.
        </p>

        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#1f1f21] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#1f1f21] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#1f1f21] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] active:scale-95 transition duration-200"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <div className="text-center text-gray-400 text-sm mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-white ml-2 hover:underline"
          >
            Login
          </Link>
        </div>

      </div>

    </div>
  )
}