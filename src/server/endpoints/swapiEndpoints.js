
const {
    TEST,
    GET_PEOPLE,
    GET_PLANET,
    GET_WEIGHT_ON_PLANET_RANDOM,
    GET_LOGS,
    WOOKIEE_FORMAT,
    WOOKIEE_QUERY_PARAM,
    BASE_URL,
    HTTP_METHODS,
    PEOPLE_URL
} = require('./constants')

const {peopleFactory} = require('../../app/People')

const _isWookieeFormat = req => req?.query?.format === WOOKIEE_QUERY_PARAM

const _supportWookieFormat = (url, req) => url+(_isWookieeFormat(req)?WOOKIEE_FORMAT:'')




const applySwapiEndpoints = (server, app) => {

    server.get(TEST, async (req, res) => {
        const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(BASE_URL, req), HTTP_METHODS.GET, null, true);
        res.send(data);
    });

    server.get(`${GET_PEOPLE}/:id`, async (req, res) => {
        const id = req?.params?.id
        if(isNaN(parseInt(id))) return res.status(401).send('bad request')
        let person = await peopleFactory(id, _isWookieeFormat(req)?'wookiee':'')
        if(!person.name){
            const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(`${BASE_URL}${PEOPLE_URL}${id}`, req), HTTP_METHODS.GET, null, true);
            //TODO: Check planet data
            await person.createInDb(data)
        } 
        res.status(200).send({id: person.id, name: person.name, mass: person.mass, height: person.height, homeworldId: person.homeworldId, homeworldName: person.homeworldName})
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