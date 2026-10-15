
import { useId, useMemo, useState } from "react";

import {
  Activity,
  ShieldCheck,
  BookOpen,
  Users,
  MessageCircle,
  Bell,
  Settings,
  X
} from "lucide-react";

import {
  calculateServiceMetrics,
  MIN_SERVICE_REQUESTS
} from "../../../utils/monitoring/serviceHealth";

import "./ServiceHealthNetwork.css";

/* =====================================================
   UNWIND PULSE — SERVICE CONFIGURATION
   ===================================================== */

const SERVICES = [
  {
    id: "auth",
    label: "Authentication",
    icon: ShieldCheck,
    x: 170,
    y: 45
  },
  {
    id: "journal",
    label: "Journal",
    icon: BookOpen,
    x: 360,
    y: 105
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    x: 350,
    y: 260
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    x: 170,
    y: 325
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    x: 35,
    y: 260
  },
  {
    id: "admin",
    label: "Administration",
    icon: Settings,
    x: 25,
    y: 105
  }
];

/* =====================================================
   HEALTH STATUS COLORS
   ===================================================== */

const HEALTH_COLORS = {
  healthy: "#37d69e",
  degraded: "#f2ba65",
  critical: "#f16f79",
  unknown: "#819a90"
};

/* =====================================================
   FORMATTING HELPERS
   ===================================================== */

function formatNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("en-IN")
    : "0";
}

function formatLatency(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "N/A";
  }

  return `${Number(value).toFixed(2)} ms`;
}

function formatPercent(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? `${number.toFixed(2)}%`
    : "N/A";
}

function getHealthLabel(health) {
  if (health === "unknown") {
    return "Insufficient data";
  }

  return health;
}

/* =====================================================
   SERVICE DETAILS PANEL
   ===================================================== */

