const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/route');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// Mount routes
app.use('/api', postRoutes);

app.get("/",(req,res)=>{
    res.send("Hello! This is an Assignment task for Idea Usher");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
