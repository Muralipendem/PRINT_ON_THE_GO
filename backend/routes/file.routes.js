import express from 'express';
import File from '../models/File.js'; // Ensure the File model exists

const router = express.Router();

// Route to save file metadata sent from the frontend
router.post('/upload', async (req, res) => {
  const fileData = req.body; // Array of file metadata

  if (!Array.isArray(fileData) || fileData.length === 0) {
    return res.status(400).json({ error: 'Invalid file data' });
  }

  try {
    // Insert the file metadata into the database
    const savedFiles = await File.insertMany(fileData);
    res.status(200).json(savedFiles);
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ error: 'Error saving file metadata' });
  }
});

// Route to get all file metadata
router.get('/', async (req, res) => {
  try {
    const files = await File.find().select('file_url paper_size copies');
    res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ error: 'Error retrieving files' });
  }
});

export default router;
