const HOME_LINK = {
  label: "Strona Główna",
  path: "/",
};

const MENU_LINKS = [
  HOME_LINK,
  { label: "Dodaj Wpis", path: "/add" },
  { label: "Historia", path: "/history" },
  { label: "Statystyki", path: "/stats" },
  //dodac kolejne zakladki jak cos
];

module.exports = {
  MENU_LINKS,
};