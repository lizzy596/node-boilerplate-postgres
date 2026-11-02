const db = require('../../config/db');
const { toJSON } = require('./plugins');

class TokenDao {
  /**
   * Create a new token record
   */
  async create(tokenData) {
    const query = `
      INSERT INTO tokens (token, user_id, type, expires, blacklisted)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, token, user_id AS "user", type, expires, blacklisted, created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const values = [
      tokenData.token,
      tokenData.user, // maps to user_id foreign key
      tokenData.type,
      tokenData.expires,
      tokenData.blacklisted || false,
    ];

    const { rows } = await db.query(query, values);
    return toJSON(rows[0]);
  }

  /**
   * Find a single token matching filter criteria
   */
  async findOne(filter) {
    const keys = Object.keys(filter);
    if (keys.length === 0) return null;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    keys.forEach((key) => {
      const dbCol = key === 'user' ? 'user_id' : key;
      conditions.push(`${dbCol} = $${paramIndex}`);
      values.push(filter[key]);
      paramIndex++;
    });

    const query = `
      SELECT id, token, user_id AS "user", type, expires, blacklisted, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM tokens
      WHERE ${conditions.join(' AND ')}
      LIMIT 1;
    `;

    const { rows } = await db.query(query, values);
    return rows[0] ? toJSON(rows[0]) : null;
  }

  /**
   * Delete tokens matching filter criteria
   */
  async deleteMany(filter) {
    const keys = Object.keys(filter);
    if (keys.length === 0) return 0;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    keys.forEach((key) => {
      const dbCol = key === 'user' ? 'user_id' : key;
      conditions.push(`${dbCol} = $${paramIndex}`);
      values.push(filter[key]);
      paramIndex++;
    });

    const query = `DELETE FROM tokens WHERE ${conditions.join(' AND ')}`;
    const result = await db.query(query, values);
    return result.rowCount;
  }

  /**
   * Find a token by its ID
   */
  async findById(id) {
    const query = `
      SELECT id, token, user_id AS "user", type, expires, blacklisted, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM tokens
      WHERE id = $1
      LIMIT 1;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] ? toJSON(rows[0]) : null;
  }

  /**
   * Delete a token by its ID
   */
  async deleteById(id) {
    const query = 'DELETE FROM tokens WHERE id = $1 RETURNING id;';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = new TokenDao();
