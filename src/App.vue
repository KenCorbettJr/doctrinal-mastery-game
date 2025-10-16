<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="mx-auto p-4 relative z-10">
      <div class="text-center mb-12">
        <h1
          class="text-7xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse flex items-center justify-center gap-4"
        >
          <Zap class="w-16 h-16" />
          DOCTRINAL MASTERY
          <Zap class="w-16 h-16" />
        </h1>
        <p class="text-xl text-gray-300 font-medium">
          Level up your scripture knowledge!
        </p>
      </div>

      <!-- Game Setup Screen -->
      <GameSetup
        v-if="gameState === 'setup'"
        :teams="teams"
        @add-team="addTeam"
        @remove-team="removeTeam"
        @start-game="startGame"
      />

      <!-- Victory Screen -->
      <VictoryScreen
        v-else-if="gameState === 'victory'"
        :scores="scores"
        @play-again="resetGame"
      />

      <!-- Main Game Screen -->
      <div v-else-if="gameState === 'play'" class="flex gap-8">
        <div class="w-3/4">
          <!-- Category Selection -->
          <CategoryGrid
            v-if="!selectedCategory"
            :available-scriptures="availableScriptures"
            @select-category="selectCategory"
            @reset-game="resetGame"
          />

          <!-- Scripture Game -->
          <ScriptureGame
            v-else
            :selected-category="selectedCategory"
            :current-scripture="currentScripture"
            :available-scriptures="availableScriptures"
            :guessing-team="guessingTeam"
            :incorrect-guesses="incorrectGuesses"
            :correct-answer="correctAnswer"
            :game-options="gameOptions"
            :elimination-state="eliminationState"
            @back-to-categories="goBackToCategories"
            @guess-scripture="guessScripture"
            @update-game-options="updateGameOptions"
          />
        </div>

        <!-- Sidebar -->
        <div class="w-1/4 space-y-6">
          <Scoreboard :scores="scores" />

          <TeamSelector
            v-if="selectedCategory"
            :scores="scores"
            :guessing-team="guessingTeam"
            @switch-team="switchTeam"
          />
        </div>
      </div>

      <!-- Congratulations Modal -->
      <CongratulationsModal
        :show="showCongratulations"
        :correct-answer="correctAnswer"
        @close="closeCongratulations"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import { Zap } from "lucide-vue-next";

// Components
import GameSetup from "./components/GameSetup.vue";
import CategoryGrid from "./components/CategoryGrid.vue";
import ScriptureGame from "./components/ScriptureGame.vue";
import Scoreboard from "./components/Scoreboard.vue";
import TeamSelector from "./components/TeamSelector.vue";
import VictoryScreen from "./components/VictoryScreen.vue";
import CongratulationsModal from "./components/CongratulationsModal.vue";

// Data and composables
import { scriptures } from "./data/scriptures.js";
import { useGameLogic } from "./composables/useGameLogic.js";

// Initialize available scriptures
const availableScriptures = reactive({ ...scriptures });

// Use game logic composable
const {
  gameState,
  teams,
  guessingTeam,
  selectedCategory,
  currentScripture,
  scores,
  incorrectGuesses,
  showCongratulations,
  correctAnswer,
  gameOptions,
  eliminationState,
  addTeam,
  removeTeam,
  startGame,
  selectCategory: selectCategoryLogic,
  goBackToCategories,
  guessScripture: guessScriptureLogic,
  switchTeam,
  resetGame: resetGameLogic,
  closeCongratulations: closeCongratulationsLogic,
  saveCurrentGame,
  loadSavedGame,
  updateGameOptions: updateGameOptionsLogic,
} = useGameLogic();

// Wrapper functions to pass availableScriptures
const selectCategory = (category) => {
  selectCategoryLogic(category, availableScriptures);
};

const guessScripture = (reference) => {
  guessScriptureLogic(reference, availableScriptures);
};

const resetGame = () => {
  resetGameLogic(scriptures, availableScriptures);
};

const closeCongratulations = () => {
  closeCongratulationsLogic(availableScriptures);
};

const updateGameOptions = (newOptions) => {
  updateGameOptionsLogic(newOptions);
};

// Watch for game state changes to trigger auto-save
watch(
  [
    gameState,
    teams,
    scores,
    availableScriptures,
    guessingTeam,
    selectedCategory,
  ],
  () => saveCurrentGame(availableScriptures),
  { deep: true }
);

// Load saved game on mount
onMounted(() => {
  loadSavedGame(availableScriptures);
});
</script>
