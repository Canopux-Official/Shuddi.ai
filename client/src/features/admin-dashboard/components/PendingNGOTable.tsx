import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Typography
} from "@mui/material";

const PendingNGOTable = ({ requests, onSelect }: any) => {
  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Pending NGO Requests
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>NGO</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {requests.map((ngo: any) => (
            <TableRow key={ngo.id}>
              <TableCell>{ngo.name}</TableCell>
              <TableCell>{ngo.area}</TableCell>
              <TableCell>{ngo.owner}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => onSelect(ngo)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

    </Paper>
  );
};

export default PendingNGOTable;