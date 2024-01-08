const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "public", "html")));
app.use(
    session({
        secret:'NAJDNJKADBGRGSKSNA',
        resave:false,
        saveUninitialized:false
        })
);

const db = require('./db.js')

// Hesiranje
async function hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
}

// Pomocne funkcije za rute
async function findKorisnik(username, password) {
    try {
        const user = await db.korisnik.findOne({where: { username: username },});
        if (!user) {
            return null;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return null;
        }
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function findKorisnikByUsername(username) {
    try {
        const user = await db.korisnik.findOne({where: { username: username },});
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function findNekretninaById(nekretnina_id) {
    try {
        const nekretnina = await db.nekretnina.findByPk(nekretnina_id);
        if (!nekretnina) {
            return null;
        }
        return nekretnina;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Dodatne rute
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findKorisnik(username, password);

        if (!user) {
            res.status(401).json({ greska: 'Neuspješna prijava' });
        } else {
            req.session.username = username;
            res.status(200).json({ poruka: 'Uspješna prijava' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: 'Problem sa nabavljanjem podataka iz baze' });
    }
});

app.post('/logout', (req, res) => {
     if (req.session.username) {
         req.session.username = null;
        res.status(200).json({ poruka: 'Uspješno ste se odjavili' });           
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

});

app.get('/korisnik', async (req, res) => {
    if (req.session.username) {
        try {
            const user = await findKorisnikByUsername(req.session.username);
            if (!user) {
                res.status(401).json({ greska: 'Neautorizovan pristup' });
            } else {
                res.status(200).json({ id:user.id, ime:user.ime, prezime:user.prezime,username:user.username,password:user.password });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ greska: 'Problem sa nabavljanjem podataka iz baze' });
        }    
   } else {
       res.status(401).json({ greska: 'Neautorizovan pristup' });
   }

});

// TODO : refactor uraditi callback funkcija u promises
app.put('/korisnik', async(req, res) => {
    if (req.session.username) {

        const data = await fs.promises.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf8');
        const users = JSON.parse(data);

            await Promise.all(users.map(async user => {
                if (user.username === req.session.username) {
                    user.ime = req.body.ime || user.ime;
                    user.prezime = req.body.prezime || user.prezime;
                    user.username = req.body.username || user.username;
                    if (req.body.password) {
                        const hashedPassword = await hashPassword(req.body.password)
                        user.password = hashedPassword;
                    }
                }
                return user;
            }));

            await fs.promises.writeFile(path.join(__dirname, 'data', 'korisnici.json'), JSON.stringify(users));
            res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
        
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.post('/upit', async(req, res) => {
    if (req.session.username) {
        const { nekretnina_id, tekst_upita } = req.body;
        try {
            const user = await findKorisnikByUsername(req.session.username);
                try{
                    const nekretnina = await findNekretninaById(nekretnina_id);
                    if (!nekretnina) {
                        res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji`});
                    } else {
                        await db.upit.create({nekretnina_id: nekretnina.id,korisnik_id: user.id,tekst_upita: tekst_upita});
                        res.status(200).json({ poruka: 'Upit je uspješno dodan'})
                    }
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({ greska: 'Problem sa nabavljanjem nekretnine iz baze' });
                }               
        } catch (error) {
            console.error(error);
            res.status(500).json({ greska: 'Problem sa nabavljanjem korisnika iz baze' });
        }
        
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});    


app.get('/korisnik', async (req, res) => {
    if (req.session.username) {
        try {
            const user = await findKorisnikByUsername(req.session.username);
            if (!user) {
                res.status(401).json({ greska: 'Neautorizovan pristup' });
            } else {
                res.status(200).json({ id:user.id, ime:user.ime, prezime:user.prezime,username:user.username,password:user.password });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ greska: 'Problem sa nabavljanjem podataka iz baze' });
        }    
   } else {
       res.status(401).json({ greska: 'Neautorizovan pristup' });
   }

});

app.get('/nekretnine', async (req, res) => {
    try {
        const nekretnine = await db.nekretnina.findAll();
        res.status(200).json(nekretnine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ne čita dobro iz datoteke' }); // iz baze
    }
});

// Treci zadatak

app.post('/marketing/nekretnine', async (req, res) => {
    const { nizNekretnina } = req.body;       
    const osvjezavanjaData = await fs.promises.readFile(path.join(__dirname, 'data', 'osvjezavanja.json'), 'utf8');
    const osvjezavanja = osvjezavanjaData ? JSON.parse(osvjezavanjaData) : [];

    nizNekretnina.forEach((id) => {
        const nekretnina = osvjezavanja.find((u) => u.id === id);
        if (nekretnina) {
            nekretnina.pretrage += 1;
        } else {
            osvjezavanja.push({ id: parseInt(id), klikovi: parseInt(0), pretrage: parseInt(1) });
        }
    });

    await fs.promises.writeFile(path.join(__dirname, 'data', 'osvjezavanja.json'), JSON.stringify(osvjezavanja));

    res.status(200).send();
  
});

app.post("/marketing/nekretnina/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const osvjezavanjaData = await fs.promises.readFile(path.join(__dirname, 'data', 'osvjezavanja.json'), 'utf8');
  
    const data = JSON.parse(osvjezavanjaData);

    data.forEach((u) => {
        if(u.id === id)
            u.klikovi += 1;
    });

    await fs.promises.writeFile(path.join(__dirname, 'data', 'osvjezavanja.json'), JSON.stringify(data));
    res.status(200).send();
});

app.post("/marketing/osvjezi", async (req, res) => {

    if (req.body.nizNekretnina) {
        req.session.nizNekretnina = req.body.nizNekretnina;
    }
        
    const nizNekretnina = req.session.nizNekretnina;
  
    console.log("Sad je poslan samo 1",nizNekretnina)
      
    const osvjezavanjaData = await fs.promises.readFile(path.join(__dirname, "data", "osvjezavanja.json"),"utf8");
      
    const osvjezavanja = osvjezavanjaData ? JSON.parse(osvjezavanjaData) : [];

    const noviPodaci = osvjezavanja.filter((u) =>nizNekretnina.find((i) => i === parseInt(u.id)));

    console.log("novi podaci su",noviPodaci);

    res.status(200).json({ nizNekretnina: noviPodaci }); 

  });


app.post("/hesiranje",async(req,res) =>{
    const { username,password} = req.body;
    const data = await fs.promises.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf8');
    const users = JSON.parse(data);
    await Promise.all(users.map(async user => {
        if (user.username === username) {
            if (password) {
                const hashedPassword = await hashPassword(req.body.password)
                user.password = hashedPassword;
            }
        }
        return user;
    }));
    await fs.promises.writeFile(path.join(__dirname, 'data', 'korisnici.json'), JSON.stringify(users));  
    res.status(200).send();  
});
  
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
