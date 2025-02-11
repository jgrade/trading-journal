const express = require('express');
const path = require('path');
const moment = require('moment');
const dashboardRoutes = require('./routes/dashboard');
const entriesRoutes = require('./routes/entries');

const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', dashboardRoutes);
app.use('/entries', entriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 