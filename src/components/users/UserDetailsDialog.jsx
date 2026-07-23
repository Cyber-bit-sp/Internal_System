import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function UserDetailsDialog({ user, isOpen, onClose, onEdit, onChangeStatus }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: {
            xs: 0,
            sm: 3,
          },
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
          },
          py: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            User Profile
          </Typography>

          <IconButton
            aria-label="Close user details"
            onClick={onClose}
            sx={{
              mt: -0.5,
              mr: -0.5,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          p: {
            xs: 2.5,
            sm: 3,
          },
          backgroundColor: "#fcfcfd",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2.5}
          sx={{
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              color: "primary.dark",
              backgroundColor: "primary.light",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>

          <Box>
            <Typography
              sx={{
                color: "text.primary",
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {fullName}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 15,
              }}
            >
              {user.jobTitle}
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{
                mt: 1.5,
              }}
            >
              <Chip
                label={user.role}
                size="small"
                color="primary"
                variant="outlined"
              />

              <Chip
                label={user.status}
                size="small"
                sx={{
                  color: user.status === "Active" ? "#067647" : "#b42318",
                  backgroundColor:
                    user.status === "Active" ? "#ecfdf3" : "#fef3f2",
                  border: `1px solid ${
                    user.status === "Active" ? "#abefc6" : "#fecdc9"
                  }`,
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Typography
          sx={{
            mb: 2,
            color: "text.primary",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Personal Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <DetailItem
            icon={<BadgeOutlinedIcon />}
            label="Employee ID"
            value={user.employeeId}
          />

          <DetailItem
            icon={<EmailOutlinedIcon />}
            label="Email"
            value={user.email}
          />

          <DetailItem
            icon={<PhoneOutlinedIcon />}
            label="Phone"
            value={user.phone || "Not provided"}
          />

          <DetailItem
            icon={<CalendarMonthOutlinedIcon />}
            label="Joined Date"
            value={formatDate(user.joinedDate)}
          />
        </Box>

        <Typography
          sx={{
            mb: 2,
            color: "text.primary",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Organization Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <DetailItem
            icon={<BusinessOutlinedIcon />}
            label="Department"
            value={user.department || "Not assigned"}
          />

          <DetailItem
            icon={<GroupsOutlinedIcon />}
            label="Team"
            value={user.team || "Not assigned"}
          />

          <DetailItem
            icon={<SupervisorAccountOutlinedIcon />}
            label="Manager"
            value={user.manager || "Not assigned"}
          />

          <DetailItem
            icon={<BadgeOutlinedIcon />}
            label="Job Title"
            value={user.jobTitle}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
          },
          py: 2,
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button
          color={user.status === "Active" ? "error" : "success"}
          variant="outlined"
          startIcon={
            user.status === "Active" ? (
              <BlockOutlinedIcon />
            ) : (
              <CheckCircleOutlineRoundedIcon />
            )
          }
          onClick={() => onChangeStatus(user)}
        >
          {user.status === "Active" ? "Deactivate" : "Activate"}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(user)}
          >
            Edit User
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        minWidth: 0,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 38,
          height: 38,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          borderRadius: 2,
          color: "primary.main",
          backgroundColor: "primary.light",
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            overflow: "hidden",
            color: "text.primary",
            fontSize: 14,
            fontWeight: 500,
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default UserDetailsDialog;
