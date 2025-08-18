<template>
  <div class="word-grid-activity">

    <div class="text-center font-bold text-lg"> Write below highlighted  word backwards on the lines provided. Some are real words and some are nonsense. Decide whether the reversed letters form a real word. If they do, Click YES. If they do not, Click NO. Use a dictionary if you are unsure. 
      
    </div>
    <!-- Question Word -->
    <div class="question-word text-2xl font-bold my-4 text-center">{{ questionWord }}</div>

    <!-- Letter Grid -->
    <div class="grid grid-cols-3 gap-2 justify-center max-w-xs mx-auto my-4">
      <button
        v-for="(letter, i) in gridLetters"
        :key="i"
        class="letter-tile border p-4 rounded text-xl font-mono min-w-[50px] min-h-[48px] hover:bg-blue-100"
        :disabled="isSelected(i) || optionWord.length >= wordLength"
        @click="selectLetter(i)"
        :style="{ opacity: isSelected(i) ? 0.5 : 1 }"
        :aria-pressed="isSelected(i)"
        :aria-label="`Select letter ${letter}`"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Option word (slots) + Back button -->
    <div class="option-container flex items-center justify-center space-x-2 my-6">
      <div class="option-word flex space-x-2">
        <div
          v-for="i in wordLength"
          :key="i"
          class="option-letter border-b-2 w-10 h-12 flex items-center justify-center"
          :aria-label="optionWord[i-1] || 'empty slot'"
        >
          {{ optionWord[i-1] || '' }}
        </div>
      </div>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <!-- Back icon button = inline with option letters -->
      <button
        type="button"
        @click="removeLastLetter"
        :disabled="optionWord.length === 0"
        class="ml-2 p-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Remove last letter"
      >
        <span class="material-icons" style="font-size: 28px; user-select: none;">arrow_back</span>
      </button>
    </div>

    <!-- Yes / No buttons shown only when all letters picked -->
    <div v-if="optionWord.length === wordLength" class="flex justify-center space-x-6 mb-6">
      <button
        type="button"
        class="yes-btn bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-2 rounded"
        @click="submitAnswer('yes')"
      >
        Yes
      </button>
      <button
        type="button"
        class="no-btn bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-2 rounded"
        @click="submitAnswer('no')"
      >
        No
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WordGridActivity",
  props: {
    questionWord: {
      type: String,
      required: true,
    },
    gridLetters: {
      type: Array,
      required: true,
      validator: (arr) => Array.isArray(arr) && arr.length === 9,
    },
  },
  data() {
    return {
      optionWord: [],
      selectedIndices: [],
    };
  },
  computed: {
    // Dynamically use the length of questionWord to control max letters
    wordLength() {
      return this.questionWord.length || 3; 
    },
  },
  methods: {
    isSelected(index) {
      return this.selectedIndices.includes(index);
    },
    selectLetter(index) {
      if (this.optionWord.length >= this.wordLength) return;
      if (this.isSelected(index)) return;

      this.optionWord.push(this.gridLetters[index]);
      this.selectedIndices.push(index);
    },
    removeLastLetter() {
      if (this.optionWord.length === 0) return;
      this.optionWord.pop();
      this.selectedIndices.pop();
    },
    submitAnswer(response) {
      this.$emit("answered", {
        word: this.optionWord.join(""),
        response,
      });
      this.optionWord = [];
      this.selectedIndices = [];
    },
  },
  watch: {
    // Reset selections when question or grid changes
    // questionWord() {
    //   this.optionWord = [];
    //   this.selectedIndices = [];
    // },
    gridLetters() {
      this.optionWord = [];
      this.selectedIndices = [];
    },
  },
};
</script>

<style scoped>
/* Existing styles first */
.word-grid-activity {
  max-width: 400px;
  margin: 0 auto;
}

.letter-tile:disabled {
  background: #f3f4f6;
  color: #b0b0b0;
  cursor: not-allowed;
}

.option-letter {
  width: 3rem;
  height: 3.25rem;
  font-family: monospace;
  font-size: 1.75rem;
}
</style>

<!-- Add this as global styles -->
<style>
/* Global styles to force counter black */
[class*="question"]:contains("of"),
*:contains("Question"):contains("of") {
  color: #000000 !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

/* Target by position (if counter is always in specific location) */
.word-grid-activity ~ * {
  color: #000000 !important;
  opacity: 1 !important;
}
</style>


