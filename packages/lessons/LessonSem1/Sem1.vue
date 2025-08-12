<template>
  <div>
    <div v-if="isLoading" class="loading-message">
      Loading lesson data...
    </div>
    <div v-else-if="loadError" class="error-message">
      Error loading lesson. Please try again.
    </div>
    <div v-else class="w-full">
      <div class="rows-12 relative">
        <topHeader
          :HeaderTop="HeaderTop"
          :componentSubtitle="componentSubtitle"
        />
      </div>
      <div class="rows-12">
        <div class="content-container">
          <div>
            <SectionSem1Intro
              v-show="InstructionShow"
              @PracticeNext="PracticeNext"
            />

            <div v-if="showStoryButton && !resultShow" class="story-section">
              <button
                @click="showStory = !showStory"
                class="story-toggle-btn"
              >
                {{ showStory ? 'Hide Story' : 'Show Story' }}
              </button>
              <SectionStory1 
                v-if="showStory" 
                :story="currentStory" 
                :image="currentImage" 
              />
            </div>

            <ImageSelectionGrid
              v-if="isEmuCsiLesson && !resultShow"
              :imageItems="currentImageItems"
              :placedWords="currentPlacedWords"
              @word-selected="handleWordSelected"
            />

            <SectionSem1
              v-else-if="showtop && !resultShow"
              :showWords="currentAvailableWords"
              :acceptInput="canSelectWords"
              :isShowing_info="isShowing_info"
              :showtop="showtop"
              @OnWord_Click="handleWordSelection"
              @OnNewGame_Click="OnNewGame_Click"
              @Ontext_Click="Ontext_Click"
            />
          </div>

          <div>
            <!-- 🎯 NEW SMART COMPONENT - Much cleaner! -->
            <SectionSem1Bottom
              v-if="!resultShow"
              :lesson-base="lessonBase"
              :current-question="currentSet"
              :lesson-config="lessonConfig"
              :selected-word="selectedWord"
              @question-loaded="handleQuestionLoaded"
              @words-updated="handleWordsUpdated"
              @navigation-changed="handleNavigationChange"
              @lesson-completed="handleLessonCompleted"
              ref="bottomSection"
            />

            <resultPopup
              v-show="resultShow"
              :activity_Status="lessonBase.activity_Status"
              :Time_elapsed="lessonBase.Time_elapsed"
              :Questions_attempted="lessonBase.Questions_attempted"
              :correct_Answers="lessonBase.correct_Answers"
              :incorrect_Answers="lessonBase.incorrect_Answers"
              :ResultHide="true"
              :ResultArrow="false"
              :JsonArrData="lessonBase.JsonArrData"
              @FinalResult="FinalResult"
              @download-results="downloadResultsJson"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css';
import { LessonBase } from 'Lessons/LessonBase';
import baseMixin from 'Scripts/mixinBaseLesson';
import SectionSem1 from 'Lessons/LessonSem1/components/SectionSem1';
import SectionSem1Intro from 'Lessons/LessonSem1/components/SectionSem1Intro';
import SectionSem1Bottom from 'Lessons/LessonSem1/components/SectionSem1Bottom';
import resultPopup from '../resultPopup.vue';
import topHeader from '../topHeader.vue';
import { Howler } from 'howler';
import SectionStory1 from './components/SectionStory1.vue';
import ImageSelectionGrid from './components/ImageSelectionGrid.vue';

