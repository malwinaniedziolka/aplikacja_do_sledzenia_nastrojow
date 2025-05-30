const Entries = require("../models/EntriesModel");

const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");

exports.getAddEntryView = (req, res) => {
  res.render("add-entry.ejs", {
    headTitle: "Dodaj Wpis",
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

//Bierzący tydzień, miesiąc, rok
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

exports.getStatisticsView = (req, res) => {
   const allEntries = Entries.getAll();

   const now = new Date();
   const currentMonth = now.getMonth();
   const currentYear = now.getFullYear();
   const currentWeek = getWeekNumber(now);

    // Filtrowanie wpisów
  const monthEntries = allEntries.filter(entry => {
    const d = new Date(entry.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const yearEntries = allEntries.filter(entry => {
    const d = new Date(entry.date);
    return d.getFullYear() === currentYear;
  });

  const weekEntries = allEntries.filter(entry => {
    const d = new Date(entry.date);
    return getWeekNumber(new Date(d)) === currentWeek &&
           new Date(d).getFullYear() === currentYear;
  });

  res.render("stats.ejs", {
    headTitle: "Statystyki",
    path: "/stats",
    activeLinkPath: "/stats",
    menuLinks: MENU_LINKS,
    entries: allEntries,
    weekEntries,
    monthEntries,
    yearEntries,
  });
};

exports.deleteEntry = (req, res) => {
  const { id } = req.params;
  Entries.deleteById(id);

  res.status(STATUS_CODE.OK).json({ success: true });
}
