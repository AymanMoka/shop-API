const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");//cors
app.use(cors());
app.options('*', cors());//enable cors


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

app.listen(3000, () => {
  console.log("Server Started");
});//strat server
