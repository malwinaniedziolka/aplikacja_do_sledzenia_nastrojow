const Entries = require("../models/EntriesModel");

const { MENU_LINKS } = require("../constants/navigation");

exports.getAddEntryView = (req, res) => {
  res.render("add-entry.ejs", {
    headTitle: "Dodaj wpis",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/add",
  });
};

exports.addNewEntry = (req, res) => {
    const { mood, description, rating, date } = req.body;
    const newEntry = new Entries(mood, description, rating ,date);
    Entries.add(newEntry);
    res.redirect('/history');
}

exports.getEntriesView = (req, res) => {
  const entries = Entries.getAll();

  res.render("entries.ejs", {
    headTitle: "Historia wpisów",
    path: "/history",
    activeLinkPath: "/history",
    entries,
    menuLinks: MENU_LINKS,
  });
};

exports.deleteEntry = (req, res) => {
  const { id } = req.params;
  Entries.deleteById(id);

  res.status(STATUS_CODE.OK).json({ success: true });
}
