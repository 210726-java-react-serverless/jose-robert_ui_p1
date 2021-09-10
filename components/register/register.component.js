import router from '../../app.js';
import env from '../../util/env.js';
import { ViewComponent } from '../view.component.js';

RegisterComponent.prototype = new ViewComponent('register');
function RegisterComponent() {

    let accountFormElement;
    let studentFormElement;
    let facultyFormElement;
    let registerFormElement;
    let studentCheckboxElement;
    let facultyCheckboxElement;
    let majorFieldElement;
    let salaryFieldElement;
    let departmentFieldElement;
    let firstnameFieldElement;
    let lastnameFieldElement;
    let dobFieldElement;
    let phoneFieldElement;
    let usernameFieldElement;
    let emailFieldElement;
    let passwordFieldElement;
    let accountTypeButtonElement;
    let studentButtonElement;
    let facultyButtonElement;
    let registerButtonElement;
    let errorMessageElement;

    let major = "";
    let salary = "";
    let department = "";
    let firstname = "";
    let lastname = "";
    let dob = "";
    let phone = "";
    let username = "";
    let email = "";
    let password = "";

    let accountType = "";

    function updateMajor(e) {
        major = e.target.value;
        console.log(major);
    }

    function updateSalary(e) {
        salary = e.target.value;
        console.log(salary);
    }

    function updateDepartment(e) {
        department = e.target.value;
        console.log(department);
    }

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

    function getNextForm() {
        if (studentCheckboxElement.checked) {
            accountFormElement.setAttribute("hidden", "true");
            studentFormElement.removeAttribute("hidden");
            accountType = "student";
        } else if (facultyCheckboxElement.checked) {
            accountFormElement.setAttribute("hidden", "true");
            facultyFormElement.removeAttribute("hidden");
            accountType = "faculty";
        } else {
            updateErrorMessage("Please select an option!");
            return;
        }
    }

    function getRegisterForm() {
        console.log(accountType);
        if (accountType === "student") {
            if (!major) {
                updateErrorMessage("Please provide a major and try again!");
                return;
            } else {
                updateErrorMessage("");
            }

            studentFormElement.setAttribute("hidden", "true");
            registerFormElement.removeAttribute("hidden");
        } else if (accountType === "faculty") {
            if (!salary || !department) {
                updateErrorMessage("Please fill in missing fields and try again!");
                return;
            } else {
                updateErrorMessage("");
            }

            facultyFormElement.setAttribute("hidden", "true");
            registerFormElement.removeAttribute("hidden");
        } else {
            updateErrorMessage("An unexpected error occured. Please try again later.");
            return;
        }


    }

    async function register() {
        if (!firstname || !lastname || !dob || !phone || !username || !email || !password) {
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
        
        let credentials = (accountType === "student") ? { major: major, user: user } : { salary: salary, department: department, user: user };
        let url = (accountType === "student") ? `${env.apiUrl}/students` : `${env.apiUrl}/faculty`;
        
        try {
            let response = await fetch(url, {
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
    }

    function renderResponse(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        } else {
            router.navigate("/login");
        }
    }

    this.render = function() {

        RegisterComponent.prototype.injectTemplate(() => {
            accountFormElement = document.getElementById("account-form");
            studentFormElement = document.getElementById("student-form");
            facultyFormElement = document.getElementById("faculty-form");
            registerFormElement = document.getElementById("register-form");
            studentCheckboxElement = document.getElementById("account-form-student-checkbox");
            facultyCheckboxElement = document.getElementById("account-form-faculty-checkbox");
            majorFieldElement = document.getElementById("student-form-major");
            salaryFieldElement = document.getElementById("faculty-form-salary");
            departmentFieldElement = document.getElementById("faculty-form-department");
            firstnameFieldElement = document.getElementById("register-form-firstname");
            lastnameFieldElement = document.getElementById("register-form-lastname");
            dobFieldElement = document.getElementById("register-form-dob");
            phoneFieldElement = document.getElementById("register-form-phone");
            usernameFieldElement = document.getElementById("register-form-username");
            emailFieldElement = document.getElementById("register-form-email");
            passwordFieldElement = document.getElementById("register-form-password");
            accountTypeButtonElement = document.getElementById("account-form-button");
            studentButtonElement = document.getElementById("student-form-button");
            facultyButtonElement = document.getElementById("faculty-form-button");
            registerButtonElement = document.getElementById("register-form-button");
            errorMessageElement = document.getElementById("error-msg");

            majorFieldElement.addEventListener('keyup', updateMajor);
            salaryFieldElement.addEventListener('keyup', updateSalary);
            departmentFieldElement.addEventListener('keyup', updateDepartment);
            firstnameFieldElement.addEventListener('keyup', updateFirstname);
            lastnameFieldElement.addEventListener('keyup', updateLastname);
            dobFieldElement.addEventListener('keyup', updateBirthday);
            phoneFieldElement.addEventListener('keyup', updatePhone);
            usernameFieldElement.addEventListener('keyup', updateUsername);
            emailFieldElement.addEventListener('keyup', updateEmail);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            accountTypeButtonElement.addEventListener('click', getNextForm);
            studentButtonElement.addEventListener('click', getRegisterForm);
            facultyButtonElement.addEventListener('click', getRegisterForm);
            registerButtonElement.addEventListener('click', register);
        });
        RegisterComponent.prototype.injectStylesheet();
    }

}

export default new RegisterComponent();