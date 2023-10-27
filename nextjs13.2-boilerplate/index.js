/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const next = require('next')
// const configs = require('@ggj/configs')
// const Proxy = require('./proxy')
/* eslint-enable @typescript-eslint/no-var-requires */

const hostname = 'localhost'
const port = 8921
const dev = process.env.ENV === 'local'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handlerError(error, req, res, next) {
  await app.render404(req, res)
}

app.prepare().then(async() => {
  const server = express()
  // const serviceConfigs = await configs.getConfigs()
  // configs.setEnvVariables(serviceConfigs)
  server.get('/health', (_, res) => res.sendStatus(200))
  // new Proxy(server)
  server.all('*', handle)
  server.use(handlerError)

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> GUI Ready on http://${hostname}:${port}`)
  })
})
