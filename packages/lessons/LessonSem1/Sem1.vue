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
        <topHeader :HeaderTop="HeaderTop" :componentSubtitle="componentSubtitle"/>
      </div>
      <div class="rows-12">
        <div class="content-container">
          <div>
            <SectionSem1Intro v-show="InstructionShow" @PracticeNext="PracticeNext"/>
            <div v-if="showStoryButton && !resultShow">
              <button @click="showStory = !showStory" class="px-10 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                {{ showStory ? 'Hide Story' : 'Show Story' }}
              </button>
              <SectionStory1 v-if="showStory" :story="currentStory" :image="currentImage" />
            </div>
            <ImageSelectionGrid v-if="isEmuCsiLesson && !resultShow" :imageItems="currentImageItems" :placedWords="placedWords" @word-selected="handleWordSelected"/>

            <SectionSem1 v-else :showWords="availableWords" :acceptInput="canModifyAnswers" :isShowing_info="isShowing_info" :showtop="showtop" @OnWord_Click="handleWordSelection" @OnNewGame_Click="OnNewGame_Click"  @Ontext_Click="Ontext_Click" />
          </div>
          <div>
            <SectionSem1Bottom :show-next-button="showNextButton" :show-previous-button="currentQuestionIndex > 0" :isReviewMode="isReviewMode" :reviewTableRows="reviewTableRows" :accept-input="canModifyAnswers" :columns="columns" :column-titles="columnTitles" :column-visibility="columnVisibility" :row-counts="rowCounts" :highlight="highlightBottom" :showBottom="showBottom" :Arrow_isShowing="Arrow_isShowing || isSingleColumnMode" @OnClicked_Col="handleColumnClick" @Click_NextButton="Click_NextButton" @Click_PreviousButton="goToPreviousQuestion"/>

            <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed" :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult" @download-results="downloadResultsJson" :ResultHide="ResultHide" :ResultArrow="ResultArrow"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css';
