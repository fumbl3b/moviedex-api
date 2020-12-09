require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movieDex = require('../movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.get('/movie', function handleGetMovie(req, res) {
  let response = movieDex;
  const { genre, country, avg_vote } = req.query;

  if (genre) {
    response = response.filter(item => item.genre.toLowerCase().includes(genre.toLowerCase()))
  } 
  if (country) {
    response = response.filter(item => item.country.toLowerCase().includes(country.toLowerCase()))
  }
  if (avg_vote) {
    response = response.filter(item => Number(item.avg_vote) >= Number(avg_vote))
  }

  res.json(response)
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
