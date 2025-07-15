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
        ></topHeader>
      </div>
      <div class="rows-12">
        <div
          style="
            margin-left: 5%;
            margin-right: 5%;
            margin-top: 2%;
            margin-bottom: 5%;
          "
          class="content-center justify-center border border-black p-5 ..."
        >
          <div>
            <SectionSem1Intro
              v-show="InstructionShow"
              @PracticeNext="PracticeNext"
            ></SectionSem1Intro>
            <SectionSem1
              :accept-input="canModifyAnswers"
              :highlight="highlightBottom"
              :showWords="availableWords"
              :isShowing_info="isShowing_info"
              :showtop="showtop"
              @OnNewGame_Click="OnNewGame_Click"
              @Ontext_Click="Ontext_Click"
              @OnWord_Click="handleWordSelection"
            ></SectionSem1>
          </div>

          <div>
            <SectionSem1Bottom
              :show-next-button="truenextgame || isReviewMode || Arrow_isShowing"
              :show-previous-button="currentQuestionIndex > 0"
              :isReviewMode="isReviewMode"
              :reviewTableRows="reviewTableRows"
              :accept-input="canModifyAnswers"
              :FirstColumn="FirstColumn"
              :SecondColumn="SecondColumn"
              :ThirdColumn="ThirdColumn"
              :FourthColumn="FourthColumn"
              :title1="title1"
              :title2="title2"
              :title3="title3"
              :title4="title4"
              :highlight="highlightBottom"
              :Listthird="Listthird"
              :Listfourth="Listfourth"
              :FirstRowCount="FirstRowCount"
              :SecondRowCount="SecondRowCount"
              :ThirdRowCount="ThirdRowCount"
              :FourthRowCount="FourthRowCount"
              :showBottom="showBottom"
              :Arrow_isShowing="Arrow_isShowing"
              @OnClicked_FirstCol="OnClicked_FirstCol"
              @OnClicked_SecondCol="OnClicked_SecondCol"
              @OnClicked_ThirdCol="OnClicked_ThirdCol"
              @OnClicked_FourthCol="OnClicked_FourthCol"
              @Click_NextButton="Click_NextButton"
              @Click_PreviousButton="goToPreviousQuestion"
            ></SectionSem1Bottom>

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
            ></resultPopup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import Vue from 'vue'
import baseMixin from 'Scripts/mixinBaseLesson'
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne'
import { generateLessonHowls } from 'Scripts/utility'
import SectionSem1 from 'Lessons/Sem1/components/SectionSem1'
import SectionSem1Intro from 'Lessons/Sem1/components/SectionSem1Intro'
import SectionSem1Bottom from 'Lessons/Sem1/components/SectionSem1Bottom'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import { Howler } from 'howler'

