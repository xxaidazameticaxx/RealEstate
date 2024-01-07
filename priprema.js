const db = require('./db.js')
db.sequelize.sync({ force: true })
    .then(() => {
        console.log('Tables synchronized successfully');
        return inicializacija();
    })
    .then(() => {
        console.log('Initialization completed successfully');
        console.log('Gotovo kreiranje tabela i ubacivanje pocetnih podataka!');
        process.exit();
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });


function inicializacija() {
    const nekretnineData = [
      {
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2023.",
        opis: "Sociis natoque penatibus.",
        klikovi:null,
        pretrage:null
      },
      {
        tip_nekretnine: "Poslovni prostor",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        klikovi:null,
        pretrage:null
      },
      {
        tip_nekretnine: "Stan",
        naziv: "Studio apartman",
        kvadratura: 21,
        cijena: 50000,
        tip_grijanja: "struja",
        lokacija: "Novi Grad",
        godina_izgradnje: 2009,
        datum_objave: "12.04.2023.",
        opis: "Dis magnis monte.",
        klikovi:null,
        pretrage:null
      },
    ];

    const korisniciData = [
        {
          ime: "Neko",
          prezime: "Nekic",
          username: "username1",
          password: "$2b$10$KjbnJqjQPySQOxCOt68cOueG6bXVRwVjk2P0/O9v45qNQIKZjNf26",
        },
        {
          ime: "Neko2",
          prezime: "Nekic2",
          username: "username2",
          password: "$2b$10$CYpJgA/604GcOBag3oNqhOZo3a2yUStDg7.3gHGg5lLEeSwfU.RDq",
        },
      ];
  
    const nekretninePromiseList = [];
    const korisniciPromiseList = [];
  
    for (const nekretninaData of nekretnineData) {
      nekretninePromiseList.push(db.nekretnina.create(nekretninaData));
    }

    for (const korisnikData of korisniciData) {
        korisniciPromiseList.push(db.korisnik.create(korisnikData));
    }
    
  
    return Promise.all([...nekretninePromiseList, ...korisniciPromiseList]);
  }