import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const CSV_PATH = path.resolve(__dirname, "../../output/ghi_combined.csv");

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const [date, ghi] = lines[i].split(",");
    if (date && ghi) {
      rows.push({ date: date.trim(), ghi: parseFloat(ghi.trim()) });
    }
  }
  return rows;
}

function loadData() {
  return parseCsv(fs.readFileSync(CSV_PATH, "utf-8"));
}

function computeStats(data) {
  if (!data.length) return { min: 0, max: 0, avg: 0 };
  const values = data.map((d) => d.ghi);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

app.use(cors());

app.get("/api/ghi", (req, res) => {
  const days = parseInt(req.query.days || "7", 10);
  const all = loadData();
  const filtered = days > 0 ? all.slice(-days) : all;
  res.json({
    range: days,
    stats: computeStats(filtered),
    data: filtered,
    lastUpdated: new Date().toISOString(),
  });
});

app.listen(PORT, () => console.log(`GHI API http://localhost:${PORT}`));
