---
layout: page
title: "ADS Data Documentation"
permalink: /adsdoc/
---

<html lang="en">
<head>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADS Cyberbag Documentation</title>
    <style>
        /* General Body and Layout */
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 100px;
            background-color: #f9f9f9;
            display: flex;
            min-height: 100vh;
        }

        /* Left Sidebar with CSV file list */
        #file-list {
            width: 300px;
            background-color: #024230;
            color: white;
            padding: 20px;
            overflow-y: auto;
            border-right: 2px solid #34495e;
        }
        
        #file-list h3 {
            font-size: 1.4rem;
            color: #ecf0f1;
            margin-bottom: 20px;
            margin-top: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        #file-list ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        #file-list li {
            font-size: 1rem;
            padding: 10px;
            margin-bottom: 8px;
            background-color: #00694E;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }

        #file-list li:hover {
            background-color: #1abc9c;
            transform: translateX(5px);
        }

        #file-list li.active {
            background-color: #16a085;
        }

        /* Main table area */
        #table-container {
            flex: 1;
            padding: 20px;
            background-color: #ecf0f1;
            overflow-y: auto;
        }

        #table-container h3 {
            font-size: 1.6rem;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #00694E;
            color: #ecf0f1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background-color: #ecf0f1;
            cursor: pointer;
        }

        td {
            color: #7f8c8d;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }

            #file-list {
                width: 100%;
                padding: 15px;
            }

            #table-container {
                padding: 10px;
            }
        }

    </style>
</head>
<body>

    <div id="file-list">
        <h3>Topic List</h3>
        <ul id="csv-files">
            <!-- CSV filenames will be inserted here -->
        </ul>
    </div>

    <div id="table-container">
        <h3>Topic Data</h3>
        <table id="data-table">
            <!-- Data table will be inserted here -->
        </table>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>

    <script>
        // Array of CSV filenames stored in your GitHub repo (update paths if necessary)
        const csvFiles = [
            'csv-files/.apollo.canbus.chassis_detail.csv',
            'csv-files/.apollo.canbus.chassis.csv',
            'csv-files/.apollo.common.latency_records.csv',
            'csv-files/.apollo.common.latency_reports.csv',
            'csv-files/.apollo.control.csv',
            'csv-files/.apollo.control.pad.csv',
            'csv-files/.apollo.hmi.status.csv',
            'csv-files/.apollo.localization.msf_status.csv',
            'csv-files/.apollo.localization.pose.csv',
            'csv-files/.apollo.monitor.csv',
            'csv-files/.apollo.monitor.system_status.csv',
            'csv-files/.apollo.perception.traffic_light.csv',
            'csv-files/.apollo.routing_request.csv',
            'csv-files/.apollo.routing_response.csv',
            'csv-files/.apollo.routing_response_history.csv',
            'csv-files/.apollo.sensor.gnss.best_pose.csv',
            'csv-files/.apollo.sensor.gnss.corrected_imu.csv',
            'csv-files/.apollo.sensor.gnss.gnss_status.csv',
            'csv-files/.apollo.sensor.gnss.ins_stat.csv',
            'csv-files/.apollo.sensor.gnss.ins_status.csv',
            'csv-files/.apollo.sensor.gnss.odometry.csv',
            'csv-files/.apollo.sensor.gnss.raw_data.csv',
            'csv-files/.tf.csv',
            'csv-files/.tf_static.csv'
        ];

        // Function to load CSV filenames and display them as a list
        function loadCSVFiles() {
            const fileListElement = document.getElementById('csv-files');
            csvFiles.forEach(file => {
                const listItem = document.createElement('li');
                const fileNameWithoutExtension = file.split('/').pop().replace('.csv', '');
                listItem.textContent = fileNameWithoutExtension;
                listItem.onclick = () => loadCSVData(file);
                fileListElement.appendChild(listItem);
            });
        }

        // Function to load and parse CSV data using PapaParse
        function loadCSVData(fileName) {
            const filePath = `https://raw.githubusercontent.com/kirschlerj/kirschlerj.github.io/main/${fileName}`;

            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    Papa.parse(data, {
                        header: true,
                        dynamicTyping: true,
                        complete: function(results) {
                            renderTable(results.data);
                        }
                    });
                })
                .catch(err => console.error('Error loading CSV data:', err));
        }

        // Function to render the table with CSV data
        function renderTable(data) {
            const table = document.getElementById('data-table');
            table.innerHTML = ''; // Clear the table before rendering new data

            if (data.length === 0) {
                table.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #7f8c8d;">No data available</td></tr>';
                return;
            }

            const headerRow = document.createElement('tr');
            Object.keys(data[0]).forEach((key) => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            data.forEach(row => {
                const rowElement = document.createElement('tr');
                Object.values(row).forEach((cell) => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    rowElement.appendChild(td);
                });
                table.appendChild(rowElement);
            });
        }

        // Load the CSV files when the page is loaded
        window.onload = loadCSVFiles;
    </script>

</body>
</html>
