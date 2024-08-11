# Auto-Web-Scraper
Auto-Web-Scraper is a web application that allows users to effortlessly scrape websites and collect data for their projects. The application is built using the MEAN stack (MongoDB, Express.js, Angular, Node.js) and Python FastAPI for the scraping functionality. 

The website can be found here (https://auto-web-scraper-e92befdaa3e7.herokuapp.com/).

# Features
- User-friendly interface for specifying scraping parameters.
- Supports scraping data from both single-page and multi-page websites.
- Option to download scraped data in CSV, JSON, or XLSX formats.
- Utilizes Python FastAPI for efficient and scalable web scraping.

# Tech Stack

## Frontend
- Angular: Framework for building client applications in HTML and TypeScript.
- Tailwind CSS: Utility-first CSS framework for styling.

## Backend
- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database for storing user data and scrape configurations.

## Scraping Model
- Python: Programming language used for web scraping.
- FastAPI: Fast web framework for building APIs with Python.

## Deployment
- Heroku (Backend, Frontend)
- AWS (API)

# Setup and Installation
 ## Prerequisites
- Node.js and npm
- Python 3.x
- MongoDB
- Angular CLI


# Installation
Clone the repository:

```bash
sh
Copy code
git clone https://github.com/your-username/auto-web-scraper.git
cd auto-web-scraper
```

Backend Setup (Node.js and Express.js):

```bash
sh
Copy code
cd backend
npm install
```

Frontend Setup (Angular):

```bash
sh
Copy code
cd frontend
npm install
```

Scraping Model Setup (Python FastAPI):

```bash
sh
Copy code
cd scraper
pip install -r requirements.txt
Running the Application
```

Start MongoDB:

```bash
sh
Copy code
mongod
```

Run the Backend:

```bash
sh
Copy code
cd backend
npm start
```

Run the Frontend:

```bash
sh
Copy code
cd frontend
ng serve
```

Run the Scraping Model:

```bash
sh
Copy code
cd scraper
uvicorn main:app --reload
```

# Usage

## Navigate to the application:
Open your browser and go to http://localhost:4200.

## Login or Register:
Create a new account or log in with your existing account.

## Specify Scraping Parameters:
Enter the URL, initial elements, parameters, and other configurations.

## Submit and Download:
Click the submit button to start the scraping process. Once completed, download the scraped data in your preferred format.


# Fork the repository.
- Create a new branch: git checkout -b feature/your-feature.
- Make your changes and commit them: git commit -m 'Add some feature'.
- Push to the branch: git push origin feature/your-feature.
- Submit a pull request.
