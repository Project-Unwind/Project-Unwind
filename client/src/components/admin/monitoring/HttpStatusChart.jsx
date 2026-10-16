
import { useId, useMemo, useState } from "react";
import { PieChart } from "lucide-react";

import "./HttpStatusChart.css";

const STATUS_CONFIG = [
  {
    key: "2xx",
    label: "Successful",
    color: "#36d8a0"
  },
  {
    key: "3xx",
    label: "Redirects",
    color: "#69aaff"
  },
  {
    key: "4xx",
    label: "Client errors",
    color: "#f2b95e"
  },
  {
    key: "5xx",
    label: "Server errors",
    color: "#f16c76"
  }
];

const RADIUS = 76;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HttpStatusChart({
  statusCodes = {},
  abortedRequests = 0
}) {
  const [activeStatus, setActiveStatus] = useState(null);
  const chartId = useId().replace(/:/g, "");

  const { segments, total } = useMemo(() => {
    const values = STATUS_CONFIG.map(item => ({
      ...item,
      count: Math.max(
        0,
        Number(statusCodes[item.key]) || 0
      )
    }));

    const totalCount = values.reduce(
      (sum, item) => sum + item.count,
      0
    );

    let cumulative = 0;

    const calculated = values.map(item => {
      const percentage = totalCount
        ? (item.count / totalCount) * 100
        : 0;

      const length = totalCount
        ? (item.count / totalCount) * CIRCUMFERENCE
        : 0;

      const segment = {
        ...item,
        percentage,
        length,
        offset: -cumulative
      };

      cumulative += length;

      return segment;
    });

    return {
      segments: calculated,
      total: totalCount
    };
  }, [statusCodes]);

  const selected = segments.find(
    item => item.key === activeStatus
  );

  return (
    <section className="pulse-status-panel">
      <div className="pulse-status-header">
        <h2>
          <PieChart size={19} />
          HTTP Status Distribution
        </h2>

        <p>Completed HTTP responses</p>
      </div>

      <div className="pulse-status-chart-layout">
        <div className="pulse-status-donut">
          <svg
            viewBox="0 0 220 220"
            role="img"
            aria-labelledby={`${chartId}-title`}
          >
            <title id={`${chartId}-title`}>
              HTTP response status distribution
            </title>

            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth={STROKE}
            />

            {segments.map(item => (
              <circle
                key={item.key}
                cx="110"
                cy="110"
                r={RADIUS}
                fill="none"
                stroke={item.color}
                strokeWidth={STROKE}
                strokeDasharray={
                  `${item.length} ${CIRCUMFERENCE}`
                }
                strokeDashoffset={item.offset}
                transform="rotate(-90 110 110)"
                opacity={
                  activeStatus &&
                  activeStatus !== item.key
                    ? 0.3
                    : 1
                }
                onMouseEnter={() =>
                  setActiveStatus(item.key)
                }
                onMouseLeave={() =>
                  setActiveStatus(null)
                }
              />
            ))}

            <text
              x="110"
              y="106"
              textAnchor="middle"
              className="pulse-status-center-value"
            >
              {selected
                ? selected.count.toLocaleString("en-IN")
                : total.toLocaleString("en-IN")}
            </text>

            <text
              x="110"
              y="128"
              textAnchor="middle"
              className="pulse-status-center-label"
            >
              {selected
                ? selected.key
                : "Responses"}
            </text>
          </svg>
        </div>

        <div className="pulse-status-legend">
          {segments.map(item => (
            <div
              key={item.key}
              className={
                `pulse-status-legend-item ${
                  activeStatus === item.key
                    ? "is-active"
                    : ""
                }`
              }
              onMouseEnter={() =>
                setActiveStatus(item.key)
              }
              onMouseLeave={() =>
                setActiveStatus(null)
              }
            >
              <div className="pulse-status-legend-name">
                <span
                  className="pulse-status-dot"
                  style={{
                    backgroundColor: item.color
                  }}
                />

                <span>{item.key}</span>
              </div>

              <strong>
                {item.count.toLocaleString("en-IN")}
              </strong>

              <span className="pulse-status-percentage">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pulse-status-footer">
        <span>
          Total responses: {total.toLocaleString("en-IN")}
        </span>

        <span>
          Aborted: {
            Number(abortedRequests).toLocaleString("en-IN")
          }
        </span>
      </div>
    </section>
  );
}