export default {
  name: 'Sem1',
  components: {
    SectionSem1,
    SectionSem1Bottom,
    resultPopup,
    SectionSem1Intro,
    topHeader,
    SectionStory1,
    ImageSelectionGrid   
  },
  mixins: [baseMixin],
  props: {
    exercise: {
      type: [Number, String],
      default: 0
    },
    instruction: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      lessonBase: null,
      
      allSelectedSets: [],
      currentQuestionIndex: 0,
      selectedWord: null,
      
      currentAvailableWords: [],
      currentPlacedWords: [],
      
      isLoading: true,
      loadError: false,
      InstructionShow: true,
      resultShow: false,
      showtop: false,
      showStory: true,
      isShowing_info: false,
      canSelectWords: true,
      
      questionTimings: [],
      questionDetails: [],
    };
  },
  computed: {
    isEmuCsiLesson() {
      return (sessionStorage.getItem('jsonFile') || '') === 'EMU-CSI';
    },
    
    showStoryButton() {
      const jsonParam = sessionStorage.getItem('jsonFile') || '';
      return ['DMU-I', 'CSU-PK', 'DMU-II'].includes(jsonParam);
    },
    
    isSingleColumnMode() {
      const jsonParam = sessionStorage.getItem('jsonFile') || '';
      return jsonParam === 'CSU-PK';
    },
    
    lessonConfig() {
      return {
        isSingleColumnMode: this.isSingleColumnMode,
        isEmuCsiLesson: this.isEmuCsiLesson
      };
    },
    
    currentStory() {
      return this.currentSet?.story || '';
    },
    
    currentImage() {
      return this.currentSet?.Image || '';
    },
    
    currentSet() {
      if (!this.allSelectedSets || !this.allSelectedSets.length) return null;
      return this.allSelectedSets[this.currentQuestionIndex] || null;
    },
    
    currentImageItems() {
      const items = [];
      if (this.isEmuCsiLesson && this.currentSet && this.currentSet.categories) {
        this.currentSet.categories.forEach(category => {
          if (category.words && category.images) {
            for (let i = 0; i < category.words.length; i++) {
              items.push({
                word: category.words[i],
                image: category.images[i] || 'placeholder.png',
              });
            }
          }
        });
      }
      return items;
    }
  },
  watch: {
    exercise(newVal) {
      this.initializeExercise(newVal);
    },
    
    currentQuestionIndex(newIndex) {
      if (this.lessonBase) {
        this.lessonBase.currentQuestionIndex = newIndex;
      }
    }
  },
  async mounted() {
    this.lessonBase = new LessonBase();
    this.lessonBase.initializeFromSession();
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const questionLimit = parseInt(urlParams.get('questionCount')) || null;
      
      await this.lessonBase.loadLessonJson(null, 'LessonSem1');
      this.processWordSets(questionLimit);
      this.initializeComponent();
    } catch (error) {
      console.error('Error loading JSON:', error);
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  },
  beforeDestroy() {
    if (this.lessonBase) {
      this.lessonBase.stopTimer();
    }
    Howler.unload();
  },
  methods: {
    processWordSets(questionLimit = null) {
      const selectedLevels = this.lessonBase.selectedLevels;
      let finalQuestionLimit = questionLimit || 1;

      let totalAvailable = 0;
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.lessonBase.activityQuestions.sets && this.lessonBase.activityQuestions.sets[levelKey]) || [];
        totalAvailable += sets.length;
      });

      if (totalAvailable < finalQuestionLimit) {
        alert(`Not enough question sets. Required: ${finalQuestionLimit}, Available: ${totalAvailable}. Using ${totalAvailable}.`);
        finalQuestionLimit = totalAvailable;
      }

      // Combine and shuffle sets
      let combinedSets = [];
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.lessonBase.activityQuestions.sets && this.lessonBase.activityQuestions.sets[levelKey]) || [];
        combinedSets.push(...sets.map(set => ({ ...set, __level: levelKey })));
      });

      combinedSets = this.lessonBase.shuffleArray(combinedSets);
      const selectedSets = combinedSets.slice(0, finalQuestionLimit);
      this.allSelectedSets = selectedSets;

      this.lessonBase.Total_Questions = finalQuestionLimit;
    },

    initializeComponent() {
      const firstLevel = this.lessonBase.selectedLevels[0] || 1;
      const levelName = this.allSelectedSets?.levelName || `Level ${firstLevel}`;
      this.componentSubtitle = levelName;

      this.run();
      this.lessonBase.startTimer();
    },

    initializeExercise(exerciseNum) {
      this.lessonBase.Questions_attempted = 0;
      this.lessonBase.correct_Answers = 0;
      this.lessonBase.incorrect_Answers = 0;
      this.questionTimings = [];
      this.questionDetails = [];
      this.currentQuestionIndex = 0;
      this.lessonBase.Exercise_Number = exerciseNum;
      this.lessonBase.Total_Questions = this.allSelectedSets.length;
    },

    // ========== LESSON FLOW ==========
    run() {
      if (this.allSelectedSets.length > 0) {
        if (this.mode === 'instruction') {
          this.InstructionShow = true;
        } else {
          this.practice0();
        }
      }
    },

    practice0() {
      this.InstructionShow = false;
      this.showtop = true;
      this.startQuestionTracking();
    },

    PracticeNext() {
      this.InstructionShow = false;
      this.practice0();
    },

    // ========== WORD INTERACTION (simplified) ==========
    handleWordSelected(word) {
      this.selectedWord = word;
      // Pass to SectionSem1Bottom
      if (this.$refs.bottomSection) {
        this.$refs.bottomSection.selectWord(word);
      }
    },

    handleWordSelection(word) {
      this.selectedWord = word;
      // Pass to SectionSem1Bottom
      if (this.$refs.bottomSection) {
        this.$refs.bottomSection.selectWord(word);
      }
    },

    OnNewGame_Click() {
      // Reset current question or continue to next
      console.log('New game clicked');
    },

    Ontext_Click() {
      this.isShowing_info = !this.isShowing_info;
    },

    // ========== EVENT HANDLERS FROM SectionSem1Bottom ==========
    handleQuestionLoaded(data) {
      console.log('Question loaded:', data);
      // Update any UI state based on question load
      this.canSelectWords = true;
    },

    handleWordsUpdated(data) {
      // Update parent state with word changes from SectionSem1Bottom
      this.currentAvailableWords = data.availableWords;
      this.currentPlacedWords = data.placedWords;
      this.selectedWord = data.selectedWord;
      
      // Update any UI based on completion status
      this.canSelectWords = !data.isComplete;
    },

    handleNavigationChange(data) {
      console.log('Navigation changed:', data);
      
      // Update current question index
      this.currentQuestionIndex = data.questionIndex;
      
      // Update timing data
      this.recordQuestionTime(data.questionIndex, data.wasCorrect);
      
      // Update UI state
      this.canSelectWords = data.canModifyAnswers;
      
      // Start tracking for new question
      if (data.direction === 'next') {
        this.startQuestionTracking();
      }
    },

    handleLessonCompleted(data) {
      console.log('Lesson completed:', data);
      
      // Record final question
      this.recordQuestionTime(data.finalQuestionIndex, data.wasCorrect);
      
      // Show results
      this.showResults();
    },

    // ========== TIMING TRACKING ==========
    startQuestionTracking() {
      this.lessonBase.startQuestionTimer();
      
      if (!this.questionDetails[this.currentQuestionIndex]) {
        const currentSet = this.allSelectedSets[this.currentQuestionIndex];
        this.questionDetails[this.currentQuestionIndex] = {
          questionIndex: this.currentQuestionIndex,
          timeTaken: 0,
          isCompleted: false,
          wasCorrect: false,
          wasDisplayed: true,
          questionTitles: currentSet?.categories?.map(cat => cat.displayName || cat.name) || []
        };
      }
    },

    recordQuestionTime(questionIndex, wasCorrect) {
      if (this.lessonBase.questionStartTime) {
        const timeTaken = this.lessonBase.getQuestionTime();
        this.questionTimings[questionIndex] = timeTaken;
        
        if (this.questionDetails[questionIndex]) {
          this.questionDetails[questionIndex] = {
            ...this.questionDetails[questionIndex],
            timeTaken: timeTaken,
            isCompleted: true,
            wasCorrect: wasCorrect || false
          };
        }
      }
    },

    // ========== RESULTS ==========
    showResults() {
      // Ensure we have minimum data for results
      if (this.lessonBase.Questions_attempted === 0) {
        this.lessonBase.Questions_attempted = this.allSelectedSets.length;
        this.lessonBase.correct_Answers = 0;
        this.lessonBase.incorrect_Answers = this.allSelectedSets.length;
      }
      
      this.lessonBase.finalizeResults({
        questionTimings: this.questionTimings,
        detailedResults: this.questionDetails
      });
      
      this.resultShow = true;
      this.InstructionShow = false;
      this.isShowing_info = false;
      this.showtop = false;
    },

    downloadResultsJson() {
      this.lessonBase.downloadResultsJson('sem1_classification_results.json');
    },

    FinalResult() {
      this.downloadResultsJson();
    }
  }
};
</script>

