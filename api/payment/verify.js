const crypto = require("crypto");
const axios = require("axios");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.RAZOR_SECRET) {
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

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment payload" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature.length !== razorpay_signature.length) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        const valid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpay_signature)
        );

        if (!valid) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        return res.status(200).json({ verified: true });
    } catch (error) {
        console.error("Payment verify error:", error.message);
        return res.status(500).json({ error: "Failed to verify payment" });
    }
};
