import { Chip } from "@mui/material";

const statusStyles = {
  Draft: {
    color: "#475467",
    backgroundColor: "#f2f4f7",
    borderColor: "#d0d5dd",
  },
  "In Progress": {
    color: "#175cd3",
    backgroundColor: "#eff8ff",
    borderColor: "#b2ddff",
  },
  Submitted: {
    color: "#93370d",
    backgroundColor: "#fffaeb",
    borderColor: "#fedf89",
  },
  Completed: {
    color: "#067647",
    backgroundColor: "#ecfdf3",
    borderColor: "#abefc6",
  },
};

function DailyPlanStatusBadge({ status }) {
  const style =
    statusStyles[status] || statusStyles.Draft;

  return (
    <Chip
      label={status || "Unknown"}
      size="small"
      variant="outlined"
      sx={{
        minWidth: 92,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        fontWeight: 600,
      }}
    />
  );
}

export default DailyPlanStatusBadge;