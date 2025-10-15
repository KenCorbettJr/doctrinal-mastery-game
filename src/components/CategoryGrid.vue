<template>
  <div>
    <div class="flex justify-end mb-6">
      <button
        @click="$emit('reset-game')"
        class="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 border border-red-500/20 flex items-center gap-2"
        title="Start Over"
      >
        <Trash2 class="w-5 h-5" />
        Start Over
      </button>
    </div>
    <div class="grid grid-cols-2 gap-6">
      <button
        v-for="category in categories"
        :key="category"
        @click="$emit('select-category', category)"
        :class="[
          'group relative h-40 text-white rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-2xl',
          categoryColors[category],
        ]"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
        ></div>
        <div
          class="relative z-10 p-6 h-full flex flex-col justify-center items-center"
        >
          <div class="mb-2">
            <component :is="getCategoryIcon(category)" class="w-12 h-12" />
          </div>
          <strong
            class="text-2xl font-black mb-2 group-hover:scale-110 transition-transform duration-300"
          >
            {{ category }}
          </strong>
          <div class="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <span class="font-bold">
              {{ availableScriptures[category].length }} Remaining
            </span>
          </div>
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Trash2, Scroll, Cross, Book, Star, BookOpen } from "lucide-vue-next";

const props = defineProps({
  availableScriptures: {
    type: Object,
    required: true,
  },
});

defineEmits(["select-category", "reset-game"]);

const categories = computed(() => Object.keys(props.availableScriptures));

const categoryColors = {
  "Old Testament": "bg-gradient-to-br from-red-500 to-pink-600",
  "New Testament": "bg-gradient-to-br from-blue-500 to-indigo-600",
  "Book of Mormon": "bg-gradient-to-br from-green-500 to-emerald-600",
  "Doctrine and Covenants": "bg-gradient-to-br from-yellow-500 to-orange-600",
};

const getCategoryIcon = (category) => {
  const icons = {
    "Old Testament": Scroll,
    "New Testament": Cross,
    "Book of Mormon": Book,
    "Doctrine and Covenants": Star,
  };
  return icons[category] || BookOpen;
};
</script>
