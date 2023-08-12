const _castToNumber = str => isNaN(parseInt(str, 10)) ? -1 : parseInt(str, 10)

const _getModelNameAndIndexFromUrl = url => {
  // eslint-disable-next-line no-unused-vars
  const [_, prefix, ...splittedUrl] = url.split('/')
  if (splittedUrl.length === 1) return ''
  return { modelName: splittedUrl[0], index: _castToNumber(splittedUrl[1]) }
}

const loggingMiddleware = (db) =>
  (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    const { modelName, index } = _getModelNameAndIndexFromUrl(req.originalUrl)
    if (modelName === '') {
      next()
      return
    }
    // TODO: implement query element at index or null
    const model = db[modelName]
    if (!model) { next() }
  }

module.exports = loggingMiddleware
