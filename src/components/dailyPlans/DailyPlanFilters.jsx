import { Button, MenuItem, Paper, TextField } from "@mui/material";

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function DailyPlanFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  team,
  onTeamChange,
  planDate,
  onPlanDateChange,
  teams = [],
  onClearFilters,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 2fr) repeat(3, minmax(150px, 1fr))",
        alignItems: "end",
        gap: 2,
        p: 2.5,
        mb: 2,
        borderRadius: 3,
      }}
    >
      <TextField
        fullWidth
        label="Search daily plans"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search employee, team, department, or email"
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
        fullWidth
        label="Status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <MenuItem value="all">All statuses</MenuItem>

        <MenuItem value="Draft">Draft</MenuItem>

        <MenuItem value="In Progress">In Progress</MenuItem>

        <MenuItem value="Submitted">Submitted</MenuItem>

        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Team"
        value={team}
        onChange={(event) => onTeamChange(event.target.value)}
      >
        <MenuItem value="all">All teams</MenuItem>

        {teams.map((teamName) => (
          <MenuItem key={teamName} value={teamName}>
            {teamName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="date"
        label="Plan Date"
        value={planDate}
        onChange={(event) => onPlanDateChange(event.target.value)}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      <Button
        color="inherit"
        variant="outlined"
        startIcon={<ClearRoundedIcon />}
        onClick={onClearFilters}
        sx={{
          justifySelf: "start",
          whiteSpace: "nowrap",
        }}
      >
        Clear Filters
      </Button>
    </Paper>
  );
}

export default DailyPlanFilters;
