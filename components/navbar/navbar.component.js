import router from "../../app.js";

const NAVBAR_ELEMENT = document.getElementById("navbar");

function NavbarComponent() {

    let templateHolder = "";
    let fragment = "components/navbar/navbar.component";

    function navigate(e) {
        router.navigate(e.target.dataset.route);
    }

    function injectTemplate(callback) {
        if (templateHolder) {
            NAVBAR_ELEMENT.innerHTML = templateHolder;
        } else {
            fetch(`${fragment}.html`)
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
        let stylesheet = document.getElementById("nav-css");
        if (stylesheet) {
            stylesheet.remove();
        }
        stylesheet = document.createElement("link");
        stylesheet.id = "nav-css";
        stylesheet.rel = "stylesheet";
        stylesheet.href = `${fragment}.css`;
        document.head.appendChild(stylesheet);
    }

    this.render = function() {
        injectTemplate(() => {
            // document.getElementById("logout").addEventListener("click", logout);
            // document.getElementById("nav-to-login").addEventListener("click", navigate);
            // document.getElementById("nav-to-register").addEventListener("click", navigate);
            // document.getElementById("nav-to-dashboard").addEventListener("click", navigate);
        });
        injectStylesheet();
    }
}

export default new NavbarComponent();