<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-6">
      <button
        @click="$emit('back-to-categories')"
        class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/20"
      >
        ← Back to Categories
      </button>
      <div class="text-right">
        <div class="text-sm text-gray-300">Current Team:</div>
        <div class="text-xl font-bold text-white flex items-center gap-2">
          <Target class="w-6 h-6" />
          {{ guessingTeam }}
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
            incorrectGuesses.includes(scripture.reference)
              ? 'bg-red-500/80 text-white border border-red-400 animate-shake'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40',
          ]"
        >
          {{ scripture.reference }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Target, BookOpen } from "lucide-vue-next";

defineProps({
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
});

defineEmits(["back-to-categories", "guess-scripture"]);
</script>
