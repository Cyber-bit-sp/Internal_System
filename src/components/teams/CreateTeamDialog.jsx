import { useState } from "react";
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
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

const initialFormData = {
  name: "",
  code: "",
  department: "",
  managerId: "",
  description: "",
  status: "Active",
  createdDate: "",
};

function CreateTeamDialog({
  isOpen,
  onClose,
  onCreateTeam,
  existingTeams = [],
  users = [],
}) {
  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] =
    useState("");

  const managerOptions = users.filter(
    (user) =>
      user.status === "Active" &&
      (user.role === "Team Manager" ||
        user.role === "Admin" ||
        user.role === "HR Manager"),
  );

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
        (team) =>
          String(team.code || "")
            .trim()
            .toLowerCase() === normalizedCode,
      );

      if (codeExists) {
        nextErrors.code =
          "This team code already exists.";
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

  function createTeamId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return `team-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
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

    const newTeam = {
      id: createTeamId(),
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
      memberCount: 0,
      status: formData.status,
      createdDate: formData.createdDate,
    };

    onCreateTeam?.(newTeam);

    setFormData(initialFormData);
    setErrors({});
    setSubmitError("");
  }

  function handleClose() {
    setFormData(initialFormData);
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
          <Stack direction="row" spacing={1.75}>
            <Box
              sx={{
                display: "flex",
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                borderRadius: 2,
                color: "primary.main",
                backgroundColor: "primary.light",
              }}
            >
              <GroupAddOutlinedIcon />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Create Team
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: 14,
                }}
              >
                Create a team and assign its department
                and manager.
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Close create team dialog"
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
              placeholder="Mobile Platform"
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
              placeholder="MOBILE-PLATFORM"
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
              placeholder="Engineering"
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
              helperText="A manager can be assigned later"
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
              placeholder="Describe the team's responsibilities and goals."
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
            startIcon={<GroupAddOutlinedIcon />}
          >
            Create Team
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateTeamDialog;