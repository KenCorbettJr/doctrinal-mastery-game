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
      <div v-if="gameState === 'setup'" class="max-w-2xl mx-auto">
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
                ><Trophy class="w-5 h-5" /> {{ team }}</span
              >
              <button
                @click="removeTeam(team)"
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
              @click="startGame"
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
      <div
        v-else-if="gameState === 'victory'"
        class="max-w-4xl mx-auto text-center"
      >
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
            @click="resetGame"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
          >
            <Gamepad2 class="w-8 h-8" />
            Play Again
          </button>
        </div>
      </div>

      <!-- Congratulations Interstitial -->
      <div
        v-if="showCongratulations"
        @click="closeCongratulations"
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

      <div v-else-if="gameState === 'play'" class="flex gap-8">
        <div class="w-3/4">
          <div v-if="!selectedCategory">
            <div class="flex justify-end mb-6">
              <button
                @click="resetGame"
                class="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 border border-red-500/20 flex items-center gap-2"
                title="Start Over"
              >
                <Trash2 class="w-5 h-5" />
                Start Over
              </button>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <button
                v-for="column in Object.keys(scriptures)"
                :key="column"
                @click="selectColumn(column)"
                :class="[
                  'group relative h-40 text-white rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-2xl',
                  categoryColors[column],
                ]"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                ></div>
                <div
                  class="relative z-10 p-6 h-full flex flex-col justify-center items-center"
                >
                  <div class="mb-2">
                    <component
                      :is="getCategoryIcon(column)"
                      class="w-12 h-12"
                    />
                  </div>
                  <strong
                    class="text-2xl font-black mb-2 group-hover:scale-110 transition-transform duration-300"
                    >{{ column }}</strong
                  >
                  <div
                    class="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm"
                  >
                    <span class="font-bold"
                      >{{ availableScriptures[column].length }} Remaining</span
                    >
                  </div>
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div class="flex justify-between items-center mb-6">
              <button
                @click="goBackToCategories"
                class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                ← Back to Categories
              </button>
              <div class="text-right">
                <div class="text-sm text-gray-300">Current Team:</div>
                <div
                  class="text-xl font-bold text-white flex items-center gap-2"
                >
                  <Target class="w-6 h-6" />
                  {{ guessingTeam }}
                </div>
              </div>
            </div>

            <div
              class="backdrop-blur-lg bg-white/10 rounded-2xl p-5 border border-white/20 shadow-2xl"
            >
              <h3
                class="font-black text-xl text-white mb-4 flex items-center gap-2"
              >
                <BookOpen class="w-6 h-6" />
                Current Scripture
                <span
                  class="ml-3 text-xs bg-purple-500/30 px-2 py-1 rounded-full"
                  >{{ selectedCategory }}</span
                >
              </h3>
              <div
                class="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl p-4 border border-yellow-400/20"
              >
                <p
                  class="text-left text-lg text-white leading-snug font-medium"
                >
                  {{ currentScripture.text }}
                </p>
              </div>
            </div>

            <div
              class="backdrop-blur-lg bg-white/10 rounded-2xl p-5 border border-white/20 shadow-2xl"
            >
              <h3
                class="font-black text-xl text-white mb-4 flex items-center gap-2"
              >
                <Target class="w-6 h-6" />
                Choose the Reference
              </h3>
              <div
                class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[28rem]"
              >
                <button
                  v-for="scripture in availableScriptures[selectedCategory]"
                  :key="scripture.reference"
                  @click="guessScripture(scripture.reference)"
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
        </div>

        <div class="w-1/4 space-y-6">
          <div
            class="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl"
          >
            <h3
              class="text-2xl font-black text-white mb-6 flex items-center gap-3"
            >
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
                  >{{ score }}</span
                >
              </div>
            </div>
          </div>

          <div
            class="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl"
            v-if="selectedCategory"
          >
            <h3
              class="text-2xl font-black text-white mb-6 flex items-center gap-3"
            >
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
                @click="onTeamSwitchClick(team)"
              >
                <Target v-if="team === guessingTeam" class="w-5 h-5" />
                <span>{{ team }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import {
  Zap,
  Rocket,
  Trophy,
  Plus,
  Gamepad2,
  Target,
  BookOpen,
  Scroll,
  Cross,
  Book,
  Star,
  Save,
  Trash2,
  X,
} from "lucide-vue-next";

const scriptures = reactive({
  "Old Testament": [
    {
      reference: "Moses 1:39",
      text: "For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man.",
    },
    {
      reference: "Moses 7:18",
      text: "And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them.",
    },
    {
      reference: "Abraham 2:9–11",
      text: "And I will make of thee a great nation, and I will bless thee above measure, and make thy name great among all nations, and thou shalt be a blessing unto thy seed after thee, that in their hands they shall bear this ministry and Priesthood unto all nations;",
    },
    {
      reference: "Abraham 3:22–23",
      text: "Now the Lord had shown unto me, Abraham, the intelligences that were organized before the world was; and among all these there were many of the noble and great ones;",
    },
    {
      reference: "Genesis 1:26–27",
      text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
    },
    {
      reference: "Genesis 2:24",
      text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.",
    },
    {
      reference: "Genesis 39:9",
      text: "There is none greater in this house than I; neither hath he kept back any thing from me but thee, because thou art his wife: how then can I do this great wickedness, and sin against God?",
    },
    {
      reference: "Exodus 20:3–17",
      text: "Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth:",
    },
    {
      reference: "Joshua 24:15",
      text: "And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the Lord.",
    },
    {
      reference: "Psalm 24:3–4",
      text: "Who shall ascend into the hill of the Lord? or who shall stand in his holy place? He that hath clean hands, and a pure heart; who hath not lifted up his soul unto vanity, nor sworn deceitfully.",
    },
    {
      reference: "Proverbs 3:5–6",
      text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    },
    {
      reference: "Isaiah 1:18",
      text: "Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.",
    },
    {
      reference: "Isaiah 5:20",
      text: "Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness; that put bitter for sweet, and sweet for bitter!",
    },
    {
      reference: "Isaiah 29:13–14",
      text: "Wherefore the Lord said, Forasmuch as this people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men:",
    },
    {
      reference: "Isaiah 53:3–5",
      text: "He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.",
    },
    {
      reference: "Isaiah 58:6–7",
      text: "Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke?",
    },
    {
      reference: "Isaiah 58:13–14",
      text: "If thou turn away thy foot from the sabbath, from doing thy pleasure on my holy day; and call the sabbath a delight, the holy of the Lord, honourable; and shalt honour him, not doing thine own ways, nor finding thine own pleasure, nor speaking thine own words:",
    },
    {
      reference: "Jeremiah 1:4–5",
      text: "Then the word of the Lord came unto me, saying, Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations.",
    },
    {
      reference: "Ezekiel 3:16–17",
      text: "And it came to pass at the end of seven days, that the word of the Lord came unto me, saying, Son of man, I have made thee a watchman unto the house of Israel: therefore hear the word at my mouth, and give them warning from me.",
    },
    {
      reference: "Ezekiel 37:15–17",
      text: "The word of the Lord came again unto me, saying, Moreover, thou son of man, take thee one stick, and write upon it, For Judah, and for the children of Israel his companions: then take another stick, and write upon it, For Joseph, the stick of Ephraim, and for all the house of Israel his companions:",
    },
    {
      reference: "Daniel 2:44–45",
      text: "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever.",
    },
    {
      reference: "Amos 3:7",
      text: "Surely the Lord God will do nothing, but he revealeth his secret unto his servants the prophets.",
    },
    {
      reference: "Malachi 3:8–10",
      text: "Will a man rob God? Yet ye have robbed me. But ye say, Wherein have we robbed thee? In tithes and offerings.",
    },
    {
      reference: "Malachi 4:5–6",
      text: "Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord: And he shall turn the heart of the fathers to the children, and the heart of the children to their fathers, lest I come and smite the earth with a curse.",
    },
  ],
  "New Testament": [
    {
      reference: "Matthew 5:14–16",
      text: "Ye are the light of the world. A city that is set on an hill cannot be hid. Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house.",
    },
    {
      reference: "Matthew 11:28–30",
      text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.",
    },
    {
      reference: "Matthew 16:15–19",
      text: "He saith unto them, But whom say ye that I am? And Simon Peter answered and said, Thou art the Christ, the Son of the living God.",
    },
    {
      reference: "Matthew 22:36–39",
      text: "Master, which is the great commandment in the law? Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.",
    },
    {
      reference: "Luke 2:10–12",
      text: "And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.",
    },
    {
      reference: "Luke 22:19–20",
      text: "And he took bread, and gave thanks, and brake it, and gave unto them, saying, This is my body which is given for you: this do in remembrance of me.",
    },
    {
      reference: "Luke 24:36–39",
      text: "And as they thus spake, Jesus himself stood in the midst of them, and saith unto them, Peace be unto you. But they were terrified and affrighted, and supposed that they had seen a spirit.",
    },
    {
      reference: "John 3:5",
      text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
    },
    {
      reference: "John 3:16",
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    },
    {
      reference: "John 7:17",
      text: "If any man will do his will, he shall know of the doctrine, whether it be of God, or whether I speak of myself.",
    },
    {
      reference: "John 17:3",
      text: "And this is life eternal, that they might know thee the only true God, and Jesus Christ, whom thou hast sent.",
    },
    {
      reference: "1 Corinthians 6:19–20",
      text: "What? know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own?",
    },
    {
      reference: "1 Corinthians 11:11",
      text: "Nevertheless neither is the man without the woman, neither the woman without the man, in the Lord.",
    },
    {
      reference: "1 Corinthians 15:20–22",
      text: "But now is Christ risen from the dead, and become the firstfruits of them that slept. For since by man came death, by man came also the resurrection of the dead.",
    },
    {
      reference: "1 Corinthians 15:40–42",
      text: "There are also celestial bodies, and bodies terrestrial: but the glory of the celestial is one, and the glory of the terrestrial is another.",
    },
    {
      reference: "Ephesians 1:10",
      text: "That in the dispensation of the fulness of times he might gather together in one all things in Christ, both which are in heaven, and which are on earth; even in him:",
    },
    {
      reference: "Ephesians 2:19–20",
      text: "Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God; And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone;",
    },
    {
      reference: "2 Thessalonians 2:1–3",
      text: "Now we beseech you, brethren, by the coming of our Lord Jesus Christ, and by our gathering together unto him, That ye be not soon shaken in mind, or be troubled, neither by spirit, nor by word, nor by letter as from us, as that the day of Christ is at hand.",
    },
    {
      reference: "2 Timothy 3:15–17",
      text: "And that from a child thou hast known the holy scriptures, which are able to make thee wise unto salvation through faith which is in Christ Jesus.",
    },
    {
      reference: "Hebrews 12:9",
      text: "Furthermore we have had fathers of our flesh which corrected us, and we gave them reverence: shall we not much rather be in subjection unto the Father of spirits, and live?",
    },
    {
      reference: "James 1:5–6",
      text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him. But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed.",
    },
    {
      reference: "James 2:17–18",
      text: "Even so faith, if it hath not works, is dead, being alone. Yea, a man may say, Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works.",
    },
    {
      reference: "1 Peter 4:6",
      text: "For for this cause was the gospel preached also to them that are dead, that they might be judged according to men in the flesh, but live according to God in the spirit.",
    },
    {
      reference: "Revelation 20:12",
      text: "And I saw the dead, small and great, stand before God; and the books were opened: and another book was opened, which is the book of life: and the dead were judged out of those things which were written in the books, according to their works.",
    },
  ],
  "Book of Mormon": [
    {
      reference: "1 Nephi 3:7",
      text: "And it came to pass that I, Nephi, said unto my father: I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them.",
    },
    {
      reference: "2 Nephi 2:25",
      text: "Adam fell that men might be; and men are, that they might have joy.",
    },
    {
      reference: "2 Nephi 2:27",
      text: "Wherefore, men are free according to the flesh; and all things are given them which are expedient unto man. And they are free to choose liberty and eternal life, through the great Mediator of all men, or to choose captivity and death, according to the captivity and power of the devil; for he seeketh that all men might be miserable like unto himself.",
    },
    {
      reference: "2 Nephi 26:33",
      text: "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness; and he denieth none that come unto him, black and white, bond and free, male and female; and he remembereth the heathen; and all are alike unto God, both Jew and Gentile.",
    },
    {
      reference: "2 Nephi 28:30",
      text: "For behold, thus saith the Lord God: I will give unto the children of men line upon line, precept upon precept, here a little and there a little; and blessed are those who hearken unto my precepts, and lend an ear unto my counsel, for they shall learn wisdom; for unto him that receiveth I will give more; and from them that shall say, We have enough, from them shall be taken away even that which they have.",
    },
    {
      reference: "2 Nephi 32:3",
      text: "Angels speak by the power of the Holy Ghost; wherefore, they speak the words of Christ. Wherefore, I said unto you, feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do.",
    },
    {
      reference: "2 Nephi 32:8–9",
      text: "And now, my beloved brethren, I perceive that ye ponder still in your hearts; and it grieveth me that I must speak concerning this thing. For if ye would hearken unto the Spirit which teacheth a man to pray, ye would know that ye must pray; for the evil spirit teacheth not a man to pray, but teacheth him that he must not pray.  But behold, I say unto you that ye must pray always, and not faint; that ye must not perform any thing unto the Lord save in the first place ye shall pray unto the Father in the name of Christ, that he will consecrate thy performance unto thee, that thy performance may be for the welfare of thy soul.",
    },
    {
      reference: "Mosiah 2:17",
      text: "And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God.",
    },
    {
      reference: "Mosiah 2:41",
      text: "And moreover, I would desire that ye should consider on the blessed and happy state of those that keep the commandments of God. For behold, they are blessed in all things, both temporal and spiritual; and if they hold out faithful to the end they are received into heaven, that thereby they may dwell with God in a state of never-ending happiness. O remember, remember that these things are true; for the Lord God hath spoken it.",
    },
    {
      reference: "Mosiah 3:19",
      text: "For the natural man is an enemy to God, and has been from the fall of Adam, and will be, forever and ever, unless he yields to the enticings of the Holy Spirit, and putteth off the natural man and becometh a saint through the atonement of Christ the Lord, and becometh as a child, submissive, meek, humble, patient, full of love, willing to submit to all things which the Lord seeth fit to inflict upon him, even as a child doth submit to his father.",
    },
    {
      reference: "Mosiah 4:9",
      text: "Believe in God; believe that he is, and that he created all things, both in heaven and in earth; believe that he has all wisdom, and all power, both in heaven and in earth; believe that man doth not comprehend all the things which the Lord can comprehend.",
    },
    {
      reference: "Mosiah 18:8–10",
      text: "And it came to pass that he said unto them: Behold, here are the waters of Mormon (for thus were they called) and now, as ye are desirous to come into the fold of God, and to be called his people, and are willing to bear one another's burdens, that they may be light;",
    },
    {
      reference: "Alma 7:11–13",
      text: "And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people.",
    },
    {
      reference: "Alma 34:9–10",
      text: "For it is expedient that an atonement should be made; for according to the great plan of the Eternal God there must be an atonement made, or else all mankind must unavoidably perish; yea, all are hardened; yea, all are fallen and are lost, and must perish except it be through the atonement which it is expedient should be made.",
    },
    {
      reference: "Alma 39:9",
      text: "Now my son, I would that ye should repent and forsake your sins, and go no more after the lusts of your eyes, but cross yourself in all these things; for except ye do this ye can in nowise inherit the kingdom of God. Oh, remember, and take it upon you, and cross yourself in these things.",
    },
    {
      reference: "Alma 41:10",
      text: "Do not suppose, because it has been spoken concerning restoration, that ye shall be restored from sin to happiness. Behold, I say unto you, wickedness never was happiness.",
    },
    {
      reference: "Helaman 5:12",
      text: "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, yea, his shafts in the whirlwind, yea, when all his hail and his mighty storm shall beat upon you, it shall have no power over you to drag you down to the gulf of misery and endless wo, because of the rock upon which ye are built, which is a sure foundation, a foundation whereon if men build they cannot fall.",
    },
    {
      reference: "3 Nephi 11:10–11",
      text: "Behold, I am Jesus Christ, whom the prophets testified shall come into the world. And behold, I am the light and the life of the world; and I have drunk out of that bitter cup which the Father hath given me, and have glorified the Father in taking upon me the sins of the world, in the which I have suffered the will of the Father in all things from the beginning.",
    },
    {
      reference: "3 Nephi 12:48",
      text: "Therefore I would that ye should be perfect even as I, or your Father who is in heaven is perfect.",
    },
    {
      reference: "3 Nephi 27:20",
      text: "Now this is the commandment: Repent, all ye ends of the earth, and come unto me and be baptized in my name, that ye may be sanctified by the reception of the Holy Ghost, that ye may stand spotless before me at the last day.",
    },
    {
      reference: "Ether 12:6",
      text: "And now, I, Moroni, would speak somewhat concerning these things; I would show unto the world that faith is things which are hoped for and not seen; wherefore, dispute not because ye see not, for ye receive no witness until after the trial of your faith.",
    },
    {
      reference: "Ether 12:27",
      text: "And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them.",
    },
    {
      reference: "Moroni 7:45–48",
      text: "And charity suffereth long, and is kind, and envieth not, and is not puffed up, seeketh not her own, is not easily provoked, thinketh no evil, and rejoiceth not in iniquity but rejoiceth in the truth, beareth all things, believeth all things, hopeth all things, endureth all things.",
    },
    {
      reference: "Moroni 10:4–5",
      text: "And when ye shall receive these things, I would exhort you that ye would ask God, the Eternal Father, in the name of Christ, if these things are not true; and if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you, by the power of the Holy Ghost. And by the power of the Holy Ghost ye may know the truth of all things.",
    },
  ],
  "Doctrine and Covenants": [
    {
      reference: "Joseph Smith—History 1:15–20",
      text: '**15** After I had retired to the place where I had previously designed to go, having looked around me, and finding myself alone, I kneeled down and began to offer up the desires of my heart to God. I had scarcely done so, when immediately I was seized upon by some power which entirely overcame me, and had such an astonishing influence over me as to bind my tongue so that I could not speak. Thick darkness gathered around me, and it seemed to me for a time as if I were doomed to sudden destruction. But, exerting all my powers to call upon God to deliver me out of the power of this enemy which had seized upon me, and at the very moment when I was ready to sink into despair and abandon myself to destruction—not to an imaginary ruin, but to the power of some actual being from the unseen world, who had such marvelous power as I had never before felt in any being—just at this moment of great alarm, I saw a pillar of light exactly over my head, above the brightness of the sun, which descended gradually until it fell upon me. It no sooner appeared than I found myself delivered from the enemy which held me bound. When the light rested upon me I saw two Personages, whose brightness and glory defy all description, standing above me in the air. One of them spake unto me, calling me by name and said, pointing to the other—*This is My Beloved Son. Hear Him! My object in going to inquire of the Lord was to know which of all the sects was right, that I might know which to join. No sooner, therefore, did I get possession of myself, so as to be able to speak, than I asked the Personages who stood above me in the light, which of all the sects was right (for at this time it had never entered into my heart that all were wrong)—and which I should join. I was answered that I must join none of them, for they were all wrong; and the Personage who addressed me said that all their creeds were an abomination in his sight; that those professors were all corrupt; that: “they draw near to me with their lips, but their hearts are far from me, they teach for doctrines the commandments of men, having a form of godliness, but they deny the power thereof." He again forbade me to join with any of them; and many other things did he say unto me, which I cannot write at this time. When I came to myself again, I found myself lying on my back, looking up into heaven. When the light had departed, I had no strength; but soon recovering in some degree, I went home. And as I leaned up to the fireplace, mother inquired what the matter was. I replied, “Never mind, all is well—I am well enough off.” I then said to my mother, “I have learned for myself that Presbyterianism is not true.” It seems as though the adversary was aware, at a very early period of my life, that I was destined to prove a disturber and an annoyer of his kingdom; else why should the powers of darkness combine against me? Why the opposition and persecution that arose against me, almost in my infancy?',
    },
    {
      reference: "Doctrine and Covenants 1:30",
      text: "And also those to whom these commandments were given, might have power to lay the foundation of this church, and to bring it forth out of obscurity and out of darkness, the only true and living church upon the face of the whole earth, with which I, the Lord, am well pleased, speaking unto the church collectively and not individually—",
    },
    {
      reference: "Doctrine and Covenants 1:37–38",
      text: "Search these commandments, for they are true and faithful, and the prophecies and promises which are in them shall all be fulfilled. What I the Lord have spoken, I have spoken, and I excuse not myself; and though the heavens and the earth pass away, my word shall not pass away, but shall all be fulfilled, whether by mine own voice or by the voice of my servants, it is the same.",
    },
    {
      reference: "Doctrine and Covenants 6:36",
      text: "Look unto me in every thought; doubt not, fear not.",
    },
    {
      reference: "Doctrine and Covenants 8:2–3",
      text: "Yea, behold, I will tell you in your mind and in your heart, by the Holy Ghost, which shall come upon you and which shall dwell in your heart. Now, behold, this is the spirit of revelation; behold, this is the spirit by which Moses brought the children of Israel through the Red Sea on dry ground.",
    },
    {
      reference: "Doctrine and Covenants 13:1",
      text: "Upon you my fellow servants, in the name of Messiah I confer the Priesthood of Aaron, which holds the keys of the ministering of angels, and of the gospel of repentance, and of baptism by immersion for the remission of sins; and this shall never be taken again from the earth, until the sons of Levi do offer again an offering unto the Lord in righteousness.",
    },
    {
      reference: "Doctrine and Covenants 18:10–11",
      text: "Remember the worth of souls is great in the sight of God; For, behold, the Lord your Redeemer suffered death in the flesh; wherefore he suffered the pain of all men, that all men might repent and come unto him.",
    },
    {
      reference: "Doctrine and Covenants 18:15–16",
      text: "And if it so be that you should labor all your days in crying repentance unto this people, and bring, save it be one soul unto me, how great shall be your joy with him in the kingdom of my Father! And now, if your joy will be great with one soul that you have brought unto me into the kingdom of my Father, how great will be your joy if you should bring many souls unto me!",
    },
    {
      reference: "Doctrine and Covenants 19:16–19",
      text: "For behold, I, God, have suffered these things for all, that they might not suffer if they would repent; But if they would not repent they must suffer even as I; Which suffering caused myself, even God, the greatest of all, to tremble because of pain, and to bleed at every pore, and to suffer both body and spirit—and would that I might not drink the bitter cup, and shrink—",
    },
    {
      reference: "Doctrine and Covenants 21:4–6",
      text: "Wherefore, meaning the church, thou shalt give heed unto all his words and commandments which he shall give unto you as he receiveth them, walking in all holiness before me; For his word ye shall receive, as if from mine own mouth, in all patience and faith.",
    },
    {
      reference: "Doctrine and Covenants 29:10–11",
      text: "For the hour is nigh, and that which was spoken by mine apostles must be fulfilled; for as they spoke so shall it come to pass; For I will reveal myself from heaven with power and great glory, with all the hosts thereof, and dwell in righteousness with men on earth a thousand years, and the wicked shall not stand.",
    },
    {
      reference: "Doctrine and Covenants 49:15–17",
      text: "And again, verily I say unto you, that whoso forbiddeth to marry is not ordained of God, for marriage is ordained of God unto man. Wherefore, it is lawful that he should have one wife, and they twain shall be one flesh, and all this that the earth might answer the end of its creation;",
    },
    {
      reference: "Doctrine and Covenants 58:42–43",
      text: "Behold, he who has repented of his sins, the same is forgiven, and I, the Lord, remember them no more. By this ye may know if a man repenteth of his sins—behold, he will confess them and forsake them.",
    },
    {
      reference: "Doctrine and Covenants 64:9–11",
      text: "Wherefore, I say unto you, that ye ought to forgive one another; for he that forgiveth not his brother his trespasses standeth condemned before the Lord; for there remaineth in him the greater sin. I, the Lord, will forgive whom I will forgive, but of you it is required to forgive all men.",
    },
    {
      reference: "Doctrine and Covenants 76:22–24",
      text: "And now, after the many testimonies which have been given of him, this is the testimony, last of all, which we give of him: That he lives! For we saw him, even on the right hand of God; and we heard the voice bearing record that he is the Only Begotten of the Father—",
    },
    {
      reference: "Doctrine and Covenants 82:10",
      text: "I, the Lord, am bound when ye do what I say; but when ye do not what I say, ye have no promise.",
    },
    {
      reference: "Doctrine and Covenants 84:20–22",
      text: "Therefore, in the ordinances thereof, the power of godliness is manifest. And without the ordinances thereof, and the authority of the priesthood, the power of godliness is not manifest unto men in the flesh; For without this no man can see the face of God, even the Father, and live.",
    },
    {
      reference: "Doctrine and Covenants 88:118",
      text: "And as all have not faith, seek ye diligently and teach one another words of wisdom; yea, seek ye out of the best books words of wisdom; seek learning, even by study and also by faith.",
    },
    {
      reference: "Doctrine and Covenants 89:18–21",
      text: "And all saints who remember to keep and do these sayings, walking in obedience to the commandments, shall receive health in their navel and marrow to their bones; And shall find wisdom and great treasures of knowledge, even hidden treasures;",
    },
    {
      reference: "Doctrine and Covenants 107:8",
      text: "The Melchizedek Priesthood holds the right of presidency, and has power and authority over all the offices in the church in all ages of the world, to administer in spiritual things.",
    },
    {
      reference: "Doctrine and Covenants 121:36, 41–42",
      text: "That the rights of the priesthood are inseparably connected with the powers of heaven, and that the powers of heaven cannot be controlled nor handled only upon the principles of righteousness. No power or influence can or ought to be maintained by virtue of the priesthood, only by persuasion, by long-suffering, by gentleness and meekness, and by love unfeigned;",
    },
    {
      reference: "Doctrine and Covenants 130:22–23",
      text: "The Father has a body of flesh and bones as tangible as man's; the Son also; but the Holy Ghost has not a body of flesh and bones, but is a personage of Spirit. Were it not so, the Holy Ghost could not dwell in us.",
    },
    {
      reference: "Doctrine and Covenants 131:1–4",
      text: "In the celestial glory there are three heavens or degrees; And in order to obtain the highest, a man must enter into this order of the priesthood [meaning the new and everlasting covenant of marriage]; And if he does not, he cannot obtain it.",
    },
    {
      reference: "Doctrine and Covenants 135:3",
      text: "Joseph Smith, the Prophet and Seer of the Lord, has done more, save Jesus only, for the salvation of men in this world, than any other man that ever lived in it. In the short space of twenty years, he has brought forth the Book of Mormon, which he translated by the gift and power of God, and has been the means of publishing it on two continents;",
    },
  ],
});

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

const gameState = ref("setup");
const teams = ref([]);
const currentTeam = ref("");
const guessingTeam = ref();
const selectedCategory = ref("");
const currentScripture = ref(null);
const availableScriptures = reactive({ ...scriptures });
const scores = reactive({});
const incorrectGuesses = ref([]);
const showCongratulations = ref(false);
const correctAnswer = ref(null);

// LocalStorage functionality
const STORAGE_KEY = "doctrinal-mastery-current-game";

const addTeam = () => {
  if (currentTeam.value && !teams.value.includes(currentTeam.value)) {
    teams.value.push(currentTeam.value);
    scores[currentTeam.value] = 0;
    currentTeam.value = "";
  }
};

const removeTeam = (team) => {
  teams.value = teams.value.filter((t) => t !== team);
  delete scores[team];
};

const startGame = () => {
  if (teams.value.length > 1) {
    gameState.value = "play";
    guessingTeam.value = teams.value[0];
    console.log("Guessing Team", guessingTeam.value, teams.value);
  }
};

const selectColumn = (column) => {
  selectedCategory.value = column;
  const randomIndex = Math.floor(
    Math.random() * availableScriptures[column].length
  );
  currentScripture.value = availableScriptures[column][randomIndex];
  incorrectGuesses.value = [];
};

const goBackToCategories = () => {
  selectedCategory.value = "";
  currentScripture.value = null;
  incorrectGuesses.value = [];
};

const guessScripture = (reference) => {
  if (reference === currentScripture.value.reference) {
    scores[guessingTeam.value]++;
    correctAnswer.value = {
      team: guessingTeam.value,
      reference: reference,
      points: scores[guessingTeam.value],
    };

    availableScriptures[selectedCategory.value] = availableScriptures[
      selectedCategory.value
    ].filter((s) => s.reference !== reference);

    // Show congratulations screen
    showCongratulations.value = true;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      showCongratulations.value = false;

      // Check if game is complete
      const totalRemaining = Object.values(availableScriptures).reduce(
        (sum, arr) => sum + arr.length,
        0
      );
      if (totalRemaining === 0) {
        gameState.value = "victory";
        // Clear saved game when game is complete
        localStorage.removeItem(STORAGE_KEY);
      } else {
        selectedCategory.value = "";
        currentScripture.value = null;
      }
    }, 3000);

    incorrectGuesses.value = [];
  } else {
    incorrectGuesses.value.push(reference);
  }
};

