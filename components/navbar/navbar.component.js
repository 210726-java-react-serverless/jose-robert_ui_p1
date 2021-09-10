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
        document.getElementById("nav-to-login").removeAttribute("hidden");
        document.getElementById("nav-to-register").removeAttribute("hidden");
        document.getElementById("logout").setAttribute("hidden", "true");
        router.navigate("/login");
    }

    this.render = function() {

        injectTemplate(() => {
            logoutElement = document.getElementById('logout');
            loginElement = document.getElementById('nav-to-login');
            registerElement = document.getElementById('nav-to-register');

            logoutElement.addEventListener("click", logout);
            loginElement.addEventListener("click", navigateToView);
            registerElement.addEventListener('click', navigateToView);
        });
        injectStylesheet();
    }

}

export default new NavbarComponent();