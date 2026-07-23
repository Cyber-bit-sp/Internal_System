import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

const emptyFormData = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  department: "",
  team: "",
  manager: "",
  role: "Employee",
  status: "Active",
  joinedDate: "",
};

function EditUserDialog({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  existingUsers,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState(emptyFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      employeeId: user.employeeId || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      jobTitle: user.jobTitle || "",
      department: user.department || "",
      team: user.team || "",
      manager:
        user.manager === "Not assigned"
          ? ""
          : user.manager || "",
      role: user.role || "Employee",
      status: user.status || "Active",
      joinedDate: user.joinedDate || "",
    });

    setErrors({});
    setSubmitError("");
  }, [user]);

  if (!user) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }

    setSubmitError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.employeeId.trim()) {
      nextErrors.employeeId = "Employee ID is required.";
    } else {
      const employeeIdExists = existingUsers.some(
        (existingUser) =>
          existingUser.id !== user.id &&
          existingUser.employeeId.toLowerCase() ===
            formData.employeeId.trim().toLowerCase(),
      );

      if (employeeIdExists) {
        nextErrors.employeeId =
          "This employee ID already belongs to another user.";
      }
    }

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
      } else {
        const emailExists = existingUsers.some(
          (existingUser) =>
            existingUser.id !== user.id &&
            existingUser.email.toLowerCase() ===
              formData.email.trim().toLowerCase(),
        );

        if (emailExists) {
          nextErrors.email =
            "This email already belongs to another user.";
        }
      }
    }

    if (!formData.jobTitle.trim()) {
      nextErrors.jobTitle = "Job title is required.";
    }

    if (!formData.department.trim()) {
      nextErrors.department = "Department is required.";
    }

    if (!formData.team.trim()) {
      nextErrors.team = "Team is required.";
    }

    if (!formData.joinedDate) {
      nextErrors.joinedDate = "Joined date is required.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("Please correct the highlighted fields.");
      return;
    }

    const updatedUser = {
      ...user,
      employeeId: formData.employeeId.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      jobTitle: formData.jobTitle.trim(),
      department: formData.department.trim(),
      team: formData.team.trim(),
      manager: formData.manager.trim() || "Not assigned",
      role: formData.role,
      status: formData.status,
      joinedDate: formData.joinedDate,
    };

    onUpdateUser(updatedUser);
    handleClose();
  }

  function handleClose() {
    setErrors({});
    setSubmitError("");
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
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
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Edit User
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Update employee information, role, and account status.
            </Typography>
          </Box>

          <IconButton
            aria-label="Close edit user dialog"
            onClick={handleClose}
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
          px: {
            xs: 2.5,
            sm: 3,
          },
          py: 3,
          backgroundColor: "#fcfcfd",
        }}
      >
        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {submitError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          <TextField
            required
            fullWidth
            autoFocus
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            error={Boolean(errors.employeeId)}
            helperText={errors.employeeId || "Unique employee identifier"}
          />

          <TextField
            required
            fullWidth
            label="Joined Date"
            name="joinedDate"
            type="date"
            value={formData.joinedDate}
            onChange={handleChange}
            error={Boolean(errors.joinedDate)}
            helperText={errors.joinedDate || "Employee start date"}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName || " "}
          />

          <TextField
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName || " "}
          />

          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email || "Used for account communication"}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            helperText="Optional"
          />

          <TextField
            required
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            error={Boolean(errors.jobTitle)}
            helperText={errors.jobTitle || " "}
          />

          <TextField
            required
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={Boolean(errors.department)}
            helperText={errors.department || " "}
          />

          <TextField
            required
            fullWidth
            label="Team"
            name="team"
            value={formData.team}
            onChange={handleChange}
            error={Boolean(errors.team)}
            helperText={errors.team || " "}
          />

          <TextField
            fullWidth
            label="Manager"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            helperText="Leave empty when not assigned"
          />

          <TextField
            select
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            helperText="Controls access level"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="HR Manager">HR Manager</MenuItem>
            <MenuItem value="Team Manager">Team Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            helperText="Current account availability"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
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
          gap: 1,
        }}
      >
        <Button
          type="button"
          color="inherit"
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserDialog;