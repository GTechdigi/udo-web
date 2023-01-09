const config = require('./vue.config.js')

const port = process.env.PORT || 80
const publicPath = config.publicPath

var connect = require('connect')
var serveStatic = require('serve-static')
const app = connect()

app.use(
  publicPath,
  serveStatic('./dist', {
    index: ['index.html', '/']
  })
)

app.listen(port, () => {
  console.log(`Serve runing at http://localhost:${port}${publicPath}`)
})
