<template>
  <div class="flex-container">
    <div class="flex mt-2" v-show="showtop">
      <div class="grid-container" style="margin-left: 65px;">
        <div 
          v-for="(word, index) in availableWords" 
          :key="index" 
          class="grid-item"
          :class="{
            'disabled-word': placedWords.includes(word),
            'selected-word': selectedWord === word
          }"
          @click="handleWordClick(word)"
          tabindex="0"
          role="button"
          :aria-pressed="selectedWord === word"
        >
          {{ word }}
        </div>
      </div>
      <div class="float-right mb-3">
        <div class="txtclsDiv" v-on:click="handleSelection()" style="cursor: pointer;">
          <span class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-4 px-5 border border-blue-500 hover:border-transparent rounded mt-2">
            Start New Game
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'

export default {
  name: ' SectionSem1',
  components: { SVGShape, SVGImageButton },

  props: {
    acceptInput: {
      type: Boolean,
      required: true
    },
    showWords: {
      type: Array,
      required: true
    },
    isShowing_info: {
      type: Boolean,
      required: true
    },
    showtop: {
      type: Boolean,
      required: true
    }
  },
  
  data: () => ({
    clicked: ``,
    availableWords: [],
    placedWords: [],
    selectedWord: null
  }),

  watch: {
    showWords: {
      immediate: true,
      handler(newVal) {
        this.availableWords = [...newVal];
        this.placedWords = [];
        this.selectedWord = null;
      }
    }
  },

  methods: {
    handleSelection() {
      this.$emit('OnNewGame_Click');
    },

    textSelection() {
      this.$emit('Ontext_Click');
    },

    handleWordClick(word) {
      if (this.placedWords.includes(word)) return;
      
      if (this.selectedWord === word) {
        this.selectedWord = null;
      } else {
        this.selectedWord = word;
      }
      this.$emit('OnWord_Click', word);
    },

    markWordAsPlaced(word) {
      if (!this.placedWords.includes(word)) {
        this.placedWords.push(word);
        if (this.selectedWord === word) {
          this.selectedWord = null;
        }
      }
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px 24px;
  max-width: 750px;
  background: rgb(43, 136, 207); 
  padding: 16px 24px;
  border-radius: 16px;
  box-sizing: border-box;
}

.grid-item {
  background: #FDA603;
  color: black;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  padding: 16px 12px;
  border-radius: 12px;
  user-select: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

.grid-item:hover,
.grid-item:focus {
  background-color: #f7b733;
  outline: none;
  transform: scale(1.05);
}

.disabled-word {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
  transform: none !important;
}

.selected-word {
  background: #4CAF50;
  color: white;
  transform: scale(1.05);
}

.txtclsDiv {
  height: 60px;
  margin-left: 10px;
  margin-top: 30px;
  padding-left: 5px;
  margin-right: 5px;
  font-weight: bold;
  width: 270px;
}

.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>