
import { useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldCheck
} from "lucide-react";

import {
  detectApiAnomalies
} from "../../../utils/monitoring/detectApiAnomalies";

import "./AnomalyInsightsPanel.css";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    icon: AlertCircle,
    color: "#f16f79"
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    color: "#f2ba65"
  }
};

function AnomalyCard({ anomaly }) {
  const [expanded, setExpanded] = useState(false);

  const config =
    SEVERITY_CONFIG[anomaly.severity] ||
    SEVERITY_CONFIG.warning;

  const Icon = config.icon;

  return (
    <article
      className={`pulse-anomaly-card pulse-anomaly-${anomaly.severity}`}
    >
      <div className="pulse-anomaly-card-main">
        <div
          className="pulse-anomaly-icon"
          style={{ color: config.color }}
        >
          <Icon size={21} />
        </div>

        <div className="pulse-anomaly-card-content">
          <div className="pulse-anomaly-title-row">
            <h3>{anomaly.title}</h3>

            <span
              className={`pulse-anomaly-severity pulse-severity-${anomaly.severity}`}
            >
              {config.label}
            </span>
          </div>

          <p>{anomaly.description}</p>

          <code className="pulse-anomaly-endpoint">
            {anomaly.endpoint}
          </code>
        </div>
      </div>

      <button
        type="button"
        className="pulse-anomaly-expand"
        aria-expanded={expanded}
        onClick={() => setExpanded(previous => !previous)}
      >
        {expanded ? "Hide investigation" : "View investigation"}

        {expanded
          ? <ChevronUp size={16} />
          : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="pulse-anomaly-investigation">
          <div className="pulse-anomaly-measurements">
            <div>
              <span>Observed value</span>
              <strong>
                {anomaly.value}
                {anomaly.type === "latency" ? " ms" : "%"}
              </strong>
            </div>

            <div>
              <span>Trigger threshold</span>
              <strong>
                {anomaly.threshold}
                {anomaly.type === "latency" ? " ms" : "%"}
              </strong>
            </div>
          </div>

          <div className="pulse-anomaly-recommendation">
            <Lightbulb size={18} />

            <div>
              <strong>Suggested investigation</strong>
              <p>{anomaly.recommendation}</p>
            </div>
          </div>

          <p className="pulse-anomaly-caution">
            This is a threshold-based finding, not a
            confirmed root-cause diagnosis.
          </p>
        </div>
      )}
    </article>
  );
}

export default function AnomalyInsightsPanel({
  endpoints = []
}) {
  const [showAll, setShowAll] = useState(false);

  const anomalies = useMemo(
    () => detectApiAnomalies(endpoints),
    [endpoints]
  );

  const criticalCount = anomalies.filter(
    item => item.severity === "critical"
  ).length;

  const warningCount = anomalies.filter(
    item => item.severity === "warning"
  ).length;

  const visibleAnomalies = showAll
    ? anomalies
    : anomalies.slice(0, 3);

  const hasEnoughData = endpoints.some(
    item => Number(item.requests) >= 5
  );

  return (
    <section className="pulse-anomaly-panel">
      <div className="pulse-anomaly-header">
        <div>
          <h2>
            <Activity size={19} />
            Smart Anomaly Insights
          </h2>

          <p>
            Automatic detection of unusual API metrics
          </p>
        </div>

        <div className="pulse-anomaly-summary">
          <span className="pulse-anomaly-critical-count">
            {criticalCount} Critical
          </span>

          <span className="pulse-anomaly-warning-count">
            {warningCount} Warnings
          </span>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="pulse-anomaly-empty">
          {hasEnoughData ? (
            <>
              <CheckCircle2 size={30} />

              <h3>No thresholds breached</h3>

              <p>
                No qualifying endpoint exceeded the
                configured latency, server-error, or
                aborted-request thresholds.
              </p>
            </>
          ) : (
            <>
              <ShieldCheck size={30} />

              <h3>Collecting baseline data</h3>

              <p>
                At least five requests per endpoint are
                required before anomaly evaluation.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="pulse-anomaly-list">
            {visibleAnomalies.map(anomaly => (
              <AnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
              />
            ))}
          </div>

          {anomalies.length > 3 && (
            <button
              type="button"
              className="pulse-anomaly-show-all"
              onClick={() =>
                setShowAll(previous => !previous)
              }
            >
              {showAll
                ? "Show fewer findings"
                : `View all ${anomalies.length} findings`}
            </button>
          )}
        </>
      )}

      <div className="pulse-anomaly-footer">
        <AlertTriangle size={14} />

        <span>
          Findings are calculated from the current
          monitoring snapshot. Detection runs when
          this dashboard loads or refreshes.
        </span>
      </div>
    </section>
  );
}
