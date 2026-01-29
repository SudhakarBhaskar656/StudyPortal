const express =  require('express');
const cookieParser=require('cookie-parser')
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Initialize database and GridFS
const dbConnection = require("./config/database");
dbConnection.connect();

// Initialize GridFS after DB connection
const { initGridFS } = require('./config/gridfs');
mongoose.connection.once('open', () => {
  initGridFS(mongoose.connection);
  console.log("GridFS initialized");
});

// route import and mount 
const user = require("./routes/user");
const courseroutes=require('./routes/courseroute');
const orderroutes=require('./routes/orderroutes');

app.use("/api/v1/auth",user);
app.use("/api/v1/course",courseroutes);
app.use("/api/v1/order",orderroutes)

// Activate 
app.listen(PORT,() => {
    console.log(`PORT HAS BEEN STARTED ON ${PORT}`);
})

app.get("/", (req,res) => {
    res.send("Default Route")
});