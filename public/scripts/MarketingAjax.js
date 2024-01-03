const MarketingAjax = (() => {

    let filtiranje = false;
    let sessionNekretnina; //provjera

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const nekretnineIds = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        const divReferenca = document.getElementById("sveNekretnine"); 

        fetch('http://localhost:3000/marketing/nekretnine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nizNekretnina: nekretnineIds }),
        })
        .then(() => {  
            filtiranje = true;           
            MarketingAjax.osvjeziPretrage(divReferenca);
            MarketingAjax.osvjeziKlikove(divReferenca);
        })
    }

    function impl_klikNekretnina(nekretnina_id) {
       fetch(`http://localhost:3000/marketing/nekretnina/${nekretnina_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            fetch('http://localhost:3000/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {nizNekretnina: [parseInt(nekretnina_id)] }),
            })
        });     
    }

    function updatePretrageWithNewData(nekretnineDivs,data){
                    nekretnineDivs.forEach(nekretninaDiv => {
                        const nekretninaId = parseInt(nekretninaDiv.id);
                
                        // Pronadji pretrage za pojedinacnu nekretninu
                        const nekretninaData = data.nizNekretnina.find(item => item.id === nekretninaId);

                        if (nekretninaData) {

                            const pretrage= document.getElementById(`pretrage-${nekretninaId}`);
                
                            if (pretrage) {
                                pretrage.textContent = 'Broj pretraga: ' + nekretninaData.pretrage || 0;
                            }
            
                        }
                    });
    }

    // Ove metode sam dodala radi konzistentnosti naziva Ajax poziva, ali se mogla napraviti i jedinstvena metoda pošto se koristi isti data
    function updateKlikoviWithNewData(nekretnineDivs,data){
        nekretnineDivs.forEach(nekretninaDiv => {
            const nekretninaId = parseInt(nekretninaDiv.id);
    
            // Pronadji klikove za pojedinacnu nekretninu
            const nekretninaData = data.nizNekretnina.find(item => item.id === nekretninaId);

            if (nekretninaData) {

                const klikovi= document.getElementById(`klikovi-${nekretninaId}`);
    
                if (klikovi) {
                    klikovi.textContent = 'Broj klikova: ' + nekretninaData.klikovi || 0;
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
      setInterval(() => {
          const nekretnineDivs = divReferenca.querySelectorAll('.grid-item1, .grid-item2, .grid-item3');

          const idNekretninaArray = Array.from(nekretnineDivs).map((nekretninaDiv) => parseInt(nekretninaDiv.id));

          let sessionNekretninaIds = sessionNekretnina ? sessionNekretnina.nizNekretnina.map(nekretnina => nekretnina.id) : []

           const sortedIdNekretninaArrays = idNekretninaArray.slice().sort();
           const sortedSessionNekretninaIds = sessionNekretninaIds.slice().sort();

          // poziva se pri svakom filtriranju, i prvobitnom kad je sesija prazna
          if (sessionNekretninaIds.length === 0 || JSON.stringify(sortedIdNekretninaArrays) !== JSON.stringify(sortedSessionNekretninaIds) ){

            if (filtiranje) {
                console.log("FILTIRANJE SE DESILO");
                requestBody = JSON.stringify({ nizNekretnina: idNekretninaArray });
                filtiranje = false;
            }
            else{
                requestBody = JSON.stringify({});
            }

            fetch('http://localhost:3000/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            })
            .then(response => response.json())
            .then(data => {
                sessionNekretnina = data;
                updateKlikoviWithNewData(nekretnineDivs,data)
            })
            .catch(error => {    
                     
                if(sessionNekretninaIds.length === 0){
                    // sesija nikad nije bila izmijenjena i poziv nije uspjesan pa se polja sakrivaju  
                    hideKlikoviAndPretrageFields(nekretnineDivs);     
                }                       
                else {
                    // ažuriraj se podacima posljednje sesije
                    updateFieldsWithNewData(nekretnineDivs,sessionNekretnina)
                }
                        
              });
          } 
        else {
              fetch('http://localhost:3000/marketing/osvjezi', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({}), 
              })
                  .then(response => response.json())
                  .then(data => {
                    console.log("OSVJEZAVANJE SE DESILO")
                    updateKlikoviwithNewData(nekretnineDivs,data)
                  })
                  .catch(error => {
                    console.log("OSVJEZAVANJE SE DESILO NENORMALNO")
                    // ažuriraj se podacima posljednje sesije
                    updateKlikoviWithNewData(nekretnineDivs,sessionNekretnina)
                });
        }
    }, 500);
  }

  function impl_osvjeziPretrage(divReferenca) {
    setInterval(() => {
        const nekretnineDivs = divReferenca.querySelectorAll('.grid-item1, .grid-item2, .grid-item3');

        const idNekretninaArray = Array.from(nekretnineDivs).map((nekretninaDiv) => parseInt(nekretninaDiv.id));

        let sessionNekretninaIds = sessionNekretnina ? sessionNekretnina.nizNekretnina.map(nekretnina => nekretnina.id) : []

        const sortedIdNekretninaArrays = idNekretninaArray.slice().sort();
        const sortedSessionNekretninaIds = sessionNekretninaIds.slice().sort();

        // poziva se pri svakom filtriranju, i prvobitnom kad je sesija prazna
        if (sessionNekretninaIds.length === 0 || JSON.stringify(sortedIdNekretninaArrays) !== JSON.stringify(sortedSessionNekretninaIds) ){

            console.log("idNekretninaArrays:",idNekretninaArray);
            console.log("sessionNekretninaIds:",sessionNekretninaIds);
            if (filtiranje) {
                console.log("FILTIRANJE SE DESILO VOL2");
                requestBody = JSON.stringify({ nizNekretnina: idNekretninaArray });
            }
            else{
                requestBody = JSON.stringify({});
            }

            fetch('http://localhost:3000/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            })
            .then(response => response.json())
            .then(data => {
                updatePretrageWithNewData(nekretnineDivs,data)
            })
            .catch(error => {    
                  if(sessionNekretninaIds.length === 0){
                      // sesija nikad nije bila izmijenjena i poziv nije uspjesan pa se polja sakrivaju  
                      hideKlikoviAndPretrageFields(nekretnineDivs);     
                  }                       
                  else {
                      // ažuriraj se podacima posljednje sesije
                      updatePretrageWithNewData(nekretnineDivs,sessionNekretnina)
                  }
                      
            });
        } else {
            fetch('http://localhost:3000/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), 
            })
                .then(response => response.json())
                .then(data => {
                    console.log("OSVJEZAVANJE SE DESILO NORMALNO VOL2")
                    updatePretrageWithNewData(nekretnineDivs,data)
                })
                .catch(error => {
                    console.log("OSVJEZAVANJE SE DESILO NENORMALNO VOL2")
                    // ažuriraj se podacima posljednje sesije
                    updatePretrageWithNewData(nekretnineDivs,sessionNekretnina)
                });
        }
  }, 500);

  }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
    };
})();
