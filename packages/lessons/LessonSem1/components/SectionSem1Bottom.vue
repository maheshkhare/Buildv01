<template>
  <div class="flex-container"> 
    <div v-show="shouldShowBottom" class="responsive-grid">
      <div class="columns-wrapper" :class="getGridClass">
        <div 
          v-for="(column, colIndex) in internalColumns" 
          :key="colIndex" 
          v-show="columnVisibility[colIndex]"
          class="column-wrapper"
        >
          <div class="column-title" :style="getTitleStyle(colIndex)">
            {{ columnTitles[colIndex] }}
          </div>
          <div class="column-container" :style="getColumnContainerStyle(colIndex)">
            <SVGImageButton 
              v-for="(item, itemIndex) in getDisplayItems(column, colIndex)"
              :key="`${colIndex}-${itemIndex}`"
              :identifier="itemIndex"
              :disable-correct="colIndex > 0"
              :accept-input="canModifyAnswers"
              class="svg-button-wrapper"
            >
              <div
                class="column-item"
                :class="getColumnItemClass(colIndex, item, itemIndex)"
                @click="handleColumnClick(colIndex, itemIndex)"
              >
                {{ item.name }}
              </div> 
            </SVGImageButton> 
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <!-- Previous Button -->
        <svg
          v-if="canGoToPrevious"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-330 50 70 90"
          class="nav-button prev-button"
          filter="drop-shadow(0 0 4px gray)"
          transform="rotate(180)"
          @click="goToPrevious"
        >
          <path
            d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
            stroke="#000"
            stroke-width="2"
            fill="#0369a1"
          />
        </svg>

        <!-- Next Button -->
        <svg
          v-if="canGoToNext"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-330 50 70 90"
          class="nav-button next-button"
          filter="drop-shadow(0 0 4px gray)"
          @click="goToNext"
        >
          <path
            d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
            stroke="#000"
            stroke-width="2"
            fill="#0369a1"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGImageButton from 'Components/SVGImageButton'

