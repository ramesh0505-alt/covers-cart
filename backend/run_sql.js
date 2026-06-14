const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:ramesh%4012%4000%40@db.merfmjvjghrvniqcxhgs.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");

    const sql = fs.readFileSync('init_utf8.sql', 'utf8').replace(/^\uFEFF/, '');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.includes('CREATE TYPE'));
    for (const stmt of statements) {
      console.log('Executing:', stmt.substring(0, 50));
      await client.query(stmt);
    }
    console.log("Executed init_utf8.sql successfully.");
  } catch (err) {
    console.error("Error executing SQL:", err.message);
  } finally {
    await client.end();
  }
}

run();
