import { Outlet } from "react-router";

import ReferenceCard from "@/components/common/ReferenceCard";

export default function ReferenceLayout() {
  return (
    <div className="reference-layout">
      <ReferenceCard>
        <Outlet />
      </ReferenceCard>
    </div>
  );
}
