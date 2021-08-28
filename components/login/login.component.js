import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

LoginComponent.prototype = new ViewComponent('login');
function LoginComponent() {

    let usernameFieldElement;
    let passwordFieldElement;
    let studentCheckFieldElement;
    let facultyCheckFieldElement;
    let loginButtonElement;
    let errorMessageElement;

    let username = '';
    let password = '';

    function updateUsername(e) {
        username = e.target.value;
        console.log(username);
    }

    function updatePassword(e) {
        password = e.target.value;
        console.log(password);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

    async function login() {
        if (!username || !password) {
            updateErrorMessage('You need to provide a username and a password!');
            return;
        } else {
            updateErrorMessage('');
        }
        
        let accountType = "";

        if (studentCheckFieldElement.checked) {
            accountType = "student";
        } else if (facultyCheckFieldElement.checked) {
            accountType = "faculty";
        } else {
            return;
        }

        let credentials = {
            username: username,
            password: password
        };

        let url = (accountType === "student") ? `${env.apiUrl}/auth` : `${env.apiUrl}/faculty/auth`;

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            let token = response.headers.get("Authorization");
            state.token = token;
            
            let data = await response.json();

            renderResponse(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderResponse(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        } else {
            document.getElementById("nav-to-login").setAttribute("hidden", "true");
            document.getElementById("nav-to-register").setAttribute("hidden", "true");
            document.getElementById("logout").removeAttribute("hidden");
            state.authUser = payload;
            router.navigate("/dashboard");
        }
    }


    this.render = function() {
        LoginComponent.prototype.injectStylesheet();
        LoginComponent.prototype.injectTemplate(() => {
            usernameFieldElement = document.getElementById('login-form-username');
            passwordFieldElement = document.getElementById('login-form-password');;
            studentCheckFieldElement = document.getElementById('student-checkbox');
            facultyCheckFieldElement = document.getElementById('faculty-checkbox');
            loginButtonElement = document.getElementById('login-form-button');;
            errorMessageElement = document.getElementById('error-msg');

            usernameFieldElement.addEventListener('keyup', updateUsername);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            loginButtonElement.addEventListener('click', login);
        });
    }
}

export default new LoginComponent();