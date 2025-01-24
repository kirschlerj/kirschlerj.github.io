const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Directory where CSV files are stored
const csvDirectory = path.join(__dirname, 'csv-files');

// Route to get the list of CSV files
app.get('/api/files', (req, res) => {
    fs.readdir(csvDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read files' });
        }
        // Filter to include only .csv files
        const csvFiles = files.filter(file => file.endsWith('.csv'));
        res.json(csvFiles);
    });
});

// Route to get CSV data for a specific file
app.get('/api/data/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(csvDirectory, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Read the CSV file and parse it
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        // Parse CSV data using PapaParse
        const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
        res.json(parsedData.data);
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
