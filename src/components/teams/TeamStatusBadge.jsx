import { Chip } from "@mui/material";

function TeamStatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        minWidth: 76,
        color: isActive ? "#067647" : "#475467",
        backgroundColor: isActive ? "#ecfdf3" : "#f2f4f7",
        border: `1px solid ${isActive ? "#abefc6" : "#d0d5dd"}`,
      }}
    />
  );
}

export default TeamStatusBadge;