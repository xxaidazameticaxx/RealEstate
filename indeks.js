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

// Definisanje ruta za dinamički prikaz stranica
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'html', `${page}`));
});

function findKorisnik(username, password, callback) {
    fs.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);
        callback(null, user);
    });
}

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
