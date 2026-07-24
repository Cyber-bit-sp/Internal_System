const TEAMS_STORAGE_KEY = "performance-management-teams";

export function loadTeams(defaultTeams = []) {
  try {
    const savedTeams = localStorage.getItem(
      TEAMS_STORAGE_KEY,
    );

    if (!savedTeams) {
      return defaultTeams.map((team) => ({
        ...team,
      }));
    }

    const parsedTeams = JSON.parse(savedTeams);

    if (!Array.isArray(parsedTeams)) {
      return defaultTeams.map((team) => ({
        ...team,
      }));
    }

    return parsedTeams;
  } catch (error) {
    console.error(
      "Failed to load teams from localStorage:",
      error,
    );

    return defaultTeams.map((team) => ({
      ...team,
    }));
  }
}

export function saveTeams(teams) {
  try {
    localStorage.setItem(
      TEAMS_STORAGE_KEY,
      JSON.stringify(teams),
    );
  } catch (error) {
    console.error(
      "Failed to save teams to localStorage:",
      error,
    );
  }
}

export function resetStoredTeams() {
  try {
    localStorage.removeItem(TEAMS_STORAGE_KEY);
  } catch (error) {
    console.error(
      "Failed to reset stored teams:",
      error,
    );
  }
}