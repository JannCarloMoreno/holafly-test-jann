const BASE_PATH = '/hfswapi'
const GET_PEOPLE = `${BASE_PATH}/getPeople`
const GET_PLANET = `${BASE_PATH}/getPlanet`
const GET_WEIGHT_ON_PLANET_RANDOM = `${BASE_PATH}/getWeightOnPlanetRandom`
const GET_LOGS = `${BASE_PATH}/getLogs`
const WOOKIEE_FORMAT = '?format=wookiee'
const WOOKIEE_QUERY_PARAM = 'wookiee'
const HTTP_METHODS = {
  GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
}

const BASE_URL = 'https://swapi.dev/api/'
const PEOPLE_URL = 'people/'
const PLANET_URL = 'planets/'
module.exports = {
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
}
