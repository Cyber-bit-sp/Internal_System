const DAILY_PLANS_STORAGE_KEY =
  "performance-management-daily-plans";

export function loadDailyPlans(defaultPlans = []) {
  try {
    const savedPlans = localStorage.getItem(
      DAILY_PLANS_STORAGE_KEY,
    );

    if (!savedPlans) {
      return clonePlans(defaultPlans);
    }

    const parsedPlans = JSON.parse(savedPlans);

    if (!Array.isArray(parsedPlans)) {
      return clonePlans(defaultPlans);
    }

    return parsedPlans;
  } catch (error) {
    console.error(
      "Failed to load daily plans from localStorage:",
      error,
    );

    return clonePlans(defaultPlans);
  }
}

export function saveDailyPlans(plans) {
  try {
    localStorage.setItem(
      DAILY_PLANS_STORAGE_KEY,
      JSON.stringify(plans),
    );
  } catch (error) {
    console.error(
      "Failed to save daily plans to localStorage:",
      error,
    );
  }
}

export function resetStoredDailyPlans() {
  try {
    localStorage.removeItem(
      DAILY_PLANS_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Failed to reset stored daily plans:",
      error,
    );
  }
}

function clonePlans(plans) {
  return plans.map((plan) => ({
    ...plan,
  }));
}