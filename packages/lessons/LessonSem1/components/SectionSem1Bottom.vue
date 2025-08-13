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
    },
    selectedWord: {
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      // 🎯 FOCUSED DATA - Only column & navigation logic
      allQuestionSets: [],
      currentQuestionIndex: 0,
      questionStates: [],
      
      // Column management
      internalColumns: [],
      columnTitles: [],
      columnVisibility: [],
      dynamicRowCounts: [],
      minRows: 3,
      
      // Word placement tracking (not management)
      currentSelectedWord: null,
      
      // State management
      canModifyAnswers: true,
      isInitialized: false,
       isViewingPrevious: false,
      // Component state
      clicked: false
    }
  },
  
  computed: {
     shouldShowBottom() {
    return this.isInitialized && this.internalColumns.length > 0;
  },
    
    canGoToPrevious() {
    return this.currentQuestionIndex > 0 && this.allQuestionSets.length > 1;
  },
    
  canGoToNext() {
    return (
      this.currentQuestionIndex < this.allQuestionSets.length - 1 || 
      this.isQuestionComplete
    );
  },
    
    isQuestionComplete() {
      // Use current question from allQuestionSets instead of prop
      const currentQ = this.allQuestionSets[this.currentQuestionIndex];
      if (!currentQ || !currentQ.categories) return false;
      
      if (this.lessonConfig.isSingleColumnMode) {
        const firstCategory = currentQ.categories[0];
        if (!firstCategory) return false;
        
        // Check first column only
        const correctWords = this.internalColumns[0]?.filter(item => 
          item.name && firstCategory.words.includes(item.name)
        ).length || 0;
        
        return correctWords === firstCategory.words.length;
      } else {
        // Check all columns
        return currentQ.categories.every((category, index) => {
          if (index >= this.internalColumns.length) return false;
          
          const correctWords = this.internalColumns[index].filter(item => 
            item.name && category.words.includes(item.name)
          ).length;
          
          return correctWords === category.words.length;
        });
      }
    },
    
    getGridClass() {
      const visibleColumns = this.columnVisibility.filter(Boolean).length;
      
      if (visibleColumns === 1) return 'grid-1-col';
      if (visibleColumns === 2) return 'grid-2-col';
      if (visibleColumns === 3) return 'grid-3-col';
      if (visibleColumns >= 4) return 'grid-4-col';
      
      return 'grid-1-col';
    },
    
    currentQuestionSet() {
      return this.allQuestionSets[this.currentQuestionIndex] || null;
    }
  },
  
  watch: {
    selectedWord: {
      handler(newWord) {
        this.currentSelectedWord = newWord;
      },
      immediate: true
    },
    
    // 🔧 OPTIONAL WATCHER - Don't cause circular calls
    currentQuestion: {
      handler(newQuestion) {
        // Only load if we get a different question from parent AND we're initialized
        if (this.isInitialized && newQuestion && newQuestion !== this.getCurrentQuestionFromState()) {
          console.log('SectionSem1Bottom: Loading question from parent:', newQuestion);
          this.loadQuestionData(newQuestion);
        }
      },
      immediate: false
    },
    
    internalColumns: {
      handler() {
        if (this.isInitialized) {
          this.initializeDynamicRowCounts();
        }
      },
      deep: true
    },
    
    isQuestionComplete(isComplete) {
      if (isComplete) {
        console.log('Question completed in SectionSem1Bottom');
        this.$emit('question-completed', {
          questionIndex: this.currentQuestionIndex,
          isCorrect: isComplete
        });
      }
    }
  },
  
  async mounted() {
    try {
      console.log('🔍 SectionSem1Bottom: Starting initialization...');
      
      // Check if lessonBase is valid
      if (!this.lessonBase || !this.lessonBase.selectedLevels || !this.lessonBase.activityQuestions) {
        throw new Error('lessonBase is not properly initialized');
      }
      
      console.log('✅ SectionSem1Bottom: lessonBase validation passed');
      
      // Initialize question sets
      await this.initializeQuestionSets();
      
      this.currentQuestionIndex = 0;
      this.isInitialized = true;
      
      // 🔧 SIMPLE: Load first question without complications
      if (this.allQuestionSets.length > 0) {
        const firstQuestion = this.allQuestionSets[0];
        this.loadQuestionData(firstQuestion);
        console.log('✅ SectionSem1Bottom: Loaded first question');
      } else {
        throw new Error('No question sets available after initialization');
      }
      
      console.log('✅ SectionSem1Bottom: Initialized with', this.allQuestionSets.length, 'question sets');
    } catch (error) {
      console.error('❌ Failed to initialize SectionSem1Bottom:', error);
      this.$emit('initialization-error', error);
    }
  },
  
  methods: {
    // 🏗️ QUESTION SET MANAGEMENT
    async initializeQuestionSets() {
      const selectedLevels = this.lessonBase.selectedLevels;
      const urlParams = new URLSearchParams(window.location.search);
      let questionLimit = parseInt(urlParams.get('questionCount')) || 1;

      // Calculate total available
      let totalAvailable = 0;
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.lessonBase.activityQuestions.sets && this.lessonBase.activityQuestions.sets[levelKey]) || [];
        totalAvailable += sets.length;
      });

      if (totalAvailable < questionLimit) {
        console.warn(`Not enough question sets. Required: ${questionLimit}, Available: ${totalAvailable}. Using ${totalAvailable}.`);
        questionLimit = totalAvailable;
      }

      // Combine and shuffle sets
      let combinedSets = [];
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.lessonBase.activityQuestions.sets && this.lessonBase.activityQuestions.sets[levelKey]) || [];
        combinedSets.push(...sets.map(set => ({ ...set, __level: levelKey })));
      });

      combinedSets = this.lessonBase.shuffleArray(combinedSets);
      this.allQuestionSets = combinedSets.slice(0, questionLimit);

      // Update lesson base
      this.lessonBase.Total_Questions = questionLimit;
      
      console.log('Processed', this.allQuestionSets.length, 'question sets');
    },

    getCurrentQuestionFromState() {
      return this.allQuestionSets[this.currentQuestionIndex] || null;
    },

    // 🔧 FIXED: Column management without circular calls
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
      
      // Create columns
      const maxWords = this.lessonConfig.isSingleColumnMode
        ? questionSet.categories[0].words.length 
        : Math.max(...questionSet.categories.map(cat => cat.words.length));
      const columnLength = Math.max(8, Math.ceil(maxWords * 1.2));
      
      this.internalColumns = questionSet.categories.map(() => 
        this.createEmptyColumn(columnLength)
      );
      
      // 🔧 FIXED: Single column mode
      if (this.lessonConfig.isSingleColumnMode) {
        this.columnTitles = [this.columnTitles[0]]; // First title only
        this.columnVisibility = [true]; // One visible column
        this.internalColumns = [this.internalColumns[0]]; // First column only - FIXED
      }
      
      // 🔧 FIXED: Only restore state if it exists, don't call loadQuestionState
      const existingState = this.questionStates[this.currentQuestionIndex];
      if (existingState) {
        this.restoreQuestionState(existingState);
      }
      
      this.initializeDynamicRowCounts();
      
      // Notify parent that question is loaded
      this.$emit('question-loaded', {
        questionIndex: this.currentQuestionIndex,
        totalQuestions: this.allQuestionSets.length,
        question: questionSet, // Pass the actual question
        columnTitles: this.columnTitles,
        categories: questionSet.categories
      });
    },
    
    // 🔧 NEW: Separate method for restoring state (no circular calls)
    restoreQuestionState(state) {
      this.internalColumns = JSON.parse(JSON.stringify(state.columns));
      this.columnTitles = [...state.columnTitles];
      this.columnVisibility = [...state.columnVisibility];
      this.canModifyAnswers = state.canModifyAnswers;
      this.dynamicRowCounts = [...(state.dynamicRowCounts || [])];
    },
    
    // 🔧 FIXED: Make resetQuestionState simpler
    resetQuestionState() {
      this.internalColumns = [];
      this.canModifyAnswers = true;
      // Don't reset other arrays that might cause reactivity issues
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
    
    // 🎯 WORD PLACEMENT
     handleColumnClick(colIndex, itemIndex) {
    if (!this.canModifyAnswers || this.isViewingPrevious) {
      console.log('Cannot modify - viewing previous or modifications disabled');
      return;
    }
      
      const column = this.internalColumns[colIndex];
      const item = column[itemIndex];
      
      if (!item.name && this.currentSelectedWord) {
        // Place word from SectionSem1
        this.placeWordInColumn(this.currentSelectedWord, colIndex, itemIndex);
      } else if (item.name && !this.currentSelectedWord) {
        // Remove word back to SectionSem1
        this.removeWordFromColumn(colIndex, itemIndex);
      }
      
      this.updateRowCount(colIndex);
      this.saveQuestionState();
    },
    
    placeWordInColumn(word, colIndex, itemIndex) {
      const item = this.internalColumns[colIndex][itemIndex];
      item.name = word;
      item.state = 'placed';
      
      console.log(`SectionSem1Bottom: Placed word "${word}" in column ${colIndex}`);
      
      // Notify SectionSem1 to mark word as placed
      this.$emit('word-placed', {
        word: word,
        colIndex: colIndex,
        itemIndex: itemIndex,
        isComplete: this.isQuestionComplete
      });
    },
    
    removeWordFromColumn(colIndex, itemIndex) {
      const item = this.internalColumns[colIndex][itemIndex];
      const word = item.name;
      
      item.name = '';
      item.state = 'base';
      
      console.log(`SectionSem1Bottom: Removed word "${word}" from column ${colIndex}`);
      
      // Notify SectionSem1 to return word to available
      this.$emit('word-removed', {
        word: word,
        colIndex: colIndex,
        itemIndex: itemIndex,
        isComplete: this.isQuestionComplete
      });
    },
    
    // 🚀 NAVIGATION
      goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.saveQuestionState();
      this.currentQuestionIndex--;
      this.isViewingPrevious = true; // 🆕 Mark as viewing previous
      this.loadQuestionState();
      
      const previousQuestion = this.allQuestionSets[this.currentQuestionIndex];
      
      this.$emit('navigation-changed', {
        direction: 'previous',
        questionIndex: this.currentQuestionIndex,
        question: previousQuestion,
        canModifyAnswers: false, // 🔧 Previous is read-only
        isViewingPrevious: true
      });
      
      // 🆕 Tell SectionSem1 to clear words for previous view
      this.$emit('clear-words-for-previous');
      
      console.log('SectionSem1Bottom: Navigated to previous question', this.currentQuestionIndex);
    }
  },
    
