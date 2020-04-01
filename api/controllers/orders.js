const mongoose = require("mongoose");
const Orders = require("../models/orders");
const Product = require("../models/product");

exports.orders_get_all = (req, res) => {
  Orders.find()
    .populate("product", "name price")
    .select("_id product quantity")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "No orders found"
      });
    });
};

exports.orders_get_order_by_id = (req, res) => {
  const id = req.params.orderID;
  Orders.findById(id)
    .populate("product", "name price")
    .exec()
    .then(docs => {
      const response = {
        message: "Your Order details are:",
        _id: docs._id,
        product: docs.product,
        quantity: docs.quantity
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.orders_place_order = (req, res) => {
  Product.findById(req.body.productID)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Orders({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.orders_delete_order_by_id = (req, res) => {
  Orders.remove({ _id: req.params.orderID })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Order Deleted with id: " + req.params.orderID,
        request: {
          method: "POST",
          url: "http://localhost:3000/orders/",
          body: {
            product: "mongoose.Types.ObjectId",
            quantity: "Number"
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
