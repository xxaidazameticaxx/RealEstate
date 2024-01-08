const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Upit = sequelize.define("Upit",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        korisnik_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        tekst_upita: {
            type: Sequelize.STRING,
            allowNull: false,
        },   
        nekretnina_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },   
    },{
        timestamps: false, 
        tableName: 'Upit', 
        freezeTableName: true,
    });
    return Upit;
};
