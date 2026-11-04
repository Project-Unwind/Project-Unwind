import {
  Component,
  Suspense,
  useState
} from "react";

import {
  Outlet,
  useLocation
} from "react-router-dom";

import DashboardSidebar
  from "../components/dashboard/DashboardSidebar";

import DashboardTopbar
  from "../components/dashboard/DashboardTopbar";

import HalloweenDashboardCorners
  from "../components/halloween/HalloweenDashboardCorners";

import DiwaliToran
  from "../components/diwali/DiwaliToran";

import AppLoader
  from "../components/common/AppStates/AppLoader";

import {
  NotificationProvider
} from "../context/NotificationContext";

import {
  useTheme
} from "../context/ThemeContext";

import "../pages/Dashboard/Dashboard.css";

class DashboardPageBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error) {
    // Avoid logging page contents or user data.
    console.error(
      "Dashboard page failed to render:",
      error?.name || "Error"
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          aria-labelledby="dashboard-page-error-title"
          style={{
            padding: "32px 20px",
            textAlign: "center"
          }}
        >
          <h2 id="dashboard-page-error-title">
            This page couldn’t load
          </h2>

          <p>
            Open another feature from the menu,
            or reload this page to try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

function DashboardLayout() {
  const { diwaliMode } = useTheme();
  const location = useLocation();

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(false);

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen
  ] = useState(false);

  return (
    <NotificationProvider>
      <div
        className={
          sidebarCollapsed
            ? "dashboard-shell dashboard-shell--sidebar-collapsed"
            : "dashboard-shell"
        }
      >
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggleCollapse={() =>
            setSidebarCollapsed(
              (current) => !current
            )
          }
          onCloseMobile={() =>
            setMobileSidebarOpen(false)
          }
        />

        <div className="dashboard-shell__body">
          <DashboardTopbar
            onOpenSidebar={() =>
              setMobileSidebarOpen(true)
            }
          />

          <main className="dashboard-shell__content">
            {/* Existing Halloween decorations */}
            <HalloweenDashboardCorners />

                       {/* Diwali-only hanging Toran row */}
            {diwaliMode && (
              <div
                className="dashboard-diwali-toran"
                aria-hidden="true"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <DiwaliToran key={index} />
                ))}
              </div>
            )}

            {/* All dashboard routes */}
<DashboardPageBoundary
  key={location.pathname}
>
  <Suspense
    fallback={
      <AppLoader
        message="Opening your space…"
        size="medium"
      />
    }
  >
    <Outlet />
  </Suspense>
</DashboardPageBoundary>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default DashboardLayout;
