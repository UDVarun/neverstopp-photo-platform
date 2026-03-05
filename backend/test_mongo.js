const mongoose = require('mongoose');
const uri = "mongodb+srv://varunud84_db_user:NNuRQkWoPO3lVylY@cluster0.0s7rcdh.mongodb.net/photolab?retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing URI:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE: Connection Error:", err);
        process.exit(1);
    });
