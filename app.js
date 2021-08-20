import navbarComponent from "./components/navbar/navbar.component.js";
import loginComponent from "./components/login/login.component.js";
import { Router } from "./utils/router.js";

let routes = [
    {
        path: "/login",
        component: loginComponent
    }
];

const router = new Router(routes);

window.onload = () => {
    navbarComponent.render();
    router.navigate("/login");
}

export default router;