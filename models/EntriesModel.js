const { randomUUID } = require('crypto'); //do automatycznich id

const Database = require('better-sqlite3');
const db = new Database('moods.db'); //baza danych

//tworzy tabelke jesli jej nie ma
db.exec(`
  CREATE TABLE IF NOT EXISTS moods (
    id INTEGER PRIMARY KEY,
    mood TEXT NOT NULL,
    description TEXT,
    rating INTEGER NOT NULL,
    date TEXT NOT NULL
  );
`);

class Entries {
    constructor(mood, description, rating, date) {
        this.id = randomUUID(); //daje randomowe id
        this.mood = mood;
        this.description = description;
        this.rating = rating;
        this.date = date;
    }

    static getAll() {
        return db.prepare('SELECT * FROM moods ORDER BY date DESC').all();
    }

    static add({ mood, description, rating, date }) {
        const stmt = db.prepare('INSERT INTO moods (mood, description, rating, date) VALUES (?, ?, ?, ?)');
        stmt.run(mood, description, rating, date);
    }

    static getLast() {
        return db.prepare('SELECT * FROM moods ORDER BY date DESC LIMIT 1').get();
    }

    static deleteById(id) {
        db.prepare('DELETE FROM moods WHERE id = ?').run(id);
    }

    static updateById(id, newData) {
        const { mood, description, rating, date } = newData;
        db.prepare(`
        UPDATE moods SET mood = ?, description = ?, rating = ?, date = ?
        WHERE id = ?
        `).run(mood, description, rating, date, id);
    }
}

module.exports = Entries;