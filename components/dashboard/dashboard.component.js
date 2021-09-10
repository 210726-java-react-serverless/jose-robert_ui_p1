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

    /**
     * Get the schedule of the currently logged in user
     */
    async function getMyCourses() {
        let params = `?user_name=${state.authUser.username}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
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

    /**
     * Returns all courses, regardless of whether they are within registration
     * date
     */
    async function getAllCourses() {
        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
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
            return;
        }
        displayCourses(tableElement, 4, ...payload);
    }

    /**
     * Takes in an element to update, the number of elements to read, and a
     * list of courses. Will use this information to generate a table
     * of courses
     * 
     * @param {*} updateElement 
     * @param {*} numElements 
     * @param  {...any} courseList 
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

    /**
     * This function will fetch all courses that students can register for.
     */
    async function openCourseList() {
        try {
            let response = await fetch(`${env.apiUrl}/course?available=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
                },
                body: JSON.stringify()
            });

            let data = await response.json();
            renderAdd(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderAdd(payload) {
        addCourse(...payload);
    }

    /**
     * This function will fetch the students schedule and allow them to drop the course
     */
    async function dropCourseList() {
        let params = `?user_name=${state.authUser.username}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
                },
                body: JSON.stringify()
            });

            let data = await response.json();

            renderDrop(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderDrop(payload) {
        dropCourse(...payload);
    }

    /**
     * This function generates the tables using the list of courses.
     * It also allows students to add a course to their schedule.
     */
    function addCourse(...list) {
        if (addTableElement.hasChildNodes()) {
            addTableElement.innerHTML = "";
        }

        for (let item of list) {
            let tr = document.createElement("tr");
            let count = 0;
            for (let prop in item) {
                if (prop !== "course_id" && count < 4) {
                    let td = document.createElement("td");
                    td.innerText = item[prop];
                    tr.append(td);
                    count++;
                }
            }
            let btnContainer = document.createElement("td");
            let addBtn = document.createElement("button");
            addBtn.innerText = "Add";
            addBtn.addEventListener("click", function() {
                addClass(item.course_code)
            });

            btnContainer.append(addBtn);
            tr.append(btnContainer);
            addTableElement.append(tr);
        }
    }

    /**
     * This function generates a table with courses a student is registered for.
     * Students can also drop a course if it's on their schedule.
     */
    function dropCourse(...list) {
        if (dropTableElement.hasChildNodes()) {
            dropTableElement.innerHTML = "";
        }

        for (let item of list) {
            let tr = document.createElement("tr");
            let count = 0;
            for (let prop in item) {
                if (prop !== "course_id" && count < 4) {
                    let td = document.createElement("td");
                    td.innerText = item[prop];
                    tr.append(td);
                    count++;
                }
            }
            let btnContainer = document.createElement("td");
            let dropBtn = document.createElement("button");
            dropBtn.innerText = "Drop";
            dropBtn.addEventListener("click", function() {
                dropClass(item.course_code);
            });

            btnContainer.append(dropBtn);
            tr.append(btnContainer);
            dropTableElement.append(tr);
        }
    }

    /**
     * This function calls the API to drop a specified course. It takes in a
     * course_code as a parameter
     * 
     * @param {*} code 
     */
    async function dropClass(code) {
        let params = `?user_name=${state.authUser.username}&course_code=${code}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
                },
                body: JSON.stringify()
            });

            if (response.status === 204) {
                console.log("Successfully unregistered from course!");
                // reset the drop and my schedule list
                getMyCourses();
                dropCourseList();
            } else {
                console.error("An unexpected error occurred");
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    /**
     * This function takes in a course_code. From there, it calls the API
     * to add the course to their schedule
     * 
     * @param {*} code 
     */
    async function addClass(code) {
        let params = `?user_name=${state.authUser.username}&course_code=${code}`;
        try {
            let response = await fetch(`${env.apiUrl}/register${params}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": state.token
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

    this.render = function() {
        console.log(state);
        if (!state.authUser) {
            router.navigate('/login');
            return;
        }

        let currentUsername = state.authUser.username.toUpperCase();


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
            addCourseElement.addEventListener("click", openCourseList);
            dropCourseElement.addEventListener("click", dropCourseList);
            viewCourseElement.addEventListener("click", getAllCourses);
            
            getMyCourses();
            openCourseList();
        });
        DashboardComponent.prototype.injectStylesheet();
    }
}

export default new DashboardComponent();