const onTeamSwitchClick = (team) => {
  guessingTeam.value = team;
};

const resetGame = () => {
  // Clear saved game
  localStorage.removeItem(STORAGE_KEY);

  gameState.value = "setup";
  teams.value = [];
  currentTeam.value = "";
  selectedCategory.value = "";
  currentScripture.value = null;
  incorrectGuesses.value = [];
  showCongratulations.value = false;
  correctAnswer.value = null;

  // Reset available scriptures
  Object.keys(scriptures).forEach((category) => {
    availableScriptures[category] = [...scriptures[category]];
  });

  // Reset scores
  Object.keys(scores).forEach((team) => {
    delete scores[team];
  });
};

const closeCongratulations = () => {
  showCongratulations.value = false;

  // Check if game is complete
  const totalRemaining = Object.values(availableScriptures).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  if (totalRemaining === 0) {
    gameState.value = "victory";
    // Clear saved game when game is complete
    localStorage.removeItem(STORAGE_KEY);
  } else {
    selectedCategory.value = "";
    currentScripture.value = null;
  }
};

// Auto-save function
const saveCurrentGame = () => {
  if (gameState.value === "play" && teams.value.length > 0) {
    const gameData = {
      gameState: gameState.value,
      teams: teams.value,
      guessingTeam: guessingTeam.value,
      selectedCategory: selectedCategory.value,
      currentScripture: currentScripture.value,
      availableScriptures: { ...availableScriptures },
      scores: { ...scores },
      incorrectGuesses: incorrectGuesses.value,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  }
};

// Load saved game on startup
const loadSavedGame = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const gameData = JSON.parse(saved);

      gameState.value = gameData.gameState;
      teams.value = [...gameData.teams];
      guessingTeam.value = gameData.guessingTeam;
      selectedCategory.value = gameData.selectedCategory || "";
      currentScripture.value = gameData.currentScripture;

      // Clear and repopulate availableScriptures
      Object.keys(availableScriptures).forEach((key) => {
        availableScriptures[key] = [...gameData.availableScriptures[key]];
      });

      // Clear and repopulate scores
      Object.keys(scores).forEach((key) => delete scores[key]);
      Object.assign(scores, gameData.scores);

      incorrectGuesses.value = [...(gameData.incorrectGuesses || [])];
    } catch (error) {
      console.error("Error loading saved game:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
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
  saveCurrentGame,
  {
    deep: true,
  }
);

// Load saved game on mount
onMounted(() => {
  loadSavedGame();
});
</script>
