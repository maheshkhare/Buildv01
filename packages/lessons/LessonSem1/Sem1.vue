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

            <div v-if="showStoryButton && !resultShow">
              <button
                @click="showStory = !showStory"
                class="px-10 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {{ showStory ? 'Hide Story' : 'Show Story' }}
              </button>
              <SectionStory1 
                v-if="showStory" 
                :story="currentStory" 
                :image="currentImage" 
              />
           -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            </div>

            <ImageSelectionGrid
              v-if="isEmuCsiLesson && !resultShow"
              :imageItems="currentImageItems"
              :placedWords="placedWords"
              @word-selected="handleWordSelected"
            />

            <SectionSem1
              v-else
              :showWords="availableWords"
              :acceptInput="canModifyAnswers"
              :isShowing_info="isShowing_info"
              :showtop="showtop"
              @OnWord_Click="handleWordSelection"
              @OnNewGame_Click="OnNewGame_Click"
              @Ontext_Click="Ontext_Click"
            />
          </div>

          <div>
            <SectionSem1Bottom
              :show-next-button="showNextButton"
              :show-previous-button="currentQuestionIndex > 0"
              :isReviewMode="isReviewMode"
              :reviewTableRows="reviewTableRows"
              :accept-input="canModifyAnswers"
              :columns="columns"
              :column-titles="columnTitles"
              :column-visibility="columnVisibility"
              :row-counts="rowCounts"
              :highlight="highlightBottom"
              :showBottom="showBottom"
              :Arrow_isShowing="Arrow_isShowing || isSingleColumnMode"
              @OnClicked_Col="handleColumnClick"
              @Click_NextButton="Click_NextButton"
              @Click_PreviousButton="goToPreviousQuestion"
            />

            <resultPopup
              v-show="resultShow"
              :activity_Status="activity_Status"
              :Time_elapsed="Time_elapsed"
              :Questions_attempted="Questions_attempted"
              :correct_Answers="correct_Answers"
              :incorrect_Answers="incorrect_Answers"
              @FinalResult="FinalResult"
              @download-results="downloadResultsJson"
              :ResultHide="ResultHide"
              :ResultArrow="ResultArrow"
            />
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
      wordSets: {},          // grouped by level (optional)
      levelNames: {},        // level names for subtitle
      allSelectedSets: []    // flattened combined sets for navigation & display
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
      // Return the unified flat list of selected question sets
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
      if (typeof raw === 'number') return [raw];
      if (typeof raw === 'string') {
        raw = raw.trim();
        if (/^\d+$/.test(raw)) return [parseInt(raw)];
        const rangeMatch = raw.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          const [min, max] = rangeMatch.slice(1).map(Number);
          if (min > max) return [min];
          return Array.from({ length: max - min + 1 }, (_, i) => min + i);
        }
      }
      return [1];
    },

    processWordSets() {
      this.wordSets = {};
      this.levelNames = {};

      const selectedLevels = this.parseLevelRange(this.Exercise_Number);
      let questionLimit = this.questionLimit || 1;

      // Calculate total available question sets across selected levels
      let totalAvailable = 0;
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.activityQuestions.sets && this.activityQuestions.sets[levelKey]) || [];
        totalAvailable += sets.length;
      });

      if (totalAvailable < questionLimit) {
        alert(`Not enough total question sets in selected levels. Required: ${questionLimit}, Available: ${totalAvailable}. Proceeding with ${totalAvailable}.`);
        questionLimit = totalAvailable;
        this.questionLimit = totalAvailable;
      }

      // Combine all sets from selected levels into flat array
      let combinedSets = [];
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (this.activityQuestions.sets && this.activityQuestions.sets[levelKey]) || [];
        combinedSets.push(...sets.map(set => ({ ...set, __level: levelKey })));
      });

      // Shuffle combined sets
      combinedSets = combinedSets.sort(() => Math.random() - 0.5);

      // Slice for requested limit
      const selectedSets = combinedSets.slice(0, questionLimit);

      // Save flat array for navigation & display
      this.allSelectedSets = selectedSets;

      // Optionally group again by level for subtitles or info
      this.wordSets = selectedSets.reduce((acc, set) => {
        const key = set.__level || 'level1';
        if (!acc[key]) acc[key] = [];
        acc[key].push(set);
        return acc;
      }, {});

      // Set levelNames for subtitle display
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        this.levelNames[level] = this.wordSets[levelKey]?.[0]?.levelName || `Level ${level}`;
      });

      this.Total_Questions = questionLimit;
    },

    handleWordSelected(word) {
      this.selectedWord = word;
    },

    initializeComponent() {
      const activityName = sessionStorage.getItem("ActivityName");
      this.language = sessionStorage.getItem("lang") || 'en';

      // Set exercise just for subtitle display convenience
      const firstLevel = this.parseLevelRange(this.Exercise_Number)[0];
      this.exercise = parseInt(firstLevel) || 1;
      const levelKey = this.getLevelKey(firstLevel);
      const currentSets = this.wordSets[levelKey];
      const levelName = currentSets?.[0]?.levelName || this.levelNames[firstLevel] || `Level ${firstLevel}`;
      this.componentSubtitle = levelName;

      this.run();
      this.TimerFun();
      this.isLoading = false;
    },

    initializeExercise(exerciseNum) {
      this.Questions_attempted = 0;
      this.correct_Answers = 0;
      this.incorrect_Answers = 0;
      this.questionTimings = [];
      this.questionDetails = [];
      this.reset();
      this.questionStates = [];
      this.currentQuestionIndex = 0;
      this.setcount = 0;
      this.Exercise_Number = exerciseNum;
      this.Total_Questions = this.currentExerciseSets.length;
      if (this.currentExerciseSets.length > 0) {
        this.displayWords();
      }
    },

    loadQuestionData(currentSet) {
      this.reset();
      this.Arrow_isShowing = false;
      this.truenextgame = false;
      this.columnTitles = currentSet.categories.map(cat => 
        cat.displayName || cat.name || ''
      );
      this.columnVisibility = currentSet.categories.map(() => !this.isSingleColumnMode);
      this.wordsarr = [];
      currentSet.categories.forEach(category => {
        if (category?.words) {
          this.wordsarr = [...this.wordsarr, ...category.words];
        }
      });
      this.wordsarr = this.shuffleArray(this.wordsarr);
      this.availableWords = [...this.wordsarr];
      this.placedWords = [];
      this.selectedWord = null;
      const maxWords = this.isSingleColumnMode
        ? currentSet.categories[0].words.length 
        : Math.max(...currentSet.categories.map(cat => cat.words.length));
      const columnLength = Math.max(8, Math.ceil(maxWords * 1.2));
      this.columns = currentSet.categories.map(() => 
        this.createEmptyColumn(columnLength)
      );
      this.counts = currentSet.categories.map(() => 0);
      if (this.isSingleColumnMode) {
        this.columnTitles = [this.columnTitles[0]];
        this.columnVisibility = [true];
        this.columns = [this.columns[0]];
        this.Arrow_isShowing = true;
      }
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

    reset() {
      this.wordsarr = [];
      this.count = 0;
      this.placedWords = [];
      this.selectedWord = null;
      this.Arrow_isShowing = false;
      this.columns.forEach(column => {
        column.forEach(item => {
          item.name = '';
          item.state = 'base';
        });
      });
    },

    shuffleArray(array) {
      let counter = array.length, temp, index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    },

    TimerFun() {
      this.timerInterval = setInterval(() => {
        if (this.timestart <= 9999999999) {
          this.timestart += 1;
        }
      }, 1000);
    },

    secondsToTime(totalSeconds) {
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor(totalSeconds % 3600 / 60).toString().padStart(2, '0');
      const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    },

    run() {
      if (Object.keys(this.wordSets).length > 0) {
        if (this.mode === 'instruction') {
          this.InstructionShow = true;
        } else {
          this.practice0();
        }
      } else {
        console.log('Waiting for data to load...');
      }
    },

    practice0() {
      this.InstructionShow = false;
      this.showtop = true;
      this.displayWords();
    },

    PracticeNext() {
      this.InstructionShow = false;
      this.practice0();
    },

    displayWords() {
      this.showtop = true;
      this.showBottom = true;
      this.startQuestionTracking();
      if (!this.currentExerciseSets || this.currentExerciseSets.length === 0) {
        console.error('No exercise sets available');
        return;
      }
      const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) {
        console.error('Current set not found or has no categories');
        return;
      }
      if (!this.questionStates[this.currentQuestionIndex]) {
        this.loadQuestionData(currentSet);
        this.canModifyAnswers = true;
      } else {
        this.loadQuestionState(this.currentQuestionIndex);
        this.canModifyAnswers = this.currentQuestionIndex >= this.setcount;
        if (!this.canModifyAnswers) {
          this.markAllAnswersAsReadonly();
        }
      }
      this.SetTotal = this.wordsarr.length;
      this.resultShow = false;
    },

    markAllAnswersAsReadonly() {
      this.columns.forEach(column => {
        column.forEach(item => {
          if (item.name) item.state = 'readonly';
        });
      });
    },

    goToPreviousQuestion() {
      this.recordQuestionTime();
      if (this.currentQuestionIndex > 0) {
        this.saveQuestionState();
        this.currentQuestionIndex--;
        this.canModifyAnswers = this.currentQuestionIndex >= this.setcount;
        this.loadQuestionState(this.currentQuestionIndex);
        if (!this.canModifyAnswers) {
          this.markAllAnswersAsReadonly();
        }
        if (this.isReviewMode) {
          this.currentReviewIndex = this.currentQuestionIndex;
        }
        this.truenextgame = true;
        this.Arrow_isShowing = this.questionStates[this.currentQuestionIndex]?.Arrow_isShowing || false;
        this.startQuestionTimer();
        this.isShowing_info = false;
        this.resultShow = false;
      }
    },

    goToNextQuestion() {
      const isCorrect = this.checkCompletion(false);
      this.updateQuestionTracking(isCorrect);
      if (this.currentQuestionIndex < this.currentExerciseSets.length - 1) {
        this.saveQuestionState();
        this.currentQuestionIndex++;
        const wasPreviouslyAnswered = this.currentQuestionIndex <= this.setcount;
        this.canModifyAnswers = !wasPreviouslyAnswered ||
              (this.questionStates[this.currentQuestionIndex]?.placedWords?.length < 
              this.questionStates[this.currentQuestionIndex]?.wordsarr?.length);
        if (wasPreviouslyAnswered) {
          this.loadQuestionState(this.currentQuestionIndex);
          if (!this.canModifyAnswers) {
            this.markAllAnswersAsReadonly();
          }
        } else {
          this.setcount = this.currentQuestionIndex;
          this.reset();
          const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
          this.loadQuestionData(currentSet);
        }
        this.Arrow_isShowing = this.placedWords.length === this.wordsarr.length;
        this.truenextgame = false;
      }
      this.startQuestionTimer();
    },

    checkCompletion(updateCounters = true) {
      const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) return false;
      if (this.isSingleColumnMode) {
        const firstCategory = currentSet.categories[0];
        if (!firstCategory) return false;
        const correctWords = this.columns[0].filter(item => item.name && firstCategory.words.includes(item.name)).length;
        const isCorrect = correctWords === firstCategory.words.length;
        if (updateCounters) {
          if (isCorrect) this.correct_Answers++;
          else this.incorrect_Answers++;
          this.Questions_attempted++;
        }
        return isCorrect;
      } else {
        const isCorrect = currentSet.categories.every((category, index) => {
          if (index >= this.columns.length) return false;
          return this.columns[index].filter(item => 
            item.name && category.words.includes(item.name)
          ).length === category.words.length;
        });
        if (updateCounters) {
          if (isCorrect) this.correct_Answers++;
          else this.incorrect_Answers++;
          this.Questions_attempted++;
        }
        return isCorrect;
      }
    },

    Click_NextButton() {
      this.Arrow_isShowing = false;
      this.isShowing_info = true;
      this.truenextgame = false;
      const isCorrect = this.checkCompletion();
      this.updateQuestionTracking(isCorrect);
      this.saveQuestionState();
      if (this.currentQuestionIndex < this.currentExerciseSets.length - 1) {
        this.goToNextQuestion();
      } else {
        this.showResults();
      }
    },

    OnNewGame_Click() {
      if (this.isReviewMode) {
        this.isReviewMode = false;
        this.currentReviewIndex = -1;
      }
      if (this.truenextgame === true) {
        this.truenextgame = false;
        this.goToNextQuestion();
      }
    },

    handleWordSelection(word) {
      this.selectedWord = word;
    },

    updateAvailableWords() {
      const allWordsPlaced = this.wordsarr.length === this.placedWords.length;
      this.Arrow_isShowing = allWordsPlaced;
      this.canModifyAnswers = !allWordsPlaced;
      this.saveQuestionState();
    },

    handleColumnClick(colIndex, itemIndex) {
      if (!this.canModifyAnswers) return;
      const column = this.columns[colIndex];
      const item = column[itemIndex];
      if (!item.name && this.selectedWord) {
        item.name = this.selectedWord;
        this.placedWords.push(this.selectedWord);
        const wordIndex = this.availableWords.indexOf(this.selectedWord);
        if (wordIndex > -1) this.availableWords.splice(wordIndex, 1);
        this.selectedWord = null;
        this.updateAvailableWords();
      } else if (item.name && !this.selectedWord) {
        const returnedWord = item.name;
        item.name = '';
        const placedIndex = this.placedWords.indexOf(returnedWord);
        if (placedIndex > -1) this.placedWords.splice(placedIndex, 1);
        this.availableWords.push(returnedWord);
        this.updateAvailableWords();
      }
    },

    saveQuestionState() {
      this.questionStates[this.currentQuestionIndex] = {
        columns: JSON.parse(JSON.stringify(this.columns)),
        columnTitles: [...this.columnTitles],
        columnVisibility: [...this.columnVisibility],
        placedWords: [...this.placedWords],
        availableWords: [...this.availableWords],
        selectedWord: this.selectedWord,
        Arrow_isShowing: this.Arrow_isShowing,
        wordsarr: [...this.wordsarr],
        counts: [...this.counts],
        isCompleted: this.placedWords.length === this.wordsarr.length,
        wasModified: this.canModifyAnswers
      };
    },

    loadQuestionState(index) {
      const state = this.questionStates[index];
      if (state) {
        this.columns = JSON.parse(JSON.stringify(state.columns));
        this.columnTitles = [...state.columnTitles];
        this.columnVisibility = [...state.columnVisibility];
        this.placedWords = [...state.placedWords];
        this.availableWords = [...state.availableWords];
        this.selectedWord = state.selectedWord;
        this.Arrow_isShowing = state.Arrow_isShowing;
        this.wordsarr = [...state.wordsarr];
        this.counts = [...state.counts];
        this.canModifyAnswers = state.wasModified;
        if (!this.canModifyAnswers) {
          this.markAllAnswersAsReadonly();
        }
      }
    },

    startQuestionTimer() {
      this.currentQuestionStartTime = Date.now();
    },

    recordQuestionTime() {
      if (this.currentQuestionStartTime) {
        const timeTaken = Date.now() - this.currentQuestionStartTime;
        this.questionTimings[this.currentQuestionIndex] = timeTaken;
        this.currentQuestionStartTime = 0;
      }
    },

    updateQuestionTracking(isCorrect) {
      if (this.currentQuestionStartTime) {
        const timeTaken = Date.now() - this.currentQuestionStartTime;
        this.questionTimings[this.currentQuestionIndex] = timeTaken;
        this.questionDetails[this.currentQuestionIndex] = {
          ...this.questionDetails[this.currentQuestionIndex],
          timeTaken: timeTaken,
          isCompleted: true,
          wasCorrect: isCorrect
        };
        this.currentQuestionStartTime = 0;
      }
    },

    /**
     * Required method to avoid error:
     */
    startQuestionTracking() {
      this.currentQuestionStartTime = Date.now();
      if (!this.questionDetails[this.currentQuestionIndex]) {
        const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
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

    showResults() {
      this.activity_Status = "Completed";
      this.Time_elapsed = this.secondsToTime(this.timestart);
      this.timeInSeconds = this.timestart;
      this.resultShow = true;
      this.InstructionShow = false;
      this.isShowing_info = false;
      this.truenextgame = false;
      this.showtop = false;
      this.showBottom = false;
      this.ResultHide = true;
      this.ResultArrow = false;
      this.JsonArrData = JSON.stringify(this.generateResultsJson());
    },

    generateResultsJson() {
      return {
        activityStatus: this.activity_Status,
        totalTime: this.timeInSeconds,
        questionTimings: this.questionTimings,
        questionsAttempted: this.Questions_attempted,
        correctAnswers: this.correct_Answers,
        incorrectAnswers: this.incorrect_Answers,
        exerciseNumber: this.exercise,
        exerciseName: this.levelNames[this.exercise] || `Level ${this.exercise}`,
        totalQuestions: this.currentExerciseSets.length,
        displayedQuestions: this.questionDetails.filter(q => q.wasDisplayed).length,
        detailedResults: this.questionDetails
      };
    },

    downloadResultsJson() {
      const data = this.generateResultsJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `classification_results_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    FinalResult() {
      const curSite = window.location.protocol + "//" + window.location.host;
      const Url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${this.CollectionResult}&Activityresult=${this.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
      window.location.href = Url;
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
