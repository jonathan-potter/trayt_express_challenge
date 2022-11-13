const mostOccuringElements = require('./mostOccuringElements.js')
const {
  getRatedMovies,
  getRecommendationByDirector,
  getRecommendationByGenre,
} = require('../helperFunctions')

module.exports = async function generateRecommendations (userId) {
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

  return {
    userId,
    ratedMovies,
    favoriteMovies,
    favDirector,
    favGenre,
    recommendationsByDirector,
    recommendationsByGenre,
    unwatchedRecommendationsByDirector,
    unwatchedRecommendationsByGenre,
  }
}
