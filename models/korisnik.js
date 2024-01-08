const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Korisnik = sequelize.define("Korisnik",{
        id:{
          type:Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
        },
        ime: {
          type:Sequelize.STRING,
          allowNull: false,
        },
        prezime: {
          type:Sequelize.STRING,
          allowNull: false,
        },
        username: {
          type:Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type:Sequelize.STRING,
          allowNull: false,
        },

    },{
      timestamps: false, 
      tableName: 'Korisnik', 
      freezeTableName: true,
    });
    return Korisnik;
};
