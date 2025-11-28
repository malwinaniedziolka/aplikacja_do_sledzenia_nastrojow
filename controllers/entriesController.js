const Entries = require("../models/EntriesModel");

const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");

exports.getAddEntryView = async (req, res) => {
  res.render("add-entry.ejs", {
    headTitle: "Dodaj Wpis",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/add",
  });
};

exports.addNewEntry = async (req, res) => {
  const { mood, description, rating, date } = req.body;
  const today = new Date();
  const entryDate = new Date(date);

  //sprawdzamy czy pola nie sa puste, nie dziala jeszcze poprawnie
  if(!mood || !rating || !date){
    return res.render("add-entry.ejs", {
      headTitle: "Dodaj wpis",
      path: "/add",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/add",
      errorMessage: "Wypełnij pola z nastrojem, oceną i datą.",
    });
  }

  //sprawdzamy, czy data jest w przyszlosci
  if (entryDate > today) {
    return res.render("add-entry.ejs", {
      headTitle: "Dodaj wpis",
      path: "/add",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/add",
      errorMessage: "Nie możesz dodać wpisu na przyszłą datę.",
    });
  }

  //sprawdzamy czy wpis już istnieje o tej samej dacie
  const allEntries = await Entries.getAll();
  const entryExists = allEntries.some((entry) => {
    const existingDate = new Date(entry.date);
    return existingDate.getTime() === entryDate.getTime();
  });

  if (entryExists) {
    return res.render("add-entry.ejs", {
      headTitle: "Dodaj wpis",
      path: "/add",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/add",
      errorMessage: "Wpis na ten dzień już istnieje.",
    });
  }

  //jak wszystko jest ok dodajemy wpis
  const newEntry = new Entries(mood, description, rating, date);
  await Entries.add(newEntry);
  res.redirect("/history");
};

exports.getEntriesView = async (req, res) => {
  const entries = await Entries.getAll();

  //sortowanie zeby w historii sie pojawialo od najnowszej daty
  entries.sort((a, b) => new Date(b.date) - new Date(a.date)); 

  res.render("entries.ejs", {
    headTitle: "Historia wpisów",
    path: "/history",
    activeLinkPath: "/history",
    entries,
    menuLinks: MENU_LINKS,
  });
};

exports.getEditEntryView = async (req, res) => {
  const { id } = req.params;
  const entry = await Entries.getAll().find(e => e.id.toString() === id.toString());

  if (!entry) {
    return res.status(STATUS_CODE.NOT_FOUND).render("404.ejs", {
      headTitle: "404",
      message: "Nie znaleziono wpisu.",
      menuLinks: MENU_LINKS,
      activeLinkPath: ""
    });
  }

  res.render("edit-entry.ejs", {
    headTitle: "Edytuj wpis",
    path: `/edit/${id}`,
    menuLinks: MENU_LINKS,
    activeLinkPath: "/history",
    entry, 
  });
};

exports.editEntry = async (req, res) => {
  const { id } = req.params;
  const { mood, description, rating, date } = req.body;
  const today = new Date();
  const entryDate = new Date(date);

  if (!mood || !rating || !date) {
    return res.render("edit-entry.ejs", {
      headTitle: "Edytuj wpis",
      path: `/edit/${id}`,
      menuLinks: MENU_LINKS,
      activeLinkPath: "/history",
      errorMessage: "Wypełnij pola z nastrojem, oceną i datą.",
      entry: { id, mood, description, rating, date },
    });
  }

  if (entryDate > today){
    return res.render("edit-entry.ejs", {
      headTitle: "Edytuj wpis",
      path: `/edit/${id}`,
      menuLinks: MENU_LINKS,
      activeLinkPath: "/history",
      errorMessage: "Nie możesz dodać wpisu na przyszłą datę.",
      entry: { id, mood, description, rating, date },
    });
  }

  await Entries.updateById(id, { mood, description, rating, date });
  res.redirect("/history");
};

exports.deleteEntry = async (req, res) => {
  const { id } = req.params;
  await Entries.deleteById(id);

  res.status(STATUS_CODE.OK).json({ success: true });
}
