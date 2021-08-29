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






    let updateCourseElement;
    let updateButton;



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






    /////////////////DELETE COURSE/////////////////

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
            updateErrorMessage("Something went wrong")
            return;
        }
        displayCourses(tableElement, 4, ...payload);
        getOpenCourses()
    }




    function deletedCourse(e) {
            del_input = e.target.value;
            console.log(del_input);
        }


    async function deleteCourse() {
        if (!del_input) {
            updateErrorMessage("Can't leave field blank or course doesnt exist");
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
            del_input.value="";

        } catch (e) {
            console.log(e);
        }
    }


    function renderDelete(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
        }else {
            console.log(payload);

        }



    }

    ///////////////END delete logic//////////////////




    ////////// Update course ///////////////
    let courseToUpdate="";
    let fieldToUpdate ="";
    let updateTo ="";


    function update_course(e) {
        courseToUpdate = e.target.value;
        console.log(courseToUpdate);
    }
    function field_to_Update(e) {
        fieldToUpdate = e.target.value;
        console.log(fieldToUpdate);
    }
    function UpdateTo(e) {
        updateTo = e.target.value;
        console.log(updateTo);
    }




    async function updateACourse(){
        if (!courseToUpdate || !fieldToUpdate || !updateTo) {
            updateErrorMessage("Can't leave field blank or course doesnt exist")
            return;
        } else {
            updateErrorMessage("");


        }
        let courseUpdater = {
            course_code:courseToUpdate,
            field:fieldToUpdate,
            updateTo:updateTo
        };
        console.log(courseUpdater)
        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(courseUpdater)
            });

            let data = await response.json();
            update(data);

            courseToUpdate.value="";
            fieldToUpdate.value="";
            updateTo.value="";

        } catch (e) {
            console.log(e);
        }
    }

    function update(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);

        }else
            console.log(payload);
    }





    async function getCourseUpdate() {

        try {
            let response = await fetch(`${env.apiUrl}/course`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            let data = await response.json();
            renderAllUpdate(data);
        } catch (e) {
            console.log(e);
        }
    }

    function renderAllUpdate(payload) {
        if (payload.statusCode === 401) {
            updateErrorMessage(payload.message);
            return;
        }
        displayCourses(updateCourseElement, 4, ...payload)
        getCourseUpdate()

    }


    ///////////END UPDATE course/////////////






    ////////Render Method//////////////
        let welcomeUserElement;
        this.render = function () {

            console.log(state);

            if (!state.authUser) {
                router.navigate('/login');
                return;
            }

            let currentUsername = state.authUser.username;

            FacultyDashboardComponent.prototype.injectTemplate(() => {

                courseNameElement = document.getElementById('create-form-courseName');
                courseCodeElement = document.getElementById('create-form-courseCode');
                startDateElement = document.getElementById('create-form-startDate');
                endDateElement = document.getElementById('create-form-endDate');
                createCourseButton = document.getElementById('create-course-button');
                errorMessageElement = document.getElementById('error-msg');
                tableElement = document.getElementById('delete-course-body');
                courseToUpdate=document.getElementById('Update-course-form')
                fieldToUpdate=document.getElementById('Update-field-form')
                updateTo=document.getElementById('Update-To-form')
                deleteButton = document.getElementById('delete-course-button');
                deleted_Course = document.getElementById("delete-course-form");


                updateCourseElement=document.getElementById('update-course-body');
                updateButton=document.getElementById('Update-course-button')


                deleted_Course.addEventListener('keyup', deletedCourse)
                deleteButton.addEventListener('click', deleteCourse)

                updateButton.addEventListener('click', updateACourse)
                courseToUpdate.addEventListener('keyup', update_course)
                fieldToUpdate.addEventListener('keyup', field_to_Update)
                updateTo.addEventListener('keyup', UpdateTo)
                courseNameElement.addEventListener('keyup', updatecourse_name);
                courseCodeElement.addEventListener('keyup', updatecourse_code);
                startDateElement.addEventListener('keyup', updatestart_date);
                endDateElement.addEventListener('keyup', updateend_date);
                createCourseButton.addEventListener('click', createCourse);
                getOpenCourses()
                getCourseUpdate()
                welcomeUserElement = document.getElementById('welcome-user');


                welcomeUserElement.innerText = currentUsername;


            });
            FacultyDashboardComponent.prototype.injectStylesheet();
        }



}
export default new FacultyDashboardComponent();
