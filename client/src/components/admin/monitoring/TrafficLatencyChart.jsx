
import { useId, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import "./TrafficLatencyChart.css";

const WIDTH = 760;
const HEIGHT = 260;

const PLOT = {
  left: 50,
  top: 20,
  right: 705,
  bottom: 215
};

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

function buildPoints(values, maxValue) {
  const plotWidth = PLOT.right - PLOT.left;
  const plotHeight = PLOT.bottom - PLOT.top;

  return values.map((value, index) => ({
    x: PLOT.left +
      (index / Math.max(1, values.length - 1)) *
      plotWidth,

    y: PLOT.bottom -
      (Math.max(0, value) / maxValue) * plotHeight
  }));
}

function linePath(points) {
  return points.map((point, index) =>
    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
  ).join(" ");
}

function areaPath(points) {
  if (!points.length) return "";

  return [
    linePath(points),
    `L ${points.at(-1).x} ${PLOT.bottom}`,
    `L ${points[0].x} ${PLOT.bottom}`,
    "Z"
  ].join(" ");
}

export default function TrafficLatencyChart({
  trends = []
}) {
  const [hovered, setHovered] = useState(null);
  const gradientId = useId().replace(/:/g, "");

  const data = useMemo(
    () => trends.filter(
      item => Number.isFinite(
        new Date(item.timestamp).getTime()
      )
    ),
    [trends]
  );

  const chart = useMemo(() => {
    if (!data.length) return null;

    const requests = data.map(
      item => Number(item.requests) || 0
    );

    const latencies = data.map(
      item => Number(item.averageLatencyMs) || 0
    );

    const maxRequests = Math.max(
      5,
      ...requests
    );

    const maxLatency = Math.max(
      100,
      ...latencies
    );

    const requestPoints = buildPoints(
      requests,
      maxRequests
    );

    const latencyPoints = buildPoints(
      latencies,
      maxLatency
    );

    return {
      requestPoints,
      latencyPoints,
      requestLine: linePath(requestPoints),
      latencyLine: linePath(latencyPoints),
      requestArea: areaPath(requestPoints),
      maxRequests,
      maxLatency
    };
  }, [data]);

  const totalRequests = data.reduce(
    (sum, item) => sum + (Number(item.requests) || 0),
    0
  );

  return (
    <section className="pulse-traffic-panel">
      <div className="pulse-traffic-header">
        <div>
          <h2>
            <Activity size={19} />
            Request Volume & Latency
          </h2>

          <p>
            Rolling request activity and response duration
          </p>
        </div>

        <div className="pulse-traffic-legend">
          <span>
            <i className="pulse-legend-requests" />
            Requests/min
          </span>

          <span>
            <i className="pulse-legend-latency" />
            Avg latency
          </span>
        </div>
      </div>

      {!chart || totalRequests === 0 ? (
        <div className="pulse-chart-empty">
          No request activity recorded in this window.
        </div>
      ) : (
        <div className="pulse-chart-container">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Request volume and average latency over time"
          >
            <defs>
              <linearGradient
                id={`${gradientId}-requests`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#36d8a0"
                  stopOpacity="0.32"
                />
                <stop
                  offset="100%"
                  stopColor="#36d8a0"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {Array.from({ length: 5 }, (_, i) => {
              const y = PLOT.top +
                (i / 4) *
                (PLOT.bottom - PLOT.top);

              return (
                <g key={i}>
                  <line
                    x1={PLOT.left}
                    x2={PLOT.right}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.13"
                    strokeDasharray="4 5"
                  />

                  <text
                    x={PLOT.left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="currentColor"
                    opacity="0.65"
                    fontSize="11"
                  >
                    {Math.round(
                      chart.maxRequests * (1 - i / 4)
                    )}
                  </text>

                  <text
                    x={PLOT.right + 12}
                    y={y + 4}
                    textAnchor="start"
                    fill="currentColor"
                    opacity="0.65"
                    fontSize="11"
                  >
                    {Math.round(
                      chart.maxLatency * (1 - i / 4)
                    )}
                  </text>
                </g>
              );
            })}

            <path
              d={chart.requestArea}
              fill={`url(#${gradientId}-requests)`}
            />

            <path
              d={chart.requestLine}
              fill="none"
              stroke="#36d8a0"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            <path
              d={chart.latencyLine}
              fill="none"
              stroke="#69aaff"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {data.map((item, index) => (
              <rect
                key={item.timestamp}
                x={
                  chart.requestPoints[index].x -
                  (PLOT.right - PLOT.left) /
                  Math.max(1, data.length) / 2
                }
                y={PLOT.top}
                width={
                  (PLOT.right - PLOT.left) /
                  Math.max(1, data.length)
                }
                height={PLOT.bottom - PLOT.top}
                fill="transparent"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <title>
                  {`${formatTime(item.timestamp)}
Requests: ${item.requests}
Average latency: ${item.averageLatencyMs} ms`}
                </title>
              </rect>
            ))}

            {hovered !== null &&
              chart.requestPoints[hovered] && (
                <g pointerEvents="none">
                  <line
                    x1={chart.requestPoints[hovered].x}
                    x2={chart.requestPoints[hovered].x}
                    y1={PLOT.top}
                    y2={PLOT.bottom}
                    stroke="#9acaba"
                    strokeDasharray="4 4"
                  />

                  <circle
                    cx={chart.requestPoints[hovered].x}
                    cy={chart.requestPoints[hovered].y}
                    r="5"
                    fill="#36d8a0"
                  />

                  <circle
                    cx={chart.latencyPoints[hovered].x}
                    cy={chart.latencyPoints[hovered].y}
                    r="5"
                    fill="#69aaff"
                  />
                </g>
              )
            }

            {data.map((item, index) => {
              if (
                index % Math.max(1, Math.ceil(data.length / 6))
                !== 0
              ) {
                return null;
              }

              return (
                <text
                  key={item.timestamp}
                  x={chart.requestPoints[index].x}
                  y={HEIGHT - 12}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity="0.65"
                  fontSize="11"
                >
                  {formatTime(item.timestamp)}
                </text>
              );
            })}
          </svg>

          {hovered !== null && data[hovered] && (
            <div
              className="pulse-chart-tooltip"
              role="status"
            >
              <strong>
                {formatTime(data[hovered].timestamp)}
              </strong>

              <span>
                Requests: {data[hovered].requests}
              </span>

              <span>
                Latency: {
                  Number(
                    data[hovered].averageLatencyMs || 0
                  ).toFixed(2)
                } ms
              </span>
            </div>
          )}
        </div>
      )}

      <div className="pulse-chart-footer">
        <span>Left axis: requests/min</span>
        <span>Right axis: latency (ms)</span>
      </div>
    </section>
  );
}
