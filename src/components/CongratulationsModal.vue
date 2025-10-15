<template>
  <div
    v-if="show"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
  >
    <div class="text-center animate-bounce-in">
      <div class="mb-8 animate-spin-slow">
        <Trophy class="w-32 h-32 text-yellow-400 mx-auto animate-pulse" />
      </div>
      <h2
        class="text-8xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-text-glow"
      >
        CORRECT!
      </h2>
      <div class="text-4xl text-white mb-4 animate-fade-in-up">
        🎉 {{ correctAnswer?.team }} 🎉
      </div>
      <div class="text-2xl text-gray-300 mb-6 animate-fade-in-up-delay">
        {{ correctAnswer?.reference }}
      </div>
      <div
        class="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent animate-scale-up"
      >
        {{ correctAnswer?.points }} Points!
      </div>
      <div class="mt-8 text-lg text-gray-400 animate-fade-in-late">
        Returning to categories...
      </div>
      <div class="mt-4 text-sm text-gray-500 animate-fade-in-late">
        Click anywhere to continue
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from "lucide-vue-next";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  correctAnswer: {
    type: Object,
    default: null,
  },
});

defineEmits(["close"]);
</script>
