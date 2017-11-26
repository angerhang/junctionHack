const express = require('express')
const errorHandler = require('errorhandler')
const cors = require('cors')

const router = require('./lib/router')

const app = express()
app.use(cors())
app.options('*', cors())

app.use('/public', express.static('public'))

app.use('/', router);
app.use(errorHandler());

const port = process.env.PORT || 3000
app.listen(port, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:' + port)
})
