const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next)
}

const methods = [
  'get',
  'post',
  'put',
  'delete'
]

function toAsyncRouter (router) {
  for (const key in router) {
    if (methods.includes(key)) {
      const method = router[key]
      router[key] = (path, ...callbacks) => method.call(router, path, ...callbacks.map(cb => asyncHandler(cb)))
    }
  }
  return router
}

module.exports = toAsyncRouter
