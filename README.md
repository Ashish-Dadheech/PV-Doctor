# 🎓 PV Doctor – GHI Dashboard

A modern and responsive **GHI (Global Horizontal Irradiance) Dashboard** developed as part of the **PV Doctor Web Development Intern Assignment**.

The project processes multiple GHI CSV files, combines them into a single dataset, and visualizes the data using an interactive time-series chart.

The dashboard provides an easy way to explore GHI data across different time ranges and view important statistics.

---

## 🌐 Live Demo

**Website:** Add your deployed project link here

---

## 🛠️ Tech Stack

- React.js
- JavaScript
- Python
- Node.js
- HTML5
- CSS3
- Vite
- CSV Data Processing
- Responsive Web Design

---

## ✨ Key Features

### 📊 GHI Data Visualization

- Interactive GHI Time-Series Chart
- Dynamic GHI data visualization
- Clean dashboard interface
- Data loaded from a local source

### ⏱️ Time Range Selection

- 1 Day View
- 7 Days View
- 30 Days View
- Dynamic chart updates

### 📈 Statistics

- Maximum GHI Value
- Minimum GHI Value
- Average GHI Value

### 🌙 User Interface

- Dark Theme
- Light Theme
- Theme Toggle
- Clean User Interface
- Responsive Layout

---

## 📂 Project Structure

```text
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
