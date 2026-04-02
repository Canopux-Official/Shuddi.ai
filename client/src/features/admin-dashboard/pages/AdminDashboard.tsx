import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminStats from "../components/AdminStats";
import PendingNGOTable from "../components/PendingNGOTable";
import ActiveNGOTable from "../components/ActiveNGOTable";
import type { NGO } from "../types/ngo";

const pendingRequests = [
  { id: "1", name: "Green Earth NGO", area: "Delhi", owner: "Rahul Sharma" },
  { id: "2", name: "Clean Rivers Initiative", area: "Bangalore", owner: "Anita Singh" }
];

const activeNGOs = [
  { id: "1", name: "Save Forest Foundation", area: "Mumbai", members: 12 },
  { id: "2", name: "Ocean Protectors", area: "Chennai", members: 8 }
];

const AdminDashboard = () => {
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  return (
    <AdminLayout>

      <AdminStats />

      <PendingNGOTable
        requests={pendingRequests}
        onSelect={(ngo : NGO) => setSelectedNGO(ngo)}
      />

      <ActiveNGOTable ngos={activeNGOs} />

    </AdminLayout>
  );
};

export default AdminDashboard;