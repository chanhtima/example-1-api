const db = require('../config/db'); // Import PostgreSQL connection

const getList = async (page = 1, limit = 100, NE_name) => {
  try {
    let query = 'SELECT * FROM books WHERE TRUE';
    let params = [];

    if (NE_name) {
      query += ' AND name ILIKE $1'; // Case-insensitive search
      params.push(`%${NE_name}%`);
    }

    const totalCountResult = await db.one('SELECT COUNT(*) FROM books WHERE TRUE' + (NE_name ? ' AND name ILIKE $1' : ''), params);
    const total = parseInt(totalCountResult.count);

    const pages = Math.ceil(total / limit);

    const newsList = await db.any(query + ' ORDER BY updated_at DESC LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);

    return {
      success: true,
      page: pages,
      limit: limit,
      total: total,
      newsData: newsList,
    };
  } catch (error) {
    throw new Error('Failed to get Books: ' + error.message);
  }
};

module.exports = { getList };
