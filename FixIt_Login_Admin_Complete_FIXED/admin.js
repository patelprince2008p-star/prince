const ADMIN_KEY = "fixit_admin_logged_in";
const REPORTS_KEY = "fixit_reports";

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

function checkAuth() {
    const isLogged = localStorage.getItem(ADMIN_KEY) === "true";
    const modal = document.getElementById("adminLoginModal");
    if (!modal) return isLogged;

    if (!isLogged) {
        modal.classList.remove("hidden");
        return false;
    } else {
        modal.classList.add("hidden");
        return true;
    }
}

function getReports() {
    try {
        const stored = localStorage.getItem(REPORTS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem(REPORTS_KEY, JSON.stringify(defaultReports));
        return defaultReports;
    } catch {
        return defaultReports;
    }
}

let reports = getReports();

function saveReports() {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

function statusClass(status) {
    return String(status).toLowerCase().replace(/\s+/g, "-");
}

function toast(message) {
    const box = document.getElementById("toast");
    box.textContent = message;
    box.classList.add("show");
    setTimeout(() => box.classList.remove("show"), 1800);
}

function updateStats() {
    const count = status => reports.filter(r => r.status === status).length;

    document.getElementById("totalCount").textContent = reports.length;
    document.getElementById("pendingCount").textContent = count("Pending");
    document.getElementById("approvedCount").textContent = count("Approved");
    document.getElementById("progressCount").textContent = count("In Progress");
    document.getElementById("resolvedCount").textContent = count("Resolved");
    document.getElementById("rejectedCount").textContent = count("Rejected");

    const pending = reports.filter(r => r.status === "Pending").slice(0, 5);
    const list = document.getElementById("pendingList");

    if (!pending.length) {
        list.innerHTML = `<div class="empty">🎉 No reports are waiting for review.</div>`;
        return;
    }

    list.innerHTML = pending.map(r => `
        <div class="mini-row">
            <div class="mini-info">
                <strong>${escapeHTML(r.title)}</strong>
                <span>${escapeHTML(r.id)} • ${escapeHTML(r.location)}</span>
            </div>
            <button class="mini-action" data-open="${escapeHTML(r.id)}">Review</button>
        </div>
    `).join("");

    list.querySelectorAll("[data-open]").forEach(btn =>
        btn.addEventListener("click", () => openReport(btn.dataset.open))
    );
}

function renderReports() {
    const search = document.getElementById("searchReports").value.toLowerCase().trim();
    const status = document.getElementById("statusFilter").value;
    const category = document.getElementById("categoryFilter").value;

    const filtered = reports.filter(r => {
        const haystack = [
            r.title, r.location, r.reportedBy, r.id, r.description
        ].join(" ").toLowerCase();

        return (
            haystack.includes(search) &&
            (status === "All" || r.status === status) &&
            (category === "All" || r.category === category)
        );
    });

    const table = document.getElementById("reportsTable");
    const empty = document.getElementById("emptyReports");

    empty.classList.toggle("hidden", filtered.length !== 0);

    table.innerHTML = filtered.map(r => `
        <tr>
            <td>
                <div class="problem">
                    <strong>${escapeHTML(r.title)}</strong>
                    <span>${escapeHTML(r.id)} • ${escapeHTML(r.category)}</span>
                </div>
            </td>
            <td>${escapeHTML(r.reportedBy || "User")}</td>
            <td><span class="priority ${String(r.priority).toLowerCase()}">${escapeHTML(r.priority)}</span></td>
            <td><span class="status ${statusClass(r.status)}">${escapeHTML(r.status)}</span></td>
            <td>${formatDate(r.date)}</td>
            <td>
                <button class="action-btn" data-open="${escapeHTML(r.id)}">View</button>
                ${r.status === "Pending"
                    ? `<button class="action-btn" data-status="${escapeHTML(r.id)}" data-new="Approved">Approve</button>
                       <button class="action-btn danger" data-status="${escapeHTML(r.id)}" data-new="Rejected">Reject</button>`
                    : ""}
            </td>
        </tr>
    `).join("");

    table.querySelectorAll("[data-open]").forEach(btn =>
        btn.addEventListener("click", () => openReport(btn.dataset.open))
    );

    table.querySelectorAll("[data-status]").forEach(btn =>
        btn.addEventListener("click", () => changeStatus(btn.dataset.status, btn.dataset.new))
    );
}

function changeStatus(id, newStatus) {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    report.status = newStatus;
    report.updatedAt = new Date().toISOString();
    saveReports();

    toast(`${id} marked as ${newStatus}`);
    refreshAll();
}

function openReport(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    document.getElementById("modalBody").innerHTML = `
        <span class="modal-id">REPORT ${escapeHTML(report.id)}</span>
        <h2 class="modal-title">${escapeHTML(report.title)}</h2>

        <div class="modal-meta">
            <span class="status ${statusClass(report.status)}">${escapeHTML(report.status)}</span>
            <span class="priority ${String(report.priority).toLowerCase()}">${escapeHTML(report.priority)} Priority</span>
        </div>

        <div class="detail-grid">
            <div class="detail"><small>Reporter</small><strong>${escapeHTML(report.reportedBy || "User")}</strong></div>
            <div class="detail"><small>Date</small><strong>${formatDate(report.date)}</strong></div>
            <div class="detail"><small>Category</small><strong>${escapeHTML(report.category)}</strong></div>
            <div class="detail"><small>Location</small><strong>${escapeHTML(report.location)}</strong></div>
        </div>

        <p class="modal-description">${escapeHTML(report.description)}</p>

        ${report.photo ? `
        <div style="margin: 14px 0;">
            <img src="${report.photo}" alt="Report photo" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border);">
        </div>
        ` : ""}

        <div class="modal-actions">
            ${report.status === "Pending" ? `
                <button data-modal-status="Approved" class="approve">✓ Approve Report</button>
                <button data-modal-status="Rejected" class="reject">× Reject Report</button>
            ` : ""}
            ${report.status === "Approved" ? `
                <button data-modal-status="In Progress">↻ Start Work</button>
                <button data-modal-status="Rejected" class="reject">× Reject</button>
            ` : ""}
            ${report.status === "In Progress" ? `
                <button data-modal-status="Resolved" class="resolve">✓ Mark Resolved</button>
            ` : ""}
            ${report.status === "Rejected" ? `
                <button data-modal-status="Approved" class="approve">↺ Approve Again</button>
            ` : ""}
            ${report.status === "Resolved" ? `
                <button data-modal-status="In Progress">↻ Reopen</button>
            ` : ""}
        </div>
    `;

    document.getElementById("modalBackdrop").classList.remove("hidden");

    document.querySelectorAll("[data-modal-status]").forEach(btn => {
        btn.addEventListener("click", () => {
            changeStatus(id, btn.dataset.modalStatus);
            closeModal();
        });
    });
}

function closeModal() {
    document.getElementById("modalBackdrop").classList.add("hidden");
}

function showPage(page) {
    document.querySelectorAll(".admin-page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".admin-nav").forEach(n => n.classList.remove("active"));

    document.getElementById(page).classList.add("active");
    document.querySelector(`.admin-nav[data-page="${page}"]`).classList.add("active");

    document.getElementById("pageTitle").textContent =
        page === "dashboard" ? "Admin Dashboard" : "Report Management";

    if (page === "reports") renderReports();
}

function refreshAll() {
    reports = getReports();
    updateStats();
    renderReports();
}

document.querySelectorAll(".admin-nav").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.go));
});

