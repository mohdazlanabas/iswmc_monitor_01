
require('dotenv').config();

const express = require('express');
const moment = require('moment');
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
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
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
            );

            -- Add issues column if it doesn't exist
            DO $
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mrf' AND column_name='issues') THEN
                    ALTER TABLE mrf ADD COLUMN issues TEXT;
                END IF;
            END
            $;
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
        grappler_b_downtime, grappler_b_working, issues
    } = req.body;
    const query = `
        INSERT INTO mrf (
            date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
            incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
            incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
            outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
            grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
            grappler_b_downtime, grappler_b_working, issues
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
    `;
    const values = [
        date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
        incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
        incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
        outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
        grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
        grappler_b_downtime, grappler_b_working, issues
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

app.get('/stored_data', async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');

        const sgpData = await pool.query('SELECT * FROM sgp WHERE date >= $1 ORDER BY date DESC', [sevenDaysAgo]);
        const mrfData = await pool.query('SELECT * FROM mrf WHERE date >= $1 ORDER BY date DESC', [sevenDaysAgo]);
        const ltpData = await pool.query('SELECT * FROM ltp WHERE date >= $1 ORDER BY date DESC', [sevenDaysAgo]);

        res.render('stored_data', {
            sgpData: sgpData.rows,
            mrfData: mrfData.rows,
            ltpData: ltpData.rows
        });
    } catch (err) {
        console.error('Error fetching stored data:', err);
        res.status(500).send('Error fetching stored data');
    }
});

