const PERFORMANCE_EVALUATIONS_STORAGE_KEY =
  "performance-management-evaluations";

export function loadPerformanceEvaluations(
  defaultEvaluations = [],
) {
  try {
    const savedEvaluations = localStorage.getItem(
      PERFORMANCE_EVALUATIONS_STORAGE_KEY,
    );

    if (!savedEvaluations) {
      return cloneEvaluations(defaultEvaluations);
    }

    const parsedEvaluations = JSON.parse(savedEvaluations);

    if (!Array.isArray(parsedEvaluations)) {
      return cloneEvaluations(defaultEvaluations);
    }

    return parsedEvaluations;
  } catch (error) {
    console.error(
      "Failed to load performance evaluations:",
      error,
    );

    return cloneEvaluations(defaultEvaluations);
  }
}

export function savePerformanceEvaluations(evaluations) {
  try {
    localStorage.setItem(
      PERFORMANCE_EVALUATIONS_STORAGE_KEY,
      JSON.stringify(evaluations),
    );
  } catch (error) {
    console.error(
      "Failed to save performance evaluations:",
      error,
    );
  }
}

export function resetStoredPerformanceEvaluations() {
  try {
    localStorage.removeItem(
      PERFORMANCE_EVALUATIONS_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Failed to reset performance evaluations:",
      error,
    );
  }
}

function cloneEvaluations(evaluations) {
  return evaluations.map((evaluation) => ({
    ...evaluation,
  }));
}