export default {
  name: 'Sem1',
  components: {
    OneToThreeVertical,
    SectionSem1,
    SectionSem1Bottom,
    resultPopup,
    SectionSem1Intro,
    topHeader
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
  data: () => ({
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
    title1: '', title2: '', title3: '', title4: '',
    Listthird: false,
    Listfourth: false,
    setcount: 0,
    SetTotal: 0,
    showWords: '',
    wordsarr: [],
    isLoading: true,
    loadError: false,
    count: 0,
    Arrow_isShowing: false,
    count1: 0, count2: 0, count3: 0, count4: 0,
    FirstRowCount: 0,
    SecondRowCount: 0,
    ThirdRowCount: 0,
    FourthRowCount: 0,
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
    wordSets: {
      twoCategories: [],
      threeCategories: [],
      fourCategories: []
    },
    FirstColumn: [
      { shape: 'square', index: 0, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 1, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 2, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 3, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 4, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 5, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 6, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 7, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' }
    ],
    SecondColumn: [
      { shape: 'square', index: 0, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 1, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 2, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 3, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 4, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 5, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 6, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 7, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' }
    ],
    ThirdColumn: [
      { shape: 'square', index: 0, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 1, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 2, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 3, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 4, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 5, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 6, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 7, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' }
    ],
    FourthColumn: [
      { shape: 'square', index: 0, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 1, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 2, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 3, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 4, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 5, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 6, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' },
      { shape: 'square', index: 7, size: 'xl', width: 'wide', height: 'normal', color: 'white', name: '', state: 'base' }
    ]
  }),

  computed: {
    currentExerciseSets() {
      if (!this.wordSets) return [];
      const sets = {
        0: this.wordSets.twoCategories || [],
        1: this.wordSets.threeCategories || [],
        2: this.wordSets.fourCategories || []
      };
      return sets[this.exercise] || [];
    },
    
    currentSet() {
      if (!this.currentExerciseSets || !this.currentExerciseSets.length) return null;
      return this.currentExerciseSets[this.currentQuestionIndex] || null;
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
      const urlParams = new URLSearchParams(window.location.search);
      const jsonParam = urlParams.get('Json') || 'CMCI1WBM';
      
      const possiblePaths = [
        `/Lesson${jsonParam}.json`,
        `/data/Lesson${jsonParam}.json`,
        `./Lesson${jsonParam}.json`,
        `./components/Lesson${jsonParam}.json`
      ];
      
      let response;
      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) break;
        } catch (e) {
          console.log(`Failed to load from ${path}`);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error('Could not load JSON from any path');
      }
      
      const wordSetsData = await response.json();
      
      this.wordSets = {
        twoCategories: wordSetsData?.sets?.twoCategories || [],
        threeCategories: wordSetsData?.sets?.threeCategories || [],
        fourCategories: wordSetsData?.sets?.fourCategories || []
      };
      
      this.initializeComponent();
    } catch (error) {
      console.error('Error:', error);
      this.loadError = true;
      this.isLoading = false;
    }
  },

  beforeDestroy() {
    Howler.unload();
  },

  methods: {
    initializeComponent() {
      const activityName = sessionStorage.getItem("ActivityName");
      this.language = sessionStorage.getItem("lang") || 'en';
      
      if (activityName && activityName.includes('instruction')) {
        this.instruction = parseInt(sessionStorage.getItem("Exe_Number")) || 1;
        this.componentSubtitle = `Classifying Concepts`;
      } else {
        this.exercise = parseInt(sessionStorage.getItem("Exe_Number")) || 0;
        this.componentSubtitle = `Classifying Concepts`;
      }
      
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
      
      this.wordSets = this.wordSets || {
        twoCategories: [],
        threeCategories: [],
        fourCategories: []
      };
      
      this.reset();
      this.questionStates = [];
      this.currentQuestionIndex = 0;
      this.setcount = 0;
      
      switch(exerciseNum) {
        case 0:
          this.Exercise_Number = 1;
          this.Listthird = false;
          this.Listfourth = false;
          this.FirstRowCount = 7;
          this.SecondRowCount = 7;
          this.ThirdRowCount = 7;
          this.FourthRowCount = 7;
          this.Total_Questions = Math.min(3, this.currentExerciseSets.length);
          break;
        case 1:
          this.Exercise_Number = 2;
          this.Listthird = true;
          this.Listfourth = false;
          this.FirstRowCount = 8;
          this.SecondRowCount = 8;
          this.ThirdRowCount = 8;
          this.FourthRowCount = 8;
          this.Total_Questions = Math.min(6, this.currentExerciseSets.length);
          break;
        case 2:
          this.Exercise_Number = 3;
          this.Listthird = true;
          this.Listfourth = true;
          this.FirstRowCount = 8;
          this.SecondRowCount = 8;
          this.ThirdRowCount = 8;
          this.FourthRowCount = 8;
          this.Total_Questions = Math.min(8, this.currentExerciseSets.length);
          break;
      }
      
      if (this.currentExerciseSets?.length > 0) {
        this.displayWords();
      }
    },

    saveQuestionState() {
      this.questionStates[this.currentQuestionIndex] = {
        FirstColumn: JSON.parse(JSON.stringify(this.FirstColumn)),
        SecondColumn: JSON.parse(JSON.stringify(this.SecondColumn)),
        ThirdColumn: JSON.parse(JSON.stringify(this.ThirdColumn)),
        FourthColumn: JSON.parse(JSON.stringify(this.FourthColumn)),
        placedWords: [...this.placedWords],
        availableWords: [...this.availableWords],
        selectedWord: this.selectedWord,
        Arrow_isShowing: this.Arrow_isShowing,
        title1: this.title1,
        title2: this.title2,
        title3: this.title3,
        title4: this.title4,
        wordsarr: [...this.wordsarr],
        count1: this.count1,
        count2: this.count2,
        count3: this.count3,
        count4: this.count4,
        isCompleted: this.placedWords.length === this.wordsarr.length,
        wasModified: this.canModifyAnswers
      };
    },

    loadQuestionState(index) {
      const state = this.questionStates[index];
      if (state) {
        this.FirstColumn = JSON.parse(JSON.stringify(state.FirstColumn));
        this.SecondColumn = JSON.parse(JSON.stringify(state.SecondColumn));
        this.ThirdColumn = JSON.parse(JSON.stringify(state.ThirdColumn));
        this.FourthColumn = JSON.parse(JSON.stringify(state.FourthColumn));
        this.placedWords = [...state.placedWords];
        this.availableWords = [...state.availableWords];
        this.selectedWord = state.selectedWord;
        this.Arrow_isShowing = state.Arrow_isShowing;
        this.title1 = state.title1;
        this.title2 = state.title2;
        this.title3 = state.title3;
        this.title4 = state.title4;
        this.wordsarr = [...state.wordsarr];
        this.count1 = state.count1;
        this.count2 = state.count2;
        this.count3 = state.count3;
        this.count4 = state.count4;
        
        this.canModifyAnswers = !state.isCompleted;
        
        if (!this.canModifyAnswers) {
          this.markAllAnswersAsReadonly();
        }
      }
    },

    loadQuestionData(currentSet) {
      this.reset();
      
      this.FirstColumn = this.createEmptyColumn();
      this.SecondColumn = this.createEmptyColumn();
      this.ThirdColumn = this.createEmptyColumn();
      this.FourthColumn = this.createEmptyColumn();

      this.title1 = currentSet.categories[0]?.displayName || currentSet.categories[0]?.name || '';
      this.title2 = currentSet.categories[1]?.displayName || currentSet.categories[1]?.name || '';
      this.title3 = currentSet.categories[2]?.displayName || currentSet.categories[2]?.name || '';
      this.title4 = currentSet.categories[3]?.displayName || currentSet.categories[3]?.name || '';
      
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
    },

    createEmptyColumn(count = 8) {
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

    goToPreviousQuestion() {
      this.updateQuestionTracking(false); 

      if (this.currentQuestionIndex > 0) {
        this.saveQuestionState();
        this.currentQuestionIndex--;
        this.canModifyAnswers = this.currentQuestionIndex >= this.setcount;
        this.loadQuestionState(this.currentQuestionIndex);
        
        if (!this.canModifyAnswers) {
          this.markAllAnswersAsReadonly();
        }
        
        this.truenextgame = true;
        this.Arrow_isShowing = this.questionStates[this.currentQuestionIndex]?.Arrow_isShowing || false;
      }
      this.startQuestionTimer();
      this.startQuestionTracking();
    },

    goToNextQuestion() {
      const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
      const isCorrect = currentSet.categories.every((category, index) => {
        const column = [this.FirstColumn, this.SecondColumn, this.ThirdColumn, this.FourthColumn][index];
        return column.filter(item => item.name && category.words.includes(item.name)).length === category.words.length;
      });
      
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
        
        if (this.currentQuestionIndex === this.currentExerciseSets.length - 1 && 
            this.placedWords.length === this.wordsarr.length) {
          this.checkCompletion();
        }
      }
      this.startQuestionTimer();
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
        this.FirstRowCount = 7;
        this.SecondRowCount = 7;
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

    randomPicker: function (optionArray) {
      return optionArray[
        Math.floor(Math.random() * Math.floor(optionArray.length))
      ]
    },
    
    prepareReviewTable() {
      this.reviewTableRows = [];
      const maxRows = Math.max(
        this.FirstColumn.filter(i => i.name).length,
        this.SecondColumn.filter(i => i.name).length,
        this.ThirdColumn.filter(i => i.name).length,
        this.FourthColumn.filter(i => i.name).length
      );
      
      for (let i = 0; i < maxRows; i++) {
        this.reviewTableRows.push({
          col1: this.FirstColumn[i]?.name || '',
          col2: this.SecondColumn[i]?.name || '',
          col3: this.ThirdColumn[i]?.name || '',
          col4: this.FourthColumn[i]?.name || ''
        });
      }
    },

    handleWordSelection(word) {
      if (!this.placedWords.includes(word)) {
        this.selectedWord = word
      }
    },

    updateAvailableWords() {
      this.availableWords = this.wordsarr.filter(word => !this.placedWords.includes(word));
      this.Arrow_isShowing = this.placedWords.length === this.wordsarr.length;
      this.canModifyAnswers = !this.Arrow_isShowing;
      this.saveQuestionState();
    },

    checkCompletion() {
      const answeredQuestions = this.questionStates.filter(state => 
        state?.placedWords?.length === state?.wordsarr?.length
      ).length;
      
      if (answeredQuestions >= this.Total_Questions) {
        this.showResults();
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

    OnClicked_FirstCol(index) {
      if (!this.canModifyAnswers) return;

      if (!this.selectedWord && this.FirstColumn[index].name) {
        const returnedWord = this.FirstColumn[index].name;
        this.FirstColumn[index].name = '';
        this.placedWords = this.placedWords.filter(word => word !== returnedWord);
        this.availableWords.push(returnedWord);
        this.updateAvailableWords();
        return;
      }
      
      if (this.selectedWord && this.FirstColumn[index].name === "") {
        this.FirstColumn[index].name = this.selectedWord;
        this.placedWords.push(this.selectedWord);
        this.selectedWord = null;
        this.updateAvailableWords();
      }
    },

    OnClicked_SecondCol(index) {
      if (!this.selectedWord && this.SecondColumn[index].name) {
        const returnedWord = this.SecondColumn[index].name
        this.SecondColumn[index].name = ''
        this.placedWords = this.placedWords.filter(word => word !== returnedWord)
        this.updateAvailableWords()
        return
      }
      
      if (this.selectedWord && this.SecondColumn[index].name === "") {
        this.SecondColumn[index].name = this.selectedWord
        this.placedWords.push(this.selectedWord)
        this.selectedWord = null
        this.updateAvailableWords()
      }
    },

    OnClicked_ThirdCol(index) {
      if (!this.selectedWord && this.ThirdColumn[index].name) {
        const returnedWord = this.ThirdColumn[index].name
        this.ThirdColumn[index].name = ''
        this.placedWords = this.placedWords.filter(word => word !== returnedWord)
        this.updateAvailableWords()
        return
      }
      
      if (this.selectedWord && this.ThirdColumn[index].name === "") {
        this.ThirdColumn[index].name = this.selectedWord
        this.placedWords.push(this.selectedWord)
        this.selectedWord = null
        this.updateAvailableWords()
      }
    },

    OnClicked_FourthCol(index) {
      if (!this.selectedWord && this.FourthColumn[index].name) {
        const returnedWord = this.FourthColumn[index].name
        this.FourthColumn[index].name = ''
        this.placedWords = this.placedWords.filter(word => word !== returnedWord)
        this.updateAvailableWords()
        return
      }
      
      if (this.selectedWord && this.FourthColumn[index].name === "") {
        this.FourthColumn[index].name = this.selectedWord
        this.placedWords.push(this.selectedWord)
        this.selectedWord = null
        this.updateAvailableWords()
      }
    },

    FinalResult() {
      const curSite = window.location.protocol + "//" + window.location.host
      const Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${this.CollectionResult}&Activityresult=${this.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`
      window.location.href = Url
    },

    TimerFun() {
      setInterval(() => {
        if (this.timestart > 9999999999) {
        } else {
          this.timestart += 1
        }
      }, 1000)
    },

    secondsToTime(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },

    formatPopupTime(seconds) {
      return this.secondsToTime(seconds);
    },

    clearanstxt() {
      this.correct_Answers = 0
      this.incorrect_Answers = 0
      this.timestart = 0
      this.timeInSeconds = 0
      this.Time_elapsed = '00:00:00'
    },

    shuffleArray(array) {
      var counter = array.length, temp, index
      while (counter > 0) {
        index = Math.floor(Math.random() * counter)
        counter--
        temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
      }
      return array
    },

    reset() {
      this.wordsarr = []
      this.count = 0
      this.placedWords = []
      this.selectedWord = null
      this.Arrow_isShowing = false
      
      this.FirstColumn.forEach(item => {
        item.name = ''
        item.state = 'base'
      })
      
      this.SecondColumn.forEach(item => {
        item.name = ''
        item.state = 'base'
      })
      
      this.ThirdColumn.forEach(item => {
        item.name = ''
        item.state = 'base'
      })
      
      this.FourthColumn.forEach(item => {
        item.name = ''
        item.state = 'base'
      })
    },

    markAllAnswersAsReadonly() {
      const columns = [this.FirstColumn, this.SecondColumn, this.ThirdColumn, this.FourthColumn];
      columns.forEach(column => {
        column.forEach(item => {
          if (item.name) item.state = 'readonly';
        });
      });
    },

    Click_NextButton() {
      this.Arrow_isShowing = false;
      this.isShowing_info = true;
      
      const currentSet = this.currentExerciseSets[this.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) return;

      const isCorrect = currentSet.categories.every((category, index) => {
        const column = [this.FirstColumn, this.SecondColumn, this.ThirdColumn, this.FourthColumn][index];
        return column.filter(item => item.name && category.words.includes(item.name)).length === category.words.length;
      });

      this.updateQuestionTracking(isCorrect);

      if (isCorrect) {
        this.correct_Answers++;
      } else {
        this.incorrect_Answers++;
      }

      this.Questions_attempted++;
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

    Ontext_Click() {
      const audioFiles = [
        'Truck', 'Airplane', 'Car', 'Wagon', 'Train', 'Baby', 'Painter', 'Woman', 'Daddy', 'Girl'
      ];

      const sound = this.showWords
      const Howls = generateLessonHowls(
        audioFiles,
        'Sem1',
        this.language
      )

      Howls[sound].on('end', () => {
        setTimeout(() => {}, 500)
      })

      Howls[sound].play()
    },

    practice0() {
      this.InstructionShow = false
      this.showtop = true
      this.displayWords()
      this.exercise
    },

    PracticeNext() {
      this.InstructionShow = false
      this.practice0()
    },

    instruction0() {
      this.showtop = true
      this.showBottom = true
      this.FirstRowCount = 7
      this.SecondRowCount = 7
      this.ThirdRowCount = 7
      this.FourthRowCount = 7
      

      const audioFiles = [
        'WordsApper', 'PutinCorrectlist', 'Nextavaialblespace', 'Tohearclickonit', 'Changeyourmind',
        'Yellowarrowapper', 'Clickonarrow', 'Readytostart'
      ]
      
      const Howls = generateLessonHowls(
        audioFiles,
        'Sem1',
        this.language
      )

      Howls['WordsApper'].on('end', () => {
        setTimeout(() => {
          this.showWords = 'Water'
          Howls['PutinCorrectlist'].play()
        }, 500)
      })

      Howls['PutinCorrectlist'].on('end', () => {
        setTimeout(() => {
          this.title1 = 'Wet'
          this.title2 = 'Dry'
          Howls['Tohearclickonit'].play()
        }, 500)
      })

      Howls['Tohearclickonit'].on('end', () => {
        setTimeout(() => {
          this.showWords = 'Sand'
          this.FirstColumn[0].name = "Water"
          Howls['Changeyourmind'].play()
        }, 500)
      })

      Howls['Changeyourmind'].on('end', () => {
        setTimeout(() => {
          this.showWords = 'Water'
          this.FirstColumn[0].name = ""
          Howls['Yellowarrowapper'].play()
        }, 500)
      })

      Howls['Yellowarrowapper'].on('end', () => {
        setTimeout(() => {
          this.Arrow_isShowing = true
          Howls['Clickonarrow'].play()
        }, 500)
      })

      Howls['Clickonarrow'].on('end', () => {
        setTimeout(() => {
          this.isShowing_info = true
          this.Arrow_isShowing = false
          Howls['Readytostart'].play()
        }, 500)
      })

      Howls['Readytostart'].on('end', () => {
        setTimeout(() => {
          this.isShowing_info = false
        }, 500)
      })
      
      Howls['WordsApper'].play()
    },

    run() {
      if (Object.keys(this.wordSets).length > 0 && 
          (this.wordSets.twoCategories.length > 0 || 
           this.wordSets.threeCategories.length > 0 || 
           this.wordSets.fourCategories.length > 0)) {
        if (this.mode === 'instruction') {
          this.InstructionShow = true;
        } else {
          this.practice0();
        }
      } else {
        console.log('Waiting for data to load...');
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

    generateResultsJson() {
      return {
        activityStatus: this.activity_Status,
        totalTime: this.timeInSeconds,
        questionTimings: this.questionTimings,
        questionsAttempted: this.Questions_attempted,
        correctAnswers: this.correct_Answers,
        incorrectAnswers: this.incorrect_Answers,
        exerciseNumber: this.exercise,
        totalQuestions: this.currentExerciseSets.length,
        displayedQuestions: this.questionDetails.filter(q => q.wasDisplayed).length,
        detailedResults: this.questionDetails
      };
    },

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
          questionTitles: currentSet.categories.map(cat => cat.displayName || cat.name)
        };
      }
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
    }
  }
}
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

  .column-cell {
    min-width: 120px;
    min-height: 50px;
    border: 1px solid #ccc;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .selected-word {
    background: #4CAF50;
    color: white;
  }
  .readonly-answer {
    pointer-events: none;
    opacity: 0.9;
  }
</style> is this good 