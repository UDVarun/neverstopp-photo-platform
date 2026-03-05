const axios = require("axios")

exports.getPhotos = async (req, res) => {
  try {
    const query = req.query.q || "nature"
    const page = req.query.page || 1

    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: query,
          page: page,
          per_page: 20
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
        }
      }
    )

    res.json(response.data)

  } catch (error) {
    console.error("Unsplash error:", error.message)

    res.status(500).json({
      error: "Failed to fetch photos"
    })
  }
}