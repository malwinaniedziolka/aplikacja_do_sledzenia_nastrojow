const Entries = require("../models/EntriesModel");

const { MENU_LINKS } = require("../constants/navigation");

//Bierzący tydzień, miesiąc, rok
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

exports.getStatisticsView = async (req, res) => {
   const allEntries =  await Entries.getAll();

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