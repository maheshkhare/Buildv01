<template>
  <div class="flex-container">

    <!-- Fixed Image Container -->
    <div class="image-wrapper" v-if="image">
      <img :src="getImagePath(image)" :alt="'Activity illustration'" />
    </div>

    <!-- Grid and Button Section -->
    <div class="flex mt-2" v-show="showtop" style="flex-direction: column;">
      <div class="grid-container">
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


    </div>

  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'

export default {
  name: 'SectionSem1',
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
  grid-template-columns: repeat(6, minmax(140px, 1fr)); /* Fixed 6 columns */
  gap: 16px 24px;
  width: 100%;
  max-width: 1200px; /* Increased max width */
  background: rgb(43, 136, 207); 
  padding: 16px 24px;
  border-radius: 16px;
  box-sizing: border-box;
  margin: 0 auto; /* Center the grid */
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
  min-width: 140px; /* Ensure minimum width */
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
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(4, minmax(140px, 1fr));
    max-width: 900px;
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
    max-width: 600px;
    gap: 12px 16px;
  }
  
  .grid-item {
    font-size: 16px;
    padding: 12px 8px;
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    max-width: 400px;
    gap: 8px 12px;
  }
}
</style>