document.getElementById("refreshBtn").addEventListener("click", refreshAll);

document.getElementById("searchReports").addEventListener("input", renderReports);
document.getElementById("statusFilter").addEventListener("change", renderReports);
document.getElementById("categoryFilter").addEventListener("change", renderReports);

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", e => {
    if (e.target.id === "modalBackdrop") closeModal();
});

const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("adminEmail").value.trim().toLowerCase();
        const password = document.getElementById("adminPassword").value;
        const err = document.getElementById("adminLoginError");

        if (email === "admin@fixit.com" && password === "admin123") {
            localStorage.setItem(ADMIN_KEY, "true");
            document.getElementById("adminLoginModal").classList.add("hidden");
            if (err) err.textContent = "";
            toast("Welcome to FixIt Control Center!");
            refreshAll();
        } else {
            if (err) err.textContent = "Invalid admin email or password. Use demo credentials.";
        }
    });
}

const demoAdminBox = document.getElementById("demoAdminBox");
if (demoAdminBox) {
    demoAdminBox.addEventListener("click", () => {
        document.getElementById("adminEmail").value = "admin@fixit.com";
        document.getElementById("adminPassword").value = "admin123";
        const err = document.getElementById("adminLoginError");
        if (err) {
            err.style.color = "var(--green)";
            err.textContent = "Credentials auto-filled! Click 'Login to Control Center →'.";
        }
    });
}

document.getElementById("adminLogout").addEventListener("click", () => {
    localStorage.removeItem(ADMIN_KEY);
    checkAuth();
    toast("Logged out of Admin Control Center.");
});

window.addEventListener("storage", event => {
    if (event.key === REPORTS_KEY) {
        refreshAll();
    }
});

checkAuth();
refreshAll();
