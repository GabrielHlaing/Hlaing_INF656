const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemController");

// routes for CRUD end points
router
  .route("/")
  .get(controller.getAllItems)
  .post(controller.createItem)
  .put(controller.updateItem)
  .delete(controller.deleteItem);

router.get("/:id", controller.getItem);

module.exports = router;
