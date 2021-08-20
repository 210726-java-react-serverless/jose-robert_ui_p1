import router from '../../app.js';
import env from '../../util/env.js';
import { ViewComponent } from '../view.component.js';

RegisterComponent.prototype = new ViewComponent('register');
function RegisterComponent() {

    let firstnameFieldElement;
    let lastnameFieldElement;
    let dobFieldElement;
    let phoneFieldElement;
    let usernameFieldElement;
    let emailFieldElement;
    let majorFieldElement;
    let passwordFieldElement;
    let registerButtonElement;
    let errorMessageElement;

    let firstname = "";
    let lastname = "";
    let dob = "";
    let phone = "";
    let username = "";
    let email = "";
    let major = "";
    let password = "";


    function updateFirstname(e) {
        firstname = e.target.value;
        console.log(firstname);
    }

    function updateLastname(e) {
        lastname = e.target.value;
        console.log(lastname);
    }

    function updateBirthday(e) {
        dob = e.target.value;
        console.log(dob);
    }

    function updatePhone(e) {
        phone = e.target.value;
        console.log(phone);
    }
    
    function updateUsername(e) {
        username = e.target.value;
        console.log(username);
    }

    function updateEmail(e) {
        email = e.target.value;
        console.log(email);
    }

    function updateMajor(e) {
        major = e.target.value;
        console.log(major);
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

    async function register() {
        if (!firstname || !lastname || !username || !email || !password) {
            updateErrorMessage("You left a field empty. Please try again!");
            return;
        } else {
            updateErrorMessage("");
        }

        let user = {
            first_name: firstname,
            last_name: lastname,
            dob: dob,
            phone_num: phone,
            user_name: username,
            password: password,
            email: email
        };

        let credentials = {
            major: major,
            user: user
        };

        try {
            let response = await fetch(`${env.apiUrl}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });
            let data = await response.json();
            renderResponse(data);
        } catch (e) {
            console.log(e);
        }

        // fetch(`${env.apiUrl}/students`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(credentials)
        // })
        //     .then(resp => {
        //         status = resp.status;
        //         return resp.json();
        //     })
        //     .then(payload => {
        //         if (status === 401) {
        //             updateErrorMessage(payload.message);
        //         } else {
        //             router.navigate("/login");
        //         }
        //     })
        //     .catch(err => console.error(err));
    }

    function renderResponse(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        } else {
            router.navigate("/login");
        }
    }

    this.render = function() {
        RegisterComponent.prototype.injectStylesheet();
        RegisterComponent.prototype.injectTemplate(() => {
            firstnameFieldElement = document.getElementById("register-form-firstname");
            lastnameFieldElement = document.getElementById("register-form-lastname");
            dobFieldElement = document.getElementById("register-form-dob");
            phoneFieldElement = document.getElementById("register-form-phone");
            usernameFieldElement = document.getElementById("register-form-username");
            emailFieldElement = document.getElementById("register-form-email");
            majorFieldElement = document.getElementById("register-form-major");
            passwordFieldElement = document.getElementById("register-form-password");
            registerButtonElement = document.getElementById("register-form-button");
            errorMessageElement = document.getElementById("error-msg");

            firstnameFieldElement.addEventListener('keyup', updateFirstname);
            lastnameFieldElement.addEventListener('keyup', updateLastname);
            dobFieldElement.addEventListener('keyup', updateBirthday);
            phoneFieldElement.addEventListener('keyup', updatePhone);
            usernameFieldElement.addEventListener('keyup', updateUsername);
            emailFieldElement.addEventListener('keyup', updateEmail);
            majorFieldElement.addEventListener('keyup', updateMajor);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            registerButtonElement.addEventListener('click', register);
        });
    }

}

export default new RegisterComponent();