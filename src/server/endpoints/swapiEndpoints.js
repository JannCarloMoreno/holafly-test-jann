
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
    PEOPLE_URL,
    PLANET_URL
} = require('./constants')

const {peopleFactory} = require('../../app/People')
const {Planet} = require('../../app/Planet')

const _isWookieeFormat = req => req?.query?.format === WOOKIEE_QUERY_PARAM

const _supportWookieFormat = (url, req) => url+(_isWookieeFormat(req)?WOOKIEE_FORMAT:'')

const _getPlanetId = (url) => url.split('/')[5]




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
            const homeworldId = _getPlanetId(data.homeworld)
            const planet = new Planet(homeworldId)
            await planet.init()
            if(!planet.name){
                const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${homeworldId}`, HTTP_METHODS.GET, null, true);
                await planet.createInDb(data)
            }
            await person.createInDb({homeworldId, homeworldName: planet.name,...data})
        } 
        res.status(200).send({name: person.name, mass: person.mass, height: person.height, homeworldId: person.homeworldId, homeworldName: person.homeworldName})
    });

    server.get(`${GET_PLANET}/:id`, async (req, res) => {
        const id = req?.params?.id
        if(isNaN(parseInt(id))) return res.status(401).send('bad request')
        let planet = new Planet(id)
        await planet.init()
        if(!planet.name){
            const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${id}`, HTTP_METHODS.GET, null, true);
            await planet.createInDb(data)
        } 
        res.status(200).send({name: planet.name, gravity: planet.gravity})
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