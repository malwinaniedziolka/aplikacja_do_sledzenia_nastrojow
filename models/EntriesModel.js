const { randomUUID } = require('crypto'); //do automatycznich id

class Entries {
    constructor(mood, description, rating, date) {
        this.id = randomUUID(); //daje randomowe id
        this.mood = mood;
        this.description = description;
        this.rating = rating;
        this.date = date;
    }

    static #entries = [ //przykladowe dane
        { id: '1', mood: "Smutny/a", description: "opis dnia", rating: "2", date: "2025-04-21"},
        { id: '2', mood: "Wesoły/a", description: "opis dnia 2", rating: "5", date: "2025-03-21"},
        { id: '3', mood: "Zły/a", description: "", rating: "3", date: "2025-02-21"},
    ];

    static getAll() { //potem zmienic jesli chcemy ladowac tylko kilkanascie ostatnich chb
        return this.#entries;
    }

    static add(task) {
        this.#entries.push(task);
    }

    static getLast() {
        if (!this.#entries.length) {
            return;
        }
        return this.#entries.reduce((latest, entry) => {
            return new Date(entry.date) > new Date(latest.date) ? entry : latest;
        });
    }

    //kolejne metody do obslugi wpisow

    static deleteById(id) {
        this.#entries = this.#entries.filter((task) => task.id !== id);
    }
}

module.exports = Entries;