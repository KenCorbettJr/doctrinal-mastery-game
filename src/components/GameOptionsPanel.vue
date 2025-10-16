<template>
  <div
    class="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl"
  >
    <h3
      class="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3"
    >
      <Settings class="w-6 h-6" />
      Game Options
    </h3>

    <!-- Answer Elimination Section -->
    <div class="space-y-6">
      <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div class="flex items-center justify-between mb-4">
          <label
            class="text-white font-semibold text-lg flex items-center gap-2"
          >
            <Zap class="w-5 h-5" />
            Answer Elimination
          </label>
          <button
            @click="toggleElimination"
            :disabled="disabled"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
              modelValue.answerElimination.enabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gray-600',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
                modelValue.answerElimination.enabled
                  ? 'translate-x-6'
                  : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <p class="text-gray-300 text-sm mb-4">
          Gradually remove incorrect answers to make questions easier over time
        </p>

        <!-- Elimination Settings (only show when enabled) -->
        <div
          v-if="modelValue.answerElimination.enabled"
          class="space-y-4 mt-4 pt-4 border-t border-white/10"
        >
          <!-- Timing Slider -->
          <div>
            <label class="block text-white font-medium mb-2">
              Elimination Interval:
              {{ modelValue.answerElimination.intervalSeconds }} seconds
            </label>
            <div class="relative">
              <input
                type="range"
                :value="modelValue.answerElimination.intervalSeconds"
                @input="updateInterval($event.target.value)"
                :disabled="disabled"
                min="3"
                max="10"
                step="1"
                class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>3s (Fast)</span>
                <span>5s</span>
                <span>10s (Slow)</span>
              </div>
            </div>
          </div>

          <!-- Elimination Count Dropdown -->
          <div>
            <label class="block text-white font-medium mb-2">
              Eliminate down to:
            </label>
            <select
              :value="modelValue.answerElimination.eliminateToCount"
              @change="updateEliminateToCount($event.target.value)"
              :disabled="disabled"
              class="w-full bg-white/10 border border-white/20 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="2" class="bg-gray-800">2 answers (easiest)</option>
              <option value="3" class="bg-gray-800">
                3 answers (moderate)
              </option>
              <option value="4" class="bg-gray-800">4 answers (harder)</option>
            </select>
          </div>

          <!-- Warning Toggle -->
          <div class="flex items-center justify-between">
            <label class="text-white font-medium flex items-center gap-2">
              <AlertTriangle class="w-4 h-4" />
              Show elimination warnings
            </label>
            <button
              @click="toggleWarning"
              :disabled="disabled"
              :class="[
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300',
                modelValue.answerElimination.showWarning
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                  : 'bg-gray-600',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ]"
            >
              <span
                :class="[
                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300',
                  modelValue.answerElimination.showWarning
                    ? 'translate-x-5'
                    : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Validation Errors -->
      <div
        v-if="validationErrors.length > 0"
        class="bg-red-500/20 border border-red-500/50 rounded-xl p-4"
      >
        <h4 class="text-red-300 font-semibold mb-2 flex items-center gap-2">
          <AlertCircle class="w-4 h-4" />
          Configuration Issues
        </h4>
        <ul class="text-red-200 text-sm space-y-1">
          <li v-for="error in validationErrors" :key="error.field">
            • {{ error.message }}
          </li>
        </ul>
      </div>

      <!-- Options Preview -->
      <div
        v-if="modelValue.answerElimination.enabled"
        class="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4"
      >
        <h4 class="text-blue-300 font-semibold mb-2 flex items-center gap-2">
          <Info class="w-4 h-4" />
          Active Settings
        </h4>
        <div class="text-blue-200 text-sm space-y-1">
          <p>
            • Answers will be eliminated every
            {{ modelValue.answerElimination.intervalSeconds }} seconds
          </p>
          <p>
            • Elimination stops when
            {{ modelValue.answerElimination.eliminateToCount }} answers remain
          </p>
          <p v-if="modelValue.answerElimination.showWarning">
            • Visual warnings will appear before elimination
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  Settings,
  Zap,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-vue-next";
import { useGameOptions } from "../composables/useGameOptions.js";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { validateOptions } = useGameOptions();

// Computed validation errors
const validationErrors = computed(() => {
  return validateOptions(props.modelValue);
});

// Helper function to emit updates
function updateOptions(updates) {
  const newOptions = {
    ...props.modelValue,
    answerElimination: {
      ...props.modelValue.answerElimination,
      ...updates,
    },
  };
  emit("update:modelValue", newOptions);
}

// Toggle functions
function toggleElimination() {
  if (props.disabled) return;
  updateOptions({ enabled: !props.modelValue.answerElimination.enabled });
}

function toggleWarning() {
  if (props.disabled) return;
  updateOptions({
    showWarning: !props.modelValue.answerElimination.showWarning,
  });
}

// Update functions
function updateInterval(value) {
  if (props.disabled) return;
  updateOptions({ intervalSeconds: parseInt(value) });
}

function updateEliminateToCount(value) {
  if (props.disabled) return;
  updateOptions({ eliminateToCount: parseInt(value) });
}
</script>

<style scoped>
/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
}

.slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
  border: none;
}

/* Select dropdown styling */
select option {
  background-color: #1f2937;
  color: white;
}
</style>
