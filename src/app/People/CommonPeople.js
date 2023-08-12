const { swPeople } = require('../db')
const AbstractPeople = require('./abstractPeople')
class CommonPeople extends AbstractPeople {
  constructor (id) {
    super()
    this.id = id
  }

  async init () {
    const person = await swPeople.findOne({ where: { id: this.id } })
    if (person) {
      this.name = person.name
      this.mass = person.mass
      this.height = person.height
      this.homeworldId = person.homeworld_id
      this.homeworldName = person.homeworld_name
    }
    return this
  }

  async createInDb ({ name, mass, height, homeworldId, homeworldName }) {
    this.name = name
    this.mass = isNaN(parseInt(mass)) ? 0 : parseInt(mass)
    this.height = isNaN(parseInt(height)) ? 0 : parseInt(height)
    this.homeworldId = homeworldId
    this.homeworldName = homeworldName
    await swPeople.create({ id: this.id, name: this.name, mass: this.mass, height: this.height, homeworld_id: this.homeworldId, homeworld_name: this.homeworldName })
  }
}

module.exports = CommonPeople
