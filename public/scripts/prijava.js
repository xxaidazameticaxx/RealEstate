const loginForm = document.querySelector('.login-form');

    loginForm.addEventListener('submit', async (event) =>{
        event.preventDefault(); 
        
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        PoziviAjax.postLogin(username, password, (error, data) => {
            if (error) {
                console.error('Login error:', error);
            } else {
                localStorage.setItem('username', username);
                window.location.href = 'http://localhost:3000/nekretnine.html';
            }
        });
    });

