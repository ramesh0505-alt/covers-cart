const fs = require('fs');
const path = require('path');

const prismaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');
const frontendPagesDir = path.join(__dirname, '..', 'frontend', 'src', 'pages');
const adminPagesDir = path.join(__dirname, '..', 'admin', 'src', 'pages');
const adminComponentsDir = path.join(__dirname, '..', 'admin', 'src', 'components', 'admin');

function getModels() {
  const content = fs.readFileSync(prismaPath, 'utf8');
  const regex = /model\s+([A-Za-z0-9_]+)\s+{/g;
  let match;
  const models = [];
  while ((match = regex.exec(content)) !== null) {
    models.push(match[1]);
  }
  return models;
}

function getControllers() {
  const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
  const controllers = {};
  for (const file of files) {
    const content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
    controllers[file] = content;
  }
  return controllers;
}

function getRoutes() {
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  const routes = {};
  for (const file of files) {
    const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
    routes[file] = content;
  }
  return routes;
}

function getFrontendFiles() {
  const getFiles = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(filePath));
      } else if (file.endsWith('.jsx')) {
        results.push(filePath);
      }
    });
    return results;
  };
  return [...getFiles(frontendPagesDir), ...getFiles(adminPagesDir), ...getFiles(adminComponentsDir)];
}

function runAudit() {
  const models = getModels();
  const controllers = getControllers();
  const routes = getRoutes();
  const frontendFiles = getFrontendFiles();

  const report = [];
  report.push("# FULL DATABASE COMPLETENESS AUDIT\n");

  let modelsWithControllers = 0;
  let controllersWithRoutes = 0;
  let routesConsumed = 0;

  let totalExpectedControllers = models.length;
  let totalControllers = Object.keys(controllers).length;

  const matrix = [];

  for (const model of models) {
    // 1. Find if a controller uses this model (prisma.modelName)
    const lowerModel = model.charAt(0).toLowerCase() + model.slice(1);
    let matchedController = null;
    for (const [cName, cContent] of Object.entries(controllers)) {
      if (cContent.includes(`prisma.${lowerModel}`)) {
        matchedController = cName;
        break;
      }
    }

    if (matchedController) modelsWithControllers++;

    // 2. Find if a route uses this controller
    let matchedRoute = null;
    if (matchedController) {
      const reqName = matchedController.replace('.js', '');
      for (const [rName, rContent] of Object.entries(routes)) {
        if (rContent.includes(reqName) || rContent.includes(reqName.replace('Controller', ''))) {
          matchedRoute = rName;
          break;
        }
      }
      if (matchedRoute) controllersWithRoutes++;
    }

    // 3. Find if frontend uses this route
    let matchedFrontend = [];
    if (matchedRoute) {
      const routeBase = matchedRoute.replace('.js', '');
      for (const fPath of frontendFiles) {
        const content = fs.readFileSync(fPath, 'utf8');
        // Simple heuristic: if it hits the endpoint or imports something related
        if (content.includes(`/${routeBase}`) || content.includes(`/${lowerModel}`) || content.includes(routeBase)) {
          matchedFrontend.push(path.basename(fPath));
        }
      }
      if (matchedFrontend.length > 0) routesConsumed++;
    }

    let status = "FAIL";
    if (matchedController && matchedRoute && matchedFrontend.length > 0) {
      status = "PASS";
    } else if (matchedController || matchedRoute) {
      status = "PARTIAL";
    }

    matrix.push({
      model,
      controller: matchedController || 'MISSING',
      route: matchedRoute || 'MISSING',
      frontend: matchedFrontend.length > 0 ? [...new Set(matchedFrontend)].join(', ') : 'MISSING',
      status
    });
  }

  report.push("## INTEGRATION MATRIX\n");
  report.push("| Screen(s) | API Route | Controller | Database Table | Status |");
  report.push("| --- | --- | --- | --- | --- |");

  for (const row of matrix) {
    let statusIcon = "❌ FAIL";
    if (row.status === "PASS") statusIcon = "✅ PASS";
    if (row.status === "PARTIAL") statusIcon = "⚠️ PARTIAL";
    report.push(`| ${row.frontend} | ${row.route} | ${row.controller} | **${row.model}** | ${statusIcon} |`);
  }

  report.push("\n## SUMMARY METRICS\n");
  const dbCompletion = ((modelsWithControllers / models.length) * 100).toFixed(1);
  const beCompletion = modelsWithControllers > 0 ? ((controllersWithRoutes / modelsWithControllers) * 100).toFixed(1) : 0;
  const feIntegration = controllersWithRoutes > 0 ? ((routesConsumed / controllersWithRoutes) * 100).toFixed(1) : 0;
  
  // Production Readiness is an aggregate of the above
  const prodReadiness = (((modelsWithControllers / models.length) + (controllersWithRoutes / models.length) + (routesConsumed / models.length)) / 3 * 100).toFixed(1);

  report.push(`- **Database Completion %**: ${dbCompletion}% (${modelsWithControllers}/${models.length} tables have controllers)`);
  report.push(`- **Backend Completion %**: ${beCompletion}% (${controllersWithRoutes}/${modelsWithControllers} controllers have routes)`);
  report.push(`- **Frontend Integration %**: ${feIntegration}% (${routesConsumed}/${controllersWithRoutes} APIs consumed by UI)`);
  report.push(`- **Production Readiness %**: ${prodReadiness}%\n`);

  report.push("\n## ISSUES IDENTIFIED\n");

  const missingControllers = matrix.filter(m => m.controller === 'MISSING').map(m => m.model);
  const missingRoutes = matrix.filter(m => m.controller !== 'MISSING' && m.route === 'MISSING').map(m => m.controller);
  const missingUI = matrix.filter(m => m.route !== 'MISSING' && m.frontend === 'MISSING').map(m => m.route);

  if (missingControllers.length > 0) {
    report.push("### Missing Controllers (Database tables with no backend logic)");
    missingControllers.forEach(m => report.push(`- ${m}`));
  }

  if (missingRoutes.length > 0) {
    report.push("\n### Missing APIs (Controllers with no HTTP routes)");
    missingRoutes.forEach(m => report.push(`- ${m}`));
  }

  if (missingUI.length > 0) {
    report.push("\n### Unconnected UIs (APIs with no frontend consumer)");
    missingUI.forEach(m => report.push(`- ${m} (No UI makes fetch/axios calls to this route)`));
  }

  const outPath = path.join(__dirname, '..', 'database_audit_report.md');
  fs.writeFileSync(outPath, report.join('\n'));
  console.log("Audit complete. Report generated at " + outPath);
}

runAudit();
