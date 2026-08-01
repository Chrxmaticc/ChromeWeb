// /api/mods.js
const https = require('https');

const NEON_API_KEY = process.env.NEON_API_KEY;
const NEON_PROJECT_ID = process.env.NEON_PROJECT_ID;

function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql, params });
    const options = {
      hostname: `${NEON_PROJECT_ID}.neon.tech`,
      path: '/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // Ensure the mods table exists
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS mods (
      id UUID DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      type TEXT CHECK (type IN ('css', 'js', 'html')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `).catch(console.error);

  if (req.method === 'GET') {
    const result = await executeQuery('SELECT * FROM mods ORDER BY created_at DESC');
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const { name, description, author, type, content } = req.body;
    if (!name || !author || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await executeQuery(
      'INSERT INTO mods (name, description, author, type, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, author, type, content]
    );
    return res.status(201).json(result.rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
