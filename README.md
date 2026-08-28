🎓 PV Doctor – GHI Dashboard

A modern and responsive GHI (Global Horizontal Irradiance) Dashboard developed as part of the PV Doctor Web Development Intern Assignment.

The project processes multiple GHI CSV files, combines them into a single dataset, and visualizes the data using an interactive time-series chart.

The dashboard provides an easy way to explore GHI data across different time ranges and view important statistics.

🌐 Live Demo

Website: Add your deployed project link here

🛠️ Tech Stack
React.js
JavaScript
Python
Node.js
HTML5
CSS3
Vite
CSV Data Processing
Responsive Web Design
✨ Key Features
📊 GHI Data Visualization
Interactive GHI Time-Series Chart
Dynamic GHI data visualization
Clean and responsive dashboard
Data loaded from a local source
⏱️ Time Range Selection
1 Day View
7 Days View
30 Days View
Dynamic chart updates
📈 Statistics
Maximum GHI Value
Minimum GHI Value
Average GHI Value
🌙 User Interface
Dark Theme
Light Theme
Theme Toggle
Clean User Interface
Responsive Layout
📂 Project Structure
Project PV Doctor/
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
📊 Data Manipulation

The Python script:

Reads multiple GHI CSV files
Searches folders and subfolders
Combines all CSV data
Preserves the original data columns
Generates a single output file

Output: output/ghi_combined.csv

🧠 System Design

The system design section covers:

Possible market data sources
Near real-time data processing
WebSocket and API updates
Visual noise reduction
Moving averages
Downsampling
Data aggregation
Handling 10 million rows
Backend filtering
Caching and indexing
Efficient chart rendering
🚀 How to Run
Install Dependencies
cd ghi-dashboard
npm install
Start the Application
npm run dev
Run Data Processing

From the project root:

python scripts/merge_ghi_data.py
