import * as express from 'express'
const cors = require('cors')

const app = express()

app.use(cors())
app.options('*', cors())
app.post('/', (request, response) => {
  response.status(200)
  response.send(JSON.stringify({
    url: 'https://camo.mybb.com/e01de90be6012adc1b1701dba899491a9348ae79/687474703a2f2f7777772e6a71756572797363726970742e6e65742f696d616765732f53696d706c6573742d526573706f6e736976652d6a51756572792d496d6167652d4c69676874626f782d506c7567696e2d73696d706c652d6c69676874626f782e6a7067',
    title: 'hi'
  }))
})

app.get('/', (request, response) => {
  response.status(200)
  response.send(JSON.stringify({
    url: 'https://camo.mybb.com/e01de90be6012adc1b1701dba899491a9348ae79/687474703a2f2f7777772e6a71756572797363726970742e6e65742f696d616765732f53696d706c6573742d526573706f6e736976652d6a51756572792d496d6167652d4c69676874626f782d506c7567696e2d73696d706c652d6c69676874626f782e6a7067',
    title: 'hi'
  }))
})



app.listen(3214, '0.0.0.0', () => {
  console.log(`pubapi-1 now listening on 3214!`)
})