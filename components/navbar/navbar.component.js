import router from "../../app.js";
import state from "../../util/state.js";

const NAVBAR_ELEMENT = document.getElementById('navbar');

function NavbarComponent() {

    let logoutElement;
    let loginElement;
    let registerElement;

    let templateHolder = '';
    let frag = 'components/navbar/navbar.component';

    function injectTemplate(callback) {

        if (templateHolder) {
            NAVBAR_ELEMENT.innerHTML = templateHolder;
        } else {
            fetch(`${frag}.html`)
                .then(resp => resp.text())
                .then(html => {
                    templateHolder = html;
                    NAVBAR_ELEMENT.innerHTML = templateHolder;
                    callback();
                })
                .catch(err => console.error(err));
        }
    }

    function injectStylesheet() {
        let dynamicStyle = document.getElementById('nav-css');
        if (dynamicStyle) dynamicStyle.remove();
        dynamicStyle = document.createElement('link');
        dynamicStyle.id = 'nav-css';
        dynamicStyle.rel = 'stylesheet';
        dynamicStyle.href = `${frag}.css`;
        document.head.appendChild(dynamicStyle);
    }

    function navigateToView(e) {
        router.navigate(e.target.dataset.route);
    }

    function logout() {
        state.authUser = null;
        state.token = null;
        logoutElement.setAttribute("hidden", "true");
        loginElement.removeAttribute("hidden");
        registerElement.removeElement("hidden");
        router.navigate("/login");
    }

    this.render = function() {
        injectStylesheet();
        injectTemplate(() => {
            document.getElementById("home").addEventListener("click", navigateToView);
            logoutElement = document.getElementById('logout');
            loginElement = document.getElementById('nav-to-login');
            registerElement = document.getElementById('nav-to-register');

            logoutElement.addEventListener("click", logout);
            loginElement.addEventListener("click", navigateToView);
            registerElement.addEventListener('click', navigateToView);
        });
    }

}

export default new NavbarComponent();