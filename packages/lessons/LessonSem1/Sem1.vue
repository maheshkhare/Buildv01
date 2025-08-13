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


<button @click="testWithMinimalData" 
        style="background: orange; color: white; padding: 10px; margin: 5px;">
  🧪 TEST WITH FAKE DATA
</button>




      <div class="rows-12">
        <div class="content-container">
          
          <!-- 🔍 DEBUG INFO -->
          <div class="debug-info" style="background: yellow; padding: 10px; margin: 10px;">
            <h4>DEBUG INFO:</h4>
            <p>InstructionShow: {{ InstructionShow }}</p>
            <p>resultShow: {{ resultShow }}</p>
            <p>lessonBase exists: {{ !!lessonBase }}</p>
            <p>currentQuestionData: {{ !!currentQuestionData }}</p>
            <p>Should show instruction: {{ InstructionShow }}</p>
            <p>Should show components: {{ !InstructionShow && !resultShow }}</p>
          </div>
          
          <SectionSem1Intro
            v-show="InstructionShow"
            @PracticeNext="handlePracticeNext"
          />

          <div v-if="showStoryButton && !resultShow" class="story-section">
            <button @click="showStory = !showStory" class="story-toggle-btn">
              {{ showStory ? 'Hide Story' : 'Show Story' }}
            </button>
            <SectionStory1 v-if="showStory" :story="currentStory" :image="currentImage" />
          </div>

          <!-- 🎯 SMART COMPONENTS - Add debug info -->
          <div v-if="!InstructionShow && !resultShow" class="components-container">
            <div class="debug-info" style="background: lightgreen; padding: 5px;">
              <p>Components should show here</p>
            </div>
            
            <SectionSem1
              :lesson-base="lessonBase"
              :current-question="currentQuestionData"
              :lesson-config="lessonConfig"
              @word-selected="handleWordSelected"
              @words-initialized="handleWordsInitialized" 
              @initialization-error="handleInitializationError"
              ref="wordSection"
            />

            <SectionSem1Bottom
            v-if="!InstructionShow && !resultShow"
            :lesson-base="lessonBase"
            :current-question="currentQuestionData"
            :lesson-config="lessonConfig"
            :selected-word="selectedWord"
            @lesson-completed="handleLessonCompleted"
            @navigation-changed="handleNavigationChanged"
            @question-loaded="handleQuestionLoaded"
            @word-placed="handleWordPlaced"
            @word-removed="handleWordRemoved"
            @clear-words-for-previous="handleClearWordsForPrevious"
            @initialization-error="handleInitializationError"
            ref="bottomSection"
          />
          </div>

          <resultPopup
            v-if="resultShow"
            :lesson-base="lessonBase"
            :lesson-type="'classification'"
            @results-closed="handleResultsClosed"
          />

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
import SectionStory1 from './components/SectionStory1.vue';

