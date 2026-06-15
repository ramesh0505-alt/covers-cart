require('dotenv').config();
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
const PORT = process.env.PORT || 5000;

const env = Object.assign({}, process.env, {
  PORT: PORT,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://example.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'anon',
  JWT_SECRET: process.env.JWT_SECRET || 'test-secret',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'secret',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://key:secret@cloud_name',
});

const child = spawn('node', [serverFile], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let healthCheckStarted = false;

const cleanup = (exitCode = 1) => {
  clearTimeout(timeout);
  if (!child.killed) {
    child.kill('SIGTERM');
  }
  process.exit(exitCode);
};

child.stdout.on('data', (chunk) => process.stdout.write(chunk));
child.stderr.on('data', (chunk) => process.stderr.write(chunk));

child.on('error', (error) => {
  console.error('Failed to spawn backend process:', error.message || error);
  cleanup(1);
});

child.on('exit', (code, signal) => {
  if (healthCheckStarted) return;
  clearTimeout(timeout);
  console.error(`Backend process exited early with code ${code}${signal ? `, signal ${signal}` : ''}`);
  cleanup(1);
});

const timeout = setTimeout(() => {
  console.error('Deploy test timed out.');
  cleanup(1);
}, 15000);

const waitForHealth = () => {
  if (healthCheckStarted) return;
  healthCheckStarted = true;

  const options = {
    hostname: '127.0.0.1',
    port: PORT,
    path: '/health',
    method: 'GET',
    timeout: 10000,
  };

  const req = http.request(options, (res) => {
    clearTimeout(timeout);
    if (res.statusCode === 200) {
      console.log('Deploy test passed: /health reachable.');
      cleanup(0);
    } else {
      console.error(`Deploy test failed: status ${res.statusCode}`);
      cleanup(1);
    }
  });

  req.on('error', (err) => {
    console.error('Deploy test could not reach backend:', err.message);
    cleanup(1);
  });

  req.end();
};

child.stdout.on('data', (chunk) => {
  if (!healthCheckStarted && chunk.toString().includes('CoversCartOnline Backend server running on port')) {
    waitForHealth();
  }
});
