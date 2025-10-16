<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-6">
      <button
        @click="$emit('back-to-categories')"
        class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/20"
      >
        ← Back to Categories
      </button>

      <div class="flex items-center gap-4">
        <!-- Settings Button -->
        <button
          @click="showSettingsModal = true"
          class="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/20"
          title="Game Settings"
          aria-label="Open game settings"
        >
          <Settings class="w-5 h-5" />
        </button>

        <div class="text-right">
          <div class="text-sm text-gray-300">Current Team:</div>
          <div class="text-xl font-bold text-white flex items-center gap-2">
            <Target class="w-6 h-6" />
            {{ guessingTeam }}
          </div>
        </div>
      </div>
    </div>

    <!-- Screen Reader Announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" role="status">
      {{ screenReaderAnnouncement }}
    </div>

    <!-- Game Options Indicators -->
    <div
      v-if="gameOptions.answerElimination.enabled"
      class="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-green-400">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">Answer Elimination Active</span>
          </div>
          <div class="text-xs text-gray-300">
            Eliminates to
            {{ gameOptions.answerElimination.eliminateToCount }} answers every
            {{ gameOptions.answerElimination.intervalSeconds }}s
          </div>
        </div>

        <!-- Elimination Countdown -->
        <div v-if="eliminationState.isActive" class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-xs text-gray-300">Next elimination in:</div>
            <div class="text-lg font-bold text-yellow-400">
              {{ countdownDisplay }}s
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-100 ease-linear"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="backdrop-blur-lg bg-white/10 rounded-2xl p-5 border border-white/20 shadow-2xl"
    >
      <h3 class="font-black text-xl text-white mb-4 flex items-center gap-2">
        <BookOpen class="w-6 h-6" />
        Current Scripture
        <span class="ml-3 text-xs bg-purple-500/30 px-2 py-1 rounded-full">
          {{ selectedCategory }}
        </span>
      </h3>
      <div
        class="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl p-4 border border-yellow-400/20"
      >
        <p class="text-left text-lg text-white leading-snug font-medium">
          {{ currentScripture.text }}
        </p>
      </div>
    </div>

    <div
      class="backdrop-blur-lg bg-white/10 rounded-2xl p-5 border border-white/20 shadow-2xl"
    >
      <h3 class="font-black text-xl text-white mb-4 flex items-center gap-2">
        <Target class="w-6 h-6" />
        Choose the Reference
      </h3>
      <div
        class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[28rem]"
      >
        <button
          v-for="scripture in availableScriptures[selectedCategory]"
          :key="scripture.reference"
          @click="$emit('guess-scripture', scripture.reference)"
          :class="[
            'px-3 py-2 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105',
            getAnswerButtonClasses(scripture.reference),
          ]"
          :style="getAnswerButtonStyles(scripture.reference)"
          :disabled="isAnswerEliminated(scripture.reference)"
          :aria-label="getAnswerAriaLabel(scripture.reference)"
        >
          {{ scripture.reference }}
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeSettingsModal"
    >
      <div
        class="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <Settings class="w-6 h-6" />
            Game Settings
          </h3>
          <button
            @click="closeSettingsModal"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Settings Form -->
        <div class="space-y-4">
          <!-- Answer Elimination Toggle -->
          <div class="flex items-center justify-between">
            <label class="text-white font-medium">Answer Elimination</label>
            <button
              @click="toggleElimination"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                tempGameOptions.answerElimination.enabled
                  ? 'bg-green-500'
                  : 'bg-gray-600',
              ]"
              role="switch"
              :aria-checked="tempGameOptions.answerElimination.enabled"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  tempGameOptions.answerElimination.enabled
                    ? 'translate-x-6'
                    : 'translate-x-1',
                ]"
              />
            </button>
          </div>

          <!-- Elimination Settings (only show if enabled) -->
          <div
            v-if="tempGameOptions.answerElimination.enabled"
            class="space-y-4 pl-4 border-l-2 border-green-500/30"
          >
            <!-- Interval Seconds -->
            <div>
              <label class="block text-sm text-gray-300 mb-2"
                >Elimination Interval</label
              >
              <select
                v-model="tempGameOptions.answerElimination.intervalSeconds"
                class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="3">Every 3 seconds</option>
                <option value="5">Every 5 seconds</option>
                <option value="10">Every 10 seconds</option>
              </select>
            </div>

            <!-- Eliminate To Count -->
            <div>
              <label class="block text-sm text-gray-300 mb-2"
                >Eliminate down to</label
              >
              <select
                v-model="tempGameOptions.answerElimination.eliminateToCount"
                class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="2">2 answers</option>
                <option value="3">3 answers</option>
              </select>
            </div>

            <!-- Show Warning Toggle -->
            <div class="flex items-center justify-between">
              <label class="text-sm text-gray-300"
                >Show elimination warnings</label
              >
              <button
                @click="
                  tempGameOptions.answerElimination.showWarning =
                    !tempGameOptions.answerElimination.showWarning
                "
                :class="[
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                  tempGameOptions.answerElimination.showWarning
                    ? 'bg-green-500'
                    : 'bg-gray-600',
                ]"
                role="switch"
                :aria-checked="tempGameOptions.answerElimination.showWarning"
              >
                <span
                  :class="[
                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                    tempGameOptions.answerElimination.showWarning
                      ? 'translate-x-5'
                      : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Confirmation Message -->
        <div
          v-if="hasChanges"
          class="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
        >
          <p class="text-sm text-yellow-200">
            <AlertTriangle class="w-4 h-4 inline mr-1" />
            Changes will take effect starting with the next question.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="closeSettingsModal"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="applySettings"
            :disabled="!hasChanges"
            :class="[
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              hasChanges
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed',
            ]"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Target, BookOpen, Settings, X, AlertTriangle } from "lucide-vue-next";

