import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography
} from "@mui/material";

const ActiveNGOTable = ({ ngos }: any) => {
  return (
    <Paper sx={{ p: 2, borderRadius: 3, mt: 4 }}>

      <Typography variant="h6" sx={{ mb: 2 }}>
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
          {ngos.map((ngo: any) => (
            <TableRow key={ngo.id}>
              <TableCell>{ngo.name}</TableCell>
              <TableCell>{ngo.area}</TableCell>
              <TableCell>{ngo.members}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

    </Paper>
  );
};

export default ActiveNGOTable;