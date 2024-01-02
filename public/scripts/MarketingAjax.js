const MarketingAjax = (() => {

    function impl_osvjeziPretrage() {
       
    }

    function impl_osvjeziKlikove() {
        
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const nekretnineIds = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        fetch('http://localhost:3000/marketing/nekretnine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nizNekretnina: nekretnineIds }),
        })
            //.then( () => {
             //   MarketingAjax.osvjeziPretrage();
            //});
    }

    function impl_klikNekretnina(nekretnina_id) {
       //osvjezi ovu nekretninu
       //prekini osvjezavanje za ostale
       fetch(`http://localhost:3000/marketing/nekretnina/${nekretnina_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
    };
})();
