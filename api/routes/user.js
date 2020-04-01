const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const checkAuth = require("../middleware/checkAuth");

// router.get("/", (req, res, next) => {
//   User.find()
//     .exec()
//     .then(doc => {
//       res
//         .status(200)
//         .json(doc)
//         .catch(err => {
//           res.status(500).json({
//             error: err
//           });
//         });
//     });
// });

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userID", checkAuth, UserController.user_delete);

module.exports = router;
