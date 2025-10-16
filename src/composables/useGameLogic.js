import { ref, reactive } from "vue";
import { useGameOptions } from "./useGameOptions.js";

export function useGameLogic() {
  const STORAGE_KEY = "doctrinal-mastery-current-game";

  const gameState = ref("setup");
  const teams = ref([]);
  const guessingTeam = ref();
  const selectedCategory = ref("");
  const currentScripture = ref(null);
  const scores = reactive({});
  const incorrectGuesses = ref([]);
  const showCongratulations = ref(false);
  const correctAnswer = ref(null);

  // Game options integration
  const {
    gameOptions,
    eliminationState,
    isEliminationEnabled,
    eliminationInterval,
    eliminateToCount,
    resetEliminationState,
    updateOptions,
  } = useGameOptions();

  // Current question answers for elimination
  const currentAnswers = ref([]);
  const eliminatedAnswers = ref([]);

  // Elimination Logic Functions
  const startElimination = (answers, correctReference) => {
    if (!isEliminationEnabled.value || !answers || answers.length < 3) {
      return;
    }

    // Stop any existing elimination
    stopElimination();

    // Set up current answers and find incorrect ones
    currentAnswers.value = [...answers];
    eliminatedAnswers.value = [];

    const incorrectAnswers = answers.filter(
      (answer) => answer !== correctReference
    );

    // Handle edge case: if eliminateToCount is greater than total answers, adjust it
    const effectiveEliminateToCount = Math.min(
      eliminateToCount.value,
      answers.length
    );

    // Validate we have enough answers to eliminate
    const maxEliminable =
      incorrectAnswers.length - (effectiveEliminateToCount - 1);
    if (maxEliminable <= 0 || effectiveEliminateToCount < 2) {
      return; // Not enough answers to eliminate any, or would leave less than 2 answers
    }

    eliminationState.availableForElimination = [...incorrectAnswers];
    eliminationState.isActive = true;
    eliminationState.nextEliminationTime =
      Date.now() + eliminationInterval.value;

    // Start the elimination timer
    const scheduleNextElimination = () => {
      if (!eliminationState.isActive) return;

      eliminationState.timerId = setTimeout(() => {
        eliminateRandomAnswer();

        // Schedule next elimination if we haven't reached the limit
        const remainingAnswers =
          currentAnswers.value.length - eliminatedAnswers.value.length;
        if (
          remainingAnswers > effectiveEliminateToCount &&
          eliminationState.availableForElimination.length > 0
        ) {
          eliminationState.nextEliminationTime =
            Date.now() + eliminationInterval.value;
          scheduleNextElimination();
        } else {
          eliminationState.isActive = false;
          eliminationState.timerId = null;
        }
      }, eliminationInterval.value);
    };

    scheduleNextElimination();
  };

  const eliminateRandomAnswer = () => {
    if (
      !eliminationState.isActive ||
      eliminationState.availableForElimination.length === 0
    ) {
      return null;
    }

    // Check if we've reached the elimination limit
    const remainingAnswers =
      currentAnswers.value.length - eliminatedAnswers.value.length;
    const effectiveEliminateToCount = Math.min(
      eliminateToCount.value,
      currentAnswers.value.length
    );
    if (remainingAnswers <= effectiveEliminateToCount) {
      return null;
    }

    // Select random incorrect answer to eliminate
    const randomIndex = Math.floor(
      Math.random() * eliminationState.availableForElimination.length
    );
    const answerToEliminate =
      eliminationState.availableForElimination[randomIndex];

    // Remove from available for elimination
    eliminationState.availableForElimination.splice(randomIndex, 1);

    // Add to eliminated answers
    eliminatedAnswers.value.push(answerToEliminate);
    eliminationState.eliminatedAnswers.push(answerToEliminate);

    return answerToEliminate;
  };

  const stopElimination = () => {
    if (eliminationState.timerId) {
      clearTimeout(eliminationState.timerId);
      eliminationState.timerId = null;
    }
    eliminationState.isActive = false;
  };

  const resetEliminationForNewQuestion = () => {
    stopElimination();
    resetEliminationState();
    currentAnswers.value = [];
    eliminatedAnswers.value = [];
  };

  const addTeam = (teamName) => {
    if (teamName && !teams.value.includes(teamName)) {
      teams.value.push(teamName);
      scores[teamName] = 0;
    }
  };

  const removeTeam = (team) => {
    teams.value = teams.value.filter((t) => t !== team);
    delete scores[team];
  };

  const startGame = () => {
    if (teams.value.length > 1) {
      gameState.value = "play";
      guessingTeam.value = teams.value[0];
    }
  };

  const selectCategory = (category, availableScriptures) => {
    selectedCategory.value = category;
    const randomIndex = Math.floor(
      Math.random() * availableScriptures[category].length
    );
    currentScripture.value = availableScriptures[category][randomIndex];
    incorrectGuesses.value = [];

    // Set current answers for this question
    const allReferences = availableScriptures[category].map((s) => s.reference);
    currentAnswers.value = [...allReferences];

    // Reset elimination state for new question
    resetEliminationForNewQuestion();

    // Start elimination if enabled and we have enough answers
    if (
      isEliminationEnabled.value &&
      availableScriptures[category].length >= 3
    ) {
      startElimination(allReferences, currentScripture.value.reference);
    }
  };

  const goBackToCategories = () => {
    selectedCategory.value = "";
    currentScripture.value = null;
    incorrectGuesses.value = [];
    // Reset elimination state when going back to categories
    resetEliminationForNewQuestion();
  };

  const guessScripture = (reference, availableScriptures) => {
    // Stop elimination when any answer is selected
    stopElimination();

    if (reference === currentScripture.value.reference) {
      scores[guessingTeam.value]++;
      correctAnswer.value = {
        team: guessingTeam.value,
        reference: reference,
        points: scores[guessingTeam.value],
      };

      availableScriptures[selectedCategory.value] = availableScriptures[
        selectedCategory.value
      ].filter((s) => s.reference !== reference);

      showCongratulations.value = true;

      setTimeout(() => {
        showCongratulations.value = false;

        const totalRemaining = Object.values(availableScriptures).reduce(
          (sum, arr) => sum + arr.length,
          0
        );
        if (totalRemaining === 0) {
          gameState.value = "victory";
          localStorage.removeItem(STORAGE_KEY);
        } else {
          selectedCategory.value = "";
          currentScripture.value = null;
          // Reset elimination state when going back to categories
          resetEliminationForNewQuestion();
        }
      }, 3000);

      incorrectGuesses.value = [];
    } else {
      incorrectGuesses.value.push(reference);
    }
  };

  const switchTeam = (team) => {
    guessingTeam.value = team;
  };

  const resetGame = (scriptures, availableScriptures) => {
    localStorage.removeItem(STORAGE_KEY);

    gameState.value = "setup";
    teams.value = [];
    selectedCategory.value = "";
    currentScripture.value = null;
    incorrectGuesses.value = [];
    showCongratulations.value = false;
    correctAnswer.value = null;

    // Reset elimination state
    resetEliminationForNewQuestion();

    Object.keys(scriptures).forEach((category) => {
      availableScriptures[category] = [...scriptures[category]];
    });

    Object.keys(scores).forEach((team) => {
      delete scores[team];
    });
  };

  const closeCongratulations = (availableScriptures) => {
    showCongratulations.value = false;

    const totalRemaining = Object.values(availableScriptures).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    if (totalRemaining === 0) {
      gameState.value = "victory";
      localStorage.removeItem(STORAGE_KEY);
    } else {
      selectedCategory.value = "";
      currentScripture.value = null;
      // Reset elimination state when going back to categories
      resetEliminationForNewQuestion();
    }
  };

  const saveCurrentGame = (availableScriptures) => {
    if (gameState.value === "play" && teams.value.length > 0) {
      const gameData = {
        gameState: gameState.value,
        teams: teams.value,
        guessingTeam: guessingTeam.value,
        selectedCategory: selectedCategory.value,
        currentScripture: currentScripture.value,
        availableScriptures: { ...availableScriptures },
        scores: { ...scores },
        incorrectGuesses: incorrectGuesses.value,
        gameOptions: { ...gameOptions.value },
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    }
  };

  const loadSavedGame = (availableScriptures) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const gameData = JSON.parse(saved);

        gameState.value = gameData.gameState;
        teams.value = [...gameData.teams];
        guessingTeam.value = gameData.guessingTeam;
        selectedCategory.value = gameData.selectedCategory || "";
        currentScripture.value = gameData.currentScripture;

        Object.keys(availableScriptures).forEach((key) => {
          availableScriptures[key] = [...gameData.availableScriptures[key]];
        });

        Object.keys(scores).forEach((key) => delete scores[key]);
        Object.assign(scores, gameData.scores);

        incorrectGuesses.value = [...(gameData.incorrectGuesses || [])];

        // Load game options if they exist in the saved data
        if (gameData.gameOptions) {
          try {
            updateOptions(gameData.gameOptions);
          } catch (error) {
            console.warn(
              "Failed to load saved game options, using defaults:",
              error
            );
          }
        }
      } catch (error) {
        console.error("Error loading saved game:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // Update game options function
  const updateGameOptions = (newOptions) => {
    try {
      // Store the previous options for comparison
      const previousOptions = { ...gameOptions.value };

      // Update the options first
      updateOptions(newOptions);

      // Handle elimination changes during active gameplay
      if (currentScripture.value && selectedCategory.value) {
        const wasEliminationEnabled = previousOptions.answerElimination.enabled;
        const isEliminationEnabled = newOptions.answerElimination.enabled;

        // If elimination was active and we're disabling it, stop current elimination
        if (eliminationState.isActive && !isEliminationEnabled) {
          stopElimination();
        }

        // If elimination settings changed but elimination is still enabled
        if (isEliminationEnabled && eliminationState.isActive) {
          const settingsChanged =
            previousOptions.answerElimination.intervalSeconds !==
              newOptions.answerElimination.intervalSeconds ||
            previousOptions.answerElimination.eliminateToCount !==
              newOptions.answerElimination.eliminateToCount;

          if (settingsChanged) {
            // Complete current elimination cycle, then restart with new settings
            // We don't interrupt the current cycle, but the next one will use new settings
            // The elimination logic will automatically pick up the new interval and count
          }
        }

        // If elimination was just enabled and we're in an active question
        if (
          !wasEliminationEnabled &&
          isEliminationEnabled &&
          !eliminationState.isActive
        ) {
          // Only start elimination if we have current answers available
          if (currentAnswers.value.length >= 3) {
            startElimination(
              currentAnswers.value,
              currentScripture.value.reference
            );
          }
        }
      }

      // The options are automatically persisted by the updateOptions function
      // Visual indicators will update automatically through reactivity
    } catch (error) {
      console.error("Failed to update game options:", error);
      throw error;
    }
  };

  return {
    gameState,
    teams,
    guessingTeam,
    selectedCategory,
    currentScripture,
    scores,
    incorrectGuesses,
    showCongratulations,
    correctAnswer,
    currentAnswers,
    eliminatedAnswers,
    gameOptions,
    eliminationState,
    addTeam,
    removeTeam,
    startGame,
    selectCategory,
    goBackToCategories,
    guessScripture,
    switchTeam,
    resetGame,
    closeCongratulations,
    saveCurrentGame,
    loadSavedGame,
    startElimination,
    eliminateRandomAnswer,
    stopElimination,
    resetEliminationForNewQuestion,
    updateGameOptions,
  };
}
