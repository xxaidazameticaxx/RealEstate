let SpisakNekretnina = function () {

    let listaNekretnina = [];
    let listaKorisnika = [];

    let init = function (nekretnine, korisnici) {
        listaNekretnina = nekretnine;
        listaKorisnika = korisnici;
    }

    let filtrirajNekretnine = function (kriterij) {
        if(!kriterij || Object.keys(kriterij).length === 0){
            return listaNekretnina; //ref https://sentry.io/answers/how-do-i-test-for-an-empty-javascript-object/
                                    //ako je falsy kriterij ili ako object nema sopstvenih properties
        }
        return listaNekretnina.filter(nekretnina => {
        if (kriterij.tip_nekretnine && (nekretnina.tip_nekretnine !== kriterij.tip_nekretnine)) {
            return false;
        }
        if (kriterij.min_kvadratura && (nekretnina.kvadratura < kriterij.min_kvadratura)) {
            return false;
        }
        if (kriterij.max_kvadratura && (nekretnina.kvadratura > kriterij.max_kvadratura)) {
            return false;
        }
        if (kriterij.min_cijena && (nekretnina.cijena < kriterij.min_cijena)) {
            return false;
        }
        if (kriterij.max_cijena && (nekretnina.cijena > kriterij.max_cijena)) {
            return false;
        }
        return true;
        });
    }

    let ucitajDetaljeNekretnine = function (id) {
        return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    }

    return {
    init: init,
    filtrirajNekretnine: filtrirajNekretnine,
    ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
    
};