const { MENU_LINKS } = require('../constants/navigation');
const Entries = require('../models/EntriesModel');

exports.getHomeView = async (request, response) => {
	const newestEntry = await Entries.getLast();
	const quote = await Entries.getQuote();

	response.render('home.ejs', {
		headTitle: 'Home',
		path: '/',
		activeLinkPath: '/',
		menuLinks: MENU_LINKS,
		newestEntry,
		quote,
	});
};
