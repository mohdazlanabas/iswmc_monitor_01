
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
// Render provides the PORT environment variable
const port = process.env.PORT || 3000;

// Set up the database connection using environment variables
// Render will provide the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use SSL in production (on Render)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Function to create tables if they don't exist
const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS sgp (
                id SERIAL PRIMARY KEY,
                name TEXT,
                from_company TEXT,
                purpose_of_visit TEXT,
                phone_number TEXT,
                id_number TEXT,
                email_address TEXT,
                pic_to_meet TEXT,
                date TEXT,
                day TEXT
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS mrf (
                id SERIAL PRIMARY KEY,
                date TEXT,
                day TEXT,
                trucks_compactor INTEGER,
                trucks_open_tipper INTEGER,
                trucks_roro INTEGER,
                trucks_open_truck INTEGER,
                incoming_bunker REAL,
                incoming_1st_floor_sorting REAL,
                incoming_tipping_platform REAL,
                incoming_line_a_process REAL,
                incoming_line_b_process REAL,
                incoming_recyclables_plastics REAL,
                incoming_recyclables_metals REAL,
                incoming_leachate REAL,
                outgoing_organic_output REAL,
                outgoing_inert_output REAL,
                grappler_a_grabs INTEGER,
                grappler_a_mode TEXT,
                grappler_a_running REAL,
                grappler_a_downtime REAL,
                grappler_a_working REAL,
                grappler_b_grabs INTEGER,
                grappler_b_mode TEXT,
                grappler_b_running REAL,
                grappler_b_downtime REAL,
                grappler_b_working REAL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ltp (
                id SERIAL PRIMARY KEY,
                date TEXT,
                day TEXT,
                operation REAL,
                flowrate REAL,
                incoming_flow REAL,
                treated_final_discharge REAL,
                issues TEXT
            )
        `);
        console.log('Tables are successfully created or already exist.');
    } catch (err) {
        console.error('Error creating tables:', err.stack);
    } finally {
        client.release();
    }
};

// Create tables on startup
createTables();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/sgp', (req, res) => {
    res.render('sgp');
});

// Use async/await for cleaner route handlers
app.post('/sgp', async (req, res) => {
    const { name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day } = req.body;
    const query = `
        INSERT INTO sgp (name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day];

    try {
        await pool.query(query, values);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

app.get('/mrf', (req, res) => {
    res.render('mrf');
});

app.post('/mrf', async (req, res) => {
    const {
        date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
        incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
        incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
        outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
        grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
        grappler_b_downtime, grappler_b_working
    } = req.body;
    const query = `
        INSERT INTO mrf (
            date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
            incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
            incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
            outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
            grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
            grappler_b_downtime, grappler_b_working
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
    `;
    const values = [
        date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
        incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
        incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
        outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
        grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
        grappler_b_downtime, grappler_b_working
    ];

    try {
        await pool.query(query, values);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

app.get('/ltp', (req, res) => {
    res.render('ltp');
});

app.post('/ltp', async (req, res) => {
    const { date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues } = req.body;
    const query = `
        INSERT INTO ltp (date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues];

    try {
        await pool.query(query, values);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data");
    }
});

app.get('/wbs', (req, res) => {
    res.render('placeholder', { facility: 'Weighbridge (WBS)' });
});

app.get('/ads', (req, res) => {
    res.render('placeholder', { facility: 'Anaerobic Digester (ADS)' });
});

app.get('/dra', (req, res) => {
    res.render('placeholder', { facility: 'Depot Repair Area (DRA)' });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
