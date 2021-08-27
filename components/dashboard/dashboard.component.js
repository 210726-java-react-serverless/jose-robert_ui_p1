import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

DashboardComponent.prototype = new ViewComponent("dashboard");
function DashboardComponent() {

    let welcomeUserElement;
    let addTableElement;
    let dropTableElement;
    let tableElement;
    let myCourseElement;
    let addCourseElement;
    let dropCourseElement;
    let viewCourseElement;

    // Get the students schedule
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

    // Get all courses
    async function getAllCourses() {
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
    }

    // Displays courses
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
            addTableElement = document.getElementById("add-table-body");
            dropTableElement = document.getElementById("drop-table-body");
            tableElement = document.getElementById("table-body");
            addCourseElement = document.getElementById("add-class-tab");
            dropCourseElement = document.getElementById("drop-class-tab");
            viewCourseElement = document.getElementById("view-course-tab");

            welcomeUserElement.innerText = currentUsername;
            addCourseElement.addEventListener("click", getOpenCourses);
            dropCourseElement.addEventListener("click", droppableCourses);
            viewCourseElement.addEventListener("click", getAllCourses);
            getMyCourses(); // get schedule on startup
        });

    }

    async function getOpenCourses() {
        try {
            let response = await fetch(`${env.apiUrl}/course?available=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            let data = await response.json();
            renderAddable(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderAddable(payload) {
        addAndDrop(addTableElement, "add", ...payload);
    }

    async function droppableCourses() {
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

            renderDroppable(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderDroppable(payload) {
        addAndDrop(dropTableElement, "drop", ...payload);
    }

    function addAndDrop(tableElement, context, ...list) {
        if (tableElement.hasChildNodes()) {
            tableElement.innerHTML = "";
        }

        for (let item of list) {
            let tr = document.createElement("tr");
            let name = document.createElement("td");
            let code = document.createElement("td");
            let start = document.createElement("td");
            let end = document.createElement("td");
            let btnContainer = document.createElement("td");
            let btn = document.createElement("button");

            name.innerText = item.course_name;
            code.innerText = item.course_code;
            start.innerText = item.start_date;
            end.innerText = item.end_date;
            
            if (context === "drop") {
                btn.innerText = "Drop";
            } else {
                btn.innerText = "Add";
            }

            btn.addEventListener("click", function() {
                if (context === "drop") {
                    dropClass(item.course_code);
                } else if (context === "add") {
                    addClass(item.course_code);
                }
            });

            tr.appendChild(name);
            tr.appendChild(code);
            tr.appendChild(start);
            tr.appendChild(end);
            tr.appendChild(btnContainer);
            btnContainer.appendChild(btn);
            tableElement.append(tr);
        }
    }

    async function dropClass(code) {
        let params = `?user_name=${state.authUser.username}&course_code=${code}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            if (response.status === 204) {
                console.log("Successfully unregistered from course!");
                // reset the drop and my schedule list
                getMyCourses();
                droppableCourses();
            } else {
                console.error("An unexpected error occurred");
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    async function addClass(code) {
        let params = `?user_name=${state.authUser.username}&course_code=${code}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });
            if (response.status === 200) {
                getMyCourses();
            } else {
                console.error("An unexpected error occurred")
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default new DashboardComponent();