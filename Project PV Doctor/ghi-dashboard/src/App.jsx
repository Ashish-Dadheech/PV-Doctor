import { useEffect, useMemo, useState } from "react";
import GHIChart from "./components/GHIChart.jsx";

const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

function formatValue(value) {
  return `${value.toFixed(2)} kWh/m²`;
}

export default function App() {
  const [range, setRange] = useState(7);
  const [theme, setTheme] = useState("dark");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/ghi?days=${range}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        if (!cancelled) setPayload(json);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const latest = payload?.data?.[payload.data.length - 1];
  const previous = payload?.data?.[payload.data.length - 2];
  const change = useMemo(() => {
    if (!latest || !previous) return null;
    const delta = latest.ghi - previous.ghi;
    const pct = (delta / previous.ghi) * 100;
    return { delta, pct };
  }, [latest, previous]);

  const lastUpdated = payload?.lastUpdated
    ? new Date(payload.lastUpdated).toLocaleTimeString()
    : "--";

  return (
    <div className="app">
      <header className="header">
        <div className="breadcrumb">Compare &gt; GHI</div>
        <div className="badge-row">
          <span className="badge">Solar</span>
          <h1 className="title">GHI Dashboard</h1>
        </div>
        <p className="subtitle">Global Horizontal Irradiance — daily solar irradiation tracking</p>
      </header>

      <section className="toolbar">
        <div>
          <div className="price-block">
            <div className="price">{latest ? formatValue(latest.ghi) : "--"}</div>
            {change && (
              <div className={`change ${change.delta >= 0 ? "up" : "down"}`}>
                {change.delta >= 0 ? "+" : ""}
                {change.delta.toFixed(2)} ({change.pct >= 0 ? "+" : ""}
                {change.pct.toFixed(2)}%)
              </div>
            )}
          </div>
          <div className="meta">GHI • Daily total • Last updated {lastUpdated}</div>
        </div>

        <div className="controls">
          <div className="toggle-group">
            {RANGES.map((item) => (
              <button
                key={item.days}
                className={range === item.days ? "active" : ""}
                onClick={() => setRange(item.days)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </section>

      {loading && <div className="loading">Loading GHI data…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && payload && (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-label">Max</div>
              <div className="stat-value">{formatValue(payload.stats.max)}</div>
            </article>
            <article className="stat-card">
              <div className="stat-label">Min</div>
              <div className="stat-value">{formatValue(payload.stats.min)}</div>
            </article>
            <article className="stat-card">
              <div className="stat-label">Avg</div>
              <div className="stat-value">{formatValue(payload.stats.avg)}</div>
            </article>
          </section>

          <GHIChart data={payload.data} />

          <div className="chart-footer">
            <span>Showing {payload.data.length} day{payload.data.length === 1 ? "" : "s"}</span>
            <span>Peak highlight + crosshair tooltip enabled</span>
          </div>
        </>
      )}
    </div>
  );
}
