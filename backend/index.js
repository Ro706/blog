const connectToMongo = require('./db');
const express = require('express');

const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

app.get('/', (req, res) => {
    res.send("Hello World");
});