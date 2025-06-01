const express = require("express");

const homeController = require("../controllers/homeController");
const entriesController = require("../controllers/entriesController");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/", homeController.getHomeView);
router.get("/add", entriesController.getAddEntryView);
router.post("/add", entriesController.addNewEntry);
router.get("/history", entriesController.getEntriesView);
router.get("/stats", statsController.getStatisticsView);
router.delete("/delete/:id", entriesController.deleteEntry);
router.get("/edit/:id", entriesController.getEditEntryView);
router.post("/edit/:id", entriesController.editEntry);

module.exports = router;