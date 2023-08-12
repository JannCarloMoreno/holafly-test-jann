const loggingMiddleware = (db) =>
  async (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
    const header = JSON.stringify(req.headers)
    const action = req.method
    // Persist this info on DB
    await db.logging.create({ action, header, ip })
    next()
  }

module.exports = loggingMiddleware