function ServiceDetails({ service, onClose }) {
  if (!service) {
    return null;
  }

  const Icon = service.icon;

  const color =
    HEALTH_COLORS[service.health] ||
    HEALTH_COLORS.unknown;

  return (
    <aside className="pulse-service-details">

      {/* SERVICE HEADER */}

      <div className="pulse-service-details-header">
        <div className="pulse-service-details-title">
          <Icon size={19} />

          <div>
            <h3>{service.label}</h3>

            <span style={{ color }}>
              {getHealthLabel(service.health)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="pulse-service-close"
          aria-label="Close service details"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      {/* SERVICE METRICS */}

      <div className="pulse-service-stats">

        <div>
          <span>API Requests</span>

          <strong>
            {formatNumber(service.requests)}
          </strong>
        </div>

        <div>
          <span>Average Latency</span>

          <strong>
            {service.requests > 0
              ? formatLatency(service.averageLatencyMs)
              : "N/A"}
          </strong>
        </div>

        <div>
          <span>5xx Response Rate</span>

          <strong>
            {service.completedResponses > 0
              ? formatPercent(service.errorRatePercent)
              : "N/A"}
          </strong>
        </div>

        <div>
          <span>Aborted Requests</span>

          <strong>
            {formatNumber(service.abortedRequests)}
          </strong>
        </div>

        <div>
          <span>Completed Responses</span>

          <strong>
            {formatNumber(service.completedResponses)}
          </strong>
        </div>

        <div>
          <span>CORS Preflights</span>

          <strong>
            {formatNumber(service.preflightRequests)}
          </strong>
        </div>

      </div>

      {/* INSUFFICIENT DATA NOTICE */}

      {service.health === "unknown" && (
        <p className="pulse-network-disclaimer">
          {service.requests === 0
            ? "No application requests were recorded for this module."
            : `At least ${MIN_SERVICE_REQUESTS} application requests are required for health classification.`}
        </p>
      )}

      {/* ENDPOINT DETAILS */}

      <div className="pulse-service-endpoints">
        <h4>Monitored Endpoints</h4>

        {service.endpoints.length === 0 ? (
          <p>
            No application endpoint activity recorded.
          </p>
        ) : (
          service.endpoints.map(endpoint => (
            <div
              key={endpoint.endpoint}
              className="pulse-service-endpoint"
            >
              <code>
                {endpoint.endpoint}
              </code>

              <span>
                {formatNumber(endpoint.requests)}
                {" "}requests
                {" · "}
                {formatLatency(
                  endpoint.averageLatencyMs
                )}
              </span>
            </div>
          ))
        )}
      </div>

    </aside>
  );
}

/* =====================================================
   MAIN SERVICE HEALTH NETWORK
   ===================================================== */

export default function ServiceHealthNetwork({
  endpoints = []
}) {
  const [
    selectedService,
    setSelectedService
  ] = useState(null);

  const gradientId = useId().replace(/:/g, "");

  /* ===================================================
     CALCULATE SERVICE METRICS

     All aggregation and health classification now
     comes from the shared serviceHealth utility.
     =================================================== */

  const services = useMemo(() => {
    return SERVICES.map(service => ({
      ...service,

      ...calculateServiceMetrics(
        service.id,
        endpoints
      )
    }));
  }, [endpoints]);

  const selected = services.find(
    service => service.id === selectedService
  );

  /* ===================================================
     SERVICE SELECTION
     =================================================== */

  const handleServiceSelect = serviceId => {
    setSelectedService(previous =>
      previous === serviceId
        ? null
        : serviceId
    );
  };

  return (
    <section className="pulse-network-panel">

      {/* ===============================================
          NETWORK HEADER
          =============================================== */}

      <div className="pulse-network-header">
        <div>
          <h2>
            <Activity size={19} />
            Service Health Network
          </h2>

          <p>
            Request-based health monitoring of
            Unwind application modules
          </p>
        </div>

        <span className="pulse-network-window">
          Rolling 60 minutes
        </span>
      </div>

      {/* ===============================================
          NETWORK CONTENT
          =============================================== */}

      <div className="pulse-network-content">
        <div className="pulse-network-visual">

          {/* SVG NETWORK VISUALIZATION */}

          <svg
            viewBox="0 0 440 380"
            role="img"
            aria-label="Unwind API service health visualization"
          >
            <defs>
              <radialGradient id={gradientId}>
                <stop
                  offset="0%"
                  stopColor="#3ad5a0"
                  stopOpacity="0.22"
                />

                <stop
                  offset="100%"
                  stopColor="#3ad5a0"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>

            {/* BACKGROUND GLOW */}

            <circle
              cx="220"
              cy="185"
              r="118"
              fill={`url(#${gradientId})`}
            />

            {/* CONCENTRIC RINGS */}

            {[65, 105, 145].map(radius => (
              <circle
                key={radius}
                cx="220"
                cy="185"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="4 6"
              />
            ))}

            {/* CONNECTION LINES */}

            {services.map(service => {
              const x = service.x + 35;
              const y = service.y + 20;

              const color =
                HEALTH_COLORS[service.health] ||
                HEALTH_COLORS.unknown;

              return (
                <line
                  key={`line-${service.id}`}
                  x1="220"
                  y1="185"
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="5 5"
                />
              );
            })}

            {/* CENTRAL API NODE */}

            <circle
              cx="220"
              cy="185"
              r="46"
              fill="#174535"
              stroke="#43d6a0"
              strokeWidth="2"
            />

            <text
              x="220"
              y="181"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="700"
            >
              UNWIND
            </text>

            <text
              x="220"
              y="200"
              textAnchor="middle"
              fill="#9de4c5"
              fontSize="11"
            >
              API Core
            </text>

            {/* SERVICE NODES */}

            {services.map(service => {
              const x = service.x + 35;
              const y = service.y + 20;

              const isSelected =
                selectedService === service.id;

              const color =
                HEALTH_COLORS[service.health] ||
                HEALTH_COLORS.unknown;

              return (
                <g key={service.id}>

                  {/* NODE OUTLINE */}

                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 30 : 25}
                    fill="#1b3830"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  {/* STATUS INDICATOR */}

                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill={color}
                  />

                  {/* MODULE LABEL */}

                  <text
                    x={x}
                    y={y + 43}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                  >
                    {service.label}
                  </text>

                </g>
              );
            })}
          </svg>

          {/* ===========================================
              ACCESSIBLE SERVICE BUTTONS
              =========================================== */}

          <div className="pulse-network-node-controls">
            {services.map(service => {
              const Icon = service.icon;

              const isSelected =
                selectedService === service.id;

              const color =
                HEALTH_COLORS[service.health] ||
                HEALTH_COLORS.unknown;

              return (
                <button
                  key={service.id}
                  type="button"
                  className={
                    `pulse-network-node-button ${
                      isSelected ? "is-selected" : ""
                    }`
                  }
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleServiceSelect(service.id)
                  }
                >
                  <Icon size={15} />

                  {service.label}

                  <span
                    className="pulse-network-health-dot"
                    style={{
                      backgroundColor: color
                    }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

        </div>

        {/* ===========================================
            SELECTED SERVICE DETAILS
            =========================================== */}

        {selected && (
          <ServiceDetails
            service={selected}
            onClose={() => setSelectedService(null)}
          />
        )}

      </div>

      {/* ===============================================
          HEALTH STATUS LEGEND
          =============================================== */}

      <div className="pulse-network-footer">
        {Object.entries(HEALTH_COLORS).map(
          ([status, color]) => (
            <span key={status}>
              <i
                style={{
                  backgroundColor: color
                }}
                aria-hidden="true"
              />

              {getHealthLabel(status)}
            </span>
          )
        )}
      </div>

      {/* ===============================================
          METRIC LIMITATIONS
          =============================================== */}

      <p className="pulse-network-disclaimer">
        Health indicators are estimated from HTTP
        request metrics, excluding OPTIONS requests.
        They do not independently verify service
        availability. Service latency is estimated
        using rounded endpoint averages.
      </p>

    </section>
  );
}
