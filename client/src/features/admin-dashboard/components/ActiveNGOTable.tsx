import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";

interface NGO {
  id: string;
  name: string;
  area: string;
  members: number;
}

interface Props {
  ngos: NGO[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: unknown,
    newPage: number
  ) => void;
}

const ActiveNGOTable = ({
  ngos,
  total,
  page,
  rowsPerPage,
  onPageChange,
}: Props) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        mt: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Active NGOs
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>NGO</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Members</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {ngos.map((ngo) => (
            <TableRow key={ngo.id}>
              <TableCell>{ngo.name}</TableCell>
              <TableCell>{ngo.area}</TableCell>
              <TableCell>{ngo.members}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        onPageChange={onPageChange}
      />
    </Paper>
  );
};

export default ActiveNGOTable;