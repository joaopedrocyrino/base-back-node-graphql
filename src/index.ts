import 'reflect-metadata'
import Data from './data'
import app from './app'

Data.init()

app.listen()
  .then(({ url }) => { console.log(`🚀  Server ready at ${url}`) })
  .catch(err => { console.log('❌ Failed to start server', err) })
