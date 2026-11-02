const db = require('../../config/db');

const userDao = {
  async insert({ name, email, password }) {
    // <-- Added password here
    const query = `
      INSERT INTO users (name, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, name, email, created_at;
    `;
    const { rows } = await db.query(query, [name, email, password]); // <-- Added password to parameters
    return rows[0];
  },

  async findById(id) {
    const query = `SELECT id, name, email, created_at FROM users WHERE id = $1;`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async update(id, { name, email }) {
    const query = `
      UPDATE users 
      SET name = COALESCE($1, name), email = COALESCE($2, email)
      WHERE id = $3
      RETURNING id, name, email, created_at;
    `;
    const { rows } = await db.query(query, [name, email, id]);
    return rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id;`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = userDao;
