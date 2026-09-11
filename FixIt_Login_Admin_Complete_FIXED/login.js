const USERS_KEY = "fixit_users";
const CURRENT_USER_KEY = "fixit_current_user";

function getUsers() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        if (!Array.isArray(saved)) saved = [];
    } catch (e) {
        saved = [];
    }

    if (!saved.some(user => user.email === "john@fixit.com")) {
        saved.push({
            name: "John Doe",
            email: "john@fixit.com",
            password: "123456"
        });
        localStorage.setItem(USERS_KEY, JSON.stringify(saved));
    }

    return saved;
}

function showMessage(text, type) {
    const box = document.getElementById("authMessage");
    box.textContent = text;
    box.className = "auth-message " + type;
}

function goToDashboard(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: user.name,
        email: user.email
    }));

    showMessage("Login successful! Opening your dashboard...", "success");

    setTimeout(() => {
        window.location.replace("index.html");
    }, 450);
}

function showLogin() {
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("authTitle").textContent = "Welcome back";
    document.getElementById("authSubtitle").textContent =
        "Login to report and track community problems.";
    showMessage("", "");
}

function showRegister() {
    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("authTitle").textContent = "Create your account";
    document.getElementById("authSubtitle").textContent =
        "Join FixIt and help improve your community.";
    showMessage("", "");
}

document.getElementById("loginTab").addEventListener("click", showLogin);
document.getElementById("registerTab").addEventListener("click", showRegister);

const demoUserBox = document.getElementById("demoUserBox");
if (demoUserBox) {
    demoUserBox.addEventListener("click", () => {
        showLogin();
        document.getElementById("loginEmail").value = "john@fixit.com";
        document.getElementById("loginPassword").value = "123456";
        showMessage("Demo user credentials auto-filled! Click 'Login →'.", "success");
    });
}

document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(item =>
        item.email.toLowerCase() === email && item.password === password
    );

    if (!user) {
        showMessage("Invalid email or password. Please try again.", "error");
        return;
    }

    goToDashboard(user);
});

document.getElementById("registerForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.email.toLowerCase() === email)) {
        showMessage("This email is already registered. Please login.", "error");
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    goToDashboard(newUser);
});

// If already logged in, don't show login page again.
if (localStorage.getItem(CURRENT_USER_KEY)) {
    window.location.replace("index.html");
} else {
    getUsers();
}
