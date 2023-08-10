const BASE_PATH = '/hfswapi'
const TEST = `${BASE_PATH}/test`
const GET_PEOPLE = `${BASE_PATH}/getPeople`
const GET_PLANET = `${BASE_PATH}/getPlanet`
const GET_WEIGHT_ON_PLANET_RANDOM = `${BASE_PATH}/getWeightOnPlanetRandom`
const GET_LOGS = `${BASE_PATH}/getLogs`
const HTTP_METHODS = {
    GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
};
const BASE_URL = 'https://swapi.dev/api/';
const WOOKIEE_FORMAT = '?format=wookiee';
const WOOKIEE_QUERY_PARAM = 'wookiee'
module.exports = {
    TEST,
    GET_PEOPLE,
    GET_PLANET,
    GET_WEIGHT_ON_PLANET_RANDOM,
    GET_LOGS,
    HTTP_METHODS,
    BASE_URL,
    WOOKIEE_FORMAT,
    WOOKIEE_QUERY_PARAM
}