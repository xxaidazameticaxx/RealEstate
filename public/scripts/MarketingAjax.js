const MarketingAjax = (() => {

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const nekretnineIds = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        const divReferenca = document.getElementById("sveNekretnine"); //PROVJERI OVO??

        fetch('http://localhost:3000/marketing/nekretnine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nizNekretnina: nekretnineIds }),
        })
        .then(() => {               //PROVJERI OVO??
            //MarketingAjax.osvjeziPretrage(divReferenca);
            MarketingAjax.osvjeziKlikove(divReferenca);
        })
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

    function updateFieldsWithNewData(nekretnineDivs,data){
                    nekretnineDivs.forEach(nekretninaDiv => {
                        const nekretninaId = parseInt(nekretninaDiv.id);
                
                        // Pronadji klikove i pretrage za pojedinacnu nekretninu
                        const nekretninaData = data.nizNekretnina.find(item => item.id === nekretninaId);

                        if (nekretninaData) {

                            const pretrage= document.getElementById(`pretrage-${nekretninaId}`);
                            const klikovi = document.getElementById(`klikovi-${nekretninaId}`);
                
                            if (pretrage) {
                                pretrage.textContent = nekretninaData.pretrage || 0;
                            }
                
                            if (klikovi) {
                                klikovi.textContent = nekretninaData.klikovi || 0;
                            }
                        }
                    });
    }

    function hideKlikoviAndPretrageFields(nekretnineDivs){
      nekretnineDivs.forEach(nekretninaDiv => {

        const nekretninaId = parseInt(nekretninaDiv.id);

        const pretrage = document.getElementById(`pretrage-${nekretninaId}`);
        const klikovi = document.getElementById(`klikovi-${nekretninaId}`);

        if (pretrage) {
            pretrage.style.display = 'none';
        }

        if (klikovi) {
            klikovi.style.display = 'none';
        }
    });
    }

    function impl_osvjeziKlikove(divReferenca) {
      //setInterval(() => {
          const nekretnineDivs = divReferenca.querySelectorAll('.grid-item1, .grid-item2, .grid-item3');

          const idNekretninaArray = Array.from(nekretnineDivs).map((nekretninaDiv) => parseInt(nekretninaDiv.id));
  
          const sessionNekretnina = JSON.parse(sessionStorage.getItem('nizNekretnina'));

          if (JSON.stringify(idNekretninaArray) !== JSON.stringify(sessionNekretnina)) {
              fetch('http://localhost:3000/marketing/osvjezi', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ nizNekretnina: idNekretninaArray }),
              })
              .then(response => response.json())
              .then(data => {
                    updateFieldsWithNewData(nekretnineDivs,data)
              })
              .catch(error => {

                if(!sessionNekretnina)
                    hideKlikoviAndPretrageFields(nekretnineDivs);

                else{}
                      //updateFieldwsWithPreviousData(????) 
              });
          } else {
              fetch('http://localhost:3000/marketing/osvjeziKlikove', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({}), 
              })
                  .then(response => {
                      if (response.ok) {
                          return response.json();
                      } else {
                          throw new Error('Failed to fetch data');
                      }
                  })
                  .then(data => {
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                  });
          }
     // }, 500);
  }

    return {
        //osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
    };
})();
