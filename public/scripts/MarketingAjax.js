const MarketingAjax = (() => {

    function impl_osvjeziPretrage(noviPodaci, fnCallback) {
        fetch('http://localhost:3000/marketing/osvjezi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noviPodaci),
        })
            .then(response => response.json())
            .then(data => fnCallback(null, data))
            .catch(error => fnCallback(error, null));
    }

    function impl_osvjeziKlikove(nekretnina_id, tekst_upita, fnCallback) {
        const data = { nekretnina_id, tekst_upita };

        fetch('http://localhost:3000/marketing/osvjezi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => fnCallback(null, data))
            .catch(error => fnCallback(error, null));
    }

    function impl_novoFiltriranje(fnCallback) {
        fetch('http://localhost:3000/marketing/nekretnine')
            .then(response => response.json())
            .then(data => fnCallback(null, data))
            .catch(error => fnCallback(error, null));
    }

    function impl_klikNekretnina(username, password, fnCallback) {
        const data = { username, password };

        fetch('http://localhost:3000/marketing/:id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => fnCallback(null, data))
            .catch(error => fnCallback(error, null));
    }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
    };
})();
