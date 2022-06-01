import 'reflect-metadata'
import TypeOrmDatabase from './data'
import app from './app'

TypeOrmDatabase.connect()
  .then(() => {
    console.log('Connected with the database')
    app.listen()
      .then(({ url }) => { console.log(`🚀  Server ready at ${url}`) })
      .catch(err => { console.log('❌ Failed to start server', err) })
  })
  .catch(err => { console.log('❌ Failed to connect with the database', err) })
