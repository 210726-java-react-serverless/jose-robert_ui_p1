import navbarComponent from './components/navbar/navbar.component.js';
import loginComponent from './components/login/login.component.js';
import registerComponent from './components/register/register.component.js';
import dashboardComponent from './components/dashboard/dashboard.component.js';
import facultyDashboardComponent from './components/facultyDashboard/facultyDashboard.component.js'

import { Router } from "./util/router.js";

//-----------------------------------------------------------------------------------

let routes = [

    {
        path: '/login',
        component: loginComponent
    },
    {
        path: '/register',
        component: registerComponent
    },
    {
        path: '/dashboard',
        component: dashboardComponent
    },
    {
        path: '/facultyDashboard',
        component: facultyDashboardComponent
    }

];

const router = new Router(routes);

window.onload = () => {
    navbarComponent.render();
    router.navigate('/login');
}

export default router;