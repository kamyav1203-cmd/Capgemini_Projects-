// =============================================
// app.js – Main frontend logic
// Uses plain JavaScript (no ES6 modules)
// All API functions come from api.js (loaded first in index.html)
// =============================================

// ── App State ─────────────────────────────────
var currentUser = null;           // Logged-in user info
var enrolledCourseIds = [];       // List of course IDs the student is enrolled in
var departments = [];             // List of departments for the filter dropdown
var toastTimer = null;            // Timer for hiding the toast message
var searchDebounce = null;        // Timer for debounced search input

// ── Helper: Get element by ID ─────────────────
function getEl(id) {
    return document.getElementById(id);
}

// ── Toast Notifications ───────────────────────
// Shows a temporary notification at the bottom of the screen
function showToast(message, type) {
    if (!type) type = 'success';

    clearTimeout(toastTimer);

    var toast = getEl('toast');
    var icon = '';
    if (type === 'success') icon = '✅ ';
    if (type === 'error')   icon = '❌ ';
    if (type === 'warning') icon = '⚠️ ';

    toast.className = 'toast ' + type;
    toast.innerHTML = icon + message;

    // Hide the toast after 3.5 seconds
    toastTimer = setTimeout(function() {
        toast.classList.add('hidden');
    }, 3500);
}

// ── Modal ─────────────────────────────────────
// Opens the modal popup with the given HTML content
function openModal(html) {
    getEl('modal-content').innerHTML = html;
    getEl('modal-overlay').classList.remove('hidden');
}

// Closes the modal popup
function closeModal() {
    getEl('modal-overlay').classList.add('hidden');
}

// ── Seats Helper ──────────────────────────────
// Calculates the fill percentage and CSS class for the seats progress bar
function getSeatsInfo(enrolledCount, totalSeats) {
    var pct = 0;
    if (totalSeats > 0) {
        pct = Math.round((enrolledCount / totalSeats) * 100);
    }
    var available = totalSeats - enrolledCount;

    var cls = '';
    if (pct >= 100) cls = 'full';
    else if (pct >= 80) cls = 'almost-full';

    return { pct: pct, available: available, cls: cls };
}

// ── Check if student is enrolled in a course ──
function isEnrolledIn(courseId) {
    for (var i = 0; i < enrolledCourseIds.length; i++) {
        if (enrolledCourseIds[i] === courseId) return true;
    }
    return false;
}

