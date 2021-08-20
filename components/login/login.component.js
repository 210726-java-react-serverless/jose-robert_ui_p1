import { ViewComponent } from "../view.component.js";
import env from "../../utils/env.js";
import router from "../../app.js";

LoginComponent.prototype = new ViewComponent("login");

function LoginComponent() {
    
    let usernameFieldEle;
    let passwordFieldEle;
    let loginBtnEle;
    let errorMsgEle;

    let username = "";
    let password = "";

    function updateUsername(e) {
        username = e.target.value;
        console.log(username);
    }

    function updatePassword(e) {
        password = e.target.value;
        console.log(password);
    }

    function updateErrorMsg(msg) {
        if (msg) {
            errorMsgEle.removeAttribute("hidden");
            errorMsgEle.innerText = msg;
        } else {
            errorMsgEle.setAttribute("hidden", "true");
            errorMsgEle.innerText = "";
        }
    }

    function login() {
        if (!username || !password) {
            updateErrorMsg("The credentials you provided are invalid!");
            return;
        } else {
            updateErrorMsg("");
        }

        let credentials = {
            username: username,
            password: password
        };

        let status = 0;

        fetch(`${env.apiUrl}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status === 401) {
                    updateErrorMsg(payload.message);
                }
            })
            .catch(err => console.error(err));
    }

    this.render = function() {
        LoginComponent.prototype.injectTemplate(() => {
            usernameFieldEle = document.getElementById("login-form-username");
            passwordFieldEle = document.getElementById("login-form-password");
            loginBtnEle = document.getElementById("login-form-button");
            errorMsgEle = document.getElementById("error-msg");

            usernameFieldEle.addEventListener("keyup", updateUsername);
            passwordFieldEle.addEventListener("keyup", updatePassword);
            loginBtnEle.addEventListener("click", login);
        });
        LoginComponent.prototype.injectStylesheet();
    }
}

export default new LoginComponent();