<style scoped>
/* ========== LAYOUT ========== */
.loading-message,
.error-message {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}

.loading-message { 
  color: #666; 
}

.error-message { 
  color: #d32f2f; 
}

.content-container {
  margin: 2% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  padding: 1.25rem;
}

/* ========== STORY SECTION ========== */
.story-section {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.story-toggle-btn {
  padding: 0.625rem 2.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
}

.story-toggle-btn:hover {
  background-color: #2563eb;
}

/* ========== WORD INTERACTIONS ========== */
.word-item {
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.word-item:hover { 
  background: #e0e0e0; 
}

.disabled-word {
  opacity: 0.5;
  pointer-events: none;
  text-decoration: line-through;
}

.readonly-answer {
  pointer-events: none;
  opacity: 0.9;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .content-container {
    margin: 2% 2% 5% 2%;
    padding: 1rem;
  }
  
  .story-toggle-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .content-container {
    margin: 1% 1% 3% 1%;
    padding: 0.75rem;
  }
  
  .loading-message,
  .error-message {
    padding: 1rem;
    font-size: 1rem;
  }
}

/* ========== COMPONENT SPACING ========== */
.rows-12 {
  width: 100%;
}

.rows-12.relative {
  position: relative;
}

/* ========== TRANSITIONS ========== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* ========== ACCESSIBILITY ========== */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .content-container {
    border-width: 2px;
  }
  
  .story-toggle-btn {
    border: 2px solid #1d4ed8;
  }
}

/* Focus states */
button:focus,
.word-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ========== PRINT STYLES ========== */
@media print {
  .story-toggle-btn,
  .navigation-buttons {
    display: none;
  }
  
  .content-container {
    border: none;
    box-shadow: none;
  }
}
</style>