export default {
  name: 'SectionSem1Bottom',
  components: { SVGImageButton },
  
  props: {
    // 🎯 MUCH SIMPLER - Only 3 props instead of 9!
    lessonBase: {
      type: Object,
      required: true
    },
    currentQuestion: {
      type: Object,
      default: null
    },
    lessonConfig: {
      type: Object,
      default: () => ({
        isSingleColumnMode: false,
        isEmuCsiLesson: false
      })
    }
  },
  
  data() {
    return {
      // 🧠 Component now owns its state
      currentQuestionIndex: 0,
      questionStates: [], // Store state for each question
      selectedWord: null,
      internalColumns: [],
      columnTitles: [],
      columnVisibility: [],
      availableWords: [],
      placedWords: [],
      canModifyAnswers: true,
      dynamicRowCounts: [],
      minRows: 3,
      clicked: false
    }
  },
  
  computed: {
    shouldShowBottom() {
      return this.currentQuestion && this.internalColumns.length > 0;
    },
    
    canGoToPrevious() {
      return this.currentQuestionIndex > 0;
    },
    
    canGoToNext() {
      return this.isQuestionComplete || this.lessonConfig.isSingleColumnMode;
    },
    
    isQuestionComplete() {
      if (!this.currentQuestion) return false;
      
      if (this.lessonConfig.isSingleColumnMode) {
        const firstCategory = this.currentQuestion.categories?.[0];
        if (!firstCategory) return false;
        const correctWords = this.internalColumns?.filter(item => 
          item.name && firstCategory.words.includes(item.name)
        ).length || 0;
        return correctWords === firstCategory.words.length;
      } else {
        return this.currentQuestion.categories?.every((category, index) => {
          if (index >= this.internalColumns.length) return false;
          const correctWords = this.internalColumns[index].filter(item => 
            item.name && category.words.includes(item.name)
          ).length;
          return correctWords === category.words.length;
        }) || false;
      }
    },
    
    getGridClass() {
      const visibleColumns = this.columnVisibility.filter(Boolean).length;
      
      if (visibleColumns === 1) return 'grid-1-col';
      if (visibleColumns === 2) return 'grid-2-col';
      if (visibleColumns === 3) return 'grid-3-col';
      if (visibleColumns >= 4) return 'grid-4-col';
      
      return 'grid-1-col';
    }
  },
  
  watch: {
    currentQuestion: {
      handler(newQuestion) {
        if (newQuestion) {
          this.loadQuestionData(newQuestion);
        }
      },
      immediate: true
    },
    
    internalColumns: {
      handler() {
        this.initializeDynamicRowCounts();
      },
      deep: true
    }
  },
  
  mounted() {
    this.currentQuestionIndex = this.lessonBase?.currentQuestionIndex || 0;
  },
  
  methods: {
    // 🏗️ QUESTION MANAGEMENT - Now owned by this component
    loadQuestionData(questionSet) {
      this.resetQuestionState();
      
      if (!questionSet || !questionSet.categories) {
        console.error('Invalid question set:', questionSet);
        return;
      }

      // Setup column structure
      this.columnTitles = questionSet.categories.map(cat => 
        cat.displayName || cat.name || ''
      );
      this.columnVisibility = questionSet.categories.map(() => !this.lessonConfig.isSingleColumnMode);
      
      // Collect all words
      this.availableWords = [];
      questionSet.categories.forEach(category => {
        if (category?.words) {
          this.availableWords = [...this.availableWords, ...category.words];
        }
      });
      
      // Shuffle words using lessonBase
      this.availableWords = this.lessonBase.shuffleArray(this.availableWords);
      this.placedWords = [];
      this.selectedWord = null;
      
      // Create columns
      const maxWords = this.lessonConfig.isSingleColumnMode
        ? questionSet.categories[0].words.length 
        : Math.max(...questionSet.categories.map(cat => cat.words.length));
      const columnLength = Math.max(8, Math.ceil(maxWords * 1.2));
      
      this.internalColumns = questionSet.categories.map(() => 
        this.createEmptyColumn(columnLength)
      );
      
      if (this.lessonConfig.isSingleColumnMode) {
        this.columnTitles = [this.columnTitles];
        this.columnVisibility = [true];
        this.internalColumns = [this.internalColumns];
      }
      
      // Restore previous state if exists
      this.loadQuestionState();
      
      this.initializeDynamicRowCounts();
      
      // Notify parent that question is loaded
      this.$emit('question-loaded', {
        questionIndex: this.currentQuestionIndex,
        totalWords: this.availableWords.length
      });
    },
    
    resetQuestionState() {
      this.internalColumns = [];
      this.selectedWord = null;
      this.canModifyAnswers = true;
    },
    
    createEmptyColumn(count) {
      return Array(count).fill().map((_, i) => ({
        shape: 'square',
        index: i,
        size: 'xl',
        width: 'wide',
        height: 'normal',
        color: 'white',
        name: '',
        state: 'base'
      }));
    },
    
    // 🎯 WORD INTERACTION - Now handled internally
    handleColumnClick(colIndex, itemIndex) {
      if (!this.canModifyAnswers) return;
      
      const column = this.internalColumns[colIndex];
      const item = column[itemIndex];
      
      if (!item.name && this.selectedWord) {
        // Place word
        item.name = this.selectedWord;
        this.placedWords.push(this.selectedWord);
        const wordIndex = this.availableWords.indexOf(this.selectedWord);
        if (wordIndex > -1) this.availableWords.splice(wordIndex, 1);
        this.selectedWord = null;
        this.updateAvailableWords();
      } else if (item.name && !this.selectedWord) {
        // Remove word
        const returnedWord = item.name;
        item.name = '';
        const placedIndex = this.placedWords.indexOf(returnedWord);
        if (placedIndex > -1) this.placedWords.splice(placedIndex, 1);
        this.availableWords.push(returnedWord);
        this.updateAvailableWords();
      }
      
      this.updateRowCount(colIndex);
      this.saveQuestionState();
      
      // Notify parent about word placement changes
      this.$emit('words-updated', {
        availableWords: this.availableWords,
        placedWords: this.placedWords,
        selectedWord: this.selectedWord,
        isComplete: this.isQuestionComplete
      });
    },
    
    updateAvailableWords() {
      const allWordsPlaced = this.availableWords.length === 0;
      this.canModifyAnswers = !allWordsPlaced;
    },
    
    // 📚 STATE MANAGEMENT - Component owns question states
    saveQuestionState() {
      this.questionStates[this.currentQuestionIndex] = {
        columns: JSON.parse(JSON.stringify(this.internalColumns)),
        columnTitles: [...this.columnTitles],
        columnVisibility: [...this.columnVisibility],
        placedWords: [...this.placedWords],
        availableWords: [...this.availableWords],
        selectedWord: this.selectedWord,
        canModifyAnswers: this.canModifyAnswers
      };
    },
    
    loadQuestionState() {
      const state = this.questionStates[this.currentQuestionIndex];
      if (state) {
        this.internalColumns = JSON.parse(JSON.stringify(state.columns));
        this.columnTitles = [...state.columnTitles];
        this.columnVisibility = [...state.columnVisibility];
        this.placedWords = [...state.placedWords];
        this.availableWords = [...state.availableWords];
        this.selectedWord = state.selectedWord;
        this.canModifyAnswers = state.canModifyAnswers;
      }
    },
    
    // 🚀 NAVIGATION - Now owned by this component
    goToPrevious() {
      if (this.currentQuestionIndex > 0) {
        this.saveQuestionState();
        this.currentQuestionIndex--;
        this.loadQuestionState();
        
        this.$emit('navigation-changed', {
          direction: 'previous',
          questionIndex: this.currentQuestionIndex,
          canModifyAnswers: this.canModifyAnswers
        });
      }
    },
    
    goToNext() {
      // Validate current question before moving
      const isCorrect = this.validateCurrentQuestion();
      
      this.saveQuestionState();
      
      if (this.currentQuestionIndex < this.lessonBase.Total_Questions - 1) {
        this.currentQuestionIndex++;
        
        this.$emit('navigation-changed', {
          direction: 'next',
          questionIndex: this.currentQuestionIndex,
          wasCorrect: isCorrect,
          canModifyAnswers: this.canModifyAnswers
        });
      } else {
        // Last question completed
        this.$emit('lesson-completed', {
          wasCorrect: isCorrect,
          finalQuestionIndex: this.currentQuestionIndex
        });
      }
    },
    
    validateCurrentQuestion() {
      const isCorrect = this.isQuestionComplete;
      
      if (isCorrect) {
        this.lessonBase.updateProgress(true);
      } else {
        this.lessonBase.updateProgress(false);
      }
      
      return isCorrect;
    },
    
    // 🎨 UI HELPERS - Keep existing functionality
    initializeDynamicRowCounts() {
      this.dynamicRowCounts = this.internalColumns.map((column, index) => {
        const filledItems = column.filter(item => item.name && item.name.trim() !== '').length;
        return Math.max(this.minRows, filledItems + 1);
      });
    },
    
    getDisplayItems(column, colIndex) {
      const currentRowCount = this.dynamicRowCounts[colIndex] || this.minRows;
      const displayItems = [];
      
      for (let i = 0; i < currentRowCount; i++) {
        if (i < column.length && column[i]) {
          displayItems.push(column[i]);
        } else {
          displayItems.push({
            name: '',
            state: 'empty',
            isEmpty: true
          });
        }
      }
      
      return displayItems;
    },
    
    updateRowCount(colIndex) {
      if (!this.internalColumns[colIndex]) return;
      
      const column = this.internalColumns[colIndex];
      const filledItems = column.filter(item => item.name && item.name.trim() !== '').length;
      const currentRowCount = this.dynamicRowCounts[colIndex] || this.minRows;
      
      if (filledItems >= currentRowCount) {
        this.$set(this.dynamicRowCounts, colIndex, filledItems + 1);
      } else if (filledItems < currentRowCount - 2 && currentRowCount > this.minRows) {
        this.$set(this.dynamicRowCounts, colIndex, Math.max(this.minRows, filledItems + 1));
      }
    },
    
    getTitleStyle(colIndex) {
      return {
        textAlign: 'center',
        border: '3px solid #2cb9fa',
        display: 'inline-block',
        backgroundColor: '#2cb9fa',
        color: 'white',
        fontWeight: 'bold'
      };
    },
    
    getColumnContainerStyle(colIndex) {
      return {
        marginTop: '15px'
      };
    },
    
    getColumnItemClass(colIndex, item, itemIndex) {
      const baseClasses = {
        'cursor-not-allowed opacity-75': !this.canModifyAnswers,
        clicked: this.clicked
      };
      
      if (item.isEmpty) {
        return {
          ...baseClasses,
          'empty-slot': true,
          'bg-white': true,
          'border-gray-300': true
        };
      }
      
      const stateClasses = {
        selected: 'border-blue-400 shadow-md',
        correct: colIndex === 0 ? 'bg-blue-200 border-blue-400 shadow-md' : 'bg-green-200 border-green-400 shadow-md',
        missed: 'bg-yellow-400 border-blue-600 shadow-md',
        incorrect: 'bg-red-400 border-red-600 shadow-md',
        unselected: 'bg-white',
        readonly: 'cursor-not-allowed opacity-75'
      };
      
      return {
        ...baseClasses,
        ...(item.state ? { [stateClasses[item.state]]: true } : { 'bg-white': true })
      };
    },
    
    // 🔗 PUBLIC METHODS - For parent to call
    selectWord(word) {
      this.selectedWord = word;
    },
    
    getCurrentState() {
      return {
        questionIndex: this.currentQuestionIndex,
        availableWords: this.availableWords,
        placedWords: this.placedWords,
        selectedWord: this.selectedWord,
        isComplete: this.isQuestionComplete,
        canModifyAnswers: this.canModifyAnswers
      };
    }
  }
}
</script>



