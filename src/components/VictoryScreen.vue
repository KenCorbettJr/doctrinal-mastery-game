<template>
  <div class="max-w-4xl mx-auto text-center">
    <div
      class="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl"
    >
      <div class="flex justify-center mb-8 animate-bounce">
        <Trophy class="w-32 h-32 text-yellow-400" />
      </div>
      <h2
        class="text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8"
      >
        GAME COMPLETE!
      </h2>
      <div class="text-2xl text-white mb-8">Final Scores:</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div
          v-for="(score, team) in scores"
          :key="team"
          class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20"
        >
          <div class="text-2xl font-bold text-white">{{ team }}</div>
          <div
            class="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            {{ score }} points
          </div>
        </div>
      </div>
      <button
        @click="$emit('play-again')"
        class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
      >
        <Gamepad2 class="w-8 h-8" />
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { Trophy, Gamepad2 } from "lucide-vue-next";

defineProps({
  scores: {
    type: Object,
    required: true,
  },
});

defineEmits(["play-again"]);
</script>
