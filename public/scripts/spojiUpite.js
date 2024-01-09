PoziviAjax.getKorisnik((error, data) => {
    if (error) {
        hideUpitForm();
    } else {
        showUpitForm();
    }
});

function showUpitForm() {
    document.getElementById('upitForma').innerHTML = '';
  
    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'upitText';
    inputField.name = 'upitText';
    inputField.placeholder = 'Napisite svoj upit...';
  
    const button = document.createElement('button');
    button.textContent = 'Postavi ';
    button.id = 'postaviUpit'
    button.addEventListener('click', postaviUpit);

    document.getElementById('upitForma').appendChild(inputField);
    document.getElementById('upitForma').appendChild(button);
  }
  
  function hideUpitForm() {
    document.getElementById('upitForma').innerHTML = '';
    document.getElementById('postaviUpit').display = "none";
  }

  function callbackFunction(error, data) {
    if (error) {
        console.error("Error:", error);
    } else {
        var upit = document.getElementById('upitText').value; 
        addNewUpit(localStorage.getItem('username'), upit);
    }
}

function addNewUpit(username,tekstUpita) {
    const upitiDiv = document.getElementById('UPITI');

    upitiDiv.style.display = 'block';
    const li = document.createElement('li');
    li.innerHTML = `
        <p>
            <span>${username} </span>
        </p>
        <p>
            ${tekstUpita}
        </p>
    `;

    upitiDiv.querySelector('ul').appendChild(li);
}

  function postaviUpit() {  
    var upitText = document.getElementById('upitText').value; 
    console.log("upit", upitText);
    try {
        PoziviAjax.postUpit(localStorage.getItem('nekretnina_id'), upitText, callbackFunction);
    } catch (error) {
        console.error("Error:", error);
    }
}
