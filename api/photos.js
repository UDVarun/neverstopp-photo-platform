const axios = require("axios");

module.exports = async (req, res) => {
    try {
        const rawQuery = `${req.query.q || "nature"}`;
        const query = rawQuery.replace(/[^\w\s-]/g, "").trim().slice(0, 60) || "nature";
        const pageNumber = Number.parseInt(req.query.page, 10);
        const page = Number.isFinite(pageNumber) && pageNumber > 0 ? Math.min(pageNumber, 100) : 1;

        console.log(`Fetching photos for query: ${query}, page: ${page}`);

        if (!process.env.UNSPLASH_KEY) {
            console.error("UNSPLASH_KEY is missing in environment variables");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const response = await axios.get("https://api.unsplash.com/search/photos", {
            params: {
                query: query,
                page: page,
                per_page: 12,
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Unsplash error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch photos" });
    }
};
