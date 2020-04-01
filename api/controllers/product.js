const mongoose = require("mongoose");
const Product = require("../models/product");

exports.product_get_all = (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then(docs => {
      const respone = {
        count: docs.length,
        product: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/product/" + doc._id
            }
          };
        })
      };
      res.status(200).json(respone);
    })
    .catch(err => {
      res.status(404).json({
        message: "No data found"
      });
    });
};

exports.product_get_by_id = (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage
        });
      } else {
        res.status(404).json({
          message: "No data Found for particular ID"
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.product_create_product = (req, res, next) => {
  //   console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product Created",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage
        },
        request: {
          method: "GET",
          url: "http://localhost:3000/product/" + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.product_delete_product = (req, res, next) => {
  const id = req.params.productID;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Product Deleted with id: " + id,
        request: {
          method: "POST",
          url: "http://localhost:3000/product/",
          body: {
            name: "String",
            price: "Number"
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.product_update_product = (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.propValue;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      //   console.log(result);
      res.status(200).json({
        message: "product updated",
        request: {
          method: "GET",
          url: "http://localhost:3000/product/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
