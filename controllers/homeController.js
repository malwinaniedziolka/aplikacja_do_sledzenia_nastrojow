const { MENU_LINKS } = require("../constants/navigation");

exports.getHomeView = (request, response) => {
  response.render("home.ejs", {
    headTitle: "Home",
    path: "/",
    activeLinkPath: "/",
    menuLinks: MENU_LINKS,
  });
};