const {
  WOOKIEE_FORMAT,
  WOOKIEE_QUERY_PARAM,
  BASE_URL,
  HTTP_METHODS,
  PEOPLE_URL,
  PLANET_URL
} = require('./constants')

const { peopleFactory } = require('../../app/People')
const { Planet } = require('../../app/Planet')

const _isWookieeFormat = req => req?.query?.format === WOOKIEE_QUERY_PARAM

const _supportWookieFormat = (url, req) => url + (_isWookieeFormat(req) ? WOOKIEE_FORMAT : '')

const _getPlanetId = (url) => url.split('/')[5]

const _getRandomInt = max => Math.floor(Math.random() * max)

const _getModelFromDb = async ({ InstanceMethod, args }) => {
  let model
  try {
    model = new InstanceMethod(...args)
    await model.init()
  } catch {
    model = await InstanceMethod(...args)
  }
  return model
}

const _isNotInDb = model => Object.keys(model).length === 1

const _getPlanet = async (id, app) => {
  const planet = await _getModelFromDb({ InstanceMethod: Planet, args: [id] })
  if (_isNotInDb(planet)) {
    const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${id}`, HTTP_METHODS.GET)
    await planet.createInDb(data)
  }
  return planet
}

const _getWookieePlanetForPerson = async (id, app) => {
  const data = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}${id}?format=wookiee`, HTTP_METHODS.GET)
  return { name: data.whrascwo }
}

const _getHomeworldPlanet = async (personData, app, wookiee) => {
  const homeworldId = _getPlanetId(personData.homeworld ?? personData.acooscwoohoorcanwa)
  let planet
  if (wookiee === 'wookiee') {
    planet = await _getWookieePlanetForPerson(homeworldId, app)
  } else {
    planet = await _getPlanet(homeworldId, app)
  }
  return { homeworldId, homeworldName: planet.name }
}

const _getRandomPersonAndPlanet = async (app) => {
  const { count: countPeople } = await app.swapiFunctions.genericRequest(`${BASE_URL}${PEOPLE_URL}`, HTTP_METHODS.GET)
  const { count: countPlanets } = await app.swapiFunctions.genericRequest(`${BASE_URL}${PLANET_URL}`, HTTP_METHODS.GET)
  return { randomPerson: _getRandomInt(countPeople), randomPlanet: _getRandomInt(countPlanets) }
}

const _getPerson = async (id, req, app) => {
  const person = await _getModelFromDb({ InstanceMethod: peopleFactory, args: [id, _isWookieeFormat(req) ? 'wookiee' : ''] })
  if (_isNotInDb(person)) {
    const data = await app.swapiFunctions.genericRequest(_supportWookieFormat(`${BASE_URL}${PEOPLE_URL}${id}`, req), HTTP_METHODS.GET)
    await person.createInDb({ ...await _getHomeworldPlanet(data, app, _isWookieeFormat(req) ? 'wookiee' : ''), ...data })
  }
  return person
}

const _validateId = (app, modelUrl, errorMessage = 'invalid Id') => {
  return async (id) => {
    const { count: modelCount } = await app.swapiFunctions.genericRequest(modelUrl, HTTP_METHODS.GET)
    if (id > modelCount || id < 0) {
      const error = new Error(errorMessage)
      error.status = 400
      throw error
    }
  }
}

module.exports = {
  _validateId,
  _getPerson,
  _getPlanet,
  _getRandomPersonAndPlanet
}
