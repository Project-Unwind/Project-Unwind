
import { useCallback, useEffect, useState } from "react";

import {
  getAdminMonitoringOverview
} from "../../services/admin/adminMonitoring.service";


import EndpointDiagnostics
  from "../../components/admin/monitoring/EndpointDiagnostics";



import AnomalyInsightsPanel
  from "../../components/admin/monitoring/AnomalyInsightsPanel";


import ServiceHealthNetwork
  from "../../components/admin/monitoring/ServiceHealthNetwork";


import HttpStatusChart
  from "../../components/admin/monitoring/HttpStatusChart";


import TrafficLatencyChart
  from "../../components/admin/monitoring/TrafficLatencyChart";

import "./AdminMonitoringPage.css";

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN");

const formatLatency = (value) =>
  value == null
    ? "> 10,000 ms"
    : `${Number(value).toFixed(2)} ms`;

function MetricCard({ label, value, description }) {
  return (
    <div className="monitoring-metric-card">
      <p className="monitoring-metric-label">{label}</p>

      <h3 className="monitoring-metric-value">{value}</h3>

      {description && (
        <p className="monitoring-metric-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default function AdminMonitoringPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchMetrics = useCallback(async (
    signal,
    isRefresh = false
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getAdminMonitoringOverview({
        signal
      });

      if (!signal?.aborted) {
        setMetrics(data);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load API monitoring metrics."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchMetrics(controller.signal);

    return () => controller.abort();
  }, [fetchMetrics]);

  const handleRefresh = () => {
    if (refreshing || loading) return;

    fetchMetrics(undefined, true);
  };

  if (loading) {
    return (
      <main className="admin-monitoring-page">
        <p>Loading API monitoring metrics...</p>
      </main>
    );
  }

  return (
    <main className="admin-monitoring-page">
      <div className="monitoring-header">
        <div>
          <h1>API Monitoring</h1>
          <p>
            Backend performance and reliability overview
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="monitoring-refresh-button"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="monitoring-error" role="alert">
          {error}
        </div>
      )}

      {metrics && (
        <>
          <p className="monitoring-window-label">
            Rolling {metrics.windowMinutes}-minute window
            {" · "}
            Last updated: {
              new Date(metrics.generatedAt).toLocaleString()
            }
          </p>

          <section className="monitoring-metrics-grid">
            <MetricCard
              label="Total Requests"
              value={formatNumber(metrics.requests)}
            />

            <MetricCard
              label="Requests / Minute"
              value={metrics.requestsPerMinute}
            />

            <MetricCard
              label="Average Latency"
              value={formatLatency(metrics.averageLatencyMs)}
            />

            <MetricCard
              label="P95 Latency"
              value={formatLatency(metrics.p95LatencyMs)}
              description="Histogram upper-bound estimate"
            />

            <MetricCard
              label="Server Error Rate"
              value={`${metrics.errorRatePercent}%`}
            />

            <MetricCard
              label="Active Requests"
              value={formatNumber(metrics.activeRequests)}
            />

            <MetricCard
              label="Aborted Requests"
              value={formatNumber(metrics.abortedRequests)}
            />

            <MetricCard
              label="Aborted Rate"
              value={`${metrics.abortedRatePercent}%`}
            />
          </section>
          
{/* =====================================================
    UNWIND PULSE — REQUEST TRAFFIC & LATENCY
    ===================================================== */}

<section
  className="monitoring-traffic-section"
  aria-label="API request traffic and latency"
>
  <TrafficLatencyChart
    trends={metrics.trends || []}
  />
</section>


          
{/* UNWIND PULSE — HTTP STATUS DISTRIBUTION */}

<div className="monitoring-status-chart-section">
  <HttpStatusChart
    statusCodes={metrics.statusCodes || {}}
    abortedRequests={metrics.abortedRequests || 0}
  />
</div>

{/* UNWIND PULSE — INTERACTIVE SERVICE HEALTH */}

<section
  className="monitoring-network-section"
  aria-label="Unwind service health network"
>
  <ServiceHealthNetwork
    endpoints={metrics.endpoints || []}
  />
</section>


{/* =====================================================
    UNWIND PULSE — SMART ANOMALY INSIGHTS
    ===================================================== */}

<section
  className="monitoring-anomaly-section"
  aria-label="API anomaly detection and insights"
>
  <AnomalyInsightsPanel
    endpoints={metrics.endpoints || []}
  />
</section>




        
{/* =====================================================
    UNWIND PULSE — ENDPOINT DIAGNOSTICS
    ===================================================== */}

<section
  className="monitoring-diagnostics-section"
  aria-label="API endpoint performance diagnostics"
>
  <EndpointDiagnostics
    endpoints={metrics.endpoints || []}
  />
</section>


          <p className="monitoring-note">
            Metrics are stored in backend memory and reset
            when the server restarts. No monitoring data
            is written to Neon.
          </p>
        </>
      )}
    </main>
  );
}
