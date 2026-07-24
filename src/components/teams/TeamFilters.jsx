import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function TeamFilters({
  searchTerm,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  departments,
  onClearFilters,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "grid",
        gridTemplateColumns:
          "minmax(300px, 2fr) minmax(180px, 1fr) minmax(160px, 1fr) auto",
        alignItems: "end",
        gap: 2,
        p: 2.5,
        mb: 2,
        borderRadius: 3,
      }}
    >
      <TextField
        label="Search teams"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name, code, manager, or department"
        slotProps={{
          input: {
            startAdornment: (
              <SearchRoundedIcon
                sx={{
                  mr: 1,
                  color: "text.secondary",
                }}
              />
            ),
          },
        }}
      />

      <TextField
        select
        label="Department"
        value={department}
        onChange={(event) =>
          onDepartmentChange(event.target.value)
        }
      >
        <MenuItem value="all">All departments</MenuItem>

        {departments.map((departmentName) => (
          <MenuItem
            key={departmentName}
            value={departmentName}
          >
            {departmentName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Status"
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <MenuItem value="all">All statuses</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Archived">Archived</MenuItem>
      </TextField>

      <Box>
        <Button
          color="inherit"
          variant="outlined"
          startIcon={<ClearRoundedIcon />}
          onClick={onClearFilters}
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          Clear filters
        </Button>
      </Box>
    </Paper>
  );
}

export default TeamFilters;