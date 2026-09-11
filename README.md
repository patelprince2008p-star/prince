#prince

FixIt — Community Problem Solver 🚀
FixIt is a modern, responsive community problem-reporting web application designed to make it easier for people to report, track, and manage local community problems.

The project provides two main experiences:

👤 User Platform — users can create an account, report problems, view their reports, track status, and explore community reports.

🔐 Admin Control Center — administrators can review reports, approve/reject them, move approved reports to In Progress, mark issues as Resolved, and filter/search reports.

✨ Features
👤 User Side
User login and registration

Demo user account

Dashboard with report statistics

Report a community problem

Select problem category and priority

Add location and description

Optional problem photo selection

My Problems section

Search and filter reports

Report status tracking

Community section

Light/Dark mode

Responsive layout for desktop and mobile

🛡️ Admin Side
Separate Admin Control Center

Admin authentication

Dashboard statistics

Pending report review

Approve or reject reports

Move approved reports to In Progress

Mark reports as Resolved

Reopen resolved/rejected reports when required

Search reports by title, location, reporter, ID, or description

Filter by status and category

Detailed report modal

Real-time synchronization between user and admin tabs using browser storage events

🧩 Report Status Flow
Pending
   ↓
Approved
   ↓
In Progress
   ↓
Resolved
A report can also be Rejected by the administrator.

🛠️ Technologies Used
HTML5

CSS3

Vanilla JavaScript (ES6+)

Browser LocalStorage

Google Fonts (Inter)

Responsive Web Design

No backend server or external database is required for the current demo version.

📁 Project Structure
FixIt/
│
├── index.html       # Main user dashboard
├── login.html       # Login and registration page
├── admin.html       # Admin Control Center
│
├── script.js        # User-side application logic
├── login.js         # Login/registration logic
├── admin.js         # Admin dashboard and report management
│
├── style.css        # Main website styling
├── login.css        # Login page styling
└── admin.css        # Admin panel styling


🚀 How to Run
Option 1 — Open directly
Download or clone this repository.

Open the project folder.

Open login.html in a modern web browser.

Create an account or use the demo account.

Option 2 — VS Code + Live Server
Open the project folder in Visual Studio Code.

Install the Live Server extension.

Right-click login.html.

Select Open with Live Server.

Using a local server is recommended for a smoother development/demo experience.

🔑 Demo Login
User Account
Email: john@fixit.com
Password: 123456
Admin Account
Email: admin@fixit.com
Password: admin123
⚠️ These credentials are for the demo/prototype only. This project uses browser-side authentication and LocalStorage, so it is not intended for production security.

💾 Data Storage
This prototype stores application data in the browser using LocalStorage.

Main storage keys include:

fixit_users
fixit_current_user
fixit_reports
fixit_admin_logged_in
fixit_theme
Because the data is stored locally:

Data is specific to the browser/device.

Clearing browser storage will remove the demo data.

Different devices do not automatically share the same reports.

A real production version should use a secure backend and database.

🤖 Future AI Enhancements
FixIt can be expanded into an AI-assisted community management platform.

Possible future features:

🤖 Automatic problem categorization

🔎 Duplicate report detection

🚨 AI-based priority prediction

📍 Smart location-based issue clustering

📊 Community issue analytics

📝 Automatic report summarization

💬 AI assistant for reporting problems

📈 Predictive maintenance insights

🎯 Project Goal
The goal of FixIt is simple:

Spot a problem → Report it → Track it → Resolve it.

Instead of stopping at a complaint submission, FixIt creates a simple workflow for managing a community issue from initial report to resolution.

🔮 Future Scope
For a production-ready version, the project can be upgraded with:

Secure user/admin authentication

Backend API

Cloud database

Image storage

Real-time notifications

GPS/map integration

Role-based access control

Email/SMS notifications

Government/municipality integration

AI-powered report analysis

📌 Project Type
Academic / Prototype Project

Built as a demonstration of a functional community problem-reporting platform with a user dashboard and administrator control center.

👨‍💻 Author
FixIt Team

Community Problem Solver — making community issues easier to report, track, and resolve.

📄 License
This project is created for educational and demonstration purposes. You may adapt the code for learning and further development.
