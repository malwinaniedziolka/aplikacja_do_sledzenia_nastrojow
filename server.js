const express = require("express");
const bodyParser = require("body-parser");

const { STATUS_CODE } = require("./constants/statusCode");
const { MENU_LINKS } = require("./constants/navigation");
const { PORT } = require("./config");
const logger = require("./utils/logger");
const entryRoutes = require("./routing/entries");
const getFileFromAbsolutePath = require("./utils/getFileFromAbsolutePath");
//dalsze importy

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(getFileFromAbsolutePath("public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, _response, next) => {
  const { url, method } = request;

  logger.getInfoLog(url, method);
  next();
});

//app.use kolejne
app.use(entryRoutes);

app.use((request, response) => {
  const { url } = request;

  response.status(STATUS_CODE.NOT_FOUND).render("404", {
    headTitle: "404",
    menuLinks: MENU_LINKS,
    activeLinkPath: "",
  });
  logger.getErrorLog(url);
});

app.listen(PORT);