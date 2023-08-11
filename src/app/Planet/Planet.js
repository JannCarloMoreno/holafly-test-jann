const {swPlanet} = require('../db')
class Planet {
    constructor(id){
        this.id = id
    }

    async init(){
        const planet = await swPlanet.findOne({where: {id: this.id}})
        if(planet){
            this.name = planet.name
            this.gravity = planet.gravity
        }
        return this
    }

    async createInDb({name, gravity}){
        this.name = name
        this.gravity = parseFloat(gravity)
        await swPlanet.create({id: this.id, name: this.name, gravity: this.gravity })
    }

    getName() {
        return this.name;
    }

    getGravity() {
        return this.gravity;
    }

}

module.exports = Planet