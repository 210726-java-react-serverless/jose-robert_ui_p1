import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';



FacultyDashboardComponent.prototype = new ViewComponent('facultyDashboard');
function FacultyDashboardComponent() {

    let courseNameElement;
    let courseCodeElement;
    let startDateElement;
    let endDateElement;
    let createCourseButton;
    let errorMessageElement;

    let del_input = "";
    let course_name = "";
    let course_code = "";
    let start_date = "";
    let end_date = "";


    let tableElement;
    let deleteButton;
    let deleted_Course ="";


    //////////////START Create course logic/////////////////
    function updatecourse_name(e) {
        course_name = e.target.value;
        console.log(course_name);
    }

    function updatecourse_code(e) {
        course_code = e.target.value;
        console.log(course_code);
    }

    function updatestart_date(e) {
        start_date = e.target.value;
        console.log(start_date);
    }

    function updateend_date(e) {
        end_date = e.target.value;
        console.log(end_date);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

    function renderCourses(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        } else {
            console.log(payload)

        }


    }

    async function createCourse() {
        if (!course_name || !course_code || !start_date || !end_date) {
            updateErrorMessage("Can't leave any fields blank")
            return;
        } else {
            updateErrorMessage("");


        }



        let course = {
            course_name: course_name,
            course_code: course_code,
            start_date: start_date,
            end_date: end_date
        };


        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(course)
            });

            let data = await response.json();

            renderCourses(data);
            courseNameElement.value = "";
            courseCodeElement.value = "";
            startDateElement.value = "";
            endDateElement.value = "";

        } catch (e) {
            console.log(e);
        }


    }

    /////////////////////END Create course logic////////////////////



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

    async function getOpenCourses() {
        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            let data = await response.json();
            renderAll(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderAll(payload) {
        if (payload.statusCode === 401) {
            // give error - can't access
            return;
        }
        displayCourses(tableElement, 4, ...payload);
    }



    /////////////////DELETE COURSE/////////////////


    function deletedCourse(e) {
            del_input = e.target.value;
            console.log(del_input);
        }


    async function deleteCourse() {
        if (!del_input) {
            updateErrorMessage("Can't leave field blank or course doesnt exist")
            return;
        } else {
            updateErrorMessage("");
        }

        try {
            let response = await fetch(`${env.apiUrl}/course?course_code=${del_input}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            let data = await response.json();
            renderDelete(data);

        } catch (e) {
            console.log(e);
        }
    }


    function renderDelete(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        } else {
            console.log(payload);
            getOpenCourses();
        }
    }





    ////////Render Method//////////////
        let welcomeUserElement;
        this.render = function () {

            console.log(state);

            if (!state.authUser) {
                router.navigate('/login');
                return;
            }

            let currentUsername = state.authUser.username;
            FacultyDashboardComponent.prototype.injectStylesheet();
            FacultyDashboardComponent.prototype.injectTemplate(() => {

                courseNameElement = document.getElementById('create-form-courseName');
                courseCodeElement = document.getElementById('create-form-courseCode');
                startDateElement = document.getElementById('create-form-startDate');
                endDateElement = document.getElementById('create-form-endDate');
                createCourseButton = document.getElementById('create-course-button');
                errorMessageElement = document.getElementById('error-msg');
                tableElement = document.getElementById('delete-course-body');

                document.getElementById("remove-course-container").addEventListener("click", getOpenCourses);
                deleteButton = document.getElementById('delete-course-button');
                deleted_Course = document.getElementById("delete-course-form");

                deleted_Course.addEventListener('keyup', deletedCourse)
                deleteButton.addEventListener('click', deleteCourse)


                courseNameElement.addEventListener('keyup', updatecourse_name);
                courseCodeElement.addEventListener('keyup', updatecourse_code);
                startDateElement.addEventListener('keyup', updatestart_date);
                endDateElement.addEventListener('keyup', updateend_date);
                createCourseButton.addEventListener('click', createCourse);
                welcomeUserElement = document.getElementById('welcome-user');


                welcomeUserElement.innerText = currentUsername;


            });

        }



}
export default new FacultyDashboardComponent();
