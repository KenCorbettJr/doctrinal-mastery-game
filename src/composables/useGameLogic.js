import { ref, reactive, watch, onMounted } from "vue";

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
  };

  const goBackToCategories = () => {
    selectedCategory.value = "";
    currentScripture.value = null;
    incorrectGuesses.value = [];
  };

  const guessScripture = (reference, availableScriptures) => {
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
      } catch (error) {
        console.error("Error loading saved game:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
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
  };
}
