const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mods (
      id UUID DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      type TEXT CHECK (type IN ('css', 'js', 'html')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

module.exports = async function handler(req, res) {
  try {
    await ensureTable();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM mods ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, description, author, type, content } = req.body;
      if (!name || !author || !type || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await pool.query(
        'INSERT INTO mods (name, description, author, type, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, author, type, content]
      );
      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Mods error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
