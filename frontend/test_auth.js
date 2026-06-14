import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manual simple dotenv parser
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length > 0) {
    env[key.trim()] = rest.join('=').trim();
  }
});

const SUPABASE_URL = env['VITE_SUPABASE_URL'] || 'https://merfmjvjghrvniqcxhgs.supabase.co';
const SUPABASE_ANON_KEY = env['VITE_SUPABASE_ANON_KEY'] || 'dummy';

console.log('Testing against URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runAuthTests() {
  const report = [];
  const testEmail = `tester${Math.floor(Math.random() * 1000)}@gmail.com`; // Changed to gmail.com since some projects block 'example.com'
  const testPassword = 'Password123!@#';

  console.log(`--- STARTING AUTH TESTING (${testEmail}) ---`);

  // 1. Signup
  let signupSuccess = false;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    if (error) {
      report.push(`Signup result: FAIL - ${error.message}`);
    } else {
      report.push(`Signup result: PASS - User created with ID ${data.user?.id}`);
      signupSuccess = true;
    }
  } catch (err) {
    report.push(`Signup result: FAIL - Exception: ${err.message}`);
  }

  // 2. Login
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error) {
      report.push(`Login result: FAIL - ${error.message}`);
    } else {
      report.push(`Login result: PASS - Session created for ${data.user?.email}`);
    }
  } catch (err) {
    report.push(`Login result: FAIL - Exception: ${err.message}`);
  }

  // 3. Session Restore
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      report.push(`Session restore result: FAIL - ${error.message}`);
    } else if (data.session) {
      report.push(`Session restore result: PASS - Restored session for ${data.session.user.email}`);
    } else {
      report.push(`Session restore result: FAIL - No active session found.`);
    }
  } catch (err) {
    report.push(`Session restore result: FAIL - Exception: ${err.message}`);
  }

  // 4. Logout
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      report.push(`Logout result: FAIL - ${error.message}`);
    } else {
      report.push(`Logout result: PASS - Session destroyed successfully.`);
    }
  } catch (err) {
    report.push(`Logout result: FAIL - Exception: ${err.message}`);
  }

  console.log('\n--- DELIVERABLE REPORT ---');
  report.forEach(r => console.log(r));
  process.exit(0);
}

runAuthTests();