<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 100%;
  padding: 0 10px;
}

.responsive-grid {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.columns-wrapper {
  display: grid;
  gap: 20px;
  margin: 20px auto;
  justify-content: center;
  align-items: start;
}

/* Dynamic Grid Classes Based on Column Count */
.grid-1-col {
  grid-template-columns: 1fr;
  max-width: 280px;
}

.grid-2-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.grid-3-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.grid-4-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
  justify-self: center;
}

.column-title {
  text-align: center;
  border: 3px solid #2cb9fa;
  display: inline-block;
  width: 100%;
  max-width: 250px;
  min-height: 35px;
  background-color: #2cb9fa;
  color: white;
  font-weight: bold;
  padding: 8px 10px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.2;
}

.column-container {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.svg-button-wrapper {
  margin-bottom: 5px;
  padding: 0;
  width: 100%;
  max-width: 250px;
}

.column-item {
  text-align: center;
  width: 100%;
  height: 35px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.column-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Empty slot styling - looks like regular empty boxes */
.column-item.empty-slot {
  background-color: white;
  border: 1px solid #e5e7eb;
}

.column-item.empty-slot:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin: 30px 0;
}

.nav-button {
  height: 50px;
  width: 60px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.nav-button:hover {
  opacity: 0.8;
}

/* Tablet Adjustments */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 800px;
  }
  
  .grid-4-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 800px;
  }
}

/* Large Desktop Adjustments */
@media screen and (min-width: 1025px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 850px;
  }
  
  .grid-4-col {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1100px;
  }
  
  .column-wrapper {
    min-width: 260px;
  }
  
  .column-title {
    max-width: 260px;
    font-size: 15px;
  }
  
  .svg-button-wrapper {
    max-width: 260px;
  }
  
  .column-item {
    font-size: 17px;
    height: 38px;
  }
}

/* Mobile Responsive */
@media screen and (max-width: 768px) {
  .grid-1-col,
  .grid-2-col,
  .grid-3-col,
  .grid-4-col {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
  
  .column-wrapper {
    min-width: 100%;
  }
  
  .column-title {
    font-size: 13px;
    max-width: 280px;
  }
  
  .column-item {
    font-size: 14px;
    height: 32px;
  }
  
  .svg-button-wrapper {
    max-width: 280px;
  }
  
  .navigation-buttons {
    gap: 20px;
    margin: 20px 0;
  }
  
  .nav-button {
    height: 40px;
    width: 50px;
  }
}
</style>
