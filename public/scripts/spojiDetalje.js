

function callbackFunction(error, data) {
    if (error) {
        console.error("Error:", error);
    } else {
        updateOsnovnoDetailsDiv(data);
        const upiti = data.Upits;
        updateUpitiDiv(upiti);
        console.log("upiti",upiti);
    }
}

function updateOsnovnoDetailsDiv(nekretnina) {
    const osnovnoDiv = document.getElementById('osnovno');
    
    osnovnoDiv.innerHTML = `
        <img src="../pictures/lina-volkmann-KHz5tDDKCXA-unsplash.jpg" alt="Details slika">
        <h3>OSNOVNO</h3>  
        <table>
            <tr>
                <td>
                    <p>
                        <span>Naziv: </span>${nekretnina.naziv}
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        <span>Kvadratura: </span>${nekretnina.kvadratura} m2
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        <span>Cijena: </span>${nekretnina.cijena} KM
                    </p>
                </td>
            </tr>
        </table>
    `;

    const detaljiDiv = document.getElementById('detalji');
    
    detaljiDiv.innerHTML = `
        <h3>DETALJI</h3>
        <table>
            <tr>
                <td>
                    <p>
                        <span>Tip grijanja: </span>${nekretnina.tip_grijanja}
                    </p>
                </td>
                <td>
                    <p>
                        <span>Godina izgradnje: </span>${nekretnina.godina_izgradnje}
                    </p> 
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        <span>Lokacija: </span>${nekretnina.lokacija}
                    </p>
                </td>  
                <td>
                    <p>
                        <span>Datum objave: </span>${nekretnina.datum_objave}
                    </p>
                </td>   
            </tr> 
            <tr>
                <td colspan="2">
                    <p>
                        <span>Opis: </span>${nekretnina.opis}
                    </p>
                </td>   
            </tr>  
        </table>
    `;
}

function updateUpitiDiv(upiti) {

    const upitiDiv = document.getElementById('UPITI');
    console.log("ovo su upiti",upiti);
    if (upiti && Array.isArray(upiti) && upiti.length > 0) {
        const ul = document.createElement('ul');
        upiti.forEach(upit => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p>
                    <span>${upit.Korisnik.username} </span>
                </p>
                <p>
                    ${upit.tekst_upita}
                </p>
            `;
            ul.appendChild(li);
        });

        upitiDiv.appendChild(ul);

    } else {
        upitiDiv.style.display = 'none';
    }
}

const localStorageData = localStorage.getItem('nekretnina_id')
if (localStorageData){
    PoziviAjax.getNekretninaById(localStorageData, callbackFunction);
}




      
      
      
      
      