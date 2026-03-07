const axios = require("axios")

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || ""
  const [scheme, token] = authHeader.split(" ")

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: "Server configuration error" })
  }

  try {
    const response = await axios.get(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey
      },
      timeout: 5000
    })

    req.user = response.data
    next()
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
}
