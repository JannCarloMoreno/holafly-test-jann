const express = require('express');
const applyEndpoints = require('./endpoints');
const applyMiddlewares = require('./middlewares');
const errorMiddleware = require('./middlewares/errorMiddleware')

const createExpressServer = async app => {
	const server = express();
	applyMiddlewares(server, app);
	applyEndpoints(server, app);
    
    await app.db.initDB();

	server.get('/', async (req, res) => {
		if(process.env.NODE_ENV === 'develop'){
				res.send('Test Enviroment');
		} else {
		    res.sendStatus(200);
		}
    });

	server.use(errorMiddleware)

	return server;
};

module.exports = createExpressServer;