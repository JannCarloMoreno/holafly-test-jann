const {swPeople}  = require('../db')
const AbstractPeople = require('./abstractPeople')
class CommonPeople extends AbstractPeople {
    constructor(id){
        this.id = id
    }

    async init(){
        const person = await swPeople.findOne({where: {id: this.id}})
        if(person){
            this.name = person.name
            this.mass = person.mass
            this.height = person.height
            this.homeworldId = person.homeworldId
            this.homeworldName = person.homeworldName
        }
        return this
    }
}

module.exports = CommonPeople