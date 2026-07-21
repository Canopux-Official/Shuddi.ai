import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Box, Typography } from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

import SectionCard from "../shared/components/SectionCard";
import EmptyState from "../shared/components/EmptyState";
import { colors, fonts, withOpacity } from "../theme/tokens";

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
  onPageChange: (event: unknown, newPage: number) => void;
}

const initialsOf = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const ActiveNGOTable = ({ ngos, total, page, rowsPerPage, onPageChange }: Props) => {
  return (
    <SectionCard title="Active NGOs" icon={BusinessOutlinedIcon}>
      {ngos.length === 0 ? (
        <EmptyState
          icon={BusinessOutlinedIcon}
          title="No active NGOs yet"
          description="Approved NGOs will show up here once they're active on the platform."
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.inkMuted, fontSize: 12, borderColor: colors.border }}>NGO</TableCell>
                <TableCell sx={{ color: colors.inkMuted, fontSize: 12, borderColor: colors.border }}>Area</TableCell>
                <TableCell align="right" sx={{ color: colors.inkMuted, fontSize: 12, borderColor: colors.border }}>
                  Members
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ngos.map((ngo) => (
                <TableRow
                  key={ngo.id}
                  sx={{ "&:hover": { bgcolor: withOpacity(colors.forest, 0.03) }, "&:last-child td": { border: 0 } }}
                >
                  <TableCell sx={{ borderColor: colors.border }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: withOpacity(colors.forest, 0.1),
                          color: colors.forest,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {initialsOf(ngo.name)}
                      </Box>
                      <Typography sx={{ fontSize: 14, color: colors.ink }}>{ngo.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.inkMuted, borderColor: colors.border }}>
                    {ngo.area}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: fonts.mono, fontSize: 13, color: colors.ink, borderColor: colors.border }}
                  >
                    {ngo.members.toLocaleString()}
                  </TableCell>
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
            sx={{ borderTop: `0.5px solid ${colors.border}`, mt: 1 }}
          />
        </>
      )}
    </SectionCard>
  );
};

export default ActiveNGOTable;