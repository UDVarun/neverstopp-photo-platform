const Razorpay = require("razorpay");

const razor = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const order = await razor.orders.create({
            amount: 50000, // Amount in paise
            currency: "INR",
        });

        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
