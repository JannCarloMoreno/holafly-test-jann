const { param, validationResult } = require('express-validator')

const {
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

const { peopleFactory } = require('../../app/People')
const { Planet } = require('../../app/Planet')

const asyncServer = require('./asyncErrorWrapper')

const _isWookieeFormat = req => req?.query?.format === WOOKIEE_QUERY_PARAM

const _supportWookieFormat = (url, req) => url + (_isWookieeFormat(req) ? WOOKIEE_FORMAT : '')

const _getPlanetId = (url) => url.split('/')[5]

const _getRandomInt = max => Math.floor(Math.random() * max)

const _sendErrorIfValidationFails = (req, errorMessage = 'validation fails') => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const error = new Error(errorMessage)
    error.status = 400
    throw error
  }
}

const applySwapiEndpoints = (server, app) => {
  server = asyncServer(server)

  server.get(`${GET_PEOPLE}/:id`, param('id').isInt(), async (req, res) => {
    _sendErrorIfValidationFails(req, 'peopleId must be an integer')
    const id = req.params.id
    const person = await peopleFactory(id, _isWookieeFormat(req) ? 'wookiee' : '')
    if (!person.name) {
      const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(`${BASE_URL}${PEOPLE_URL}${id}`, req), HTTP_METHODS.GET, null, true)
      const homeworldId = _getPlanetId(data.homeworld)
      const planet = new Planet(homeworldId)
      await planet.init()
      if (!planet.name) {
        const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${homeworldId}`, HTTP_METHODS.GET, null, true)
        await planet.createInDb(data)
      }
      await person.createInDb({ homeworldId, homeworldName: planet.name, ...data })
    }
    res.status(200).send({ name: person.name, mass: person.mass, height: person.height, homeworldId: person.homeworldId, homeworldName: person.homeworldName })
  })

  server.get(`${GET_PLANET}/:id`, param('id').isInt(), async (req, res) => {
    _sendErrorIfValidationFails(req, 'planetId must be an integer')
    const id = req.params.id
    const planet = new Planet(id)
    await planet.init()
    if (!planet.name) {
      const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${id}`, HTTP_METHODS.GET, null, true)
      await planet.createInDb(data)
    }
    res.status(200).send({ name: planet.name, gravity: planet.gravity })
  })

  server.get(GET_WEIGHT_ON_PLANET_RANDOM, async (req, res) => {
    const { count: countPeople } = await app.swapiFunctions.genericRequest(`${BASE_URL}${PEOPLE_URL}`, HTTP_METHODS.GET, null, true)
    const { count: countPlanets } = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}`, HTTP_METHODS.GET, null, true)
    const randomPerson = _getRandomInt(countPeople)
    const randomPlanet = _getRandomInt(countPlanets)
    const person = await peopleFactory(randomPerson, _isWookieeFormat(req) ? 'wookiee' : '')
    if (!person.name) {
      const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(`${BASE_URL}${PEOPLE_URL}${randomPerson}`, req), HTTP_METHODS.GET, null, true)
      const homeworldId = _getPlanetId(data.homeworld)
      const planet = new Planet(homeworldId)
      await planet.init()
      if (!planet.name) {
        const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${homeworldId}`, HTTP_METHODS.GET, null, true)
        await planet.createInDb(data)
      }
      await person.createInDb({ homeworldId, homeworldName: planet.name, ...data })
    }
    const planet = new Planet(randomPlanet)
    await planet.init()
    if (!planet.name) {
      const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${randomPlanet}`, HTTP_METHODS.GET, null, true)
      await planet.createInDb(data)
    }
    if (planet.id === person.homeworldId) return res.status(401).send('Bad luck, try again!')
    res.send({ weight: person.mass * planet.gravity, personMass: person.mass, gravity: planet.gravity })
  })

  server.get(GET_LOGS, async (req, res) => {
    const data = await app.db.logging.findAll()
    res.send(data)
  })
}

module.exports = applySwapiEndpoints
