# Greenviro SPAJ ISWMC Operation Data Programs

This project is a web-based data collection application for the Greenviro SPAJ ISWMC (Integrated Solid Waste Management Center). It allows users to input operational data for various facilities within the center.

## Features

*   **Data Entry Forms:** Separate data entry forms for different facilities:
    *   Security Guard Post (SGP)
    *   Material Recovery Facility (MRF)
    *   Leachate Treatment Plant (LTP)
*   **Database Integration:** Data submitted through the forms is stored in a local SQLite database.
*   **Responsive Design:** The application is designed to be user-friendly on both desktop and mobile devices, using the Bootstrap framework.
*   **Placeholder Pages:** Includes placeholder pages for future development of the following modules:
    *   Weighbridge (WBS)
    *   Anaerobic Digester (ADS)
    *   Depot Repair Area (DRA)

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** SQLite
*   **Frontend:** EJS (Embedded JavaScript), Bootstrap
*   **Version Control:** Git

## Setup and Installation

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd iswmc_monitor
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the application:**
    ```bash
    node index.js
    ```

## Usage

1.  Once the application is running, open your web browser and navigate to `http://localhost:3000`.
2.  You will see the main navigation page with links to the different data collection forms.
3.  Click on a link to go to the corresponding form.
4.  Fill out the form fields and click the "Submit" button to save the data.
5.  A "Home" button is available on each form to return to the main navigation page.

## Database

The application uses a SQLite database to store the collected data. The database file, `iswmc.db`, is located in the `database` directory. The database contains separate tables for each of the data collection modules (SGP, MRF, LTP).

## Future Development

The following modules are planned for future development:

*   Weighbridge (WBS)
*   Anaerobic Digester (ADS)
*   Depot Repair Area (DRA)

These modules currently have placeholder pages.
