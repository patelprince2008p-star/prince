/* =========================================
   USER LOGIN GUARD
========================================= */

const currentUser = JSON.parse(localStorage.getItem("fixit_current_user") || "null");

if (!currentUser) {
    window.location.replace("login.html");
}

function getInitials(name) {
    return String(name || "User")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase() || "U";
}

function updateUserUI() {
    if (!currentUser) return;

    const name = currentUser.name || "User";
    const initials = getInitials(name);

    const userName = document.getElementById("userName");
    const welcomeName = document.getElementById("welcomeName");
    const userAvatar = document.getElementById("userAvatar");

    if (userName) userName.textContent = name;
    if (welcomeName) welcomeName.textContent = name.split(/\s+/)[0];
    if (userAvatar) userAvatar.textContent = initials;
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("fixit_current_user");
        window.location.replace("login.html");
    });
}

/* =========================================
   FIXIT APP
   Pure HTML + CSS + JavaScript
========================================= */


/* =========================================
   DEFAULT DATA
========================================= */

const defaultReports = [
    {
        id: "FX-1001",
        title: "Large pothole on main road",
        category: "Roads",
        priority: "High",
        location: "Main Road, Sector 4",
        description:
            "There is a large pothole near the main road intersection. It is becoming difficult for bikes and cars to pass safely.",
        status: "In Progress",
        date: "2026-09-08",
        reportedBy: "John Doe",
        initials: "JD"
    },

    {
        id: "FX-1002",
        title: "Street light not working",
        category: "Street Light",
        priority: "Medium",
        location: "Park Street, Block B",
        description:
            "The street light has not been working for the last few nights, making the road very dark after sunset.",
        status: "Pending",
        date: "2026-09-07",
        reportedBy: "John Doe",
        initials: "JD"
    },

    {
        id: "FX-1003",
        title: "Garbage overflowing",
        category: "Garbage",
        priority: "Medium",
        location: "Community Park Entrance",
        description:
            "The garbage bin near the park entrance is completely full and waste is spreading around the area.",
        status: "Resolved",
        date: "2026-09-04",
        reportedBy: "John Doe",
        initials: "JD"
    },

    {
        id: "FX-1004",
        title: "Water leakage near sidewalk",
        category: "Water",
        priority: "Urgent",
        location: "Market Road, Near Gate 2",
        description:
            "A water pipe appears to be leaking continuously near the sidewalk.",
        status: "Pending",
        date: "2026-09-03",
        reportedBy: "John Doe",
        initials: "JD"
    }
];


/* =========================================
   LOCAL STORAGE
========================================= */

function getReports() {

    const stored = localStorage.getItem("fixit_reports");

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            return defaultReports;
        }
    }

    localStorage.setItem(
        "fixit_reports",
        JSON.stringify(defaultReports)
    );

    return defaultReports;
}


let reports = getReports();


function saveReports() {

    localStorage.setItem(
        "fixit_reports",
        JSON.stringify(reports)
    );
}


/* =========================================
   ELEMENTS
========================================= */

const navItems = document.querySelectorAll(".nav-item[data-section]");
const sections = document.querySelectorAll(".page-section");

const pageTitle = document.getElementById("pageTitle");

const reportButton = document.getElementById("reportButton");
const reportButton2 = document.getElementById("reportButton2");

const reportForm = document.getElementById("reportForm");

const cancelReport = document.getElementById("cancelReport");

const problemsTable = document.getElementById("problemsTable");

const recentReports = document.getElementById("recentReports");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

const emptyState = document.getElementById("emptyState");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

const photoInput = document.getElementById("photo");
const fileName = document.getElementById("fileName");


/* =========================================
   NAVIGATION
========================================= */

const sectionTitles = {
    dashboard: "Dashboard",
    report: "Report Problem",
    problems: "My Problems",
    community: "Community"
};


