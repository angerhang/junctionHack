const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const errorHandler = require('errorhandler')

const gVision = require('./lib/g_vision')

const app = express()
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
  if (!/^image\/(jpe?g|png|gif)$/i.test(req.file.mimetype) && !/^application\/(pdf)$/i.test(req.file.mimetype)) {
    throw new Error('Supports only image and pdf formats.')
  }

  gVision.getAnnotations(req.file.path)
    .then(annotations => {
      res.json(annotations)
    })
    .catch((err) => {
      res.send(500, err)
    })
})


app.use('/', router);
app.use(errorHandler());

const port = process.env.PORT || 3000
app.listen(port, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:' + port)
})
