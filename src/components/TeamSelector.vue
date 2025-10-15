<template>
  <div
    class="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl"
  >
    <h3 class="text-2xl font-black text-white mb-6 flex items-center gap-3">
      <Gamepad2 class="w-7 h-7" />
      Current Player
    </h3>
    <div class="space-y-3">
      <button
        v-for="(score, team) in scores"
        :key="team"
        class="w-full p-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        :class="
          team === guessingTeam
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse'
            : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
        "
        @click="$emit('switch-team', team)"
      >
        <Target v-if="team === guessingTeam" class="w-5 h-5" />
        <span>{{ team }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Gamepad2, Target } from "lucide-vue-next";

defineProps({
  scores: {
    type: Object,
    required: true,
  },
  guessingTeam: {
    type: String,
    required: true,
  },
});

defineEmits(["switch-team"]);
</script>
