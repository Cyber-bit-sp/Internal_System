import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const drawerWidth = 260;

const navigationItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    path: "/users",
    label: "User Management",
    icon: <PeopleOutlineRoundedIcon />,
  },
  {
    path: "/teams",
    label: "Team Management",
    icon: <GroupsOutlinedIcon />,
  },
  {
    path: "/daily-plans",
    label: "Daily Plans",
    icon: <CalendarTodayOutlinedIcon />,
  },
  {
    path: "/performance",
    label: "Performance",
    icon: <AssessmentOutlinedIcon />,
  },
];

function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minWidth: 1180,
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Drawer
        variant="permanent"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            backgroundColor: "#101828",
            color: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "72px !important",
              px: 2.5,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
            >
              <Box
                sx={{
                  display: "flex",
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                P
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Performance Hub
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    color: "#98a2b3",
                    fontSize: 11,
                  }}
                >
                  Workforce Management
                </Typography>
              </Box>
            </Stack>
          </Toolbar>

          <Divider
            sx={{
              borderColor:
                "rgba(255, 255, 255, 0.08)",
            }}
          />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 1.5,
              py: 2,
            }}
          >
            <Typography
              sx={{
                px: 1.5,
                mb: 1,
                color: "#667085",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Workspace
            </Typography>

            <List disablePadding>
              {navigationItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    minHeight: 46,
                    mb: 0.5,
                    borderRadius: 2,
                    color: "#d0d5dd",

                    "& .MuiListItemIcon-root": {
                      color: "#98a2b3",
                    },

                    "&.active": {
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                    },

                    "&.active .MuiListItemIcon-root": {
                      color: "#ffffff",
                    },

                    "&.active:hover": {
                      backgroundColor: "#1d4ed8",
                    },

                    "&:hover": {
                      backgroundColor:
                        "rgba(255, 255, 255, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <ListItemButton
              component={NavLink}
              to="/settings"
              sx={{
                mb: 1,
                borderRadius: 2,
                color: "#d0d5dd",

                "& .MuiListItemIcon-root": {
                  color: "#98a2b3",
                },

                "&.active": {
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                },

                "&.active .MuiListItemIcon-root": {
                  color: "#ffffff",
                },

                "&.active:hover": {
                  backgroundColor: "#1d4ed8",
                },

                "&:hover": {
                  backgroundColor:
                    "rgba(255, 255, 255, 0.06)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                }}
              >
                <SettingsOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Settings"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14,
                      fontWeight: 500,
                    },
                  },
                }}
              />
            </ListItemButton>

            <Divider
              sx={{
                mb: 1.5,
                borderColor:
                  "rgba(255, 255, 255, 0.08)",
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                px: 1,
                py: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: "#344054",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                AD
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Alex Davis
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    color: "#98a2b3",
                    fontSize: 11,
                  }}
                >
                  Administrator
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      <Box
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          minWidth: 0,
        }}
      >
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            zIndex: 10,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor:
              "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "72px !important",
              px: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Performance Management System
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.2,
                  fontSize: 12,
                }}
              >
                Manage your organization and employee
                performance
              </Typography>
            </Box>

            <Tooltip title="Alex Davis, Administrator">
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: "primary.main",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                AD
              </Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            minHeight: "calc(100vh - 72px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;