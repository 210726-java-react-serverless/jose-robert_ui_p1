import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let welcomeUserElement;
    let tableElement;
    let button;
    
    function displayCourses(...courseList) {
        if (tableElement.hasChildNodes()) {
            tableElement.innerHTML = "";
            return;
        }

        for (let item of courseList) {
            let tr = document.createElement("tr");
            let courseCode = document.createElement("td");
            let courseName = document.createElement("td");
            let startDate = document.createElement("td");
            let endDate = document.createElement("td");

            courseCode.innerText = item.course_code;
            courseName.innerText = item.course_name;
            startDate.innerText = item.start_date;
            endDate.innerText = item.end_date;

            tr.appendChild(courseCode);
            tr.appendChild(courseName);
            tr.appendChild(startDate);
            tr.appendChild(endDate);

            tableElement.appendChild(tr);
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
            tableElement = document.getElementById("table-body");
            button = document.getElementById("my-button");

            welcomeUserElement.innerText = currentUsername;
            button.addEventListener("click", getCourses);
        });

    }

}

export default new DashboardComponent();