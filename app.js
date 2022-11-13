const express = require('express')
const cors = require('cors')
const {
  saveRecommendations,
  getSavedRecommendations,
} = require('./helperFunctions')
const generateRecommendations = require('./utilities/generateRecommendations.js')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())

// The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
// Use getSavedRecommendations(userId) to see if the user already have saved recommendation available. If it is the case, return saved recommendation. It not, get recommendation using the steps above and use saveRecommendations(userId, recommendation) to save the user's recommendation.
app.get('/recommendations', async (req, response) => {
  // The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
  // TODO: do the middleware thing later
  const userId = '9aaec1fc-ea13-4783-81f8-a998c1e0d648'

  const recommendations = await generateRecommendations(userId)

  response.json(recommendations)
})

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
