'use strict'

module.exports = (sequelize, DataTypes) => {
  const swWookieePeople = sequelize.define(
    'swWookieePeople', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: DataTypes.STRING,
      mass: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      homeworld_name: DataTypes.STRING,
      homeworld_id: DataTypes.STRING
    },
    {
      paranoid: true
    }
  )
  return swWookieePeople
}
