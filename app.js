const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(
  "mongodb+srv://mongo_node_api:" +
    process.env.MONGO_ATLAS_PW +
    "@testing-node-api-yevlw.mongodb.net/test?retryWrites=true&w=majority"
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

//Routes for products and orders
app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

//error handlingfor 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//error handling for other ports
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
