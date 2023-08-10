const {swPeople}  = require('../db')
const AbstractPeople = require('./abstractPeople')
class CommonPeople extends AbstractPeople {
    constructor(id){
        this.id = id
    }

    async init({name, mass, height, homeworld_name, homeworld_id}){
        let person = await swPeople.findOne({where: {id: this.id}})
        if(!person) person = swPeople.create({id: this.id,name,mass, height, homeworld_name, homeworld_id})
        return person
    }
}

module.exports = CommonPeople