const { useEffect, useMemo, useRef, useState } = React;

const PAD = { top: 20, right: 16, bottom: 36, left: 52 };
const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatValue(value) {
  return `${value.toFixed(2)} kWh/m²`;
}

function GHIChart({ data }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const layout = useMemo(() => {
    if (!data.length) return null;
    const width = 900;
    const height = 320;
    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const values = data.map((d) => d.ghi);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.08 || 0.5;
    const yMin = min - padding;
    const yMax = max + padding;
    const xScale = (index) => PAD.left + (index / Math.max(data.length - 1, 1)) * innerW;
    const yScale = (value) => PAD.top + innerH - ((value - yMin) / (yMax - yMin)) * innerH;
    const points = data.map((d, i) => ({ ...d, x: xScale(i), y: yScale(d.ghi), index: i }));
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`;
    const peak = points.reduce((best, p) => (p.ghi > best.ghi ? p : best), points[0]);
    const ticks = Array.from({ length: 5 }, (_, i) => {
      const value = yMin + ((yMax - yMin) * i) / 4;
      return { value, y: yScale(value) };
    });
    const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .map((index) => ({ index, x: xScale(index), label: formatDate(data[index].date) }));
    return { width, height, innerH, points, linePath, areaPath, peak, ticks, xLabels };
  }, [data]);

  function handleMove(event) {
    if (!layout || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * layout.width;
    let nearest = layout.points[0];
    let bestDist = Infinity;
    for (const point of layout.points) {
      const dist = Math.abs(point.x - x);
      if (dist < bestDist) { bestDist = dist; nearest = point; }
    }
    setHover(nearest);
  }

  if (!layout) return <div className="chart-wrap" />;

  return (
    <div className="chart-panel">
      <div className="chart-wrap" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        <svg ref={svgRef} viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
          {layout.ticks.map((tick) => (
            <g key={tick.value}>
              <line x1={PAD.left} x2={layout.width - PAD.right} y1={tick.y} y2={tick.y} stroke="var(--border)" />
              <text x={PAD.left - 8} y={tick.y + 4} textAnchor="end" fill="var(--muted)" fontSize="11">{tick.value.toFixed(2)}</text>
            </g>
          ))}
          <path d={layout.areaPath} fill="var(--fill)" />
          <path d={layout.linePath} fill="none" stroke="var(--line)" strokeWidth="2.5" />
          {layout.points.map((point) => (
            <circle key={point.date} cx={point.x} cy={point.y} r={hover?.date === point.date ? 5 : 3}
              fill={point.date === layout.peak.date ? "var(--accent)" : "var(--line)"}
              opacity={hover && hover.date !== point.date ? 0.35 : 1} />
          ))}
          <circle cx={layout.peak.x} cy={layout.peak.y} r="7" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text className="peak-label" x={layout.peak.x + 10} y={layout.peak.y - 8}>Peak {formatValue(layout.peak.ghi)}</text>
          {hover && (
            <>
              <line x1={hover.x} x2={hover.x} y1={PAD.top} y2={PAD.top + layout.innerH} stroke="var(--muted)" strokeDasharray="4 4" />
              <circle cx={hover.x} cy={hover.y} r="6" fill="var(--line)" stroke="#fff" strokeWidth="2" />
            </>
          )}
          {layout.xLabels.map((label) => (
            <text key={label.index} x={label.x} y={layout.height - 10} textAnchor="middle" fill="var(--muted)" fontSize="11">{label.label}</text>
          ))}
        </svg>
        {hover && (
          <div className="tooltip" style={{ left: `${(hover.x / layout.width) * 100}%`, top: `${(hover.y / layout.height) * 100}%` }}>
            <div>{formatDate(hover.date)}</div>
            <div>{formatValue(hover.ghi)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [range, setRange] = useState(7);
  const [theme, setTheme] = useState("dark");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

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
    return () => { cancelled = true; };
  }, [range]);

  const latest = payload?.data?.[payload.data.length - 1];
  const previous = payload?.data?.[payload.data.length - 2];
  const change = useMemo(() => {
    if (!latest || !previous) return null;
    const delta = latest.ghi - previous.ghi;
    return { delta, pct: (delta / previous.ghi) * 100 };
  }, [latest, previous]);

  const lastUpdated = payload?.lastUpdated ? new Date(payload.lastUpdated).toLocaleTimeString() : "--";

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
                {change.delta >= 0 ? "+" : ""}{change.delta.toFixed(2)} ({change.pct >= 0 ? "+" : ""}{change.pct.toFixed(2)}%)
              </div>
            )}
          </div>
          <div className="meta">GHI • Daily total • Last updated {lastUpdated}</div>
        </div>
        <div className="controls">
          <div className="toggle-group">
            {RANGES.map((item) => (
              <button key={item.days} className={range === item.days ? "active" : ""} onClick={() => setRange(item.days)}>{item.label}</button>
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
            <article className="stat-card"><div className="stat-label">Max</div><div className="stat-value">{formatValue(payload.stats.max)}</div></article>
            <article className="stat-card"><div className="stat-label">Min</div><div className="stat-value">{formatValue(payload.stats.min)}</div></article>
            <article className="stat-card"><div className="stat-label">Avg</div><div className="stat-value">{formatValue(payload.stats.avg)}</div></article>
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
