const {swWookieePeople}  = require('../db')
const AbstractPeople = require('./abstractPeople')
class WookieePeople extends AbstractPeople {
    constructor(id){
        super()
        this.id = id
    }

    async init(){
        const person = await swWookieePeople.findOne({where: {id: this.id}})
        if(person){
            this.name = person.name
            this.mass = person.mass
            this.height = person.height
            this.homeworldId = person.homeworldId
            this.homeworldName = person.homeworldName
        }
        return this
    }

    async createInDb({whrascwo, scracc, acwoahrracao, homeworldId, homeworldName}){
        this.name = whrascwo
        this.mass = isNaN(parseInt(scracc))?0:parseInt(scracc)
        this.height = isNaN(parseInt(acwoahrracao))?0:parseInt(acwoahrracao)
        this.homeworldId = homeworldId
        this.homeworldName = homeworldName
        await swWookieePeople.create({id: this.id, name: this.name, mass: this.mass, height: this.height,homeworld_id: this.homeworldId, homeworld_name: this.homeworldName })
    }

}

module.exports = WookieePeople