const USERS_STORAGE_KEY = "performance-management-users";

export function loadUsers(defaultUsers = []) {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (!savedUsers) {
      return defaultUsers.map((user) => ({ ...user }));
    }

    const parsedUsers = JSON.parse(savedUsers);

    if (!Array.isArray(parsedUsers)) {
      return defaultUsers.map((user) => ({ ...user }));
    }

    return parsedUsers;
  } catch (error) {
    console.error("Failed to load users from localStorage:", error);
    return defaultUsers.map((user) => ({ ...user }));
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users),
    );
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
}

export function resetStoredUsers() {
  try {
    localStorage.removeItem(USERS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset stored users:", error);
  }
}