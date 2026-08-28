PV Doctor – Web Development Intern Assignment
Overview

This project was created as part of the Web Development Intern Assignment for PV Doctor.

The project includes three parts:

Data Manipulation
GHI Data Visualization
Thinking & System Design
Question 1 – Data Manipulation
Objective

The objective is to combine multiple GHI CSV files into a single CSV file.

A Python script recursively reads the CSV files from the GHI dataset and its subfolders. The data is combined and saved as a single output CSV file.

Script
scripts/merge_ghi_data.py
Output
output/ghi_combined.csv
Steps
Read all GHI CSV files.
Search through subfolders.
Combine the CSV data.
Preserve the original columns.
Generate a single combined CSV file.
Assumptions
Input files are valid CSV files.
CSV files have compatible columns.
The required input folder exists.
Missing values can remain empty.
Possible Issues

The solution may face issues if:

CSV files have incompatible columns.
Files are corrupted.
The input folder is missing.
Files cannot be accessed.
The dataset is extremely large and causes memory issues.
Question 2 – GHI Data Visualization
Objective

A responsive React application was built to visualize GHI data as a time-series chart.

Features
GHI time-series chart
1 Day view
7 Day view
30 Day view
Maximum value
Minimum value
Average value
Dark theme
Light theme
Responsive design
Data loaded from a local data source
Project Structure
src/
├── components/
│   └── GHIChart.jsx
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx

The application displays the GHI values over time.

The X-axis represents time.
The Y-axis represents the GHI value.

Users can select 1 Day, 7 Days, or 30 Days to change the displayed time range.

The application also calculates and displays:

Maximum GHI
Minimum GHI
Average GHI

An additional Dark/Light Theme Toggle was added to improve usability.

Question 3 – Thinking & System Design
Possible Data Sources

The STRC price chart could use data from:

Stock market data feeds
Financial data providers
Brokerage APIs
Historical databases

The main data required for the chart includes:

Timestamp
Price
High price
Low price
Opening price
Trading volume
Near Real-Time Updates

The data flow can be represented as:

Market Data Source
        ↓
Data Ingestion Service
        ↓
Validation and Processing
        ↓
Database / Cache
        ↓
Backend API or WebSocket
        ↓
Frontend Chart

New data can be delivered to the frontend using WebSockets or periodic API requests.

Reducing Visual Noise

Visual noise can be reduced using:

Moving averages
Downsampling
Data aggregation
Zoom and pan
Improved tooltips

The original raw data remains unchanged.

Large Dataset – 10 Million Rows

Loading all 10 million rows in the frontend can cause:

High memory usage
Slow rendering
Slow JavaScript processing
Long loading times
Browser freezing or crashing
Solution

The problem can be addressed using:

Backend filtering
Downsampling
Data aggregation
Database indexing
Caching
Web Workers
Efficient chart rendering

The frontend should receive only the data required for the selected time range.

Technologies Used
React
JavaScript
Python
HTML
CSS
How to Run the Project
Frontend

Install dependencies:

npm install

Start the development server:

npm run dev
Data Processing

Run the Python script:

python scripts/merge_ghi_data.py

The combined CSV file will be generated in:

output/ghi_combined.csv
Conclusion

This project demonstrates:

CSV data processing
Data visualization
React development
Responsive UI design
Basic data engineering concepts
Large dataset performance considerations
System design thinking

Bas isse README.md naam se project ke main/root folder me save kar dena. Ensure kar lena ki package.json me jo actual commands hain aur Python script ke required packages, woh README se match karte hon.
