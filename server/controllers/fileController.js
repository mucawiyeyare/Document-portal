const File = require('../models/File');
const path = require('path');
const fs = require('fs');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, mimetype, size } = req.file;

    const newFile = await File.create({
      originalName: originalname,
      fileName: filename,
      fileType: mimetype,
      filePath: filePath,
      uploadedBy: req.user._id,
      size: size
    });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 }).populate('uploadedBy', 'name email');
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const viewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.resolve(file.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File physically missing' });
    }

    // Set headers to prevent download and force inline viewing
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.fileType);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physically
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await file.deleteOne();
    res.json({ message: 'File removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadFile, getFiles, viewFile, deleteFile };
