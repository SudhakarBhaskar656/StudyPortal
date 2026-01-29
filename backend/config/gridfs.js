const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

let gfs;
let bucket;

const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    const filename = `${Date.now()}-${file.originalname}`;
    return {
      bucketName: 'coursesImages',
      filename: filename,
      metadata: {
        uploadedAt: new Date(),
        uploadedBy: req.user?.id || 'anonymous'
      }
    };
  }
});

const initGridFS = (connection) => {
  gfs = new (require('gridfs-stream'))(connection.db, mongoose.mongo);
  bucket = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: 'coursesImages' });
};

module.exports = { storage, initGridFS, getGFS: () => gfs, getBucket: () => bucket };
