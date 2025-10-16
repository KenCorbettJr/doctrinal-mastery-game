import { ref, reactive, computed } from "vue";

// Validation functions
function validateAnswerEliminationOptions(options) {
  const errors = [];

  if (typeof options.enabled !== "boolean") {
    errors.push({
      field: "answerElimination.enabled",
      message: "Enabled must be a boolean value",
    });
  }

  if (![3, 5, 10].includes(options.intervalSeconds)) {
    errors.push({
      field: "answerElimination.intervalSeconds",
      message: "Interval must be 3, 5, or 10 seconds",
    });
  }

  if (
    typeof options.eliminateToCount !== "number" ||
    options.eliminateToCount < 2
  ) {
    errors.push({
      field: "answerElimination.eliminateToCount",
      message: "Eliminate to count must be a number >= 2",
    });
  }

  if (typeof options.showWarning !== "boolean") {
    errors.push({
      field: "answerElimination.showWarning",
      message: "Show warning must be a boolean value",
    });
  }

  return errors;
}

function validateOptions(options) {
  const errors = [];

  if (!options || typeof options !== "object") {
    errors.push({
      field: "root",
      message: "Options must be an object",
    });
    return errors;
  }

  if (!options.answerElimination) {
    errors.push({
      field: "answerElimination",
      message: "Answer elimination options are required",
    });
  } else {
    errors.push(...validateAnswerEliminationOptions(options.answerElimination));
  }

  return errors;
}

// Validation for elimination context (during gameplay)
function validateEliminationContext(
  totalAnswers,
  correctAnswerIndex,
  eliminateToCount
) {
  const errors = [];

  if (totalAnswers < 3) {
    errors.push({
      field: "context",
      message: "Need at least 3 answers for elimination to be meaningful",
    });
  }

  if (eliminateToCount >= totalAnswers) {
    errors.push({
      field: "eliminateToCount",
      message: `Cannot eliminate to ${eliminateToCount} when only ${totalAnswers} answers exist`,
    });
  }

  if (correctAnswerIndex < 0 || correctAnswerIndex >= totalAnswers) {
    errors.push({
      field: "correctAnswerIndex",
      message: "Invalid correct answer index",
    });
  }

  return errors;
}

// Default game options configuration
const defaultGameOptions = {
  answerElimination: {
    enabled: false,
    intervalSeconds: 5,
    eliminateToCount: 2,
    showWarning: true,
  },
};

// Global state for game options
const gameOptions = ref({ ...defaultGameOptions });
const eliminationState = reactive({
  isActive: false,
  timerId: null,
  nextEliminationTime: 0,
  eliminatedAnswers: [],
  availableForElimination: [],
});

export function useGameOptions() {
  // Computed properties
  const isEliminationEnabled = computed(
    () => gameOptions.value.answerElimination.enabled
  );
  const eliminationInterval = computed(
    () => gameOptions.value.answerElimination.intervalSeconds * 1000
  );
  const eliminateToCount = computed(
    () => gameOptions.value.answerElimination.eliminateToCount
  );

  // Initialize options (load from storage if available)
  function initializeOptions() {
    try {
      const savedOptions = localStorage.getItem("doctrinalMasteryGameOptions");
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions);
        // Validate and merge with defaults
        gameOptions.value = {
          ...defaultGameOptions,
          ...parsed,
          answerElimination: {
            ...defaultGameOptions.answerElimination,
            ...parsed.answerElimination,
          },
        };
      }
    } catch (error) {
      console.warn("Failed to load saved game options, using defaults:", error);
      gameOptions.value = { ...defaultGameOptions };
    }
  }

  // Save options to localStorage
  function saveOptions() {
    try {
      localStorage.setItem(
        "doctrinalMasteryGameOptions",
        JSON.stringify(gameOptions.value)
      );
    } catch (error) {
      console.warn("Failed to save game options:", error);
    }
  }

  // Update game options
  function updateOptions(newOptions) {
    const validationErrors = validateOptions(newOptions);
    if (validationErrors.length > 0) {
      throw new Error(
        `Invalid options: ${validationErrors.map((e) => e.message).join(", ")}`
      );
    }

    gameOptions.value = { ...newOptions };
    saveOptions();
  }

  // Reset to default options
  function resetOptions() {
    gameOptions.value = { ...defaultGameOptions };
    saveOptions();
  }

  // Reset elimination state
  function resetEliminationState() {
    if (eliminationState.timerId) {
      clearTimeout(eliminationState.timerId);
    }

    eliminationState.isActive = false;
    eliminationState.timerId = null;
    eliminationState.nextEliminationTime = 0;
    eliminationState.eliminatedAnswers = [];
    eliminationState.availableForElimination = [];
  }

  // Validation method for elimination context
  function validateEliminationContextForGame(totalAnswers, correctAnswerIndex) {
    return validateEliminationContext(
      totalAnswers,
      correctAnswerIndex,
      gameOptions.value.answerElimination.eliminateToCount
    );
  }

  // Error handling utility
  function handleValidationErrors(errors) {
    if (errors.length > 0) {
      const errorMessage = errors
        .map((e) => `${e.field}: ${e.message}`)
        .join("; ");
      console.error("Game options validation failed:", errorMessage);
      return errorMessage;
    }
    return null;
  }

  return {
    // State
    gameOptions,
    eliminationState,

    // Computed
    isEliminationEnabled,
    eliminationInterval,
    eliminateToCount,

    // Methods
    initializeOptions,
    updateOptions,
    resetOptions,
    resetEliminationState,
    saveOptions,
    validateEliminationContextForGame,
    handleValidationErrors,

    // Validation utilities
    validateOptions,
  };
}
