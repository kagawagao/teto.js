import Koa from 'koa'
import convert from 'koa-convert'
import webpack from 'webpack'
import webpackConfig from '../webpack'
import historyApiFallback from 'koa-connect-history-api-fallback'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import _debug from 'debug'
import mongodb from 'mongodb'
import config from '../config'
import dispatcher from './middleware/dispatcher'
import mockMiddleware from './middleware/webpack-mock'
import dispatcherConfig from '../.shouldnotpublic'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import authMiddleware from './middleware/auth'
import tokensMiddleware from './middleware/tokens'

const debug = _debug('app:server')
const paths = config.utils_paths
const app = new Koa()

const {mongodbURL} = dispatcherConfig
// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false
})))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output
  const connectDatabase = async (url) => {
    const MongoClient = mongodb.MongoClient
    const database = await MongoClient.connect(url)
    console.log(database)
    return database
  }
  // const database = new Promise((resolve, reject) => {
  //   const MongoClient = mongodb.MongoClient
  //   MongoClient.connect(mongodbURL, (err, db) => {
  //     if (err) {
  //       console.log('Unable to connect to the mongoDB server. Error:')
  //       console.dir(err)
  //       reject(err)
  //     } else {
  //       resolve(db)
  //     }
  //   })
  // })
  app.use(bodyParser())
  app.use(tokensMiddleware())
  app.use(authMiddleware(connectDatabase(mongodbURL)))
  app.use(dispatcher(dispatcherConfig))
  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))
  // Serve api mocks from ~/mocks
  app.use(mockMiddleware(paths.base('mocks'), {
    // match non dispatcher requests
    matcher: /^\/v\d+(\.\d+)+(?!\/dispatcher\/)/,
    // trim version in request path
    reducer: /^\/v\d+(\.\d+)\/+/
  }))
  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(convert(serve(paths.client('static'))))
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(convert(serve(paths.base(config.dir_dist))))
}

export default app
