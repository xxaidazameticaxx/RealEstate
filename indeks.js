const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret:'NAJDNJKADBGRGSKSNA',
        resave:false,
        saveUninitialized:false
        })
);

// Hesiranje
async function hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
}

// Pomocne funkcije za rute
function findKorisnik(username, password, callback) {
    fs.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf8', async (error, data) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log(error);
            callback(error, null);
            return;
        }
        else{
            callback(null, user);
        }
        
    });
}

function findKorisnikByUsername(username, callback) {
    fs.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf8', async (error, data) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);
        callback(null, user);  
    });
}

// Dodatne rute
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    findKorisnik(username, password, (error, user) => {
        if (error || !user) {
            res.status(401).json({ greska: 'Neuspješna prijava' });
        } else {
            req.session.username = username;
            res.status(200).json({ poruka: 'Uspješna prijava' });
        }
    });
});

app.post('/logout', (req, res) => {
     if (req.session.username) {
         req.session.username = null;
        res.status(200).json({ poruka: 'Uspješno ste se odjavili' });           
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

});

app.get('/korisnik', (req, res) => {
    if (req.session.username) {
        findKorisnikByUsername(req.session.username, (error, user) => {
            if (error || !user) {
                res.status(401).json({ greska: 'Neautorizovan pristup' });
            } else {
                res.status(200).json({ id:user.id, ime:user.ime, prezime:user.prezime,username:user.username,password:user.password });
            }
        });     
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

app.get('/nekretnine', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'nekretnine.json'), 'utf8', async (error, data) => {
        if (error) {
            console.error(err);
            res.status(500).json({ error: 'Ne čita dobro iz datoteke' });
            return;
        }
            const nekretnine = JSON.parse(data);
            res.status(200).json(nekretnine);
        
    });
});

// Definisanje ruta za dinamički prikaz stranica
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'html', `${page}`));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
