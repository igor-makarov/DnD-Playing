import { Outlet } from "react-router";

export default function ReferenceLayout() {
  return (
    <div className="info-tooltip-dialog" style={{ margin: "0 auto" }}>
      <Outlet />
    </div>
  );
}
