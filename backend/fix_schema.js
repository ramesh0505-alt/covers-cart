const fs = require('fs');
const lines = fs.readFileSync('prisma/schema.prisma', 'utf8').split('\n');

let insideModelOrEnum = false;
let hasSchema = false;
let modifiedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^(model|enum)\s+\w+\s*\{/)) {
    insideModelOrEnum = true;
    hasSchema = false;
  }
  
  if (insideModelOrEnum && line.includes('@@schema')) {
    hasSchema = true;
  }
  
  if (insideModelOrEnum && line.trim() === '}') {
    if (!hasSchema) {
      modifiedLines.push('  @@schema("public")');
    }
    insideModelOrEnum = false;
  }
  
  modifiedLines.push(line);
}

fs.writeFileSync('prisma/schema.prisma', modifiedLines.join('\n'));
console.log("Fixed schema.prisma successfully");
