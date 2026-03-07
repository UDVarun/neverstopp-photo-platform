const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE: Connection Error:", err);
        process.exit(1);
    });
