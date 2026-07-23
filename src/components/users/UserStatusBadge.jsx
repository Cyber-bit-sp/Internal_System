import { Chip } from "@mui/material";

function UserStatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        minWidth: 72,
        color: isActive ? "#067647" : "#b42318",
        backgroundColor: isActive ? "#ecfdf3" : "#fef3f2",
        border: `1px solid ${isActive ? "#abefc6" : "#fecdc9"}`,
      }}
    />
  );
}

export default UserStatusBadge;