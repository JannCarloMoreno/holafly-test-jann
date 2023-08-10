
const {
    TEST,
    GET_PEOPLE,
    GET_PLANET,
    GET_WEIGHT_ON_PLANET_RANDOM,
    GET_LOGS,
    HTTP_METHODS,
    BASE_URL,
    WOOKIEE_FORMAT,
    WOOKIEE_QUERY_PARAM
} = require('./constants')

const _isWookieeFormat = req => req?.query?.format === WOOKIEE_QUERY_PARAM

const _supportWookieFormat = (url, req) => url+(_isWookieeFormat(req)?WOOKIEE_FORMAT:'')




const applySwapiEndpoints = (server, app) => {

    server.get(TEST, async (req, res) => {
        const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(BASE_URL, req), HTTP_METHODS.GET, null, true);
        res.send(data);
    });

    server.get(`${GET_PEOPLE}/:id`, async (req, res) => {
        res.sendStatus(501);
    });

    server.get(`${GET_PLANET}/:id`, async (req, res) => {
        res.sendStatus(501);
    });

    server.get(GET_WEIGHT_ON_PLANET_RANDOM, async (req, res) => {
        res.sendStatus(501);
    });

    server.get(GET_LOGS,async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;