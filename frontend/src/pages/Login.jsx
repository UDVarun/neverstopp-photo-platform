import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate("/")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="w-full max-w-md p-10 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#111] shadow-2xl border border-white/10 backdrop-blur-xl">

        <h1 className="text-white text-3xl font-semibold mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign in to continue exploring.
        </p>

        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

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
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?
          <Link
            to="/signup"
            className="text-white ml-2 hover:underline"
          >
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  )
}