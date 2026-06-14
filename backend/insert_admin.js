const { Client } = require('pg');
const crypto = require('crypto');

const dbUrl = "postgresql://postgres:ramesh%4012%4000%40@db.merfmjvjghrvniqcxhgs.supabase.co:5432/postgres";

async function createAdmin() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    const email = 'admin@coverscart.com';
    const password = 'Password123'; // We'll rely on Supabase to let us login, wait no we are inserting it manually!

    // In Supabase, the password is crypted using pgcrypto. 
    // We can just execute the SQL function!
    let userId;
    const existRes = await client.query("SELECT id FROM auth.users WHERE email = $1", [email]);
    if (existRes.rows.length > 0) {
      userId = existRes.rows[0].id;
      const updateQuery = `
        UPDATE auth.users 
        SET encrypted_password = crypt($1, gen_salt('bf')), email_confirmed_at = now()
        WHERE id = $2
      `;
      await client.query(updateQuery, [password, userId]);
      console.log("Admin user updated in auth.users! ID:", userId);
    } else {
      const query = `
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1,
          crypt($2, gen_salt('bf')),
          now(),
          now(),
          now(),
          '{"provider":"email","providers":["email"]}',
          '{"name":"Admin User"}',
          now(),
          now(),
          '',
          '',
          '',
          ''
        ) RETURNING id;
      `;
      const res = await client.query(query, [email, password]);
      userId = res.rows[0].id;
      console.log("Admin user created in auth.users! ID:", userId);
    }
    const publicUserQuery = `
      INSERT INTO public."User" (id, email, password, role, "updatedAt")
      VALUES ($1, $2, $3, 'ADMIN', now())
      ON CONFLICT (id) DO NOTHING;
    `;
    await client.query(publicUserQuery, [userId, email, password]);
    console.log("Admin inserted into public.User table.");

  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    await client.end();
  }
}

createAdmin();
