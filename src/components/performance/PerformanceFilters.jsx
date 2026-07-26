import {
  Button,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function PerformanceFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  team,
  onTeamChange,
  reviewPeriod,
  onReviewPeriodChange,
  teams = [],
  reviewPeriods = [],
  onClearFilters,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "grid",
        gridTemplateColumns:
          "minmax(280px, 2fr) repeat(3, minmax(170px, 1fr)) auto",
        alignItems: "end",
        gap: 2,
        p: 2.5,
        mb: 2,
        borderRadius: 3,
      }}
    >
      <TextField
        fullWidth
        label="Search evaluations"
        value={searchTerm}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search employee, email, team, or evaluator"
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
        label="Review Period"
        value={reviewPeriod}
        onChange={(event) =>
          onReviewPeriodChange(event.target.value)
        }
      >
        <MenuItem value="all">
          All periods
        </MenuItem>

        {reviewPeriods.map((period) => (
          <MenuItem key={period} value={period}>
            {period}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Team"
        value={team}
        onChange={(event) =>
          onTeamChange(event.target.value)
        }
      >
        <MenuItem value="all">
          All teams
        </MenuItem>

        {teams.map((teamName) => (
          <MenuItem
            key={teamName}
            value={teamName}
          >
            {teamName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Status"
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <MenuItem value="all">
          All statuses
        </MenuItem>

        <MenuItem value="Not Started">
          Not Started
        </MenuItem>

        <MenuItem value="Draft">
          Draft
        </MenuItem>

        <MenuItem value="Submitted">
          Submitted
        </MenuItem>

        <MenuItem value="Acknowledged">
          Acknowledged
        </MenuItem>

        <MenuItem value="Completed">
          Completed
        </MenuItem>
      </TextField>

      <Button
        color="inherit"
        variant="outlined"
        startIcon={<ClearRoundedIcon />}
        onClick={onClearFilters}
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        Clear Filters
      </Button>
    </Paper>
  );
}

export default PerformanceFilters;