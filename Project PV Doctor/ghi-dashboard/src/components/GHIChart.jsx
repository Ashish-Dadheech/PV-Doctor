import { useMemo, useRef, useState } from "react";

const PAD = { top: 20, right: 16, bottom: 36, left: 52 };

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatValue(value) {
  return `${value.toFixed(2)} kWh/m²`;
}

export default function GHIChart({ data }) {
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
    const yTicks = 5;
    const ticks = Array.from({ length: yTicks }, (_, i) => {
      const value = yMin + ((yMax - yMin) * i) / (yTicks - 1);
      return { value, y: yScale(value) };
    });

    const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .map((index) => ({ index, x: xScale(index), label: formatDate(data[index].date) }));

    return { width, height, innerH, points, linePath, areaPath, peak, ticks, xLabels, yMin, yMax };
  }, [data]);

  function handleMove(event) {
    if (!layout || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * layout.width;
    let nearest = layout.points[0];
    let bestDist = Infinity;
    for (const point of layout.points) {
      const dist = Math.abs(point.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = point;
      }
    }
    setHover(nearest);
  }

  if (!layout) {
    return <div className="chart-wrap" />;
  }

  return (
    <div className="chart-panel">
      <div className="chart-wrap" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        <svg ref={svgRef} viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
          {layout.ticks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={PAD.left}
                x2={layout.width - PAD.right}
                y1={tick.y}
                y2={tick.y}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text x={PAD.left - 8} y={tick.y + 4} textAnchor="end" fill="var(--muted)" fontSize="11">
                {tick.value.toFixed(2)}
              </text>
            </g>
          ))}

          <path d={layout.areaPath} fill="var(--fill)" />
          <path d={layout.linePath} fill="none" stroke="var(--line)" strokeWidth="2.5" />

          {layout.points.map((point) => (
            <circle
              key={point.date}
              cx={point.x}
              cy={point.y}
              r={hover?.date === point.date ? 5 : 3}
              fill={point.date === layout.peak.date ? "var(--accent)" : "var(--line)"}
              opacity={hover && hover.date !== point.date ? 0.35 : 1}
            />
          ))}

          <circle cx={layout.peak.x} cy={layout.peak.y} r="7" fill="none" stroke="var(--accent)" strokeWidth="2" />
          <text className="peak-label" x={layout.peak.x + 10} y={layout.peak.y - 8}>
            Peak {formatValue(layout.peak.ghi)}
          </text>

          {hover && (
            <>
              <line
                x1={hover.x}
                x2={hover.x}
                y1={PAD.top}
                y2={PAD.top + layout.innerH}
                stroke="var(--muted)"
                strokeDasharray="4 4"
              />
              <circle cx={hover.x} cy={hover.y} r="6" fill="var(--line)" stroke="#fff" strokeWidth="2" />
            </>
          )}

          {layout.xLabels.map((label) => (
            <text
              key={label.index}
              x={label.x}
              y={layout.height - 10}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
            >
              {label.label}
            </text>
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
