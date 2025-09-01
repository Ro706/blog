const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// define routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/blog', require('./routes/blog'));

// Connect to MongoDB
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.send("Hello World");

});