// ── Build Course Card (Browse Tab) ────────────
function buildCourseCard(course) {
    var enrolled = isEnrolledIn(course.courseId);
    var seats = getSeatsInfo(course.enrolledCount, course.totalSeats);
    var isFull = seats.available <= 0;

    // Build the action buttons based on enrollment status
    var actionHtml = '';
    if (enrolled) {
        actionHtml =
            '<span class="enrolled-badge">✓ Enrolled</span>' +
            '<button class="btn btn-danger" onclick="handleDrop(' + course.courseId + ', \'' + course.courseName.replace(/'/g, "\\'") + '\')">Drop</button>';
    } else {
        var enrollDisabled = isFull ? 'disabled' : '';
        var enrollLabel = isFull ? 'Full' : '+ Enroll';
        actionHtml =
            '<button class="btn btn-primary" ' + enrollDisabled + ' onclick="handleEnroll(' + course.courseId + ', \'' + course.courseName.replace(/'/g, "\\'") + '\')"> ' + enrollLabel + '</button>';
    }

    var availText = isFull ? '❌ Full' : '✅ ' + seats.available + ' left';

    var card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML =
        '<div class="card-header">' +
            '<span class="card-category">' + course.departmentName + '</span>' +
            '<div class="card-title">' + course.courseName + '</div>' +
        '</div>' +
        '<div class="card-body">' +
            '<div class="card-meta">' +
                '<span>🎓 ' + course.credits + ' Credits</span>' +
                '<span>👥 ' + course.totalSeats + ' Seats</span>' +
                '<span>' + availText + '</span>' +
            '</div>' +
            '<div class="seats-bar-wrap">' +
                '<div class="seats-label">' +
                    '<span>Enrollment</span>' +
                    '<span>' + course.enrolledCount + '/' + course.totalSeats + '</span>' +
                '</div>' +
                '<div class="seats-bar"><div class="seats-fill ' + seats.cls + '" style="width:' + seats.pct + '%"></div></div>' +
            '</div>' +
        '</div>' +
        '<div class="card-footer">' +
            actionHtml +
            '<button class="btn btn-outline" onclick="openCourseDetails(' + course.courseId + ')">Details</button>' +
        '</div>';

    return card;
}

// ── Enroll in a Course ────────────────────────
async function handleEnroll(courseId, courseName) {
    try {
        await enrollInCourse(currentUser.studentId, courseId);
        showToast('Enrolled in "' + courseName + '"!');
        await refreshAll();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── Drop a Course ─────────────────────────────
async function handleDrop(courseId, courseName) {
    var confirmed = confirm('Drop "' + courseName + '"?');
    if (!confirmed) return;

    try {
        await dropFromCourse(currentUser.studentId, courseId);
        showToast('Dropped "' + courseName + '"', 'warning');
        await refreshAll();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── Course Detail Modal ───────────────────────
async function openCourseDetails(courseId) {
    // Find the course from the currently displayed grid
    var courses = await getCourses('', '');
    var course = null;
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].courseId === courseId) {
            course = courses[i];
            break;
        }
    }
    if (!course) return;

    var enrolled = isEnrolledIn(course.courseId);
    var seats = getSeatsInfo(course.enrolledCount, course.totalSeats);
    var isFull = seats.available <= 0;

    var actionHtml = '';
    if (enrolled) {
        actionHtml = '<button class="btn btn-danger" id="m-drop">Drop Course</button>';
    } else {
        var disabledAttr = isFull ? 'disabled' : '';
        var btnLabel = isFull ? 'No Seats Available' : '+ Enroll Now';
        actionHtml = '<button class="btn btn-primary" id="m-enroll" ' + disabledAttr + '>' + btnLabel + '</button>';
    }

    var availText = isFull ? '❌ Full' : '✅ ' + seats.available + ' seats';

    openModal(
        '<div class="modal-header">' +
            '<span class="card-category">' + course.departmentName + '</span>' +
            '<div class="modal-title">' + course.courseName + '</div>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="modal-detail">' +
                '<div class="detail-item"><div class="label">Department</div><div class="value">' + course.departmentName + '</div></div>' +
                '<div class="detail-item"><div class="label">Credits</div><div class="value">🎓 ' + course.credits + '</div></div>' +
                '<div class="detail-item"><div class="label">Total Seats</div><div class="value">👥 ' + course.totalSeats + '</div></div>' +
                '<div class="detail-item"><div class="label">Available</div><div class="value">' + availText + '</div></div>' +
            '</div>' +
            '<div class="seats-bar-wrap" style="margin-bottom:20px">' +
                '<div class="seats-label"><span>Enrollment Progress</span><span>' + course.enrolledCount + '/' + course.totalSeats + ' (' + seats.pct + '%)</span></div>' +
                '<div class="seats-bar" style="height:8px"><div class="seats-fill ' + seats.cls + '" style="width:' + seats.pct + '%"></div></div>' +
            '</div>' +
            '<div class="modal-actions">' +
                actionHtml +
                '<button class="btn btn-outline" id="m-close">Close</button>' +
            '</div>' +
        '</div>'
    );

    // Attach button events inside the modal
    getEl('m-close').onclick = closeModal;

    var enrollBtn = getEl('m-enroll');
    if (enrollBtn) {
        enrollBtn.onclick = async function() {
            try {
                await enrollInCourse(currentUser.studentId, course.courseId);
                showToast('Enrolled in "' + course.courseName + '"!');
                closeModal();
                await refreshAll();
            } catch (err) {
                showToast(err.message, 'error');
            }
        };
    }

    var dropBtn = getEl('m-drop');
    if (dropBtn) {
        dropBtn.onclick = async function() {
            var confirmed = confirm('Drop "' + course.courseName + '"?');
            if (!confirmed) return;
            try {
                await dropFromCourse(currentUser.studentId, course.courseId);
                showToast('Dropped "' + course.courseName + '"', 'warning');
                closeModal();
                await refreshAll();
            } catch (err) {
                showToast(err.message, 'error');
            }
        };
    }
}

// ── Build Enrollment Card (My Enrollments Tab) ─
function buildEnrollCard(enrollment) {
    var seats = getSeatsInfo(enrollment.enrolledCount, enrollment.totalSeats);
    var dateStr = new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    var card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML =
        '<div class="card-header">' +
            '<span class="card-category">' + enrollment.departmentName + '</span>' +
            '<div class="card-title">' + enrollment.courseName + '</div>' +
        '</div>' +
        '<div class="card-body">' +
            '<div class="card-meta">' +
                '<span>🎓 ' + enrollment.credits + ' Credits</span>' +
                '<span>📅 ' + dateStr + '</span>' +
            '</div>' +
            '<div class="seats-bar-wrap">' +
                '<div class="seats-label">' +
                    '<span>Enrollment</span>' +
                    '<span>' + enrollment.enrolledCount + '/' + enrollment.totalSeats + '</span>' +
                '</div>' +
                '<div class="seats-bar"><div class="seats-fill ' + seats.cls + '" style="width:' + seats.pct + '%"></div></div>' +
            '</div>' +
        '</div>' +
        '<div class="card-footer">' +
            '<button class="btn btn-danger" onclick="handleDrop(' + enrollment.courseId + ', \'' + enrollment.courseName.replace(/'/g, "\\'") + '\')">Drop Course</button>' +
        '</div>';

    return card;
}

// ── Build Admin Course Card ───────────────────
function buildAdminCard(course) {
    var statusText = course.seatsAvailable ? '✅ Open' : '❌ Full';

    var card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML =
        '<div class="card-header">' +
            '<span class="card-category">' + course.departmentName + '</span>' +
            '<div class="card-title">' + course.courseName + '</div>' +
        '</div>' +
        '<div class="card-body">' +
            '<div class="card-meta">' +
                '<span>🎓 ' + course.credits + ' Credits</span>' +
                '<span>👥 ' + course.enrolledCount + '/' + course.totalSeats + '</span>' +
                '<span>' + statusText + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="card-footer">' +
            '<button class="btn btn-admin" onclick="openEditForm(' + course.courseId + ')">✏️ Edit</button>' +
            '<button class="btn btn-danger" onclick="handleDeleteCourse(' + course.courseId + ', \'' + course.courseName.replace(/'/g, "\\'") + '\')">🗑 Delete</button>' +
        '</div>';

    return card;
}

// ── Admin: Open Add Course Form ───────────────
function openAddForm() {
    // Build department <option> list
    var deptOptions = '<option value="">Select Department</option>';
    for (var i = 0; i < departments.length; i++) {
        deptOptions += '<option value="' + departments[i].departmentId + '">' + departments[i].departmentName + '</option>';
    }

    openModal(
        '<div class="modal-header" style="background: var(--admin-light);">' +
            '<div class="modal-title" style="color:var(--admin)">➕ Add New Course</div>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="form-group"><label>Course Name</label>' +
                '<input type="text" id="f-name" placeholder="e.g. Data Structures" /></div>' +
            '<div class="form-group"><label>Department</label>' +
                '<select id="f-dept">' + deptOptions + '</select></div>' +
            '<div class="form-group"><label>Credits</label>' +
                '<input type="number" id="f-credits" value="3" min="1" max="6" /></div>' +
            '<div class="form-group"><label>Total Seats</label>' +
                '<input type="number" id="f-seats" value="30" min="1" max="200" /></div>' +
            '<div class="modal-actions">' +
                '<button class="btn btn-primary" onclick="submitAddCourse()">Add Course</button>' +
                '<button class="btn btn-outline" onclick="closeModal()">Cancel</button>' +
            '</div>' +
        '</div>'
    );
}

// ── Admin: Submit Add Course ──────────────────
async function submitAddCourse() {
    var name = getEl('f-name').value.trim();
    var deptId = parseInt(getEl('f-dept').value);
    var credits = parseInt(getEl('f-credits').value);
    var seats = parseInt(getEl('f-seats').value);

    if (!name) {
        showToast('Course name is required', 'error');
        return;
    }

    try {
        await createCourse(name, deptId, credits, seats);
        showToast('Added "' + name + '"!');
        closeModal();
        await loadAdminCourses();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── Admin: Open Edit Course Form ──────────────
async function openEditForm(courseId) {
    // Fetch courses to find the one we want to edit
    var courses = await getCourses('', '');
    var course = null;
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].courseId === courseId) {
            course = courses[i];
            break;
        }
    }
    if (!course) return;

    // Build department <option> list with current department pre-selected
    var deptOptions = '';
    for (var j = 0; j < departments.length; j++) {
        var selected = (departments[j].departmentId === course.departmentId) ? 'selected' : '';
        deptOptions += '<option value="' + departments[j].departmentId + '" ' + selected + '>' + departments[j].departmentName + '</option>';
    }

    openModal(
        '<div class="modal-header" style="background: var(--admin-light);">' +
            '<div class="modal-title" style="color:var(--admin)">✏️ Edit Course</div>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="form-group"><label>Course Name</label>' +
                '<input type="text" id="f-name" value="' + course.courseName + '" /></div>' +
            '<div class="form-group"><label>Department</label>' +
                '<select id="f-dept">' + deptOptions + '</select></div>' +
            '<div class="form-group"><label>Credits</label>' +
                '<input type="number" id="f-credits" value="' + course.credits + '" min="1" max="6" /></div>' +
            '<div class="form-group"><label>Total Seats</label>' +
                '<input type="number" id="f-seats" value="' + course.totalSeats + '" min="1" max="200" /></div>' +
            '<div class="modal-actions">' +
                '<button class="btn btn-primary" onclick="submitEditCourse(' + course.courseId + ')">Update Course</button>' +
                '<button class="btn btn-outline" onclick="closeModal()">Cancel</button>' +
            '</div>' +
        '</div>'
    );
}

// ── Admin: Submit Edit Course ─────────────────
async function submitEditCourse(courseId) {
    var name = getEl('f-name').value.trim();
    var deptId = parseInt(getEl('f-dept').value);
    var credits = parseInt(getEl('f-credits').value);
    var seats = parseInt(getEl('f-seats').value);

    if (!name) {
        showToast('Course name is required', 'error');
        return;
    }

    try {
        await updateCourse(courseId, name, deptId, credits, seats);
        showToast('Updated "' + name + '"');
        closeModal();
        await loadAdminCourses();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── Admin: Delete a Course ────────────────────
async function handleDeleteCourse(courseId, courseName) {
    var confirmed = confirm('Delete course "' + courseName + '"? This cannot be undone.');
    if (!confirmed) return;

    try {
        await deleteCourse(courseId);
        showToast('Deleted "' + courseName + '"', 'warning');
        await loadAdminCourses();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── Grid Helpers ──────────────────────────────
// Shows a loading spinner inside a grid container
function showLoading(grid) {
    grid.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';
}

// Renders a list of items into a grid using a builder function
function renderGrid(grid, items, buildCard, emptyMessage) {
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><h3>' + emptyMessage + '</h3></div>';
        return;
    }

    for (var i = 0; i < items.length; i++) {
        var card = buildCard(items[i]);
        grid.appendChild(card);
    }
}

// ── Load: Browse Courses ──────────────────────
async function loadCourses() {
    var grid = getEl('course-grid');
    showLoading(grid);

    var search = getEl('search-input').value.trim();
    var deptId = getEl('dept-filter').value;

    var courses = await getCourses(search, deptId);
    renderGrid(grid, courses, buildCourseCard, 'No courses found');

    var count = courses.length;
    var label = count === 1 ? '1 course' : count + ' courses';
    getEl('course-count').textContent = 'Showing ' + label;
}

// ── Load: My Enrollments ──────────────────────
async function loadEnrollments() {
    var grid = getEl('enrollment-grid');
    showLoading(grid);

    var enrollments = await getMyEnrollments(currentUser.studentId);

    // Build the list of enrolled course IDs for quick lookup
    enrolledCourseIds = [];
    for (var i = 0; i < enrollments.length; i++) {
        enrolledCourseIds.push(enrollments[i].courseId);
    }

    renderGrid(grid, enrollments, buildEnrollCard, 'You are not enrolled in any courses yet');
}

// ── Load: Admin – Manage Courses ──────────────
async function loadAdminCourses() {
    var grid = getEl('admin-course-grid');
    showLoading(grid);
    var courses = await getCourses('', '');
    renderGrid(grid, courses, buildAdminCard, 'No courses found');
}

// ── Load: Admin – Enrollment History ──────────
async function loadHistory() {
    var tbody = getEl('history-body');
    tbody.innerHTML = '';

    var all = await getAllEnrollments();

    if (all.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-400)">No enrollment records found</td></tr>';
        return;
    }

    for (var i = 0; i < all.length; i++) {
        var e = all[i];

        var enrollDate = new Date(e.enrollmentDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        var dropDate = '—';
        if (e.dropDate) {
            dropDate = new Date(e.dropDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }

        var statusClass = e.isActive ? 'badge-active' : 'badge-dropped';
        var statusLabel = e.isActive ? 'Active' : 'Dropped';

        var row = '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + e.studentName + '</td>' +
            '<td>' + e.courseName + '</td>' +
            '<td>' + e.departmentName + '</td>' +
            '<td>' + enrollDate + '</td>' +
            '<td>' + dropDate + '</td>' +
            '<td><span class="badge ' + statusClass + '">' + statusLabel + '</span></td>' +
            '</tr>';

        tbody.innerHTML += row;
    }
}

// ── Refresh Browse + Enrollments Together ─────
async function refreshAll() {
    await loadEnrollments();
    await loadCourses();
}

// ── Load Departments into Filter Dropdown ──────
async function loadDepartments() {
    departments = await getDepartments();

    var select = getEl('dept-filter');
    select.innerHTML = '<option value="">All</option>';

    for (var i = 0; i < departments.length; i++) {
        var option = document.createElement('option');
        option.value = departments[i].departmentId;
        option.textContent = departments[i].departmentName;
        select.appendChild(option);
    }
}

// ── Tab Navigation ────────────────────────────
function showTab(tabName) {
    // Hide all tabs
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    // Remove active from all nav buttons
    var navBtns = document.querySelectorAll('.nav-btn');
    for (var j = 0; j < navBtns.length; j++) {
        navBtns[j].classList.remove('active');
    }

    // Show the selected tab
    var selectedTab = getEl('tab-' + tabName);
    if (selectedTab) selectedTab.classList.add('active');

    // Highlight the selected nav button
    var selectedBtn = document.querySelector('[data-tab="' + tabName + '"]');
    if (selectedBtn) selectedBtn.classList.add('active');
}

// ── Add Admin Tabs to Nav ─────────────────────
function addAdminTabs() {
    var nav = getEl('main-nav');
    var manageCourses = document.createElement('button');
    manageCourses.className = 'nav-btn admin-tab';
    manageCourses.dataset.tab = 'admin-courses';
    manageCourses.textContent = 'Manage Courses';
    nav.appendChild(manageCourses);

    var history = document.createElement('button');
    history.className = 'nav-btn admin-tab';
    history.dataset.tab = 'admin-history';
    history.textContent = 'Enrollment History';
    nav.appendChild(history);
}

// ── Enter App After Login / Register ──────────
async function enterApp(authResponse) {
    // Save the JWT token so API calls can use it
    saveToken(authResponse.token);
    currentUser = authResponse;

    // Show user info in the header
    getEl('user-name').textContent = authResponse.name;
    getEl('user-role').textContent = authResponse.role;
    getEl('user-avatar').textContent = authResponse.name[0].toUpperCase();

    // Add admin tabs if the user is an admin
    if (authResponse.role === 'Admin') {
        addAdminTabs();
    }

    // Switch from login screen to the main app
    getEl('login-screen').classList.add('hidden');
    getEl('app').classList.remove('hidden');

    // Load initial data
    await loadDepartments();
    await loadEnrollments();
    await loadCourses();
}

// ── Login ─────────────────────────────────────
async function handleLogin() {
    var email = getEl('login-email').value.trim();
    var password = getEl('login-password').value;
    var errorEl = getEl('login-error');
    var btn = getEl('login-btn');

    // Basic validation
    if (!email || !password) {
        errorEl.textContent = 'Email and password are required';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        var result = await loginUser(email, password);
        await enterApp(result);
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

// ── Register ──────────────────────────────────
async function handleRegister() {
    var name = getEl('reg-name').value.trim();
    var email = getEl('reg-email').value.trim();
    var phone = getEl('reg-phone').value.trim();
    var password = getEl('reg-password').value;
    var role = getEl('reg-role').value;
    var errorEl = getEl('register-error');
    var btn = getEl('register-btn');

    // Basic validation
    if (!name || !email || !password) {
        errorEl.textContent = 'Name, email and password are required';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
        var result = await registerUser(name, email, phone, password, role);
        showToast('Account created! Welcome, ' + result.name + '!');
        await enterApp(result);
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

// ── Logout ────────────────────────────────────
function handleLogout() {
    currentUser = null;
    enrolledCourseIds = [];
    clearToken();

    // Remove admin tabs from nav
    var adminTabs = document.querySelectorAll('.admin-tab');
    for (var i = 0; i < adminTabs.length; i++) {
        adminTabs[i].remove();
    }

    showTab('courses');
    getEl('app').classList.add('hidden');
    getEl('login-screen').classList.remove('hidden');

    // Clear login fields
    getEl('login-email').value = '';
    getEl('login-password').value = '';
}

// ── Switch Between Login / Register Tabs ──────
function switchAuthTab(tabName) {
    var tabs = document.querySelectorAll('.auth-tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    var activeTab = document.querySelector('[data-auth="' + tabName + '"]');
    if (activeTab) activeTab.classList.add('active');

    if (tabName === 'login') {
        getEl('login-form').classList.remove('hidden');
        getEl('register-form').classList.add('hidden');
    } else {
        getEl('login-form').classList.add('hidden');
        getEl('register-form').classList.remove('hidden');
    }
}

// ── Wire Up Events After Page Loads ───────────
window.onload = function() {

    // Login / Register tab buttons
    var authTabs = document.querySelectorAll('.auth-tab');
    for (var i = 0; i < authTabs.length; i++) {
        authTabs[i].addEventListener('click', function() {
            switchAuthTab(this.dataset.auth);
        });
    }

    // Login button
    getEl('login-btn').addEventListener('click', handleLogin);

    // Register button
    getEl('register-btn').addEventListener('click', handleRegister);

    // Logout button
    getEl('logout-btn').addEventListener('click', handleLogout);

    // Add Course button (admin)
    getEl('add-course-btn').addEventListener('click', openAddForm);

    // Close modal when clicking the X button
    getEl('modal-close').addEventListener('click', closeModal);

    // Close modal when clicking the dark overlay outside the modal box
    getEl('modal-overlay').addEventListener('click', function(e) {
        if (e.target === getEl('modal-overlay')) {
            closeModal();
        }
    });

    // Main nav tab clicks
    getEl('main-nav').addEventListener('click', async function(e) {
        var btn = e.target.closest('.nav-btn');
        if (!btn) return;

        var tab = btn.dataset.tab;
        showTab(tab);

        // Load data for the selected tab
        if (tab === 'courses') await loadCourses();
        else if (tab === 'enrolled') await loadEnrollments();
        else if (tab === 'admin-courses') await loadAdminCourses();
        else if (tab === 'admin-history') await loadHistory();
    });

    // Search box – debounced so we don't fire on every keystroke
    getEl('search-input').addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(loadCourses, 350);
    });

    // Clear search button
    getEl('clear-search').addEventListener('click', function() {
        getEl('search-input').value = '';
        loadCourses();
    });

    // Department filter dropdown
    getEl('dept-filter').addEventListener('change', loadCourses);
};
