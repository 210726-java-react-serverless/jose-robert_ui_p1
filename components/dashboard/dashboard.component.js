import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let welcomeUserElement;
    let listElement;
    let button;
    
    function displayCourses(...courseList) {
        for (let item of courseList) {
            let listItem = document.createElement("li");
            listItem.innerText = item.course_name;

            let p1 = document.createElement("p");
            p1.innerText = item.course_code;

            let p2 = document.createElement("p");
            p2.innerText = item.start_date;

            let p3 = document.createElement("p");
            p3.innerText = item.end_date;

            listItem.appendChild(p1);
            listItem.appendChild(p2);
            listItem.appendChild(p3);
            listElement.append(listItem);
        }
    }

    async function getCourses() {
        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            let data = await response.json();

            renderCourses(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderCourses(payload) {
        displayCourses(...payload);
    }

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }

        let currentUsername = state.authUser.username;

        DashboardComponent.prototype.injectStylesheet();
        DashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            listElement = document.getElementById("list");
            button = document.getElementById("my-button");

            welcomeUserElement.innerText = currentUsername;
            button.addEventListener("click", getCourses);
        });

    }

}

export default new DashboardComponent();
