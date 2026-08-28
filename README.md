☀️ PV Doctor – GHI Dashboard

A modern and responsive GHI (Global Horizontal Irradiance) Dashboard developed as part of the PV Doctor Web Development Intern Assignment.

The project processes GHI CSV data, creates a combined dataset, and visualizes the data in a React-based time-series dashboard.

📌 Assignment Overview

This project covers:

Question 1: Data Manipulation
Question 2: Web / Visualization Skills
Question 3: Thinking & System Design
🛠️ Tech Stack
React
JavaScript
Python
HTML5
CSS3
Node.js
Vite
CSV Data Processing
Responsive Web Design
✨ Key Features
📊 GHI Data Visualization
Interactive GHI Time-Series Chart
Dynamic GHI data visualization
Clean dashboard interface
📅 Time Range Selection
1 Day View
7 Days View
30 Days View
📈 Data Statistics
Maximum GHI Value
Minimum GHI Value
Average GHI Value
🌙 Theme Support
Dark Mode
Light Mode
Theme Toggle
📱 Responsive Design
Desktop support
Tablet support
Mobile support
📂 Question 1 – Data Manipulation
Objective

The objective of this task is to process all GHI CSV files and generate a single CSV file containing the combined data.

Approach

A Python script was created to:

Read the GHI dataset folder.
Find CSV files.
Read data from each CSV file.
Combine the data.
Preserve the CSV columns.
Generate a single output CSV file.
Script
scripts/merge_ghi_data.py
Output
output/ghi_combined.csv
Assumptions
All input files are valid CSV files.
CSV files contain compatible columns.
Required input folders exist.
Files are readable.
Missing values can remain empty.
What Could Break the Solution?

The solution may face problems if:

CSV files have incompatible columns.
A CSV file is corrupted.
The input folder is missing.
Files cannot be accessed.
The dataset is extremely large.
📊 Question 2 – Web / Visualization Skills
Objective

A responsive React application was created to visualize GHI data as a time-series chart.

Features
GHI Time-Series Chart

The application displays GHI values over time.

X-axis: Date or Time
Y-axis: GHI Value
Time Range Selection

Users can select:

1 Day
7 Days
30 Days

The chart updates based on the selected time range.

Statistics

The application calculates and displays:

Maximum GHI Value
Minimum GHI Value
Average GHI Value
Additional Feature

A Dark / Light Theme Toggle was added to improve usability.

Responsive Design

The application is responsive and designed to work on:

Desktop
Tablet
Mobile devices
Data Source

The chart data is loaded from a local data source instead of hardcoding all values directly in the chart component.

🧠 Question 3 – Thinking & System Design
Possible Data Sources

The STRC price time-series chart could use:

Market data feeds
Financial data providers
Stock exchange APIs
Brokerage APIs
Historical databases

The chart mainly requires:

Timestamp
Price

Additional data may include:

Opening Price
Highest Price
Lowest Price
Trading Volume
Near Real-Time Data Processing

The data flow can work as follows:

Market Data Source
        ↓
Data Ingestion Service
        ↓
Validation and Processing
        ↓
Database / Cache
        ↓
Backend API / WebSocket
        ↓
Frontend Chart

New price data is received from a data source.

The backend validates and processes the data before storing it in a database or cache.

The frontend can receive updates using:

WebSockets
Server-Sent Events
Periodic API requests

The chart can then update when new data becomes available.

Reducing Visual Noise

Visual noise can be reduced without changing the original raw data using:

Moving Average

A moving average can help users understand the overall trend.

Downsampling

Fewer data points can be displayed while preserving the important chart shape.

Data Aggregation

Data can be grouped based on the selected time range.

For example:

1 Day  → Detailed data
7 Days → Hourly or aggregated data
30 Days → Larger time intervals
Zoom and Pan

Users can zoom into a smaller section to view more details.

Improved Tooltips

Exact values can be shown when users hover over the chart instead of displaying labels for every point.

10 Million Rows – Frontend Problems

Loading all 10 million rows in the frontend can cause:

High memory usage
Slow rendering
Slow JavaScript processing
Long network transfer time
Browser freezing
Browser crashes
Large Dataset Solution
Backend Filtering

The frontend should request only the required data.

Example:

GET /api/price?range=1d
GET /api/price?range=7d
GET /api/price?range=30d
Downsampling

Reduce the number of data points sent to the frontend.

Data Aggregation

Return different data resolutions depending on the selected time range.

Caching

Store frequently requested data for faster responses.

Database Indexing

Indexes on timestamps can improve query performance.

Efficient Rendering

Avoid rendering millions of individual chart points.

Web Workers

Move heavy calculations away from the main UI thread.

📁 Project Structure
PROJECT PV DOCTOR/
│
├── docs/
│   ├── QUESTION1.md
│   ├── QUESTION2.md
│   └── QUESTION3.md
│
├── ghi-dashboard/
│   ├── server/
│   │   └── index.js
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── GHIChart.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── output/
│   └── ghi_combined.csv
│
├── scripts/
│   └── merge_ghi_data.py
│
└── README.md
🚀 How to Run the Project
Install Dependencies

Open the ghi-dashboard folder and run:

npm install
Start the Frontend
npm run dev

Open the URL shown in the terminal.

🐍 Run Data Processing

From the project root:

python scripts/merge_ghi_data.py

The combined CSV file will be generated at:
