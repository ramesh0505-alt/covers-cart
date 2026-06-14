const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const db = require('../models/db');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const BUCKET_NAME = 'media';

exports.getMediaFiles = async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  try {
    if (db.prisma) {
      const media = await db.prisma.mediaLibrary.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(media);
    }
    
    // Fallback: list from bucket directly if DB is unavailable
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadMediaFile = async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  try {
    const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false
    });

    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    
    let dbRecord = null;
    if (db.prisma) {
      dbRecord = await db.prisma.mediaLibrary.create({
        data: {
          filename: fileName,
          url: urlData.publicUrl,
          size: req.file.size || 0,
          mimeType: req.file.mimetype
        }
      });
    }

    res.status(201).json({ success: true, url: urlData.publicUrl, fileName, dbRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMediaFile = async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  const { fileName } = req.body;
  if (!fileName) return res.status(400).json({ error: "fileName required" });

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    if (error) throw error;
    
    if (db.prisma) {
      // Find matching record by filename since we don't always pass the db ID
      const record = await db.prisma.mediaLibrary.findFirst({
        where: { filename: fileName }
      });
      if (record) {
        await db.prisma.mediaLibrary.delete({ where: { id: record.id } });
      }
    }

    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
