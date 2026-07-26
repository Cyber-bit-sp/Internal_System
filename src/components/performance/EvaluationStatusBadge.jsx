import { Chip } from "@mui/material";

const statusStyles = {
  "Not Started": {
    color: "#475467",
    backgroundColor: "#f2f4f7",
    borderColor: "#d0d5dd",
  },

  Draft: {
    color: "#175cd3",
    backgroundColor: "#eff8ff",
    borderColor: "#b2ddff",
  },

  Submitted: {
    color: "#93370d",
    backgroundColor: "#fffaeb",
    borderColor: "#fedf89",
  },

  Acknowledged: {
    color: "#5925dc",
    backgroundColor: "#f4f3ff",
    borderColor: "#d9d6fe",
  },

  Completed: {
    color: "#067647",
    backgroundColor: "#ecfdf3",
    borderColor: "#abefc6",
  },
};

function EvaluationStatusBadge({ status }) {
  const style =
    statusStyles[status] ||
    statusStyles["Not Started"];

  return (
    <Chip
      label={status || "Unknown"}
      size="small"
      variant="outlined"
      sx={{
        minWidth: 104,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        fontWeight: 600,
      }}
    />
  );
}

export default EvaluationStatusBadge;