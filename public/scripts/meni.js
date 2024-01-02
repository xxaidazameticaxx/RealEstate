const menuList = document.getElementById('menu-list');

if (localStorage.getItem('username')){
    loggedInUser();
}
else{
    loggedOutUser();
}

function loggedInUser(){
    menuList.innerHTML="";
    const options = ['Profil', 'Nekretnine', 'Detalji', 'Odjava'];
    options.forEach(option => {
        const li = document.createElement('li');

        if (option === 'Odjava') {
            const button = document.createElement('button');
            button.textContent = 'Odjava';
            button.addEventListener('click', logout);
            li.appendChild(button);
        } else {
            const a = document.createElement('a');
            a.textContent = option;
            a.addEventListener('click', navigateToPage);
            li.appendChild(a);
        }

        menuList.appendChild(li);
    });
}

function loggedOutUser(){
    // User is not logged in
    menuList.innerHTML="";
    const options = ['Nekretnine', 'Detalji', 'Prijava'];
    options.forEach(option => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = option;
        a.addEventListener('click', navigateToPage);
        li.appendChild(a);
        menuList.appendChild(li);
    });
}
  
function navigateToPage(event) {
    event.preventDefault();
    const page = event.target.textContent.toLowerCase() + '.html';
    window.top.location.href = page;
}

function logout() {
    PoziviAjax.postLogout((error, data) => {
        if (error) {
            console.error('Logout error:', error);
        } else {
            localStorage.removeItem('username');
            loggedOutUser();
        }
    });
}
