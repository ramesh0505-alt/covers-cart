const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const BUCKET_NAME = 'media';

exports.getMediaFiles = async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  try {
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
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false
    });

    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    res.status(201).json({ success: true, url: urlData.publicUrl, fileName });
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
    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