const props = defineProps({
  selectedCategory: {
    type: String,
    required: true,
  },
  currentScripture: {
    type: Object,
    required: true,
  },
  availableScriptures: {
    type: Object,
    required: true,
  },
  guessingTeam: {
    type: String,
    required: true,
  },
  incorrectGuesses: {
    type: Array,
    required: true,
  },
  correctAnswer: {
    type: Object,
    default: null,
  },
  gameOptions: {
    type: Object,
    required: true,
  },
  eliminationState: {
    type: Object,
    required: true,
  },
});

// Countdown timer state
const currentTime = ref(Date.now());
let countdownInterval = null;

// Screen reader announcements
const screenReaderAnnouncement = ref("");
const lastEliminatedCount = ref(0);

// Settings modal state
const showSettingsModal = ref(false);
const tempGameOptions = ref({});

// Initialize temp options when modal opens
watch(showSettingsModal, (isOpen) => {
  if (isOpen) {
    // Deep copy current game options
    tempGameOptions.value = {
      answerElimination: {
        ...props.gameOptions.answerElimination,
      },
    };
  }
});

// Check if there are changes to apply
const hasChanges = computed(() => {
  if (!tempGameOptions.value.answerElimination) return false;

  const current = props.gameOptions.answerElimination;
  const temp = tempGameOptions.value.answerElimination;

  return (
    current.enabled !== temp.enabled ||
    current.intervalSeconds !== temp.intervalSeconds ||
    current.eliminateToCount !== temp.eliminateToCount ||
    current.showWarning !== temp.showWarning
  );
});

// Settings modal functions
const closeSettingsModal = () => {
  showSettingsModal.value = false;
};

const toggleElimination = () => {
  tempGameOptions.value.answerElimination.enabled =
    !tempGameOptions.value.answerElimination.enabled;
};

const applySettings = () => {
  if (hasChanges.value) {
    // Emit the updated options to parent
    emit("update-game-options", { ...tempGameOptions.value });

    // Announce change to screen readers
    screenReaderAnnouncement.value =
      "Game settings have been updated and will take effect with the next question.";

    // Clear announcement after 3 seconds
    setTimeout(() => {
      screenReaderAnnouncement.value = "";
    }, 3000);
  }

  closeSettingsModal();
};

// Get emit function
const emit = defineEmits([
  "back-to-categories",
  "guess-scripture",
  "update-game-options",
]);

