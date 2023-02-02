const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");//cors
app.use(cors());
app.options('*', cors());//enable cors

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));//parsing

require("dotenv").config();//dot env

mongoose.connect(
  process.env.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database Connected");
  }
);//connect to db

const categoryRoute = require('./routes/categoryRoute');
app.use('/api/v1/categories', categoryRoute); //category middleware

const productRoute = require('./routes/productRoute');
app.use('/api/v1/products', productRoute); //category middleware

const userRoute = require('./routes/userRoute');
app.use("/api/v1/users", userRoute); //users middleware


app.listen(3000, () => {
  console.log("Server Started");
});//strat server
