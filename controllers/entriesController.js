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
  const today = new Date();
  const entryDate = new Date(date);

  //sprawdzamy czy pola nie sa puste, nie dziala jeszcze poprawnie
  if(!mood || !description || !rating || !date){
    return res.render("add-entry.ejs", {
      headTitle: "Dodaj wpis",
      path: "/add",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/add",
      errorMessage: "Wszystkie pola muszą być wypełnione",
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
  const allEntries = Entries.getAll();
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
  Entries.add(newEntry);
  res.redirect("/history");
};

exports.getEntriesView = (req, res) => {
  const entries = Entries.getAll();

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

exports.deleteEntry = (req, res) => {
  const { id } = req.params;
  Entries.deleteById(id);

  res.status(STATUS_CODE.OK).json({ success: true });
}