export default {
  name: 'Sem1',
  components: {
    SectionSem1,
    SectionSem1Bottom,
    resultPopup,
    SectionSem1Intro,
    topHeader,
    SectionStory1
  },
  mixins: [baseMixin],
  data() {
    return {
      // 🎯 MINIMAL DATA - Just UI state
      lessonBase: null,
      isLoading: true,
      loadError: false,
      InstructionShow: true, // This might be the issue
      resultShow: false,
      showStory: true,
      
      // 🔄 State received from smart components
      currentQuestionIndex: 0,
      currentQuestionData: null,
      selectedWord: null,
      
      // Debug
      debugMode: true
    };
  },
  computed: {
    // 🎯 MINIMAL COMPUTED - Just config
    lessonConfig() {
      return {
        isSingleColumnMode: (sessionStorage.getItem('jsonFile') || '') === 'CSU-PK',
        isEmuCsiLesson: (sessionStorage.getItem('jsonFile') || '') === 'EMU-CSI'
      };
    },
    
    showStoryButton() {
      const jsonParam = sessionStorage.getItem('jsonFile') || '';
      return ['DMU-I', 'CSU-PK', 'DMU-II'].includes(jsonParam);
    },
    
    currentStory() {
      return this.currentQuestionData?.story || '';
    },
    
    currentImage() {
      return this.currentQuestionData?.Image || '';
    }
  },
 async mounted() {
  console.log('🔍 Sem1: Starting mount...');
  
  // TEMPORARY: Skip error handling to see exact error
  this.lessonBase = new LessonBase();
  this.lessonBase.initializeFromSession();
  await this.lessonBase.loadLessonJson(null, 'LessonSem1');
  
  this.componentSubtitle = 'Classification Exercise';
  
  if (this.mode !== 'instruction') {
    this.InstructionShow = false;
  }
  
  this.isLoading = false;
  // Don't catch errors - let them show in console
},

  beforeDestroy() {
    if (this.lessonBase) {
      this.lessonBase.stopTimer();
    }
  },
  methods: {


testWithMinimalData() {
  console.log('🧪 Testing with minimal data...');
  
  // Create fake lesson data with ALL required methods
  this.lessonBase = {
    selectedLevels: [1],
    Total_Questions: 1,
    currentQuestionIndex: 0,
    Questions_attempted: 0,
    correct_Answers: 0,
    incorrect_Answers: 0,
    activityQuestions: {
      sets: {
        level1: [{
          categories: [
            {
              name: 'Animals',
              displayName: 'Animals',
              words: ['cat', 'dog', 'bird', 'fish']
            },
            {
              name: 'Colors', 
              displayName: 'Colors',
              words: ['red', 'blue', 'green', 'yellow']
            }
          ]
        }]
      }
    },
    // All required methods
    shuffleArray: (arr) => [...arr].sort(() => Math.random() - 0.5),
    updateProgress: (isCorrect) => {
      this.lessonBase.Questions_attempted++;
      if (isCorrect) {
        this.lessonBase.correct_Answers++;
      } else {
        this.lessonBase.incorrect_Answers++;
      }
      console.log('Progress updated:', { 
        attempted: this.lessonBase.Questions_attempted,
        correct: this.lessonBase.correct_Answers 
      });
    },
    startTimer: () => console.log('Timer started'),
    stopTimer: () => console.log('Timer stopped'),
    startQuestionTimer: () => {
      this.lessonBase.questionStartTime = Date.now();
      console.log('Question timer started');
    },
    getQuestionTime: () => {
      if (this.lessonBase.questionStartTime) {
        return (Date.now() - this.lessonBase.questionStartTime) / 1000;
      }
      return 0;
    },
    questionStartTime: null
  };
  
  this.loadError = false;
  this.isLoading = false;
  this.InstructionShow = false;
  
  console.log('🧪 Fake data set with all methods, components should show now');
},






    // 🎯 EVENT HANDLERS - Enhanced with logging
    
    handlePracticeNext() {
      console.log('Sem1: Practice Next clicked');
      this.InstructionShow = false;
    },
    
    handleWordsInitialized(data) {
      console.log('Sem1: Words initialized:', data);
    },
    
    handleWordSelected(data) {
      console.log('Sem1: Word selected:', data.word);
      this.selectedWord = data.word;
    },
    
  handleNavigationChanged(data) {
    console.log('Sem1: Navigation changed to question', data.questionIndex);
    this.currentQuestionIndex = data.questionIndex;
    this.currentQuestionData = data.question;
    
    // 🆕 Handle previous view state
    if (data.isViewingPrevious) {
      if (this.$refs.wordSection) {
        this.$refs.wordSection.clearWordsForPrevious();
      }
    } else {
      if (this.$refs.wordSection) {
        this.$refs.wordSection.restoreWordsForCurrent();
      }
    }
  },

   handleClearWordsForPrevious() {
    if (this.$refs.wordSection) {
      this.$refs.wordSection.clearWordsForPrevious();
    }
  },
    
   handleQuestionLoaded(data) {
  console.log('Sem1: Question loaded:', data);
  
  // Store the question data from SectionSem1Bottom
  this.currentQuestionData = data.question;
  this.currentQuestionIndex = data.questionIndex;
  
  console.log('Sem1: Updated currentQuestionData:', this.currentQuestionData);
},
    
    handleWordPlaced(data) {
      console.log('Sem1: Word placed:', data.word);
      if (this.$refs.wordSection) {
        this.$refs.wordSection.syncWithPlacement({
          wordPlaced: data.word
        });
      }
      this.selectedWord = null;
    },
    
    handleWordRemoved(data) {
      console.log('Sem1: Word removed:', data.word);
      if (this.$refs.wordSection) {
        this.$refs.wordSection.syncWithPlacement({
          wordRemoved: data.word
        });
      }
    },
    
    handleLessonCompleted(data) {
    console.log('Sem1: Lesson completed:', data);
    
    // Store results data for resultPopup
    this.lessonResults = data;
    this.resultShow = true;
  },
    
    handleResultsClosed() {
      console.log('Sem1: Results closed');
      this.resultShow = false;
    },
    
    handleInitializationError(error) {
      console.error('Sem1: Component initialization error:', error);
      this.loadError = true;
    },
    
    // 🧪 DEBUG METHODS
    toggleDebugMode() {
      this.debugMode = !this.debugMode;
    },
    
    forceShowComponents() {
      console.log('Forcing components to show...');
      this.InstructionShow = false;
      this.resultShow = false;
    }
  }
};
</script>

<style scoped>
.loading-message,
.error-message {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}

.loading-message { color: #666; }
.error-message { color: #d32f2f; }

.content-container {
  margin: 2% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  padding: 1.25rem;
  min-height: 400px; /* Ensure container has height */
}

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

.components-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.debug-info {
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.debug-info h4 {
  margin: 0 0 5px 0;
  font-weight: bold;
}

.debug-info p {
  margin: 2px 0;
}

@media (max-width: 768px) {
  .content-container {
    margin: 2% 2% 5% 2%;
    padding: 1rem;
  }
}
</style>
