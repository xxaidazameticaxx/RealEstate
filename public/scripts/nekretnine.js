function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
  // pozivanje metode za filtriranje
  const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
  // kreiranje grid-container
  gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-container');
  divReferenca.appendChild(gridContainer);

  // dodavanje elemenata u grid-container
  gridContainer.innerHTML = "";

  filtriraneNekretnine.forEach(nekretnina => {
    const divItem = document.createElement('div');
    if (tip_nekretnine === 'Stan')
      divItem.classList.add('grid-item1');
    else if (tip_nekretnine === 'Kuca')
      divItem.classList.add('grid-item2');
    else
      divItem.classList.add('grid-item3');
    divItem.innerHTML = `
      <img src="${nekretnina.slika}" alt="picture">
      <h3 class="naziv">${nekretnina.naziv}</h3>
      <p class="kvadratura">${nekretnina.kvadratura} m<sup>2</sup></p>
      <p class="cijena">${nekretnina.cijena} KM</p>
      <button class="button">Detalji</button>
    `;

    gridContainer.appendChild(divItem);
  });
}

    const divStan = document.getElementById("stan");
    const divKuca = document.getElementById("kuca");
    const divPp = document.getElementById("pp");
    
    //instanciranje modula
    let nekretnine = SpisakNekretnina();

    PoziviAjax.getNekretnine((error, data) => {
      if (error) {
          console.error(error);
          return;
      }
      nekretnine.init(data,null);
      
      //pozivanje funkcije
      spojiNekretnine(divStan, nekretnine, "Stan");
      spojiNekretnine(divKuca, nekretnine, "Kuća");
      spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    });

    

    