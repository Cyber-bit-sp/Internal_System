import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function UserFilters({
  searchTerm,
  onSearchChange,
  department,
  onDepartmentChange,
  role,
  onRoleChange,
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
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          xl: "minmax(280px, 2fr) repeat(3, minmax(160px, 1fr)) auto",
        },
        alignItems: "end",
        gap: 2,
        p: 2.5,
        mb: 2,
        borderRadius: 3,
      }}
    >
      <TextField
        label="Search users"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Name, email, ID, or job title"
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
        onChange={(event) => onDepartmentChange(event.target.value)}
      >
        <MenuItem value="all">All departments</MenuItem>

        {departments.map((departmentName) => (
          <MenuItem key={departmentName} value={departmentName}>
            {departmentName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Role"
        value={role}
        onChange={(event) => onRoleChange(event.target.value)}
      >
        <MenuItem value="all">All roles</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="HR Manager">HR Manager</MenuItem>
        <MenuItem value="Team Manager">Team Manager</MenuItem>
        <MenuItem value="Employee">Employee</MenuItem>
      </TextField>

      <TextField
        select
        label="Status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <MenuItem value="all">All statuses</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </TextField>

      <Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ClearRoundedIcon />}
          onClick={onClearFilters}
          sx={{
            width: {
              xs: "100%",
              xl: "auto",
            },
            whiteSpace: "nowrap",
          }}
        >
          Clear filters
        </Button>
      </Box>
    </Paper>
  );
}

export default UserFilters;