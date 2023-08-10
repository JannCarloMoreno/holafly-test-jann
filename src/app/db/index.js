'use strict';

const Sequelize = require('sequelize');
const models = require('./models');

let sequelize;

sequelize = new Sequelize("sqlite::memory:", {
  logging: false //console.log
});

const db = {
	Sequelize,
	sequelize,
};

for (const modelInit of models) {
	const model = modelInit(db.sequelize, db.Sequelize.DataTypes);
	db[model.name] = model;
}

db.swPlanet.hasMany(db.swPeople)
db.swPeople.belongsTo(db.swPlanet)
db.swPlanet.hasMany(db.swWookieePeople)
db.swWookieePeople.belongsTo(db.swPlanet)


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


const initDB = async () => {
  await db.swPeople.sync({ force: true });
  await db.swWookieePeople.sync({ force: true });
  await db.swPlanet.sync({ force: true });
  await db.logging.sync({ force: true });
}

// const createModels = async () => {
//   await initDB()
//   const a = await db.swPlanet.create({name:'tierra', gravity:10.0})
//   const as = await db.swPlanet.findOne({where: {id: 1}});
//   console.log(as.name)
//   const b = await db.swPeople.create({id: 1, name: 'jann', mass: 15, height: 130})
// }

// (async ()=> {
//   await createModels()
// })()

const populateDB = async () => {
  await db.swPlanet.bulkCreate([
    {
      name: "Tatooine",
      gravity: 1.0
    }
  ]);
  await db.swPeople.bulkCreate([
    {
      name: "Luke Skywalker",
      height: 172,
      mass: 77,
      homeworld_name: "Tatooine",
      homeworld_id: "/planets/1"
    }
  ]);
}

const deleteDB = async () => {
  await db.swPeople.drop();
  await db.swPlanet.drop();
  await db.logging.drop();
}

const watchDB = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true,
  });

  const people = await db.swPeople.findAll({
    raw: true,
  });

  console.log("============= swPlanet =============");
  console.table(planets);
  console.log("\n");
  console.log("============= swPeople =============");
  console.table(people);
}

db.initDB = initDB;
db.populateDB = populateDB;
db.watchDB = watchDB;
db.deleteDB = deleteDB;

module.exports = db;
