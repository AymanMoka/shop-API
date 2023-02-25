const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors"); //enable cors
app.use(cors());
app.options("*", cors()); //enable cors

const admin = require("./routes/admin");
app.use("/admin/", admin); //admin middleware for admin panel

app.use(express.json({ limit: "5mb" })); //parsing
app.use(express.urlencoded({ limit: "5mb", extended: true })); //parsing
app.use(bodyParser.json()); //parsing

const authJwt = require("./helpers/jwt");
app.use(authJwt()); //jwt middleware


app.get("/", (req, res) => {
  res.send("hello from server :)");
}); //home route

require("dotenv").config(); //dot env

mongoose.connect(
  process.env.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database Connected");
  }
); //connect to db

const categoryRoute = require("./routes/categoryRoute");
app.use("/api/v1/categories", categoryRoute); //category middleware

const productRoute = require("./routes/productRoute");
app.use("/api/v1/products", productRoute); //category middleware

const userRoute = require("./routes/userRoute");
app.use("/api/v1/users", userRoute); //users middleware

app.listen(3000, () => {
  console.log("Server Started");
}); //strat server
