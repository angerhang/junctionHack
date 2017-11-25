const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')

const processImage = require('./process_image')

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(null, `${raw.toString('hex')}${Date.now()}.${mime.extension(file.mimetype)}`)
    })
  },
  limits: { fileSize: 5 * 1000 * 1000 }
})
const upload = multer({ storage })

router.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html' });
  var form = '<form action="/annotate" enctype="multipart/form-data" method="post">upload image: <input multiple="multiple" name="imagedata" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  res.end(form);
})

router.post('/annotate', upload.single('imagedata'), function (req, res) {
  if (!req.file) {
    throw new Error('No image sent')
  }
  if (!/^image\/(jpe?g|png)$/i.test(req.file.mimetype)) {
    throw new Error('Supports only png/jpg formats.')
  }

  processImage.getObjectDesc(req.file.path)
    .then((desc) => {
      res.json(desc)
    })
    .catch((err) => {
      res.send(500, err)
    })
})

module.exports = router
