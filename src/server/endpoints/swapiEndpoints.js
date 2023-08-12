const { param, validationResult } = require('express-validator')

const _sendErrorIfValidationFails = (req, errorMessage = 'validation fails') => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const error = new Error(errorMessage)
    error.status = 400
    throw error
  }
}

const asyncServer = require('./asyncErrorWrapper')

const {
  GET_PEOPLE,
  GET_PLANET,
  GET_WEIGHT_ON_PLANET_RANDOM,
  GET_LOGS,
  BASE_URL,
  PEOPLE_URL,
  PLANET_URL
} = require('./constants')

const {
  _validateId,
  _getPerson,
  _getPlanet,
  _getRandomPersonAndPlanet
} = require('./util')

const applySwapiEndpoints = (server, app) => {
  server = asyncServer(server)

  server.get(`${GET_PEOPLE}/:id`, param('id').isInt().custom(_validateId(app, `${BASE_URL}${PEOPLE_URL}`)), async (req, res) => {
    _sendErrorIfValidationFails(req, 'peopleId must be an integer')
    const id = req.params.id
    const person = await _getPerson(id, req, app)
    res.status(200).send({ name: person.name, mass: person.mass, height: person.height, homeworldId: person.homeworldId, homeworldName: person.homeworldName })
  })

  server.get(`${GET_PLANET}/:id`, param('id').isInt().custom(_validateId(app, `${BASE_URL}${PLANET_URL}`)), async (req, res) => {
    _sendErrorIfValidationFails(req, 'planetId must be an integer')
    const id = req.params.id
    const planet = await _getPlanet(id, app)
    res.status(200).send({ name: planet.name, gravity: planet.gravity })
  })

  server.get(GET_WEIGHT_ON_PLANET_RANDOM, async (req, res) => {
    const { randomPerson, randomPlanet } = await _getRandomPersonAndPlanet(app)
    const person = await _getPerson(randomPerson, req, app)
    const planet = await _getPlanet(randomPlanet, app)
    if (planet.id === person.homeworldId) return res.status(401).send({ error: 'Bad luck, try again!' })
    res.send({ weight: person.mass * planet.gravity, personMass: person.mass, gravity: planet.gravity })
  })

  server.get(GET_LOGS, async (req, res) => {
    const data = await app.db.logging.findAll()
    res.send(data)
  })
}

module.exports = applySwapiEndpoints
