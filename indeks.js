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

const db = require('./db.js');
const { Op } = require('sequelize');

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

// Rute
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
            const user = await db.korisnik.findOne({where: { username: req.session.username }});
            res.status(200).json({ id:user.id, ime:user.ime, prezime:user.prezime,username:user.username,password:user.password });
        } catch (error) {
            console.error(error);
            res.status(500).json({ greska: 'Problem sa nabavljanjem podataka iz baze' });
        }    
   } else {
       res.status(401).json({ greska: 'Neautorizovan pristup' });
   }
});

app.put('/korisnik', async(req, res) => {
    if (req.session.username) {
        try {
                const user = await db.korisnik.findOne({where: { username: req.session.username }});
                user.ime = req.body.ime || user.ime;
                user.prezime = req.body.prezime || user.prezime;
                user.username = req.body.username || user.username;

                if (req.body.password) {
                    const hashedPassword = await hashPassword(req.body.password);
                    user.password = hashedPassword;
                }
                await user.save();
                res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ greska: 'Problem sa nabavljanjem korisnika iz baze' });
        }
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.post('/upit', async(req, res) => {
    if (req.session.username) {
        const { nekretnina_id, tekst_upita } = req.body;
        try {
            const user = await db.korisnik.findOne({where: { username: req.session.username }});
            try{
                const nekretnina = await db.nekretnina.findByPk(nekretnina_id);
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
            const user = await db.korisnik.findOne({where: { username: req.session.username }});
            res.status(200).json({ id:user.id, ime:user.ime, prezime:user.prezime, username:user.username, password:user.password });
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
    try {
        const nekretnine = await db.nekretnina.findAll({
            where: {
                id: {
                    [Op.in]: nizNekretnina
                }
            }
        });

        if (nekretnine.length === 0) {
            res.status(400).json({ greska: 'Nijedna nekretnina sa navedenim id-jevima nije pronađena' });
            return;
        }
        await Promise.all(nekretnine.map(async nekretnina => {
            nekretnina.pretrage = nekretnina.pretrage + 1; 
            await nekretnina.save();
        }));
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: 'Problem sa nabavljanjem nekretnina iz baze' });
    }
});


app.post("/marketing/nekretnina/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const nekretnina = await db.nekretnina.findByPk(id);
        nekretnina.klikovi= nekretnina.klikovi + 1;
        await nekretnina.save()
        res.status(200).send();
    }
    catch(error){
        console.error(error);
        res.status(500).json({ greska: 'Problem sa dobavljanjem podataka nekretnine iz baze' });
    } 
});

app.post("/marketing/osvjezi", async (req, res) => {

    if (req.body.nizNekretnina) {
        req.session.nizNekretnina = req.body.nizNekretnina;
    }

    const nizNekretnina = req.session.nizNekretnina;
    console.log("Sad je poslan samo 1", nizNekretnina);

    try {
        const nekretnine = await db.nekretnina.findAll({
            where: {
                id: {
                    [Op.in]: nizNekretnina
                }
            }
        });
        const noviPodaci = nekretnine.map(({ id, klikovi, pretrage }) => ({ id, klikovi, pretrage }));
        console.log("novi podaci su", noviPodaci);
        res.status(200).json({ nizNekretnina: noviPodaci });
    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: 'Problem sa dobavljanjem podataka nekretnine iz baze' });
    }
});

// Cetvrta spirala

app.get("/nekretnina/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const nekretnina = await db.nekretnina.findByPk(id, {
            include: [
                { model: db.upit, include: db.korisnik }  
            ]
        });

        if (!nekretnina) {
            res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        } else {
            res.status(200).json(nekretnina);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: 'Greska sa nabavljanjem nekretnina iz baze' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
