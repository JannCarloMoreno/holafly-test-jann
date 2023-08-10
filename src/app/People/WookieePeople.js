const {swWookieePeople}  = require('../db')
const AbstractPeople = require('./abstractPeople')
class WookieePeople extends AbstractPeople {
    constructor(id){
        this.id = id
    }

    async init({name, mass, height, homeworld_name, homeworld_id}){
        let person = await swWookieePeople.findOne({where: {id: this.id}})
        if(!person) person = swPeople.create({id: this.id,name,mass, height, homeworld_name, homeworld_id})
        return person
    }
}

module.exports = WookieePeople