function showSection(sectionName) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    const targetSection = document.getElementById(sectionName);

    if (targetSection) {
        targetSection.classList.add("active");
    }


    const activeNav = document.querySelector(
        `.nav-item[data-section="${sectionName}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }


    pageTitle.textContent =
        sectionTitles[sectionName] || "FixIt";


    sidebar.classList.remove("open");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (sectionName === "dashboard") {
        updateDashboard();
    }

    if (sectionName === "problems") {
        renderProblems();
    }

    if (sectionName === "community") {
        renderCommunity();
    }
}


/* Navigation buttons */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const section = item.dataset.section;

        showSection(section);

    });

});


/* Buttons that navigate */

document.querySelectorAll("[data-section-target]").forEach(button => {

    button.addEventListener("click", () => {

        showSection(button.dataset.sectionTarget);

    });

});


/* Quick actions */

document.querySelectorAll(".quick-action").forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        showSection(action);

    });

});


/* Report buttons */

if (reportButton) {

    reportButton.addEventListener("click", () => {

        showSection("report");

        setTimeout(() => {
            document.getElementById("problemTitle").focus();
        }, 200);

    });

}


if (reportButton2) {

    reportButton2.addEventListener("click", () => {

        showSection("report");

    });

}


/* Cancel */

if (cancelReport) {

    cancelReport.addEventListener("click", () => {

        reportForm.reset();

        fileName.textContent = "";

        showSection("dashboard");

    });

}


/* =========================================
   CATEGORY ICON
========================================= */

function getCategoryIcon(category) {

    const icons = {

        Roads: "▱",

        "Street Light": "☼",

        Water: "≈",

        Garbage: "♻",

        Traffic: "⚑",

        "Public Space": "⌂",

        Other: "●"

    };

    return icons[category] || "●";
}


/* =========================================
   DATE
========================================= */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* =========================================
   STATUS CLASS
========================================= */

function statusClass(status) {

    return status
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    const total = reports.length;

    const pending = reports.filter(
        report => report.status === "Pending"
    ).length;

    const progress = reports.filter(
        report => report.status === "In Progress"
    ).length;

    const resolved = reports.filter(
        report => report.status === "Resolved"
    ).length;


    document.getElementById("totalReports").textContent = total;

    document.getElementById("pendingReports").textContent = pending;

    document.getElementById("progressReports").textContent = progress;

    document.getElementById("resolvedReports").textContent = resolved;


    renderRecentReports();

}


/* =========================================
   RECENT REPORTS
========================================= */

function renderRecentReports() {

    const recent = [...reports]
        .sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date)
        )
        .slice(0, 5);


    if (recent.length === 0) {

        recentReports.innerHTML = `
            <div class="empty-state visible">
                <div class="empty-icon">+</div>
                <h3>No reports yet</h3>
                <p>Start by reporting your first community problem.</p>
            </div>
        `;

        return;
    }


    recentReports.innerHTML = recent.map(report => {

        return `

            <div
                class="report-item"
                data-id="${report.id}"
            >

                <div class="report-category-icon">
                    ${getCategoryIcon(report.category)}
                </div>

                <div class="report-info">

                    <div class="report-title">
                        ${escapeHTML(report.title)}
                    </div>

                    <span class="report-location">
                        ${escapeHTML(report.location)}
                    </span>

                </div>

                <span class="status ${statusClass(report.status)}">
                    ${report.status}
                </span>

            </div>

        `;

    }).join("");


    document.querySelectorAll(".report-item").forEach(item => {

        item.addEventListener("click", () => {

            openReportModal(item.dataset.id);

        });

    });

}


/* =========================================
   REPORT FORM
========================================= */

reportForm.addEventListener("submit", event => {

    event.preventDefault();


    const title =
        document.getElementById("problemTitle").value.trim();

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;

    const location =
        document.getElementById("location").value.trim();

    const description =
        document.getElementById("description").value.trim();


    if (
        !title ||
        !category ||
        !priority ||
        !location ||
        !description
    ) {

        showToast(
            "Missing information",
            "Please fill all required fields."
        );

        return;

    }


    function finishSubmission(photoUrl) {
        const newReport = {
            id:
                "FX-" +
                Math.floor(
                    1000 +
                    Math.random() * 9000
                ),
            title,
            category,
            priority,
            location,
            description,
            photo: photoUrl || "",
            status: "Pending",
            date:
                new Date()
                    .toISOString()
                    .split("T")[0],
            reportedBy: currentUser?.name || "User",
            initials: getInitials(currentUser?.name || "User")
        };

        reports.unshift(newReport);
        saveReports();

        reportForm.reset();
        fileName.textContent = "";

        showToast(
            "Report submitted",
            `Your report ${newReport.id} has been created.`
        );

        setTimeout(() => {
            showSection("problems");
        }, 700);
    }

    if (photoInput && photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        if (file.size <= 1.5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function(e) {
                finishSubmission(e.target.result);
            };
            reader.onerror = function() {
                finishSubmission("");
            };
            reader.readAsDataURL(file);
            return;
        }
    }

    finishSubmission("");

});


/* =========================================
   FILE INPUT
========================================= */

if (photoInput) {

    photoInput.addEventListener("change", () => {

        if (photoInput.files.length > 0) {

            const file = photoInput.files[0];

            if (file.size > 5 * 1024 * 1024) {

                showToast(
                    "File too large",
                    "Please select an image smaller than 5MB."
                );

                photoInput.value = "";

                fileName.textContent = "";

                return;
            }

            fileName.textContent =
                "Selected: " + file.name;

        } else {

            fileName.textContent = "";

        }

    });

}


/* =========================================
   RENDER PROBLEMS
========================================= */

function renderProblems() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;

    const selectedCategory =
        categoryFilter.value;


    const filtered =
        reports.filter(report => {

            const matchesSearch =

                report.title
                    .toLowerCase()
                    .includes(search)

                ||

                report.location
                    .toLowerCase()
                    .includes(search)

                ||

                report.description
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                selectedStatus === "All"

                ||

                report.status === selectedStatus;


            const matchesCategory =

                selectedCategory === "All"

                ||

                report.category === selectedCategory;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });


    if (filtered.length === 0) {

        problemsTable.innerHTML = "";

        emptyState.classList.add("visible");

        return;

    }


    emptyState.classList.remove("visible");


    problemsTable.innerHTML = filtered.map(report => {

        return `

            <tr>

                <td>

                    <div class="problem-cell">

                        <div class="problem-cell-icon">
                            ${getCategoryIcon(report.category)}
                        </div>

                        <div class="problem-cell-info">

                            <strong>
                                ${escapeHTML(report.title)}
                            </strong>

                            <span>
                                ${escapeHTML(report.location)}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(report.category)}
                </td>


                <td>

                    <span class="priority ${report.priority.toLowerCase()}">
                        ${report.priority}
                    </span>

                </td>


                <td>

                    <span class="status ${statusClass(report.status)}">
                        ${report.status}
                    </span>

                </td>


                <td>
                    ${formatDate(report.date)}
                </td>


                <td>

                    <button
                        class="table-action"
                        data-view="${report.id}"
                        title="View details"
                    >
                        ⋮
                    </button>

                </td>

            </tr>

        `;

    }).join("");


    document
        .querySelectorAll("[data-view]")
        .forEach(button => {

            button.addEventListener("click", () => {

                openReportModal(
                    button.dataset.view
                );

            });

        });

}


/* Filters */

searchInput.addEventListener(
    "input",
    renderProblems
);

statusFilter.addEventListener(
    "change",
    renderProblems
);

categoryFilter.addEventListener(
    "change",
    renderProblems
);


/* =========================================
   REPORT MODAL
========================================= */

function openReportModal(id) {

    const report =
        reports.find(item => item.id === id);


    if (!report) {
        return;
    }


    let timeline = "";


    if (report.status === "Pending") {

        timeline = `

            <div class="timeline">

                <div class="timeline-item">

                    <strong>Report submitted</strong>

                    <span>
                        ${formatDate(report.date)}
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Waiting for review</strong>

                    <span>
                        The report is waiting for action.
                    </span>

                </div>

            </div>

        `;

    } else if (report.status === "Approved") {

        timeline = `

            <div class="timeline">

                <div class="timeline-item">

                    <strong>Report submitted</strong>

                    <span>
                        ${formatDate(report.date)}
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Report approved</strong>

                    <span>
                        Your report has been reviewed and approved by FixIt.
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Waiting for work to start</strong>

                    <span>
                        The responsible team will begin work soon.
                    </span>

                </div>

            </div>

        `;

    } else if (report.status === "Rejected") {

        timeline = `

            <div class="timeline">

                <div class="timeline-item">

                    <strong>Report submitted</strong>

                    <span>
                        ${formatDate(report.date)}
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Report rejected</strong>

                    <span>
                        This report was not approved by the FixIt team.
                    </span>

                </div>

            </div>

        `;

    } else if (report.status === "In Progress") {

        timeline = `

            <div class="timeline">

                <div class="timeline-item">

                    <strong>Report submitted</strong>

                    <span>
                        ${formatDate(report.date)}
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Report accepted</strong>

                    <span>
                        The issue has been reviewed.
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Work in progress</strong>

                    <span>
                        The responsible team is working on it.
                    </span>

                </div>

            </div>

        `;

    } else {

        timeline = `

            <div class="timeline">

                <div class="timeline-item">

                    <strong>Report submitted</strong>

                    <span>
                        ${formatDate(report.date)}
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Issue reviewed</strong>

                    <span>
                        The report was accepted.
                    </span>

                </div>

                <div class="timeline-item">

                    <strong>Problem resolved</strong>

                    <span>
                        The issue has been successfully resolved.
                    </span>

                </div>

            </div>

        `;

    }


    modalContent.innerHTML = `

        <span class="eyebrow">
            REPORT ${report.id}
        </span>

        <h2>
            ${escapeHTML(report.title)}
        </h2>


        <div class="modal-meta">

            <span class="status ${statusClass(report.status)}">
                ${report.status}
            </span>

            <span class="priority ${report.priority.toLowerCase()}">
                ${report.priority} Priority
            </span>

        </div>


        <div class="modal-location">

            📍 ${escapeHTML(report.location)}

            &nbsp; • &nbsp;

            ${formatDate(report.date)}

        </div>


        <div class="modal-description">

            ${escapeHTML(report.description)}

        </div>

        ${report.photo ? `
        <div class="modal-photo" style="margin: 16px 0;">
            <img src="${report.photo}" alt="Report photo" style="width: 100%; max-height: 260px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border);">
        </div>
        ` : ""}

        <div class="modal-section">

            <h4>Report progress</h4>

            ${timeline}

        </div>

    `;


    modalOverlay.classList.add("active");

}


function closeModal() {

    modalOverlay.classList.remove("active");

}


modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (event.target === modalOverlay) {
            closeModal();
        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModal();
        }

    }
);


/* =========================================
   COMMUNITY
========================================= */

function renderCommunity() {

    const communityGrid =
        document.getElementById("communityGrid");


    const resolved =
        reports.filter(
            report => report.status === "Resolved"
        ).length;


    document.getElementById(
        "communityTotal"
    ).textContent = reports.length + 24;


    document.getElementById(
        "communityResolved"
    ).textContent = resolved + 12;


    const communityReports = [

        ...reports,

        {
            id: "COMM-01",
            title: "Broken bench in public garden",
            category: "Public Space",
            priority: "Low",
            location: "Central Community Garden",
            description:
                "One of the benches in the garden is damaged and needs repair.",
            status: "In Progress",
            date: "2026-09-05",
            reportedBy: "Aarav Shah",
            initials: "AS"
        },

        {
            id: "COMM-02",
            title: "Traffic signal timing issue",
            category: "Traffic",
            priority: "High",
            location: "Main Junction",
            description:
                "The traffic signal appears to stay green for a very short time during peak hours.",
            status: "Pending",
            date: "2026-09-02",
            reportedBy: "Priya Patel",
            initials: "PP"
        }

    ];


    communityGrid.innerHTML =
        communityReports
            .slice(0, 8)
            .map(report => {

                return `

                    <div class="community-card">

                        <div class="community-card-top">

                            <div>

                                <h3>
                                    ${escapeHTML(report.title)}
                                </h3>

                                <div class="community-card-location">
                                    📍 ${escapeHTML(report.location)}
                                </div>

                            </div>

                            <span class="status ${statusClass(report.status)}">
                                ${report.status}
                            </span>

                        </div>


                        <p class="community-card-description">
                            ${escapeHTML(report.description)}
                        </p>


                        <div class="community-card-footer">

                            <div class="community-user">

                                <div class="mini-avatar">
                                    ${report.initials}
                                </div>

                                Reported by ${escapeHTML(report.reportedBy)}

                            </div>

                            <span class="priority ${report.priority.toLowerCase()}">
                                ${report.priority}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =========================================
   DARK MODE
