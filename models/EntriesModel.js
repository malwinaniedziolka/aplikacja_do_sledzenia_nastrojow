const { randomUUID } = require('crypto');
const { Pool } = require('pg');
require('dotenv').config();

//polaczenie do posgresql
const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

//tworzenie tab jesli nie isnieje
async function createDB() {
	await pool.query(`CREATE TABLE IF NOT EXISTS moods (
        id VARCHAR PRIMARY KEY,
        mood TEXT NOT NULL,
        description TEXT,
        rating INTEGER NOT NULL,
        date TEXT NOT NULL);
    `);
}
createDB();

class Entries {
	constructor(mood, description, rating, date) {
		this.id = randomUUID(); //daje randomowe id
		this.mood = mood;
		this.description = description;
		this.rating = rating;
		this.date = date;
	}

	static async getAll() {
		const result = await pool.query('SELECT * FROM moods ORDER BY date DESC');
		return result.rows;
	}

	static async add({ mood, description, rating, date }) {
		await pool.query(
			'INSERT INTO moods (id, mood, description, rating, date) VALUES ($1, $2, $3, $4, $5)',
			[randomUUID(), mood, description, rating, date]
		);
	}

	static async getLast() {
		const result = await pool.query(
			'SELECT * FROM moods ORDER BY date DESC LIMIT 1'
		);
		return result.rows[0];
	}

	static async deleteById(id) {
		await pool.query('DELETE FROM moods WHERE id = $1', [id]);
	}

	static async updateById(id, newData) {
		const { mood, description, rating, date } = newData;
		await pool.query(
			`
        UPDATE moods SET mood = $1, description = $2, rating = $3, date = $4
        WHERE id = $5
        `,
			[mood, description, rating, date, id]
		);
	}
}

module.exports = Entries;
