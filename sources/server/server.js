const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const router = require('./router.js')
const path = require('path')

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public/styles/css'))
app.use(express.static('sources/client'))
app.use(express.static('resources'))

// строит путь до любой страницы
const globalPath = (page) => {
  return path.resolve(`${__dirname}/../../pages/${page}.html`)
}

// запуск сервера
function start() { 
  app.listen(port, err => {
      if (err) console.log(err)
      console.log(`Сервер запущен по адресу: http://localhost:${port}`)
  })
  router(app, globalPath)
}

start()
