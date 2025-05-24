const express = require("express");

const homeController = require("../controllers/homeController");
const entriesController = require("../controllers/entriesController");

const router = express.Router();

router.get("/", homeController.getHomeView);
router.get("/add", entriesController.getAddEntryView);
router.post("/add", entriesController.addNewEntry);
router.get("/history", entriesController.getEntriesView);
//router.delete("/delete/:id", entriesController.deleteEntry);

module.exports = router;