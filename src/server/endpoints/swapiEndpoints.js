
const _isWookieeFormat = req => req?.query?.format === 'wookiee'

const BASE_URL = 'https://swapi.dev/api/';

const _supportWookieFormat = (url, req) => url+(_isWookieeFormat(req)?'?format=wookiee':'')

const HTTP_METHODS = {
    GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
};



const applySwapiEndpoints = (server, app) => {

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(BASE_URL, req), HTTP_METHODS.GET, null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;