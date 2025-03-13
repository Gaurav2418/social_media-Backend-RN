const express = require("express")
const cors = require("cors")
const connectDB = require("./dbconnection")
const bodyParser = require('body-parser');
// const userRoute = require('./routes/userRoute')
const app = express();
app.use(express.json())

const router = express.Router();
const user12 = require("./routes/userRoute")
const post = require("./routes/postRoute")
require('dotenv').config();  // This loads your .env file


const registerController = require ('./controllers/userController')
connectDB()
app.use(cors());
app.use("/api", user12);
app.use("/api", post)

app.use(express.urlencoded({ extended: true }));



app.get('/',(req, res)=> {
    console.log("server is running on 8080");
    return res.status(200).send("server running on port 8080")}
    
    
)

app.listen(8080,()=>{
    console.log("server is running");
})