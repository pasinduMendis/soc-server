const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const PORT = 5000
const cors = require('cors')
const mongoose = require('mongoose')
const dataBase = require('./DBconfig.js')
const userRoutes = require('./routes/userRoutes')

mongoose.Promise = global.Promise
mongoose
  .connect(dataBase.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log('Database is successfully connected')
    },
    (err) => {
      console.log('cannont connect to the database' + err)
    }
  )

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())
app.use('/user', userRoutes)

app.listen(process.env.PORT||PORT, function () {
  console.log('saver is running')
})
