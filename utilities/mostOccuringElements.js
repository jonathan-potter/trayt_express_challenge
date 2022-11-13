const _ = require('lodash')

module.exports = function mostOccuringElements (array) {
  const elementCounts = _.countBy(array)

  const maxCount = Math.max.apply(undefined, Object.values(elementCounts))

  return Object.entries(elementCounts)
    .filter(([key, value]) => value === maxCount)
    .map(([key]) => key)
}
