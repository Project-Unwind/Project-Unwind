
import {
  Suspense,
  useState
} from "react";

import {
  Outlet
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

function DashboardLayout() {
  const { diwaliMode } = useTheme();

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
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default DashboardLayout;
