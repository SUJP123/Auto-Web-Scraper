const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const app = express();

// Set up env access
dotenv.config({path:__dirname+'/./../../.env'});

app.use(cors())

// middleware
app.use(express.json());
app.use(cookieParser());

const name = encodeURIComponent(process.env.DB_NAME);
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@scraper.jht70.mongodb.net/?retryWrites=true&w=majority&appName=${name}`

const connectionpOptions = {
  dbName: process.env.DB}

try {
    mongoose.connect(uri, connectionpOptions); 
    console.log("Connected to MongoDB");
} catch(error) {
    console.error(error);
}



// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);


let PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


