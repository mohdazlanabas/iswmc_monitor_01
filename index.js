
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Set up the database
const db = new sqlite3.Database('./database/iswmc.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the ISWMC database.');
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sgp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        from_company TEXT,
        purpose_of_visit TEXT,
        phone_number TEXT,
        id_number TEXT,
        email_address TEXT,
        pic_to_meet TEXT,
        date TEXT,
        day TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS mrf (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ltp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        day TEXT,
        operation REAL,
        flowrate REAL,
        incoming_flow REAL,
        treated_final_discharge REAL,
        issues TEXT
    )`);
});

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

app.post('/sgp', (req, res) => {
    const { name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day } = req.body;
    db.run(`INSERT INTO sgp (name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, from_company, purpose_of_visit, phone_number, id_number, email_address, pic_to_meet, date, day], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
});

app.get('/mrf', (req, res) => {
    res.render('mrf');
});

app.post('/mrf', (req, res) => {
    const {
        date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
        incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
        incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
        outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
        grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
        grappler_b_downtime, grappler_b_working
    } = req.body;
    db.run(`INSERT INTO mrf (
        date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
        incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
        incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
        outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
        grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
        grappler_b_downtime, grappler_b_working
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            date, day, trucks_compactor, trucks_open_tipper, trucks_roro, trucks_open_truck,
            incoming_bunker, incoming_1st_floor_sorting, incoming_tipping_platform, incoming_line_a_process,
            incoming_line_b_process, incoming_recyclables_plastics, incoming_recyclables_metals, incoming_leachate,
            outgoing_organic_output, outgoing_inert_output, grappler_a_grabs, grappler_a_mode, grappler_a_running,
            grappler_a_downtime, grappler_a_working, grappler_b_grabs, grappler_b_mode, grappler_b_running,
            grappler_b_downtime, grappler_b_working
        ], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
});

app.get('/ltp', (req, res) => {
    res.render('ltp');
});

app.post('/ltp', (req, res) => {
    const { date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues } = req.body;
    db.run(`INSERT INTO ltp (date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [date, day, operation, flowrate, incoming_flow, treated_final_discharge, issues], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
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
    console.log(`App listening at http://localhost:${port}`);
});
