import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
      light: "#dbeafe",
    },

    background: {
      default: "#f6f8fb",
      paper: "#ffffff",
    },

    text: {
      primary: "#101828",
      secondary: "#667085",
    },

    divider: "#e4e7ec",
  },

  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),

    h4: {
      fontSize: "1.875rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e4e7ec",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#f9fafb",
          color: "#475467",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        },

        body: {
          color: "#475467",
          borderColor: "#eaecf0",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;