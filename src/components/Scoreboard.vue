<template>
  <div
    class="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl"
  >
    <h3 class="text-2xl font-black text-white mb-6 flex items-center gap-3">
      <Trophy class="w-7 h-7" />
      Scoreboard
    </h3>
    <div class="space-y-3">
      <div
        v-for="(score, team) in scores"
        :key="team"
        class="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/10"
      >
        <span class="text-white font-bold">{{ team }}</span>
        <span
          class="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-3 py-1 rounded-full text-lg"
        >
          {{ score }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from "lucide-vue-next";

defineProps({
  scores: {
    type: Object,
    required: true,
  },
});
</script>