app.get('/data_visualization', async (req, res) => {
    try {
        const oneWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
        const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
        const oneYearAgo = moment().subtract(1, 'years').format('YYYY-MM-DD');

        const sgpData = await pool.query('SELECT COUNT(*) as count, date FROM sgp GROUP BY date');
        const mrfData = await pool.query('SELECT * FROM mrf');
        const ltpData = await pool.query('SELECT * FROM ltp');

        const now = moment();

        const filterAndSum = (data, dateField, valueField, days) => {
            const threshold = moment().subtract(days, 'days');
            return data.rows.filter(row => moment(row[dateField]).isAfter(threshold)).reduce((acc, row) => acc + (parseFloat(row[valueField]) || 0), 0);
        };

        const sgp = {
            weekly_visitors: sgpData.rows.filter(row => moment(row.date).isAfter(moment().subtract(7, 'days'))).reduce((acc, row) => acc + parseInt(row.count), 0),
            monthly_visitors: sgpData.rows.filter(row => moment(row.date).isAfter(moment().subtract(30, 'days'))).reduce((acc, row) => acc + parseInt(row.count), 0),
            yearly_visitors: sgpData.rows.filter(row => moment(row.date).isAfter(moment().subtract(365, 'days'))).reduce((acc, row) => acc + parseInt(row.count), 0),
        };

        const mrf = {
            weekly_trucks: filterAndSum(mrfData, 'date', 'trucks_compactor', 7) + filterAndSum(mrfData, 'date', 'trucks_open_tipper', 7) + filterAndSum(mrfData, 'date', 'trucks_roro', 7) + filterAndSum(mrfData, 'date', 'trucks_open_truck', 7),
            monthly_trucks: filterAndSum(mrfData, 'date', 'trucks_compactor', 30) + filterAndSum(mrfData, 'date', 'trucks_open_tipper', 30) + filterAndSum(mrfData, 'date', 'trucks_roro', 30) + filterAndSum(mrfData, 'date', 'trucks_open_truck', 30),
            yearly_trucks: filterAndSum(mrfData, 'date', 'trucks_compactor', 365) + filterAndSum(mrfData, 'date', 'trucks_open_tipper', 365) + filterAndSum(mrfData, 'date', 'trucks_roro', 365) + filterAndSum(mrfData, 'date', 'trucks_open_truck', 365),
            weekly_incoming_tonnage: filterAndSum(mrfData, 'date', 'incoming_bunker', 7) + filterAndSum(mrfData, 'date', 'incoming_1st_floor_sorting', 7) + filterAndSum(mrfData, 'date', 'incoming_tipping_platform', 7),
            monthly_incoming_tonnage: filterAndSum(mrfData, 'date', 'incoming_bunker', 30) + filterAndSum(mrfData, 'date', 'incoming_1st_floor_sorting', 30) + filterAndSum(mrfData, 'date', 'incoming_tipping_platform', 30),
            yearly_incoming_tonnage: filterAndSum(mrfData, 'date', 'incoming_bunker', 365) + filterAndSum(mrfData, 'date', 'incoming_1st_floor_sorting', 365) + filterAndSum(mrfData, 'date', 'incoming_tipping_platform', 365),
            weekly_line_process: filterAndSum(mrfData, 'date', 'incoming_line_a_process', 7) + filterAndSum(mrfData, 'date', 'incoming_line_b_process', 7),
            monthly_line_process: filterAndSum(mrfData, 'date', 'incoming_line_a_process', 30) + filterAndSum(mrfData, 'date', 'incoming_line_b_process', 30),
            yearly_line_process: filterAndSum(mrfData, 'date', 'incoming_line_a_process', 365) + filterAndSum(mrfData, 'date', 'incoming_line_b_process', 365),
            weekly_recyclables: filterAndSum(mrfData, 'date', 'incoming_recyclables_plastics', 7) + filterAndSum(mrfData, 'date', 'incoming_recyclables_metals', 7),
            monthly_recyclables: filterAndSum(mrfData, 'date', 'incoming_recyclables_plastics', 30) + filterAndSum(mrfData, 'date', 'incoming_recyclables_metals', 30),
            yearly_recyclables: filterAndSum(mrfData, 'date', 'incoming_recyclables_plastics', 365) + filterAndSum(mrfData, 'date', 'incoming_recyclables_metals', 365),
            weekly_organic_output: filterAndSum(mrfData, 'date', 'outgoing_organic_output', 7),
            monthly_organic_output: filterAndSum(mrfData, 'date', 'outgoing_organic_output', 30),
            yearly_organic_output: filterAndSum(mrfData, 'date', 'outgoing_organic_output', 365),
            weekly_inert_output: filterAndSum(mrfData, 'date', 'outgoing_inert_output', 7),
            monthly_inert_output: filterAndSum(mrfData, 'date', 'outgoing_inert_output', 30),
            yearly_inert_output: filterAndSum(mrfData, 'date', 'outgoing_inert_output', 365),
            weekly_grappler_a_grabs: filterAndSum(mrfData, 'date', 'grappler_a_grabs', 7),
            monthly_grappler_a_grabs: filterAndSum(mrfData, 'date', 'grappler_a_grabs', 30),
            yearly_grappler_a_grabs: filterAndSum(mrfData, 'date', 'grappler_a_grabs', 365),
            weekly_grappler_b_grabs: filterAndSum(mrfData, 'date', 'grappler_b_grabs', 7),
            monthly_grappler_b_grabs: filterAndSum(mrfData, 'date', 'grappler_b_grabs', 30),
            yearly_grappler_b_grabs: filterAndSum(mrfData, 'date', 'grappler_b_grabs', 365),
        };

        const ltp = {
            weekly_flowrate: filterAndSum(ltpData, 'date', 'flowrate', 7),
            monthly_flowrate: filterAndSum(ltpData, 'date', 'flowrate', 30),
            yearly_flowrate: filterAndSum(ltpData, 'date', 'flowrate', 365),
            weekly_incoming_flow: filterAndSum(ltpData, 'date', 'incoming_flow', 7),
            monthly_incoming_flow: filterAndSum(ltpData, 'date', 'incoming_flow', 30),
            yearly_incoming_flow: filterAndSum(ltpData, 'date', 'incoming_flow', 365),
            weekly_treated_final_discharge: filterAndSum(ltpData, 'date', 'treated_final_discharge', 7),
            monthly_treated_final_discharge: filterAndSum(ltpData, 'date', 'treated_final_discharge', 30),
            yearly_treated_final_discharge: filterAndSum(ltpData, 'date', 'treated_final_discharge', 365),
        };

        res.render('data_visualization', { sgp, mrf, ltp });
    } catch (err) {
        console.error('Error fetching data for visualization:', err);
        res.status(500).send('Error fetching data for visualization');
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
