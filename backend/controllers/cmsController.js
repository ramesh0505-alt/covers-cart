const fs = require('fs');
const path = require('path');
const db = require('../models/db');

const FALLBACK_PATH = path.join(__dirname, '../models/cms_fallback.json');
const UPLOADS_DIR = path.join(__dirname, '../../../frontend/public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to read fallback settings
const readFallbackSettings = () => {
  try {
    if (fs.existsSync(FALLBACK_PATH)) {
      const data = fs.readFileSync(FALLBACK_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading cms_fallback.json:", err);
  }
  return {};
};

// Helper to write fallback settings
const writeFallbackSettings = (settings) => {
  try {
    fs.writeFileSync(FALLBACK_PATH, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing cms_fallback.json:", err);
  }
};

exports.getCmsSettings = async (req, res) => {
  try {
    // Try to load from Prisma if prisma is initialized
    if (db.prisma) {
      const dbSettings = await db.prisma.cmsSetting.findMany();
      if (dbSettings && dbSettings.length > 0) {
        const settings = {};
        dbSettings.forEach(item => {
          try {
            settings[item.key] = JSON.parse(item.value);
          } catch (e) {
            settings[item.key] = item.value;
          }
        });
        return res.json(settings);
      }
    }
  } catch (err) {
    console.log("Prisma fetch failed, using fallback:", err.message);
  }

  // Fallback
  const fallback = readFallbackSettings();
  res.json(fallback);
};

exports.updateCmsSettings = async (req, res) => {
  const newSettings = req.body;
  
  // 1. Always write to fallback JSON file for reliability
  const currentFallback = readFallbackSettings();
  const mergedSettings = { ...currentFallback, ...newSettings };
  writeFallbackSettings(mergedSettings);

  // 2. Try to write to Prisma if initialized
  if (db.prisma) {
    try {
      for (const [key, val] of Object.entries(newSettings)) {
        const stringValue = typeof val === 'object' ? JSON.stringify(val) : String(val);
        await db.prisma.cmsSetting.upsert({
          where: { key },
          update: { value: stringValue },
          create: { key, value: stringValue }
        });
      }
    } catch (err) {
      console.error("Prisma write failed:", err.message);
    }
  }

  res.json({ success: true, settings: mergedSettings });
};

// HOMEPAGE BUILDER CONTROLLERS
exports.getHomepageSections = async (req, res) => {
  try {
    if (db.prisma) {
      const sections = await db.prisma.homepageSection.findMany({
        orderBy: { order: 'asc' }
      });
      return res.json(sections);
    }
  } catch (err) {
    console.log("Prisma fetch failed:", err.message);
  }
  res.json([]);
};

exports.updateHomepageSections = async (req, res) => {
  const { sections } = req.body;
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: "Sections must be an array" });
  }

  try {
    if (db.prisma) {
      // For simplicity in the builder, we wipe and recreate, or we can upsert
      await db.prisma.homepageSection.deleteMany({});
      
      const created = await Promise.all(
        sections.map((sec, i) => db.prisma.homepageSection.create({
          data: {
            type: sec.type,
            order: i,
            active: sec.active !== false,
            config: typeof sec.config === 'object' ? JSON.stringify(sec.config) : sec.config
          }
        }))
      );
      return res.json({ success: true, sections: created });
    }
    res.json({ success: true, message: "Fallback environment: changes not persisted" });
  } catch (err) {
    console.error("Failed to update homepage sections:", err.message);
    res.status(500).json({ error: err.message });
  }
};

