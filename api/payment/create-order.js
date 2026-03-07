const Razorpay = require("razorpay");
const axios = require("axios");

const plans = {
    monthly: 50000,
    yearly: 499900,
};

const razor = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        await axios.get(`${process.env.SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.SUPABASE_ANON_KEY,
            },
            timeout: 5000,
        });

        const plan = req.body?.plan || "monthly";
        const amount = plans[plan];

        if (!amount) {
            return res.status(400).json({ error: "Invalid plan" });
        }

        const order = await razor.orders.create({
            amount,
            currency: "INR",
        });

        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
