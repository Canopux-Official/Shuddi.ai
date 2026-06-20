import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";
import AdminStats from "../components/AdminStats";
import ActiveNGOTable from "../components/ActiveNGOTable";

import { getActiveNGOs } from "../../../apis/super-admin/admin.api";

const ROWS_PER_PAGE = 10;

interface NGO {
  id: string;
  name: string;
  area: string;
  members: number;
}

// since AdminStats and ActiveNGOTable both make separate API calls,
// load them in parallel from the dashboard page and pass the data down as props.
// That keeps all dashboard data fetching in one place and makes the components purely UI.
// It's easier to maintain once the dashboard grows.

const AdminDashboard = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [page, setPage] = useState(0);

  const [total, setTotal] = useState(0);

  const fetchActiveNGOs = async () => {
    try {
      const response = await getActiveNGOs(
        page + 1,
        ROWS_PER_PAGE
      );

      setNgos(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error(
        "Failed to fetch NGOs",
        error
      );
    }
  };

  useEffect(() => {
    fetchActiveNGOs();
  }, [page]);

  return (
    <AdminLayout>
      <AdminStats />

      <ActiveNGOTable
        ngos={ngos}
        total={total}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={(_, newPage) =>
          setPage(newPage)
        }
      />
    </AdminLayout>
  );
};

export default AdminDashboard;