goToNext() {
    const isCorrect = this.validateCurrentQuestion();
    this.saveQuestionState();
    
    if (this.currentQuestionIndex < this.allQuestionSets.length - 1) {
      this.currentQuestionIndex++;
      this.isViewingPrevious = false; // 🆕 Not viewing previous anymore
      const nextQuestion = this.allQuestionSets[this.currentQuestionIndex];
      
      this.loadQuestionData(nextQuestion);
      
      this.$emit('navigation-changed', {
        direction: 'next',
        questionIndex: this.currentQuestionIndex,
        question: nextQuestion,
        wasCorrect: isCorrect,
        canModifyAnswers: true, // 🔧 Current question is editable
        isViewingPrevious: false
      });
      
      console.log('SectionSem1Bottom: Navigated to next question', this.currentQuestionIndex);
    } else {
      // Last question completed
      this.$emit('lesson-completed', {
        wasCorrect: isCorrect,
        finalQuestionIndex: this.currentQuestionIndex,
        totalQuestions: this.allQuestionSets.length,
        detailedResults: this.getAllQuestionResults() // 🆕 Add results data
      });
      
      console.log('SectionSem1Bottom: Lesson completed');
    }
  },
    
    validateCurrentQuestion() {
      const isCorrect = this.isQuestionComplete;
      
      // Update lesson base progress
      if (this.lessonBase) {
        this.lessonBase.updateProgress(isCorrect);
      }
      
      return isCorrect;
    },
    

     getAllQuestionResults() {
    return this.questionStates.map((state, index) => {
      const question = this.allQuestionSets[index];
      return {
        questionIndex: index,
        question: question,
        state: state,
        isComplete: this.checkQuestionComplete(state, question)
      };
    });
  },
  checkQuestionComplete(state, question) {
    if (!state || !question || !question.categories) return false;
    
    return question.categories.every((category, index) => {
      if (index >= state.columns.length) return false;
      const correctWords = state.columns[index].filter(item => 
        item.name && category.words.includes(item.name)
      ).length;
      return correctWords === category.words.length;
    });
  },
    // 📚 STATE MANAGEMENT
    saveQuestionState() {
      this.questionStates[this.currentQuestionIndex] = {
        columns: JSON.parse(JSON.stringify(this.internalColumns)),
        columnTitles: [...this.columnTitles],
        columnVisibility: [...this.columnVisibility],
        canModifyAnswers: this.canModifyAnswers,
        dynamicRowCounts: [...this.dynamicRowCounts]
      };
    },
    
    // 🔧 FIXED: Remove the circular call
    loadQuestionState() {
      const state = this.questionStates[this.currentQuestionIndex];
      if (state) {
        this.restoreQuestionState(state);
      }
      // 🔧 REMOVED: Don't call loadQuestionData here - this was causing the loop!
    },
    
    // 🎨 UI HELPERS
    initializeDynamicRowCounts() {
      this.dynamicRowCounts = this.internalColumns.map((column) => {
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
        placed: 'bg-blue-100 border-blue-400 shadow-sm',
        correct: colIndex === 0 ? 'bg-blue-200 border-blue-400 shadow-md' : 'bg-green-200 border-green-400 shadow-md',
        missed: 'bg-yellow-400 border-blue-600 shadow-md',
        incorrect: 'bg-red-400 border-red-600 shadow-md',
        base: 'bg-white',
        readonly: 'cursor-not-allowed opacity-75'
      };
      
      return {
        ...baseClasses,
        ...(item.state ? { [stateClasses[item.state]]: true } : { 'bg-white': true })
      };
    },
    
    // 🔗 PUBLIC METHODS
    selectWord(word) {
      this.currentSelectedWord = word;
    },
    
    syncWithWordSelection(data) {
      console.log('SectionSem1Bottom: Syncing with word selection:', data);
    },
    
    getCurrentState() {
      return {
        questionIndex: this.currentQuestionIndex,
        totalQuestions: this.allQuestionSets.length,
        currentQuestion: this.currentQuestionSet,
        isComplete: this.isQuestionComplete,
        canModifyAnswers: this.canModifyAnswers,
        columns: this.internalColumns.map(col => col.filter(item => item.name)),
        columnTitles: this.columnTitles
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
