const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");
const productControllers = require("../controllers/product");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  cb(null, false);
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
  fileFilter: fileFilter
});

const upload = multer({ storage: storage });

router.get("/", productControllers.product_get_all);

router.get("/:productID", productControllers.product_get_by_id);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productControllers.product_create_product
);

router.delete(
  "/:productID",
  checkAuth,
  productControllers.product_delete_product
);

router.patch(
  "/:productID",
  checkAuth,
  productControllers.product_update_product
);

module.exports = router;
