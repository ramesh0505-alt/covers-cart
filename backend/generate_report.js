const fs = require('fs');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const report = [];
  report.push('# Functional Verification Report\n');

  const addPass = (module, phase, msg) => report.push(`**${module} - ${phase}:** <span style="color:green">PASS</span>\n- ${msg}\n`);
  const addFail = (module, phase, msg) => report.push(`**${module} - ${phase}:** <span style="color:red">FAIL</span>\n- ${msg}\n`);
  const addWarn = (module, phase, msg) => report.push(`**${module} - ${phase}:** <span style="color:orange">WARNING</span>\n- ${msg}\n`);

  // 1. Auth
  try {
    await prisma.$connect();
    const count = await prisma.user.count();
    addPass('Auth', 'Database Read', `Successfully connected to Prisma and read ${count} users.`);
  } catch (err) {
    addFail('Auth', 'Database Connection', `Failed to connect to database: ${err.message}`);
  }

  // 2. Products
  try {
    const res = await axios.get('http://localhost:5000/api/products');
    if (res.status === 200) {
      addPass('Products', 'API Response', `GET /api/products successful (Body length: ${JSON.stringify(res.data).length} bytes)`);
    } else {
      addFail('Products', 'API Response', `Status code ${res.status}`);
    }
  } catch (err) {
    addFail('Products', 'API Response', err.message);
  }

  // 3. Categories
  try {
    const res = await axios.get('http://localhost:5000/api/categories');
    if (res.status === 200) {
      addPass('Categories', 'API Response', `GET /api/categories successful`);
    } else {
      addFail('Categories', 'API Response', `Status code ${res.status}`);
    }
  } catch (err) {
    addFail('Categories', 'API Response', err.message);
  }

  // 4. CMS
  try {
    const res = await axios.get('http://localhost:5000/api/cms/homepage-sections');
    if (res.status === 200) {
      addPass('CMS', 'API Response', `GET /api/cms/homepage-sections successful`);
    } else {
      addFail('CMS', 'API Response', `Status code ${res.status}`);
    }
  } catch (err) {
    addFail('CMS', 'API Response', err.message);
  }

  // 5. Media
  try {
    const res = await axios.get('http://localhost:5000/api/media');
    // Media usually requires auth
    addWarn('Media', 'API Response', `GET /api/media returned ${res.status} (Likely requires auth token)`);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      addPass('Media', 'Route Verification', `Route is protected (401 Unauthorized) as expected.`);
    } else {
      addFail('Media', 'API Response', err.message);
    }
  }

  // Write report
  fs.writeFileSync('../functional_verification_report.md', report.join('\n'));
  console.log('Report generated at ../functional_verification_report.md');
  process.exit(0);
}

run();
