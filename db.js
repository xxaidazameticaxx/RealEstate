const Sequelize = require("sequelize");
const path = require('path');
const sequelize = new Sequelize(
    "wt24",
    "root",
    "password",
    {
        host:"localhost",
        dialect:"mysql"
    }
);

const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.nekretnina  = require(path.join(__dirname, "db","models", "nekretnina.js"))(sequelize);
db.korisnik = require(path.join(__dirname,"db", "models", "korisnik.js"))(sequelize);
db.upit = require(path.join(__dirname,"db", "models", "upit.js"))(sequelize);

//relacije
db.upit.belongsTo(db.nekretnina, { foreignKey: 'nekretnina_id' });
db.nekretnina.hasMany(db.upit, { foreignKey: 'nekretnina_id' });

db.upit.belongsTo(db.korisnik, { foreignKey: 'korisnik_id' });
db.korisnik.hasMany(db.upit, { foreignKey: 'korisnik_id' });

module.exports=db;