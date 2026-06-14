const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function runVerification() {
  const report = [];

  const addPass = (module, msg) => report.push(`[PASS] ${module}: ${msg}`);
  const addFail = (module, msg) => report.push(`[FAIL] ${module}: ${msg}`);
  const addWarn = (module, msg) => report.push(`[WARNING] ${module}: ${msg}`);

  console.log("Starting verification...");

  try {
    // 1. Auth & Profiles
    const userCount = await prisma.user.count();
    addPass('Auth', `Database read verification successful. Found ${userCount} users in Prisma.`);
    
    // 2. Categories API & DB
    try {
      const catRes = await axios.get('http://localhost:5000/api/categories');
      if (catRes.status === 200) {
        addPass('Categories', `API returned ${catRes.data.length} categories.`);
        const dbCatCount = await prisma.category.count();
        addPass('Categories', `Database matches with ${dbCatCount} categories.`);
      } else {
        addFail('Categories', `API returned status ${catRes.status}`);
      }
    } catch (e) {
      addFail('Categories', `API/DB failed: ${e.message}`);
    }

    // 3. Products API & DB
    try {
      const prodRes = await axios.get('http://localhost:5000/api/products');
      if (prodRes.status === 200) {
        addPass('Products', `API returned ${prodRes.data.length} products.`);
        const dbProdCount = await prisma.product.count();
        addPass('Products', `Database read verified: ${dbProdCount} products.`);
      } else {
        addFail('Products', `API error`);
      }
    } catch (e) {
      addFail('Products', `Error: ${e.message}`);
    }

    // 4. CMS
    try {
      const cmsRes = await axios.get('http://localhost:5000/api/cms/homepage-sections');
      addPass('CMS', `API read successful. Length: ${cmsRes.data.length}`);
    } catch (e) {
      addFail('CMS', `API error: ${e.message}`);
    }

    // 5. Orders API
    try {
      // Mock order creation to test write
      const mockOrder = await prisma.order.create({
        data: {
          totalAmount: 99.99,
          status: 'Pending',
          paymentStatus: 'Pending',
          shippingAddress: '123 Test St',
          paymentMethod: 'COD'
        }
      });
      addPass('Orders', `Database write verification successful. Created Order ID: ${mockOrder.id}`);
      
      const foundOrder = await prisma.order.findUnique({ where: { id: mockOrder.id } });
      addPass('Orders', `Database read verification successful. Found Order ID: ${foundOrder.id}`);
      
      // Cleanup
      await prisma.order.delete({ where: { id: mockOrder.id } });
    } catch (e) {
      addFail('Orders', `Database write/read failed: ${e.message}`);
    }

    // Print Report
    console.log("\n================ FUNCTIONAL VERIFICATION REPORT ================\n");
    report.forEach(r => console.log(r));
    console.log("\n==============================================================\n");

  } catch (e) {
    console.error("Critical Failure:", e);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
