import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent("dashboard");
function DashboardComponent() {

    let welcomeUserElement;
    let tableElement;
    let myCourseElement;
    let contactTab;

    async function getMyCourses() {
        let params = `?user_name=${state.authUser.username}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify()
            });

            let data = await response.json();

            renderMyCourses(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderMyCourses(payload) {
        displayCourses(myCourseElement, 2, ...payload);
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
        if (payload.statusCode === 401) {
            // give error - can't access
            return;
        }
        displayCourses(tableElement, 4, ...payload);
        // displayCourses(document.getElementById("course-list"), 2, ...payload); // this is for testing
    }

    /**
     * iterate through a list of courses, populate a table, and append it to the update element
     * 
     * @param {*} updateElement - the element to update
     * @param {*} numElements - the number of 'td' to create
     * @param  {...any} courseList - the list of courses
     */
    function displayCourses(updateElement, numElements, ...courseList) {
        if (updateElement.hasChildNodes()) {
            updateElement.innerHTML = "";
        }

        for (let item of courseList) {
            let tr = document.createElement("tr");
            let count = 0;
            for (let prop in item) {
                if (prop !== "course_id" && count < numElements) {
                    let td = document.createElement("td");
                    td.innerText = item[prop];
                    tr.append(td);
                    count++
                }
            }
            updateElement.append(tr);
        }
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

            welcomeUserElement = document.getElementById("welcome-user");
            myCourseElement = document.getElementById("course-list");
            tableElement = document.getElementById("table-body");
            contactTab = document.getElementById("contact-tab");

            welcomeUserElement.innerText = currentUsername;

            contactTab.addEventListener("click", getCourses);
            getMyCourses();
        });

    }

}

export default new DashboardComponent();