const express = require('express')
const cors = require('cors')
const {
  getRatedMovies,
  getRecommendationByDirector,
  getRecommendationByGenre,
  saveRecommendations,
  getSavedRecommendations,
} = require('./helperFunctions')
const mostOccuringElements = require('./utilities/mostOccuringElements.js')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())

// The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
// First you should get a list of movies a user has rated, ratedMovies. Using getRatedMovies(userId)
// Figure out what is the name of a user's favorite director, favDirector. By counting the most popular director in ratedMovies list that have userRating larger or equal to 7 (1~10 scale)
// Figure out what is a user's favorite genre, favGenre. By counting the most popular genre in ratedMovies list that have userRating larger or equal to 7 (1~10 scale)
// Use favDirector to get a list of recommended movies made by this director (byDirector)
// Use favGenre to get a list of recommended movies in the genre (byGenre)
// Filter out movies in byDirector and byGenre that's already in the user's ratedMovies. (Because that means the user already watched it)
// Use getSavedRecommendations(userId) to see if the user already have saved recommendation available. If it is the case, return saved recommendation. It not, get recommendation using the steps above and use saveRecommendations(userId, recommendation) to save the user's recommendation.
app.get('/recommendations', async (req, response) => {
  // The route should have a middleware where it uses the user's Bearer Token to get the user's userId (which you will hard code to 9aaec1fc-ea13-4783-81f8-a998c1e0d648)
  // TODO: do the middleware thing later
  const userId = '9aaec1fc-ea13-4783-81f8-a998c1e0d648'

  // First you should get a list of movies a user has rated, ratedMovies. Using getRatedMovies(userId)
  const ratedMovies = await getRatedMovies(userId)
  const favoriteMovies = ratedMovies.filter(ratedMovie => 7 <= ratedMovie.userRating)
  // Figure out what is the name of a user's favorite director, favDirector. By counting the most popular director in ratedMovies list that have userRating larger or equal to 7 (1~10 scale)
  const favDirector = mostOccuringElements(favoriteMovies.map(movie => movie.director))[0]
  // Figure out what is a user's favorite genre, favGenre. By counting the most popular genre in ratedMovies list that have userRating larger or equal to 7 (1~10 scale)
  const favGenre = mostOccuringElements(favoriteMovies.map(movie => movie.genres).flat())[0]

  const [ recommendationsByDirector, recommendationsByGenre ] = await Promise.all([
    // Use favDirector to get a list of recommended movies made by this director (byDirector)
    getRecommendationByDirector(favDirector),
    // Use favGenre to get a list of recommended movies in the genre (byGenre)
    getRecommendationByGenre(favGenre)
  ])

  // Filter out movies in byDirector and byGenre that's already in the user's ratedMovies. (Because that means the user already watched it)
  const unwatchedRecommendationsByDirector = recommendationsByDirector.filter(movie => !ratedMovies.some(ratedMovie => ratedMovie.id === movie.id))
  const unwatchedRecommendationsByGenre = recommendationsByGenre.filter(movie => !ratedMovies.some(ratedMovie => ratedMovie.id === movie.id))

  response.json({
    userId,
    ratedMovies,
    favoriteMovies,
    favDirector,
    favGenre,
    recommendationsByDirector,
    recommendationsByGenre,
    unwatchedRecommendationsByDirector,
    unwatchedRecommendationsByGenre,
  })
})

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