========================================= */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeIcon.textContent = "☀";

        themeToggle.lastChild.textContent =
            " Light Mode";

    } else {

        document.body.classList.remove("dark");

        themeIcon.textContent = "☾";

        themeToggle.lastChild.textContent =
            " Dark Mode";

    }

}


const savedTheme =
    localStorage.getItem("fixit_theme") || "light";


applyTheme(savedTheme);


themeToggle.addEventListener(
    "click",
    () => {

        const isDark =
            document.body.classList.contains("dark");


        const newTheme =
            isDark ? "light" : "dark";


        localStorage.setItem(
            "fixit_theme",
            newTheme
        );


        applyTheme(newTheme);

    }
);


/* =========================================
   MOBILE SIDEBAR
========================================= */

mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle("open");

    }
);


/* =========================================
   NOTIFICATION
========================================= */

document
    .getElementById("notificationButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Notifications",
                "You're all caught up!"
            );

        }
    );


/* =========================================
   ESCAPE HTML
   Prevents HTML injection in user content
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   INITIALIZE APP
========================================= */

function init() {

    updateUserUI();

    updateDashboard();

    renderProblems();

    renderCommunity();

}


init();

/* Refresh user dashboard when Admin Panel changes a report */
window.addEventListener("storage", event => {
    if (event.key === "fixit_reports") {
        reports = getReports();
        updateDashboard();
        renderProblems();
        renderCommunity();
    }
});
