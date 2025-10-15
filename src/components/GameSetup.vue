<template>
  <div class="max-w-2xl mx-auto">
    <div
      class="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      <h2
        class="text-4xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3"
      >
        <Rocket class="w-10 h-10" />
        Team Setup
      </h2>

      <div class="space-y-4 mb-8">
        <div
          v-for="team in teams"
          :key="team"
          class="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <span
            class="text-white font-semibold text-lg flex items-center gap-2"
          >
            <Trophy class="w-5 h-5" /> {{ team }}
          </span>
          <button
            @click="emit('remove-team', team)"
            class="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium"
          >
            Remove
          </button>
        </div>
      </div>

      <div class="flex space-x-4 mb-8">
        <input
          v-model="currentTeam"
          @keyup.enter="addTeam"
          placeholder="Enter your team name..."
          class="bg-white/10 border border-white/20 p-4 rounded-2xl flex-1 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm text-lg"
        />
        <button
          @click="addTeam"
          class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <Plus class="w-5 h-5" />
          Add Team
        </button>
      </div>

      <div class="flex gap-4">
        <button
          @click="emit('start-game')"
          :disabled="teams.length < 2"
          class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-2xl disabled:opacity-50 animate-pulse hover:animate-none flex items-center justify-center gap-3"
        >
          <Gamepad2 class="w-8 h-8" />
          START GAME
        </button>
      </div>

      <p class="text-center text-gray-300 mt-4 text-sm">
        Need at least 2 teams to start!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Rocket, Trophy, Plus, Gamepad2 } from "lucide-vue-next";

defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["add-team", "remove-team", "start-game"]);

const currentTeam = ref("");

const addTeam = () => {
  if (currentTeam.value.trim()) {
    emit("add-team", currentTeam.value.trim());
    currentTeam.value = "";
  }
};
</script>
