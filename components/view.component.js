import env from "../utils/env.js";

export function ViewComponent(viewName) {

    let templateHolder = "";
    let fragment = `components/${viewName}/${viewName}.component`;

    this.viewMetadata = {
        name: viewName,
        url: `/${viewName}`,
        templateUri: `${fragment}.html`,
        stylesheetUri: `${fragment}.css`
    };

    this.injectTemplate = function(callback) {
        if (templateHolder) {
            console.log(`Already fetched ${viewName} template, using internally stored templateHolder`);
            env.rootDiv.innerHTML = templateHolder;
            callback();
        } else {
            console.log(`Fetching ${viewName} template`);
            fetch(this.viewMetadata.templateUri)
                .then(resp => resp.text())
                .then(html => {
                    templateHolder = html;
                    env.rootDiv.innerHTML = templateHolder;
                    callback();
                })
                .catch(err => console.error(err));
        }
    }

    this.injectStylesheet = function() {
        let stylesheet = document.getElementById("dynamic-css");
        if (stylesheet) {
            stylesheet.remove();
        }
        stylesheet = document.createElement("link");
        stylesheet.id = "dynamic-css";
        stylesheet.rel = "stylesheet";
        stylesheet.href = this.viewMetadata.stylesheetUri;
        document.head.appendChild(stylesheet);
    }
}