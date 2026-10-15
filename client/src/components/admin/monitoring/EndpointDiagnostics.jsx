
import { useMemo, useState } from "react";

import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  Activity,
  AlertTriangle
} from "lucide-react";

import "./EndpointDiagnostics.css";

/* =====================================================
   CONFIGURATION
   ===================================================== */

const MIN_REQUESTS = 5;

const THRESHOLDS = {
  serverErrorRate: 3,
  abortedRate: 3,
  averageLatencyMs: 1000
};

const SORT_COLUMNS = [
  ["requests", "Requests"],
  ["averageLatencyMs", "Avg Latency"],
  ["p95LatencyMs", "P95"],
  ["errorRatePercent", "5xx Rate"],
  ["abortedRequests", "Aborted"]
];

/* =====================================================
   NUMERIC HELPERS
   ===================================================== */

function validNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

function validCount(value) {
  const number = validNumber(value);

  return number !== null &&
    Number.isSafeInteger(number)
    ? number
    : null;
}

function formatNumber(value) {
  const number = validNumber(value);

  return number === null
    ? "N/A"
    : number.toLocaleString("en-IN");
}

function formatPercent(value) {
  const number = validNumber(value);

  return number === null
    ? "N/A"
    : `${number.toFixed(2)}%`;
}

function formatLatency(value, requests = 0) {
  // A null histogram percentile with recorded
  // requests means the value exceeded 10,000 ms.
  if (value === null && requests > 0) {
    return "> 10,000 ms";
  }

  const number = validNumber(value);

  return number === null
    ? "N/A"
    : `${number.toFixed(2)} ms`;
}

/* =====================================================
   ENDPOINT METRIC NORMALIZATION
   ===================================================== */

function getMethod(endpoint) {
  return String(endpoint?.endpoint || "")
    .trim()
    .split(/\s+/)[0]
    .toUpperCase();
}

function calculateEndpointMetrics(endpoint) {
  const requests = validCount(endpoint.requests);

  const abortedRequests = validCount(
    endpoint.abortedRequests
  );

  const validAborts =
    requests !== null &&
    abortedRequests !== null &&
    abortedRequests <= requests;

  const completedResponses = validAborts
    ? requests - abortedRequests
    : null;

  const serverErrors = validCount(
    endpoint.statusCodes?.["5xx"]
  );

  const validServerErrors =
    completedResponses !== null &&
    serverErrors !== null &&
    serverErrors <= completedResponses;

  const errorRatePercent =
    validServerErrors && completedResponses > 0
      ? (serverErrors / completedResponses) * 100
      : null;

  const abortedRatePercent = validAborts && requests > 0
    ? (abortedRequests / requests) * 100
    : null;

  return {
    requests,
    abortedRequests,
    completedResponses,
    serverErrors,
    errorRatePercent,
    abortedRatePercent,
    averageLatencyMs: validNumber(
      endpoint.averageLatencyMs
    ),
    p50LatencyMs: endpoint.p50LatencyMs,
    p95LatencyMs: endpoint.p95LatencyMs,
    p99LatencyMs: endpoint.p99LatencyMs,
    maxLatencyMs: validNumber(
      endpoint.maxLatencyMs
    )
  };
}

/* =====================================================
   ENDPOINT STATUS CLASSIFICATION
   ===================================================== */

function getEndpointStatus(endpoint, stats) {
  if (getMethod(endpoint) === "OPTIONS") {
    return "preflight";
  }

  if (
    stats.requests === null ||
    stats.requests < MIN_REQUESTS
  ) {
    return "insufficient";
  }

  // Consistent with anomaly detection:
  // HTTP error rates require enough completed responses.
  if (
    stats.completedResponses >= MIN_REQUESTS &&
    stats.errorRatePercent !== null &&
    stats.errorRatePercent >=
      THRESHOLDS.serverErrorRate
  ) {
    return "errors";
  }

  if (
    stats.abortedRatePercent !== null &&
    stats.abortedRatePercent >= THRESHOLDS.abortedRate
  ) {
    return "aborted";
  }

  if (
    stats.averageLatencyMs !== null &&
    stats.averageLatencyMs >=
      THRESHOLDS.averageLatencyMs
  ) {
    return "slow";
  }

  // Don't label an endpoint healthy unless all
  // relevant metric values are available.
  if (
    stats.completedResponses === null ||
    stats.completedResponses < MIN_REQUESTS ||
    stats.errorRatePercent === null ||
    stats.abortedRatePercent === null ||
    stats.averageLatencyMs === null
  ) {
    return "insufficient";
  }

  return "healthy";
}

/* =====================================================
   SORTING
   ===================================================== */

function getSortValue(item, key) {
  if (key === "requests") {
    return item.stats.requests;
  }

  if (key === "abortedRequests") {
    return item.stats.abortedRequests;
  }

  if (key === "averageLatencyMs") {
    return item.stats.averageLatencyMs;
  }

  if (key === "errorRatePercent") {
    return item.stats.errorRatePercent;
  }

  if (key === "p95LatencyMs") {
    // A null P95 with recorded requests indicates
    // the highest histogram bucket (> 10,000 ms).
    if (
      item.endpoint.p95LatencyMs === null &&
      item.stats.requests > 0
    ) {
      return Infinity;
    }

    return validNumber(
      item.endpoint.p95LatencyMs
    );
  }

  return null;
}

