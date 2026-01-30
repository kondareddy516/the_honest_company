# The Honest Company - Full Stack Application

This is a full-stack web application developed as part of the **Flipr Placement Drive Fullstack Task**. It consists of a public-facing Landing Page and a private Admin Panel to manage content dynamically.

## 🚀 Live Deployment
* **Frontend:** [Link to your Vercel/Netlify deployment]
* **Backend:** [Link to your Render/Heroku/AWS deployment]

## ✨ Features

### 1. Landing Page
* **Hero Section:** engaging introductory content.
* **Our Projects:** Dynamically fetched project list including images, names, and descriptions.
* **Happy Clients:** Client testimonials fetched from the database.
* **Contact Form:** Functional form for user inquiries (data is sent to the backend).
* **Newsletter:** Subscription input field to capture email addresses.

### 2. Admin Panel
* **Authentication:** Secure login for administrators.
* **Project Management:** Add, edit, or delete projects.
* **Client Management:** Add, edit, or delete client testimonials.
* **View Inquiries:** Read submissions from the Contact Form.
* **Subscriber List:** View a list of all subscribed email addresses.

### 3. Bonus Features (Implemented)
* **Image Cropping:** Integrated `react-easy-crop` in the Admin Panel. When uploading images for projects or clients, the admin can crop them to specific aspect ratios before saving to ensuring design consistency.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, JWT (JSON Web Tokens), Multer (Image Uploads)
* **Database:** MongoDB (Mongoose)

## ⚙️ Installation & Run Locally

### Prerequisites
* Node.js installed
* MongoDB Atlas URI (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd the_honest_company
Here is a professional README.md file tailored to your project. It includes the specific requirements from the PDF (like the bonus Image Cropping feature) and the technical details found in your code (such as the default admin credentials and tech stack).

You can create a file named README.md in your root directory and paste the following content into it:

Markdown
# The Honest Company - Full Stack Application

This is a full-stack web application developed as part of the **Flipr Placement Drive Fullstack Task**. It consists of a public-facing Landing Page and a private Admin Panel to manage content dynamically.

## 🚀 Live Deployment
* **Frontend:** [Link to your Vercel/Netlify deployment]
* **Backend:** [Link to your Render/Heroku/AWS deployment]

## ✨ Features

### 1. Landing Page
* **Hero Section:** engaging introductory content.
* **Our Projects:** Dynamically fetched project list including images, names, and descriptions.
* **Happy Clients:** Client testimonials fetched from the database.
* **Contact Form:** Functional form for user inquiries (data is sent to the backend).
* **Newsletter:** Subscription input field to capture email addresses.

### 2. Admin Panel
* **Authentication:** Secure login for administrators.
* **Project Management:** Add, edit, or delete projects.
* **Client Management:** Add, edit, or delete client testimonials.
* **View Inquiries:** Read submissions from the Contact Form.
* **Subscriber List:** View a list of all subscribed email addresses.

### 3. Bonus Features (Implemented)
* **Image Cropping:** Integrated `react-easy-crop` in the Admin Panel. When uploading images for projects or clients, the admin can crop them to specific aspect ratios before saving to ensuring design consistency.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, JWT (JSON Web Tokens), Multer (Image Uploads)
* **Database:** MongoDB (Mongoose)

## ⚙️ Installation & Run Locally

### Prerequisites
* Node.js installed
* MongoDB Atlas URI (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd the_honest_company
2. Backend Setup
Navigate to the server directory and install dependencies:

Bash
cd server
npm install
Create a .env file in the server directory with the following variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Optional: Default Admin Credentials
ADMIN_USER=admin
ADMIN_PASS=23BQ5A0516
Start the backend server:

Bash
npm start
The server will run on http://localhost:5000

3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:

Bash
cd client
npm install
Start the frontend development server:

Bash
npm run dev
The client will run on http://localhost:5173 (or the port shown in terminal)

🔑 Admin Credentials
To access the Admin Panel, navigate to /admin (or click the Admin button if available) and use the following default credentials (unless changed in .env):

Username: admin

Password: 23BQ5A0516

📂 Project Structure
root/
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable components (ImageCropper, Forms, etc.)
│   │   ├── pages/      # LandingPage, AdminPanel
│   │   └── ...
├── server/             # Node.js Backend
│   ├── models/         # Mongoose Models (Project, Client, Contact, Subscriber)
│   ├── routes/         # API Routes
│   ├── uploads/        # Image storage directory
│   └── index.js        # Server entry point
└── README.md
