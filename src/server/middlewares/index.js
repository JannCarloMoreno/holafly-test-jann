const loggingMiddleware = require('./loggingMiddleware');
const checkDbMiddleware = require('./checkDbMiddleware')

const applyMiddlwares = (server, app) => {
    server.use(loggingMiddleware(app.db));
    server.use(checkDbMiddleware(app.db));
	return server;
};

module.exports = applyMiddlwares;