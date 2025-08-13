<template>
  <div class="flex-container">
    <!-- Fixed Image Container -->
    <div class="image-wrapper" v-if="displayImage">
      <img :src="getImagePath(displayImage)" :alt="'Activity illustration'" class="activity-image" />
    </div>

    <!-- Word Grid Section -->
    <div class="flex mt-2" v-show="shouldShowWordGrid" style="flex-direction: column;">
      <div class="grid-container">
        <div 
          v-for="(word, index) in internalAvailableWords" 
          :key="`word-${index}-${word}`"
          class="grid-item"
          :class="getWordClass(word)"
          @click="handleWordClick(word)"
          @keydown.enter="handleWordClick(word)"
          @keydown.space.prevent="handleWordClick(word)"
          tabindex="0"
          role="button"
          :aria-pressed="internalSelectedWord === word"
          :aria-disabled="!canInteractWithWord(word)"
          :aria-label="`Word: ${word}. ${getWordAriaState(word)}`"
        >
          {{ word }}
        </div>
      </div>

      <!-- Word Statistics -->
      <div v-if="showWordStats" class="word-stats">
        <div class="stat-item">
          <span class="stat-label">Available:</span>
          <span class="stat-value">{{ internalAvailableWords.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Placed:</span>
          <span class="stat-value">{{ internalPlacedWords.length }}</span>
        </div>
        <div class="stat-item" v-if="internalSelectedWord">
          <span class="stat-label">Selected:</span>
          <span class="stat-value">{{ internalSelectedWord }}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${selectionProgress * 100}%` }"
          ></div>
        </div>
        <span class="progress-text">
          {{ Math.round(selectionProgress * 100) }}% Complete
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'

export default {
  name: 'SectionSem1',
  
  props: {
    lessonBase: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && typeof value.shuffleArray === 'function';
      }
    },
    currentQuestion: {
      type: Object,
      default: null
    },
    lessonConfig: {
      type: Object,
      default: () => ({
        isSingleColumnMode: false,
        isEmuCsiLesson: false,
        showDebugInfo: false
      })
    },
    showWordStats: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      // 🧠 COMPONENT OWNS ALL WORD STATE
      internalAvailableWords: [],
      internalPlacedWords: [],
      internalSelectedWord: null,
      
      // Internal state management
      isInitialized: false,
      canInteract: true,
      originalWordList: [], // Keep original for reset
      wordPlacementHistory: [], // Track placement history
      isViewingPrevious: false,

      // Component state
      isLoading: false,
      hasError: false,
      errorMessage: ''
    }
  },

  computed: {
   shouldShowWordGrid() {
    return this.isInitialized && 
           this.internalAvailableWords.length > 0 && 
           !this.hasError &&
           !this.isViewingPrevious; // 🆕 Hide grid when viewing previous
  },
    
    displayImage() {
      return this.currentQuestion?.image || 
             this.currentQuestion?.Image || 
             null;
    },
    
    totalWords() {
      return this.originalWordList.length;
    },
    
    selectionProgress() {
      if (this.totalWords === 0) return 0;
      return this.internalPlacedWords.length / this.totalWords;
    },
    
    isQuestionComplete() {
      return this.internalAvailableWords.length === 0 && this.totalWords > 0;
    },
    
    canSelectNewWord() {
      return this.canInteract && !this.isQuestionComplete;
    }
  },

  watch: {
    currentQuestion: {
      handler(newQuestion, oldQuestion) {
        if (newQuestion && (!oldQuestion || newQuestion !== oldQuestion)) {
          this.initializeWordsFromQuestion(newQuestion);
        }
      },
      immediate: true
    },
    
    isQuestionComplete(isComplete) {
      if (isComplete) {
        this.$emit('question-completed', {
          totalWords: this.totalWords,
          placedWords: [...this.internalPlacedWords],
          timeTaken: this.lessonBase?.getQuestionTime() || 0
        });
      }
    }
  },

mounted() {
  try {
    console.log('🔍 SectionSem1: Starting initialization...');
    
    // Check if lessonBase is valid
    if (!this.lessonBase) {
      throw new Error('lessonBase prop is null or undefined');
    }
    
    console.log('✅ SectionSem1: lessonBase validation passed');
    
    // Initialize if we already have a question
    if (this.currentQuestion) {
      console.log('🔍 SectionSem1: Initializing with current question');
      this.initializeWordsFromQuestion(this.currentQuestion);
    } else {
      console.log('🔍 SectionSem1: No current question yet, waiting...');
    }
    
    console.log('✅ SectionSem1: Mount completed');
  } catch (error) {
    console.error('❌ Error in SectionSem1 mounted():', error);
    this.$emit('initialization-error', error);
  }
},

  methods: {

 clearWordsForPrevious() {
    console.log('SectionSem1: Clearing words for previous view');
    this.isViewingPrevious = true;
    // Don't actually clear the words, just hide the grid
  },

  // 🆕 ADD: Restore words when returning to current
  restoreWordsForCurrent() {
    console.log('SectionSem1: Restoring words for current view');
    this.isViewingPrevious = false;
  },



    // 🏗️ QUESTION INITIALIZATION - Core logic moved here
    async initializeWordsFromQuestion(questionSet) {
      this.isLoading = true;
      this.hasError = false;
      
      try {
        if (!questionSet || !questionSet.categories) {
          throw new Error('Invalid question set: missing categories');
        }

        // Reset state
        this.resetInternalState();
        
        // Extract words from categories
        const allWords = this.extractWordsFromCategories(questionSet.categories);
        
        if (allWords.length === 0) {
          throw new Error('No words found in question categories');
        }

        // Shuffle and store words
        const shuffledWords = this.lessonBase.shuffleArray([...allWords]);
        
        this.originalWordList = [...allWords];
        this.internalAvailableWords = [...shuffledWords];
        this.internalPlacedWords = [];
        this.internalSelectedWord = null;
        this.canInteract = true;
        this.isInitialized = true;

        console.log(`SectionSem1: Initialized with ${allWords.length} words from ${questionSet.categories.length} categories`);
        
        // Notify parent components
        this.$emit('words-initialized', {
          totalWords: allWords.length,
          availableWords: [...this.internalAvailableWords],
          categories: questionSet.categories.map(cat => cat.displayName || cat.name)
        });

      } catch (error) {
        this.hasError = true;
        this.errorMessage = error.message;
        console.error('SectionSem1 initialization error:', error);
        
        this.$emit('initialization-error', {
          error: error.message,
          questionSet
        });
      } finally {
        this.isLoading = false;
      }
    },

    extractWordsFromCategories(categories) {
      let allWords = [];
      
      categories.forEach((category, categoryIndex) => {
        if (category && category.words && Array.isArray(category.words)) {
          // Add words with category info for tracking
          const categoryWords = category.words.map(word => ({
            word: word,
            category: category.displayName || category.name || `Category ${categoryIndex + 1}`,
            categoryIndex: categoryIndex
          }));
          
          allWords = [...allWords, ...categoryWords.map(item => item.word)];
        }
      });
      
      return allWords;
    },

    resetInternalState() {
      this.internalAvailableWords = [];
      this.internalPlacedWords = [];
      this.internalSelectedWord = null;
      this.originalWordList = [];
      this.wordPlacementHistory = [];
      this.isInitialized = false;
      this.canInteract = true;
      this.hasError = false;
      this.errorMessage = '';
    },

    // 🎯 WORD INTERACTION - Enhanced logic
    handleWordClick(word) {
      if (!this.canInteractWithWord(word)) {
        console.log(`SectionSem1: Cannot interact with word "${word}"`);
        return;
      }
      
      // Start question timing if not started
      if (this.lessonBase && !this.lessonBase.questionStartTime) {
        this.lessonBase.startQuestionTimer();
      }
      
      // Toggle selection
      const wasSelected = this.internalSelectedWord === word;
      this.internalSelectedWord = wasSelected ? null : word;
      
      console.log(`SectionSem1: Word ${wasSelected ? 'deselected' : 'selected'}: "${word}"`);
      
      // Record interaction history
      this.recordWordInteraction(word, wasSelected ? 'deselected' : 'selected');
      
      // Emit selection event
      this.$emit('word-selected', {
        word: this.internalSelectedWord,
        previousWord: wasSelected ? word : null,
        availableWords: [...this.internalAvailableWords],
        placedWords: [...this.internalPlacedWords],
        canInteract: this.canInteract
      });
    },

    canInteractWithWord(word) {
      return this.canInteract && 
             this.internalAvailableWords.includes(word) && 
             !this.internalPlacedWords.includes(word);
    },

    recordWordInteraction(word, action) {
      const interaction = {
        word,
        action,
        timestamp: Date.now(),
        questionTime: this.lessonBase?.getQuestionTime() || 0
      };
      
      this.wordPlacementHistory.push(interaction);
    },

    // 🔄 WORD STATE MANAGEMENT - Public methods for other components
     markWordAsPlaced(word) {
    if (this.isViewingPrevious) {
      console.log('Cannot place word - viewing previous question');
      return false;
    }
      // Remove from available
      const wordIndex = this.internalAvailableWords.indexOf(word);
      this.internalAvailableWords.splice(wordIndex, 1);
      
      // Add to placed
      if (!this.internalPlacedWords.includes(word)) {
        this.internalPlacedWords.push(word);
      }
      
      // Clear selection if this word was selected
      if (this.internalSelectedWord === word) {
        this.internalSelectedWord = null;
      }
      
      this.recordWordInteraction(word, 'placed');
      this.updateInteractionState();
      this.emitWordStateUpdate('placed', word);
      
      console.log(`SectionSem1: Word placed: "${word}"`);
      return true;
    },

     returnWordToAvailable(word) {
    if (this.isViewingPrevious) {
      console.log('Cannot return word - viewing previous question');
      return false;
    }

      // Remove from placed
      const placedIndex = this.internalPlacedWords.indexOf(word);
      this.internalPlacedWords.splice(placedIndex, 1);
      
      // Add back to available
      if (!this.internalAvailableWords.includes(word)) {
        this.internalAvailableWords.push(word);
      }
      
      this.recordWordInteraction(word, 'returned');
      this.updateInteractionState();
      this.emitWordStateUpdate('returned', word);
      
      console.log(`SectionSem1: Word returned: "${word}"`);
      return true;
    },

    updateInteractionState() {
      // Enable/disable interaction based on game state
      this.canInteract = this.internalAvailableWords.length > 0;
    },

    emitWordStateUpdate(action, word) {
      this.$emit('words-state-changed', {
        action,
        word,
        availableWords: [...this.internalAvailableWords],
        placedWords: [...this.internalPlacedWords],
        selectedWord: this.internalSelectedWord,
        canInteract: this.canInteract,
        progress: this.selectionProgress,
        isComplete: this.isQuestionComplete
      });
    },

    // 🔗 PUBLIC METHODS - For parent/sibling components
    selectWord(word) {
      if (this.internalAvailableWords.includes(word)) {
        this.internalSelectedWord = word;
        this.$emit('word-selected', {
          word: word,
          availableWords: [...this.internalAvailableWords],
          placedWords: [...this.internalPlacedWords]
        });
        return true;
      }
      return false;
    },

    syncWithPlacement(placementData) {
      let syncSuccess = true;
      
      if (placementData.wordPlaced) {
        syncSuccess = this.markWordAsPlaced(placementData.wordPlaced) && syncSuccess;
      }
      
      if (placementData.wordRemoved) {
        syncSuccess = this.returnWordToAvailable(placementData.wordRemoved) && syncSuccess;
      }
      
      return syncSuccess;
    },

    getCurrentWordState() {
      return {
        availableWords: [...this.internalAvailableWords],
        placedWords: [...this.internalPlacedWords],
        selectedWord: this.internalSelectedWord,
        canInteract: this.canInteract,
        totalWords: this.totalWords,
        progress: this.selectionProgress,
        isComplete: this.isQuestionComplete,
        isInitialized: this.isInitialized,
        history: [...this.wordPlacementHistory]
      };
    },

    resetWordState() {
      if (this.currentQuestion) {
        console.log('SectionSem1: Resetting word state');
        this.initializeWordsFromQuestion(this.currentQuestion);
      }
    },

    // 🎨 UI HELPERS
    getWordClass(word) {
      const baseClass = {
        'word-placed': this.internalPlacedWords.includes(word),
        'word-selected': this.internalSelectedWord === word && this.canInteractWithWord(word),
        'word-available': this.internalAvailableWords.includes(word) && this.canInteractWithWord(word),
        'word-disabled': !this.canInteractWithWord(word)
      };
      
      return baseClass;
    },

    getWordAriaState(word) {
      if (this.internalPlacedWords.includes(word)) return 'Placed';
      if (this.internalSelectedWord === word) return 'Selected';
      if (this.canInteractWithWord(word)) return 'Available';
      return 'Disabled';
    },

    getImagePath(imageName) {
      // Implement your image path logic
      try {
        return require(`@/assets/images/${imageName}`);
      } catch (e) {
        console.warn(`Image not found: ${imageName}`);
        return '';
      }
    },

    // 🧪 DEBUG METHODS
    getDebugInfo() {
      return {
        componentName: 'SectionSem1',
        state: {
          available: this.internalAvailableWords,
          placed: this.internalPlacedWords,
          selected: this.internalSelectedWord,
          initialized: this.isInitialized,
          canInteract: this.canInteract
        },
        history: this.wordPlacementHistory,
        question: this.currentQuestion?.categories?.map(cat => cat.name)
      };
    }
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 100%;
}

.image-wrapper {
  text-align: center;
  margin-bottom: 1rem;
}

.activity-image {
  max-width: 300px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(6, minmax(140px, 1fr));
  gap: 16px 24px;
  width: 100%;
  max-width: 1200px;
  background: rgb(43, 136, 207); 
  padding: 16px 24px;
  border-radius: 16px;
  box-sizing: border-box;
  margin: 0 auto;
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
  min-width: 140px;
  border: 2px solid transparent;
}

.grid-item:hover,
.grid-item:focus {
  background-color: #f7b733;
  outline: none;
  transform: scale(1.02);
}

/* Word States */
.word-available {
  background: #FDA603;
  cursor: pointer;
}

.word-selected {
  background: #f7b733;
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.2);
  border: 2px solid #2563eb;
}

.word-placed {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
  transform: none !important;
  background: #9CA3AF;
  border-color: #6B7280;
}

.word-disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #E5E7EB;
  color: #9CA3AF;
}

.word-disabled:hover,
.word-disabled:focus,
.word-placed:hover,
.word-placed:focus {
  transform: none !important;
  background-color: inherit;
}

/* Word Statistics */
.word-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-weight: 600;
  color: #374151;
}

.stat-value {
  font-weight: 700;
  color: #1F2937;
  background: #F3F4F6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

/* Progress Bar */
.progress-container {
  margin-top: 1rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #059669);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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
    min-width: 120px;
  }
  
  .word-stats {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    max-width: 400px;
    gap: 8px 12px;
  }
  
  .grid-item {
    font-size: 14px;
    padding: 10px 6px;
    min-width: 100px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .grid-item,
  .progress-fill {
    transition: none;
  }
  
  .grid-item:hover,
  .grid-item:focus,
  .word-selected {
    transform: none;
  }
}

@media (prefers-contrast: high) {
  .grid-item {
    border: 2px solid #000;
  }
  
  .word-selected {
    border: 3px solid #0000FF;
  }
  
  .word-placed {
    border: 2px solid #FF0000;
  }
}

/* Focus states for keyboard navigation */
.grid-item:focus-visible {
  outline: 3px solid #2563EB;
  outline-offset: 2px;
}

/* Loading and error states */
.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  margin: 1rem auto;
  max-width: 400px;
}

.loading-state {
  background: #F3F4F6;
  color: #6B7280;
}

.error-state {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
}
</style>