// Update current time every 100ms for smooth countdown
onMounted(() => {
  countdownInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 100);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

// Computed properties for countdown display
const countdownDisplay = computed(() => {
  if (
    !props.eliminationState.isActive ||
    !props.eliminationState.nextEliminationTime
  ) {
    return 0;
  }

  const timeRemaining = Math.max(
    0,
    props.eliminationState.nextEliminationTime - currentTime.value
  );
  return Math.ceil(timeRemaining / 1000);
});

const progressPercentage = computed(() => {
  if (
    !props.eliminationState.isActive ||
    !props.eliminationState.nextEliminationTime
  ) {
    return 0;
  }

  const totalInterval =
    props.gameOptions.answerElimination.intervalSeconds * 1000;
  const timeRemaining = Math.max(
    0,
    props.eliminationState.nextEliminationTime - currentTime.value
  );
  const elapsed = totalInterval - timeRemaining;

  return Math.min(100, (elapsed / totalInterval) * 100);
});

// Watch for elimination changes to announce them
watch(
  () => props.eliminationState.eliminatedAnswers.length,
  (newCount, oldCount) => {
    if (newCount > oldCount && newCount > 0) {
      const eliminatedAnswer =
        props.eliminationState.eliminatedAnswers[newCount - 1];
      screenReaderAnnouncement.value = `Answer ${eliminatedAnswer} has been eliminated. ${
        props.availableScriptures[props.selectedCategory].length - newCount
      } answers remaining.`;

      // Clear announcement after 3 seconds
      setTimeout(() => {
        screenReaderAnnouncement.value = "";
      }, 3000);
    }
  }
);

// Watch for elimination warnings
watch(
  () => countdownDisplay.value,
  (newTime) => {
    if (newTime === 3 && props.eliminationState.isActive) {
      screenReaderAnnouncement.value =
        "Warning: Answer elimination in 3 seconds";
    }
  }
);

// Animation and elimination helper functions
const isAnswerEliminated = (reference) => {
  return props.eliminationState.eliminatedAnswers.includes(reference);
};

const isAnswerAboutToBeEliminated = (reference) => {
  if (
    !props.gameOptions.answerElimination.showWarning ||
    !props.eliminationState.isActive
  ) {
    return false;
  }

  // Show warning in the last 2 seconds before elimination
  const timeRemaining = Math.max(
    0,
    props.eliminationState.nextEliminationTime - currentTime.value
  );
  const warningThreshold = 2000; // 2 seconds

  return (
    timeRemaining <= warningThreshold &&
    timeRemaining > 0 &&
    props.eliminationState.availableForElimination.includes(reference)
  );
};

const getAnswerButtonClasses = (reference) => {
  const baseClasses = [];

  if (isAnswerEliminated(reference)) {
    // Eliminated answer - faded out and disabled
    baseClasses.push(
      "opacity-30 cursor-not-allowed pointer-events-none bg-gray-500/20 text-gray-400 border-gray-500/20"
    );
  } else if (props.incorrectGuesses.includes(reference)) {
    // Incorrect guess - red styling with shake animation
    baseClasses.push(
      "bg-red-500/80 text-white border border-red-400 animate-shake"
    );
  } else {
    // Normal answer button (includes correct answer when not eliminated/warned)
    baseClasses.push(
      "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
    );
  }

  return baseClasses.join(" ");
};

const getAnswerButtonStyles = (reference) => {
  if (isAnswerEliminated(reference)) {
    return {
      transition: "all 0.5s ease-out",
      transform: "scale(0.95)",
    };
  }

  return {};
};

const getAnswerAriaLabel = (reference) => {
  if (isAnswerEliminated(reference)) {
    return `${reference} - eliminated answer, not selectable`;
  } else if (isAnswerAboutToBeEliminated(reference)) {
    return `${reference} - warning: may be eliminated soon`;
  } else if (props.incorrectGuesses.includes(reference)) {
    return `${reference} - incorrect guess`;
  }

  return `${reference} - scripture reference option`;
};
</script>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Ensure smooth transitions for eliminated answers */
.transition-elimination {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out,
    background-color 0.3s ease;
}

/* Accessibility: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .animate-shake {
    animation: none;
  }

  .animate-pulse {
    animation: none;
  }

  .transition-elimination {
    transition: none;
  }
}
</style>