function compareEndpoints(a, b, key, direction) {
  const aValue = getSortValue(a, key);
  const bValue = getSortValue(b, key);

  // Missing values always appear last.
  if (aValue === null && bValue === null) {
    return a.endpoint.endpoint.localeCompare(
      b.endpoint.endpoint
    );
  }

  if (aValue === null) return 1;
  if (bValue === null) return -1;

  const difference = direction === "asc"
    ? aValue - bValue
    : bValue - aValue;

  if (difference !== 0) {
    return difference;
  }

  return a.endpoint.endpoint.localeCompare(
    b.endpoint.endpoint
  );
}

/* =====================================================
   CSV EXPORT SECURITY
   ===================================================== */

function escapeCSV(value) {
  let text = String(value ?? "");

  // Strip null bytes and nonprinting controls,
  // while preserving ordinary visible text.
  text = text.replace(
    /[\u0000-\u001f\u007f-\u009f]/g,
    " "
  );

  // A leading formula character can execute
  // when imported by some spreadsheet programs.
  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function csvNumber(value) {
  const number = validNumber(value);

  return number === null
    ? ""
    : number;
}

function csvPercent(value) {
  const number = validNumber(value);

  return number === null
    ? ""
    : Number(number.toFixed(2));
}

function csvPercentile(value, requests) {
  if (value === null && requests > 0) {
    return ">10000";
  }

  return csvNumber(value);
}

function createCSV(items) {
  const headers = [
    "Endpoint",
    "Requests",
    "Completed Responses",
    "Average Latency (ms)",
    "P50 (ms)",
    "P95 (ms)",
    "P99 (ms)",
    "5xx Error Rate (%)",
    "Aborted Requests",
    "Aborted Rate (%)",
    "Status"
  ];

  const rows = items.map(item => {
    const { endpoint, stats, status } = item;

    return [
      endpoint.endpoint,
      csvNumber(stats.requests),
      csvNumber(stats.completedResponses),
      csvNumber(stats.averageLatencyMs),
      csvPercentile(
        stats.p50LatencyMs,
        stats.requests
      ),
      csvPercentile(
        stats.p95LatencyMs,
        stats.requests
      ),
      csvPercentile(
        stats.p99LatencyMs,
        stats.requests
      ),
      csvPercent(stats.errorRatePercent),
      csvNumber(stats.abortedRequests),
      csvPercent(stats.abortedRatePercent),
      status
    ];
  });

  return [headers, ...rows]
    .map(row => row.map(escapeCSV).join(","))
    .join("\r\n");
}

function exportCSV(items) {
  if (!items.length) return;

  const csv = createCSV(items);

  const blob = new Blob(
    ["\uFEFF", csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download =
    `unwind-api-diagnostics-${Date.now()}.csv`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Release the object URL after download initiation.
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/* =====================================================
   ENDPOINT DETAILS ROW
   ===================================================== */

function EndpointRow({
  item,
  isExpanded,
  onToggle
}) {
  const { endpoint, stats, status } = item;

  const label = String(endpoint.endpoint || "");

  const firstSpace = label.indexOf(" ");

  const method = firstSpace === -1
    ? label
    : label.slice(0, firstSpace);

  const path = firstSpace === -1
    ? ""
    : label.slice(firstSpace + 1);

  const displayStatus = {
    insufficient: "Low data",
    healthy: "Healthy",
    slow: "Slow",
    errors: "Server errors",
    aborted: "Aborted",
    preflight: "Preflight"
  }[status] || "Unknown";

  return (
    <>
      <tr
        className={
          `pulse-endpoint-row pulse-endpoint-${status}`
        }
      >
        <td>
          <button
            type="button"
            className="pulse-endpoint-expand"
            aria-expanded={isExpanded}
            onClick={onToggle}
          >
            {isExpanded
              ? <ChevronUp size={15} />
              : <ChevronDown size={15} />}

            <span className="pulse-endpoint-method">
              {method}
            </span>

            <code>{path}</code>
          </button>
        </td>

        <td>
          {formatNumber(stats.requests)}
        </td>

        <td>
          {formatLatency(
            stats.averageLatencyMs,
            stats.requests
          )}
        </td>

        <td>
          {formatLatency(
            stats.p95LatencyMs,
            stats.requests
          )}
        </td>

        <td>
          {formatPercent(stats.errorRatePercent)}
        </td>

        <td>
          {formatNumber(stats.abortedRequests)}
        </td>

        <td>
          <span
            className={
              `pulse-endpoint-status pulse-status-${status}`
            }
          >
            <span />
            {displayStatus}
          </span>
        </td>
      </tr>

      {isExpanded && (
        <tr className="pulse-endpoint-detail-row">
          <td colSpan={7}>
            <div className="pulse-endpoint-details">
              <div>
                <span>P50 Latency</span>
                <strong>
                  {formatLatency(
                    stats.p50LatencyMs,
                    stats.requests
                  )}
                </strong>
              </div>

              <div>
                <span>P99 Latency</span>
                <strong>
                  {formatLatency(
                    stats.p99LatencyMs,
                    stats.requests
                  )}
                </strong>
              </div>

              <div>
                <span>Maximum Latency</span>
                <strong>
                  {formatLatency(stats.maxLatencyMs)}
                </strong>
              </div>

              <div>
                <span>Aborted Rate</span>
                <strong>
                  {formatPercent(
                    stats.abortedRatePercent
                  )}
                </strong>
              </div>

              <div>
                <span>2xx Responses</span>
                <strong>
                  {formatNumber(
                    endpoint.statusCodes?.["2xx"]
                  )}
                </strong>
              </div>

              <div>
                <span>4xx Responses</span>
                <strong>
                  {formatNumber(
                    endpoint.statusCodes?.["4xx"]
                  )}
                </strong>
              </div>
            </div>

            {["errors", "aborted", "slow"].includes(
              status
            ) && (
              <p className="pulse-endpoint-warning">
                <AlertTriangle size={15} />
                A monitoring threshold was exceeded.
                Investigate before drawing conclusions.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

export default function EndpointDiagnostics({
  endpoints = []
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [sortKey, setSortKey] = useState(
    "requests"
  );

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [expanded, setExpanded] = useState(null);

  const normalizedEndpoints = useMemo(() => {
    if (!Array.isArray(endpoints)) {
      return [];
    }

    return endpoints
      .filter(endpoint =>
        endpoint &&
        typeof endpoint === "object" &&
        typeof endpoint.endpoint === "string"
      )
      .map(endpoint => {
        const stats = calculateEndpointMetrics(
          endpoint
        );

        return {
          endpoint,
          stats,
          status: getEndpointStatus(
            endpoint,
            stats
          )
        };
      });
  }, [endpoints]);

  const processedEndpoints = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = normalizedEndpoints.filter(
      item => {
        const matchesSearch =
          item.endpoint.endpoint
            .toLowerCase()
            .includes(query);

        const matchesFilter =
          filter === "all" ||
          item.status === filter;

        return matchesSearch && matchesFilter;
      }
    );

    return [...filtered].sort((a, b) =>
      compareEndpoints(
        a,
        b,
        sortKey,
        sortDirection
      )
    );
  }, [
    normalizedEndpoints,
    search,
    filter,
    sortKey,
    sortDirection
  ]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDirection(previous =>
        previous === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  return (
    <section className="pulse-diagnostics-panel">

      {/* HEADER */}

      <div className="pulse-diagnostics-header">
        <div>
          <h2>
            <Activity size={19} />
            Endpoint Diagnostics
          </h2>

          <p>
            Investigate API performance and reliability
          </p>
        </div>

        <button
          type="button"
          className="pulse-diagnostics-export"
          disabled={processedEndpoints.length === 0}
          onClick={() =>
            exportCSV(processedEndpoints)
          }
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* SEARCH & FILTER */}

      <div className="pulse-diagnostics-toolbar">
        <div className="pulse-diagnostics-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search endpoints..."
            value={search}
            onChange={event =>
              setSearch(event.target.value)
            }
            aria-label="Search API endpoints"
          />
        </div>

        <select
          value={filter}
          onChange={event =>
            setFilter(event.target.value)
          }
          aria-label="Filter endpoint status"
          className="pulse-diagnostics-filter"
        >
          <option value="all">All endpoints</option>
          <option value="healthy">Healthy</option>
          <option value="slow">Slow</option>
          <option value="errors">Server errors</option>
          <option value="aborted">Aborted</option>
          <option value="insufficient">
            Insufficient data
          </option>
          <option value="preflight">
            CORS preflight
          </option>
        </select>
      </div>

      {/* TABLE */}

      <div className="pulse-diagnostics-table-wrapper">
        <table className="pulse-diagnostics-table">
          <thead>
            <tr>
              <th>Endpoint</th>

              {SORT_COLUMNS.map(([key, label]) => (
                <th key={key}>
                  <button
                    type="button"
                    className="pulse-diagnostics-sort"
                    onClick={() =>
                      handleSort(key)
                    }
                    aria-label={
                      `Sort by ${label}`
                    }
                  >
                    {label}
                    <ArrowUpDown size={13} />
                  </button>
                </th>
              ))}

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {processedEndpoints.map(item => (
              <EndpointRow
                key={item.endpoint.endpoint}
                item={item}
                isExpanded={
                  expanded === item.endpoint.endpoint
                }
                onToggle={() =>
                  setExpanded(previous =>
                    previous === item.endpoint.endpoint
                      ? null
                      : item.endpoint.endpoint
                  )
                }
              />
            ))}

            {processedEndpoints.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="pulse-diagnostics-empty"
                >
                  No endpoints match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}

      <div className="pulse-diagnostics-footer">
        <span>
          Showing {processedEndpoints.length} of{" "}
          {normalizedEndpoints.length} endpoints
        </span>

        <span>
          Metrics reflect the current monitoring window.
        </span>
      </div>
    </section>
  );
}