import baseMixin from 'Scripts/mixinBaseLesson';
import { generateLessonHowls } from 'Scripts/utility';
import SectionSem1 from 'Lessons/LessonSem1/components/SectionSem1';
import SectionSem1Intro from 'Lessons/LessonSem1/components/SectionSem1Intro';
import SectionSem1Bottom from 'Lessons/LessonSem1/components/SectionSem1Bottom';
import resultPopup from '../resultPopup.vue';
import topHeader from '../topHeader.vue';
import { Howler } from 'howler';
import SectionStory1 from './components/SectionStory1.vue';
import ImageSelectionGrid from './components/ImageSelectionGrid.vue';
import { parseLevelRangeHelper, processWordSetshelper, initializeComponenthelper, initializeExercisehelper1, loadQuestionDatahelper, createEmptyColumnhelper, resethelper, shuffleArrayhelper1, TimerFunhelper1, secondsToTimehelper1, runhelper1, practice0helper1, PracticeNexthelper1, displayWordshelper1, goToPreviousQuestionhelper1, goToNextQuestionhelper1,markAllAnswersAsReadonlyhelper1, checkCompletionhelper1, Click_NextButtonhelper1, OnNewGame_Clickhelper1,updateAvailableWordshelper1, handleColumnClickhelper1, saveQuestionStatehelper1,loadQuestionStatehelper1, recordQuestionTimehelper1 ,updateQuestionTrackinghelper1, startQuestionTrackinghelper1, showResultshelper1,generateResultsJsonhelper1 , downloadResultsJsonhelper1 , FinalResulthelper1
} from '../../common-generic-components/activityHelpers.js';
import { ContextConsumer } from 'react-is';
export default {
  name: 'Sem1',
  components: {
    SectionSem1,
    SectionSem1Bottom,
    resultPopup,
    SectionSem1Intro,
    topHeader,
    SectionStory1,
    ImageSelectionGrid,
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
      questionLimit: null,
      allowDuplicateSelections: false,
      showStory: true,
      questionTimings: [],
      questionDetails: [],
      currentQuestionStartTime: 0,
      isReviewMode: false,
      questionStates: [],
      currentQuestionIndex: 0,
      reviewTableRows: [],
      currentReviewIndex: -1,
      availableWords: [],
      previousAnswers: [],
      placedWords: [],
      selectedWord: null,
      WordForShow: '',
      columnTitles: [],
      columnVisibility: [],
      columns: [],
      rowCounts: [],
      setcount: 0,
      SetTotal: 0,
      showWords: '',
      wordsarr: [],
      isLoading: true,
      loadError: false,
      count: 0,
      Arrow_isShowing: false,
      counts: [],
      isShowing_info: false,
      showtop: false,
      timestart: 0,
      Questions_attempted: 0,
      correct_Answers: 0,
      incorrect_Answers: 0,
      Time_elapsed: '00:00:00',
      timeInSeconds: 0,
      activity_Status: "Inprogress",
      Exercise_Number: '',
      Total_Questions: 3,
      resultShow: false,
      truenextgame: false,
      showBottom: false,
      InstructionShow: true,
      JsonArrData: [],
      ResultHide: false,
      ResultArrow: false,
      canModifyAnswers: true,
      wordSets: {},          
      levelNames: {},        
      allSelectedSets: []    
    };
  },
  computed: {
    isEmuCsiLesson() {
      return (sessionStorage.getItem('jsonFile') || '') === 'EMU-CSI';
    },
    showNextButtonAlways() {
      return this.isEmuCsiLesson ? true : this.showNextButton;
    },
    showNextButton() {
      return this.truenextgame || this.isReviewMode || this.Arrow_isShowing || this.isSingleColumnMode;
    },
    showStoryButton() {
      const jsonParam = sessionStorage.getItem('jsonFile') || '';
      return ['DMU-I', 'CSU-PK', 'DMU-II'].includes(jsonParam);
    },
    isSingleColumnMode() {
      const jsonParam = sessionStorage.getItem('jsonFile') || '';
      return jsonParam === 'CSU-PK';
    },
    currentStory() {
      return this.currentSet?.story || '';
    },
    currentImage() {
      return this.currentSet?.Image || '';
    },
    currentExerciseSets() {
      return this.allSelectedSets || [];
    },
    currentSet() {
      if (!this.currentExerciseSets || !this.currentExerciseSets.length) return null;
      return this.currentExerciseSets[this.currentQuestionIndex] || null;
    },
    currentImageItems() {
      const items = [];
      if (
        this.isEmuCsiLesson &&
        this.currentSet &&
        this.currentSet.categories
      ) {
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
    },
    formattedTime() {
      const sec = this.timeInSeconds;
      const h = Math.floor(sec / 3600).toString().padStart(2, '0');
      const m = Math.floor(sec % 3600 / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
  },
  watch: {
    exercise(newVal) {
      this.initializeExercise(newVal);
    }
  },
  async mounted() {
    try {
      const jsonParam = sessionStorage.getItem('jsonFile') || 'CMCI1WBM';
      const jsonFileName = `Lesson${jsonParam}.json`;
      const response = await import(`./data/${jsonFileName}`);
      const urlParams = new URLSearchParams(window.location.search);
      this.questionLimit = parseInt(urlParams.get('questionCount')) || null;
      this.Exercise_Number = urlParams.get('Exe_Number') || sessionStorage.getItem("Exe_Number") || '1';
      this.activityQuestions = response.default || response;
      this.processWordSets();
      this.initializeComponent();
    } catch (error) {
      console.error('Error loading JSON:', error);
      this.loadError = true;
      this.isLoading = false;
    }
  },
  beforeDestroy() {
    Howler.unload();
  },
  methods: {
  getLevelKey(exerciseNumber) {
      return `level${exerciseNumber}`;
    },
  parseLevelRange(raw) {
            return parseLevelRangeHelper(this, raw);
    },
  processWordSets()
        {
          return processWordSetshelper(this);
    },
  handleWordSelected(word) {
      this.selectedWord = word;
    },
  initializeComponent() {
      return initializeComponenthelper(this);
    },
  initializeExercise(exerciseNum) {
      return initializeExercisehelper1(this,exerciseNum);
    },
  loadQuestionData(currentSet) {
     return  loadQuestionDatahelper(this,currentSet);
     
    },
  createEmptyColumn(count) {
       return createEmptyColumnhelper(count);
    },
  reset() {
     return resethelper(this);
    },
  shuffleArray(array) {
     return shuffleArrayhelper1(array);
    },
  TimerFun() {
      return TimerFunhelper1(this);
    },
  secondsToTime(totalSeconds) {
     return secondsToTimehelper1(totalSeconds);
    },
  run() {
     return runhelper1 (this);
    },
  practice0() {
     return practice0helper1(this);
    },
  PracticeNext() {
      return PracticeNexthelper1(this);
    },
  displayWords() {
     return displayWordshelper1(this);
    },
  markAllAnswersAsReadonly() {
     return markAllAnswersAsReadonlyhelper1(this);
    },
  goToPreviousQuestion() {
    return goToPreviousQuestionhelper1(this);
    },
  goToNextQuestion() {
      return goToNextQuestionhelper1(this);
    },
  checkCompletion(updateCounters = true) {
      return checkCompletionhelper1(this,updateCounters = true);
    },
  Click_NextButton() {
      return Click_NextButtonhelper1(this);
    },
  OnNewGame_Click() {
    return OnNewGame_Clickhelper1(this)
    },
  handleWordSelection(word) {
      this.selectedWord = word;
    },
  updateAvailableWords() {
     return updateAvailableWordshelper1(this);
    },
  handleColumnClick(colIndex, itemIndex) {
     return handleColumnClickhelper1(this,colIndex, itemIndex)
    },
  saveQuestionState() {
     return saveQuestionStatehelper1(this);
    },
  loadQuestionState(index) {
      return loadQuestionStatehelper1(this,index)
    },
  startQuestionTimer() {
      this.currentQuestionStartTime = Date.now();
    },
  recordQuestionTime() {
      return recordQuestionTimehelper1(this);
    },
  updateQuestionTracking(isCorrect) {
     return updateQuestionTrackinghelper1(this, isCorrect);
    },
  startQuestionTracking() {
     return startQuestionTrackinghelper1(this);
    },
  showResults() {
      return showResultshelper1(this);
    },
  generateResultsJson() {
     return generateResultsJsonhelper1(this);
    },
  downloadResultsJson() {
    return downloadResultsJsonhelper1(this)
    },
  FinalResult() {
     return FinalResulthelper1(this);
    }
  }
};
</script>

<style>
.loading-message,
.error-message {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}
.loading-message { color: #666; }
.error-message { color: #d32f2f; }

.content-container {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  margin-bottom: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  padding: 1.25rem;
}

.story-toggle {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.story-toggle-btn {
  padding: 0.625rem 2.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.3s;
}
.story-toggle-btn:hover {
  background-color: #2563eb;
}

.word-item {
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
}
.word-item:hover { background: #e0e0e0; }
.disabled-word {
  opacity: 0.5;
  pointer-events: none;
  text-decoration: line-through;
}
.readonly-answer {
  pointer-events: none;
  opacity: 0.9;
}
</style>
