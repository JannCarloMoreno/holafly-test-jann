const createServer = require('./server')

const app = require('./app')

async function start () {
  const server = await createServer(app)

  const port = process.env.PORT || 4567
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port: ${port}`)
  })
}

start()
