// =============================================
// api.js – All API calls to the backend
// Base URL of the ASP.NET Core Web API
// =============================================

const BASE_URL = 'http://localhost:5000/api';

// Store the JWT token in memory after login
let jwtToken = null;

// Save token after login/register
function saveToken(token) {
    jwtToken = token;
}

// Clear token on logout
function clearToken() {
    jwtToken = null;
}

// Generic fetch helper – sends request and returns JSON response
async function sendRequest(url, method, body) {
    // Build request headers
    const headers = {
        'Content-Type': 'application/json'
    };

    // Attach JWT token if available
    if (jwtToken) {
        headers['Authorization'] = 'Bearer ' + jwtToken;
    }

    // Build request options
    const options = {
        method: method,
        headers: headers
    };

    // Attach body for POST/PUT/DELETE requests
    if (body) {
        options.body = JSON.stringify(body);
    }

    // Send the request
    const response = await fetch(url, options);
    const data = await response.json().catch(function() { return {}; });

    // If response is not OK (e.g. 400, 401, 404), throw error
    if (!response.ok) {
        throw new Error(data.error || 'Request failed with status ' + response.status);
    }

    return data;
}

// ── Auth ──────────────────────────────────────
async function loginUser(email, password) {
    const body = { email: email, password: password };
    return await sendRequest(BASE_URL + '/auth/login', 'POST', body);
}

async function registerUser(name, email, phone, password, role) {
    const body = { name: name, email: email, phone: phone, password: password, role: role };
    return await sendRequest(BASE_URL + '/auth/register', 'POST', body);
}

// ── Departments ───────────────────────────────
async function getDepartments() {
    return await sendRequest(BASE_URL + '/departments', 'GET', null);
}

// ── Courses ───────────────────────────────────
async function getCourses(search, departmentId) {
    let url = BASE_URL + '/courses?';
    if (search) url += 'search=' + search + '&';
    if (departmentId) url += 'departmentId=' + departmentId;
    return await sendRequest(url, 'GET', null);
}

async function createCourse(courseName, departmentId, credits, totalSeats) {
    const body = {
        courseName: courseName,
        departmentId: departmentId,
        credits: credits,
        totalSeats: totalSeats
    };
    return await sendRequest(BASE_URL + '/courses', 'POST', body);
}

async function updateCourse(courseId, courseName, departmentId, credits, totalSeats) {
    const body = {
        courseName: courseName,
        departmentId: departmentId,
        credits: credits,
        totalSeats: totalSeats
    };
    return await sendRequest(BASE_URL + '/courses/' + courseId, 'PUT', body);
}

async function deleteCourse(courseId) {
    return await sendRequest(BASE_URL + '/courses/' + courseId, 'DELETE', null);
}

// ── Enrollments ───────────────────────────────
async function getMyEnrollments(studentId) {
    return await sendRequest(BASE_URL + '/enrollments/student/' + studentId, 'GET', null);
}

async function getAllEnrollments() {
    return await sendRequest(BASE_URL + '/enrollments', 'GET', null);
}

async function enrollInCourse(studentId, courseId) {
    const body = { studentId: studentId, courseId: courseId };
    return await sendRequest(BASE_URL + '/enrollments', 'POST', body);
}

async function dropFromCourse(studentId, courseId) {
    const body = { studentId: studentId, courseId: courseId };
    return await sendRequest(BASE_URL + '/enrollments/drop', 'DELETE', body);
}
