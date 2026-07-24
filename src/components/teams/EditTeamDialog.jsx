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
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

const emptyFormData = {
  name: "",
  code: "",
  department: "",
  managerId: "",
  description: "",
  status: "Active",
  createdDate: "",
};

function EditTeamDialog({
  team,
  isOpen,
  onClose,
  onUpdateTeam,
  existingTeams = [],
  users = [],
}) {
  const [formData, setFormData] = useState(emptyFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const managerOptions = users.filter(
    (user) =>
      user.status === "Active" &&
      (user.role === "Team Manager" ||
        user.role === "Admin" ||
        user.role === "HR Manager"),
  );

  useEffect(() => {
    if (!team) {
      return;
    }

    setFormData({
      name: team.name || "",
      code: team.code || "",
      department: team.department || "",
      managerId:
        team.managerId === null ||
        team.managerId === undefined
          ? ""
          : String(team.managerId),
      description: team.description || "",
      status: team.status || "Active",
      createdDate: team.createdDate || "",
    });

    setErrors({});
    setSubmitError("");
  }, [team]);

  if (!team) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Team name is required.";
    }

    if (!formData.code.trim()) {
      nextErrors.code = "Team code is required.";
    } else {
      const normalizedCode = formData.code
        .trim()
        .toLowerCase();

      const codeExists = existingTeams.some(
        (existingTeam) =>
          existingTeam.id !== team.id &&
          String(existingTeam.code || "")
            .trim()
            .toLowerCase() === normalizedCode,
      );

      if (codeExists) {
        nextErrors.code =
          "This team code belongs to another team.";
      }
    }

    if (!formData.department.trim()) {
      nextErrors.department =
        "Department is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        "Description is required.";
    }

    if (!formData.createdDate) {
      nextErrors.createdDate =
        "Created date is required.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError(
        "Please correct the highlighted fields.",
      );
      return;
    }

    const selectedManager = users.find(
      (user) =>
        String(user.id) ===
        String(formData.managerId),
    );

    const updatedTeam = {
      ...team,
      name: formData.name.trim(),
      code: formData.code
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "-"),
      department: formData.department.trim(),
      managerId: selectedManager?.id || null,
      managerName: selectedManager
        ? `${selectedManager.firstName} ${selectedManager.lastName}`
        : "Not assigned",
      description: formData.description.trim(),
      status: formData.status,
      createdDate: formData.createdDate,
    };

    onUpdateTeam?.(updatedTeam);
  }

  function handleClose() {
    setErrors({});
    setSubmitError("");
    onClose?.();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2.5 }}>
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
              Edit Team
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14,
              }}
            >
              Update team information, manager, and status.
            </Typography>
          </Box>

          <IconButton
            aria-label="Close edit team dialog"
            onClick={handleClose}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
        <DialogContent
          sx={{
            px: 3,
            py: 3,
            backgroundColor: "#fcfcfd",
          }}
        >
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 2.5,
            }}
          >
            <TextField
              required
              fullWidth
              autoFocus
              label="Team Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={
                errors.name || "Visible team name"
              }
            />

            <TextField
              required
              fullWidth
              label="Team Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={Boolean(errors.code)}
              helperText={
                errors.code ||
                "Unique short team identifier"
              }
            />

            <TextField
              required
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={Boolean(errors.department)}
              helperText={
                errors.department ||
                "Department responsible for this team"
              }
            />

            <TextField
              select
              fullWidth
              label="Team Manager"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              helperText="Choose an active manager"
            >
              <MenuItem value="">
                Not assigned
              </MenuItem>

              {managerOptions.map((user) => (
                <MenuItem
                  key={user.id}
                  value={String(user.id)}
                >
                  {user.firstName} {user.lastName}
                  {" · "}
                  {user.jobTitle}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              helperText="Current team availability"
            >
              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Archived">
                Archived
              </MenuItem>
            </TextField>

            <TextField
              required
              fullWidth
              label="Created Date"
              name="createdDate"
              type="date"
              value={formData.createdDate}
              onChange={handleChange}
              error={Boolean(errors.createdDate)}
              helperText={
                errors.createdDate ||
                "Date the team was created"
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              required
              fullWidth
              multiline
              minRows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={
                errors.description ||
                `${formData.description.length}/300 characters`
              }
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
              }}
              sx={{
                gridColumn: "1 / -1",
              }}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
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
      </Box>
    </Dialog>
  );
}

export default EditTeamDialog;