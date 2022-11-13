const path = require('path')
const express = require('express')
const cors = require('cors')
const {
  saveRecommendations,
  getSavedRecommendations,
} = require('./helperFunctions')
const generateRecommendations = require('./utilities/generateRecommendations.js')
const verifyToken = require('./utilities/verifyToken')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())
app.use(verifyToken)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

// The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
// Use getSavedRecommendations(userId) to see if the user already have saved recommendation available. If it is the case, return saved recommendation. It not, get recommendation using the steps above and use saveRecommendations(userId, recommendation) to save the user's recommendation.
app.get('/recommendations', async (req, response) => {
  // The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
  // TODO: do the middleware thing later
  const userId = req.token

  // Use getSavedRecommendations(userId) to see if the user already have saved recommendation available.
  const savedRecommendations = await getSavedRecommendations(userId)

  // If it is the case, return saved recommendation.
  if (savedRecommendations) {
    return response.json({
      fromCache: true,
      ...savedRecommendations
    })
  }

  // It not, get recommendation using the steps above and use saveRecommendations(userId, recommendation) to save the user's recommendation.
  const newRecommendations = await generateRecommendations(userId)

  response.json({
    fromCache: false,
    ...newRecommendations
  })

  saveRecommendations(userId, newRecommendations)
})

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
