# Greenviro SPAJ ISWMC Operation Data Programs

This project is a web-based data collection application for the Greenviro SPAJ ISWMC (Integrated Solid Waste Management Center). It allows users to input operational data for various facilities within the center.

## Features

*   **Data Entry Forms:** Separate data entry forms for different facilities:
    *   Security Guard Post (SGP)
    *   Material Recovery Facility (MRF)
    *   Leachate Treatment Plant (LTP)
*   **Database Integration:** Data submitted through the forms is stored in a PostgreSQL database.
*   **Responsive Design:** The application is designed to be user-friendly on both desktop and mobile devices, using the Bootstrap framework.
*   **Placeholder Pages:** Includes placeholder pages for future development of the following modules:
    *   Weighbridge (WBS)
    *   Anaerobic Digester (ADS)
    *   Depot Repair Area (DRA)

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Frontend:** EJS (Embedded JavaScript), Bootstrap
*   **Version Control:** Git

---

## Deployment on Render

This application is configured for easy deployment on [Render](https://render.com/).

### Step-by-Step Instructions:

1.  **Push to GitHub:** Make sure your project code is pushed to a GitHub repository.

2.  **Create a Render Account:** Sign up for a free account on Render using your GitHub profile.

3.  **Create a New PostgreSQL Database:**
    *   In the Render Dashboard, click **"New +"** and select **"PostgreSQL"**.
    *   Give your database a unique name (e.g., `iswmc-database`).
    *   Select a region close to you.
    *   Click **"Create Database"**.
    *   Wait for the database to become available. Once it's ready, find the **"Connections"** section and copy the **"Internal Connection String"**. You will need this for the web service.

4.  **Create a New Web Service:**
    *   In the Render Dashboard, click **"New +"** and select **"Web Service"**.
    *   Connect your GitHub account and select the repository for this project.
    *   Give your web service a unique name (e.g., `iswmc-app`).
    *   Under **"Environment"**, ensure the **"Runtime"** is set to **"Node"**.
    *   The **"Build Command"** should be `npm install`.
    *   The **"Start Command"** should be `npm start`.

5.  **Add Environment Variables:**
    *   Under the **"Environment"** section for your new web service, click **"Add Environment Variable"**.
    *   Add the first variable:
        *   **Key:** `DATABASE_URL`
        *   **Value:** Paste the **"Internal Connection String"** you copied from your PostgreSQL database.
    *   Add the second variable:
        *   **Key:** `NODE_ENV`
        *   **Value:** `production`

6.  **Deploy:**
    *   Click **"Create Web Service"** at the bottom of the page.
    *   Render will automatically build and deploy your application. You can monitor the progress in the deploy logs.
    *   Once deployed, you will be given a public URL (e.g., `https-iswmc-app.onrender.com`) where you can access your live application.

---

## Local Development Setup

To run this application on your local machine, you will need to have Node.js and PostgreSQL installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd iswmc_monitor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Local PostgreSQL Database:**
    *   Create a new PostgreSQL database on your local machine.
    *   Get your database connection string. It will look something like this: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`

4.  **Create Environment File:**
    *   Create a new file named `.env` in the root of the project.
    *   Add your local database connection string to this file:
        ```
        DATABASE_URL=your_postgresql_connection_string
        ```
    *   **Important:** You will need to install a package to read this `.env` file for local development. Run:
        ```bash
        npm install dotenv
        ```
    *   Then, add the following line to the very top of `index.js`:
        ```javascript
        require('dotenv').config();
        ```

5.  **Run the application:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Database

The application uses a PostgreSQL database. The schema is defined in `index.js` and the tables (`sgp`, `mrf`, `ltp`) are created automatically when the application starts if they do not already exist.
