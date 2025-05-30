const { MENU_LINKS } = require("../constants/navigation");
const Entries = require("../models/EntriesModel");

exports.getHomeView = (request, response) => {
  const newestEntry = Entries.getLast();

  response.render("home.ejs", {
    headTitle: "Strona Główna",
    path: "/",
    activeLinkPath: "/",
    menuLinks: MENU_LINKS,
    newestEntry,
  });
};
