<template>
  <OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
      <div class="w-full main-bg min-h-screen">
        <div v-if="isLoading" class="loading-message">
          Loading lesson data...
        </div>
        <div v-else-if="loadError" class="error-message">
          Error loading lesson. Please try again.
        </div>
        <div v-else class="w-full">
          <div class="w-full">
            <topHeader
              :HeaderTop="HeaderTop"
              :componentSubtitle="componentSubtitle"
            />
          </div>
          <div class="w-full px-2 sm:px-4 lg:px-8">
            <div class="container mx-auto max-w-7xl bg-white shadow-lg border-2 border-black rounded-none p-4 sm:p-6 lg:p-10 my-4 sm:my-6 lg:my-8">
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
              <!-- Instructions Section -->
              <SectionSem3Intro
                v-show="InstructionShow && !isCSRILesson"
                @PracticeNext="PracticeNext"
                class="w-full"
              />
              <!-- Story Button -->
              <div v-if="showStoryButton && !resultShow && !isCSRILesson" class="mt-6 text-center px-4">
                <button
                  @click="showStory = !showStory"
                  class="w-full sm:w-auto px-6 sm:px-10 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {{ showStory ? 'Hide' : 'Show' }} Story Section
                </button>
              </div>

              <!-- Story Section -->
              <div v-if="showStory && !isCSRILesson" class="mt-6 px-2 sm:px-4">
                <SectionStory 
                  :currentStory="computedCurrentStory" 
                  :paraData="currentPara" 
                  class="w-full"
                />
              </div>
              <!-- CSR-I Word Grid Activity -->
              <WordGridActivity
                v-if="isCSRILesson && currentQuestion && !resultShow"
                :questionWord="getQuestionWord(currentQuestion)"
                :gridLetters="getGridLetters(currentQuestion)"
                :wordLength="3"
                @answered="handleWordGridAnswered"
                class="w-full"
              />
              <!-- Navigation Buttons for CSR-I -->
              <div v-if="isCSRILesson && !resultShow" class="flex flex-col sm:flex-row justify-center items-center mt-5 gap-3 px-4">
                <button
                  :disabled="counter === 0"
                  @click="goToPreviousQuestion"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :class="{ 'opacity-50 cursor-not-allowed': counter === 0 }"
                >
                  Previous
                </button>
                <button
                  :disabled="lockedForNext"
                  @click="AnswerCheck"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :class="{ 'opacity-50 cursor-not-allowed': lockedForNext }"
                >
                  Next
                </button>
              </div>

              <!-- Main Section for Non-CSR-I -->
              <SectionSem3Top
                v-show="PracticeOne && !isCSRILesson && !resultShow"
                :accept-input="acceptInput"
                :commonNumArray="commonNumArray"
                :ImageNames="ImageNames"
                :ImageNames1="ImageNames1"
                :ImageNames2="ImageNames2"
                :ImageNames3="ImageNames3"
                :ImageNames4="ImageNames4"
                :isCMS2="isCSMSII"
                @NumberValue="NumberValue"
                @AnswerCheck="AnswerCheck"
                @NextQuestion="NextQuestion"
                @WordsAnswer="WordsAnswer"
                :PrevQuestion="PrevQuestion"
                @PreviousQuestion="goToPreviousQuestion"
                :counter="counter"
                :viewingPrevious="viewingPrevious"
                :AnswerCheckShow="AnswerCheckShow"
                :NextQuestionShow="NextQuestionShow"
                :ProgressBar="ProgressBar"
                :Questions_attempted="lessonBase.Questions_attempted"
                :Total_Questions="lessonBase.Total_Questions"
                :imageHeight="getResponsiveImageHeight()"
                :imageWidth="getResponsiveImageWidth()"
                class="w-full"
              />

            </div>
          </div>
        </div>
      </div>
    </template>
  </OneToThreeVertical>
</template>

<script>
import 'CSS/tailwind.css'
import { LessonBase } from 'Lessons/LessonBase'
import baseMixin from 'Scripts/mixinBaseLesson'
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne'
import SectionSem3Top from 'Lessons/LessonSem3/components/SectionSem3Top'
import SectionSem3Intro from 'Lessons/LessonSem3/components/SectionSem3Intro'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import SectionStory from './components/SectionStory.vue'
import WordGridActivity from 'Lessons/LessonSem3/components/WordGridActivity.vue'

export default {
  name: 'Sem3',
  components: {
    OneToThreeVertical,
    resultPopup,
    SectionSem3Top,
    SectionSem3Intro,
    topHeader,
    SectionStory,
    WordGridActivity,
  },
  mixins: [baseMixin],
  props: {
    exercise: { type: [Number, String], default: 0 },
    instruction: { type: Number, default: 1 },
    lessonData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      lessonBase: null,
      // Core lesson data
      items: [],
      counter: 0,
      practiceList: [],
      currentQuestion: null,
      
      // UI state
      isLoading: true,
      loadError: false,
      resultShow: false,
      InstructionShow: false,
      PracticeOne: false,
      showStory: false,
      
      // CSR-I specific
      lastGridAnswer: null,
      lockedForNext: true,
      
      // Non-CSR-I specific
      commonNumArray: [],
      acceptInput: true,
      viewingPrevious: false,
      AnswerCheckShow: false,
      NextQuestionShow: false,
      PrevQuestion: false,
      
      // Image properties
      ImageNames: 'L1-1',
      ImageNames1: 'NA',
      ImageNames2: 'NA',
      ImageNames3: 'NA',
      ImageNames4: 'NA',
      
      // Progress tracking
      ProgressBar: [],
      TestProgressBar: 0,
      countcorrect: 0,
      ContinuesWrong: 0,
      
      // Legacy properties
      paraData: '',
      targets: '',
      currentIndex: 0,
      timestart: 0,
      questionStartTime: 0,
      PlayBtnshow: false,
      ShuffleShapes: '',
      OptionImg: 'a0',
      CollectionResult: [],
      
      // Responsive
      screenSize: 'lg',
    }
  },
  computed: {
    isCSRILesson() {
      return this.lessonBase?.jsonFileName === 'CSR-I';
    },
    
    isCSMSII() {
      return this.lessonBase?.jsonFileName === 'CMS-II';
    },
    
    showStoryButton() {
      const allowedFiles = ['CMUCMS-I', 'CMUCMS-II'];
      return allowedFiles.includes(this.lessonBase?.jsonFileName);
    },
    
    currentPara() {
      if (!this.showStoryButton || !this.currentQuestion) return '';
      return this.currentQuestion.Para || '';
    },
    
    computedCurrentStory() {
      return this.currentPara;
    },
    
    componentSubtitle() {
      return 'Aiming Your Eyes';
    }
  },
  watch: {
    exercise(newVal) {
      this.initializeExercise(newVal);
    }
  },
  async mounted() {
    this.lessonBase = new LessonBase();
    this.lessonBase.initializeFromSession();
    
    try {
      this.updateScreenSize();
      window.addEventListener('resize', this.updateScreenSize);
      
      const urlParams = new URLSearchParams(window.location.search);
      const totalQsRaw = parseInt(urlParams.get('questionCount')) || 15;
      this.lessonBase.Total_Questions = totalQsRaw;
      
      await this.lessonBase.loadLessonJson(null, 'LessonSem3');
      
      this.processQuestionSets();
      this.initializeComponent();
    } catch (error) {
      console.error('Error loading lesson:', error);
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  },
  beforeDestroy() {
    if (this.lessonBase) {
      this.lessonBase.stopTimer();
    }
    window.removeEventListener('resize', this.updateScreenSize);
  },
  methods: {
    // ========== INITIALIZATION ==========
    processQuestionSets() {
      const selectedLevels = this.lessonBase.selectedLevels;
      
      // Calculate total available questions
      const totalAvailable = selectedLevels.reduce((sum, lvl) => {
        const key = `Level${lvl}`;
        const levelData = this.lessonBase.activityQuestions[key];
        return sum + (Array.isArray(levelData) ? levelData.length : 0);
      }, 0);
      
      if (totalAvailable < this.lessonBase.Total_Questions) {
        this.lessonBase.Total_Questions = totalAvailable;
      }
      
      // Collect and shuffle questions
      const allQuestions = [];
      selectedLevels.forEach(level => {
        const levelKey = `Level${level}`;
        const levelQuestions = this.lessonBase.activityQuestions[levelKey] || [];
        levelQuestions.forEach((q, index) => {
          allQuestions.push({
            ...q,
            __index: index,
            __level: levelKey
          });
        });
      });
      
      // Shuffle and select questions
      const shuffled = this.lessonBase.shuffleArray(allQuestions);
      this.items = shuffled.slice(0, this.lessonBase.Total_Questions);
      
      // Initialize progress bar
      this.ProgressBar = Array(this.lessonBase.Total_Questions)
        .fill(null)
        .map((_, i) => ({ index: i, state: null }));
    },
    
    initializeComponent() {
      this.componentSubtitle = 'Aiming Your Eyes';
      this.run();
    },
    
    initializeExercise(exerciseNum) {
      this.lessonBase.Questions_attempted = 0;
      this.lessonBase.correct_Answers = 0;
      this.lessonBase.incorrect_Answers = 0;
      this.practiceList = [];
      this.counter = 0;
      this.lessonBase.Exercise_Number = exerciseNum;
    },
    
    // ========== LESSON FLOW ==========
    run() {
      this.InstructionShow = this.mode === 'instruction';
      this.resultShow = false;
      this.PlayBtnshow = false;
      if (!this.InstructionShow) this.practice0();
    },
    
    PracticeNext() {
      this.InstructionShow = false;
      this.practice0();
    },
    
    practice0() {
      if (this.items.length === 0) {
        console.error('No questions loaded');
        return;
      }
      
      this.lessonBase.startTimer();
      this.AnswerCheckShow = true;
      this.PracticeOne = true;
      this.acceptInput = true;
      
      this.loadCurrentQuestion();
    },
    
    loadCurrentQuestion() {
      if (this.counter >= this.items.length) {
        this.showResults();
        return;
      }
      
      this.currentQuestion = this.items[this.counter];
      this.lessonBase.startQuestionTimer();
      
      if (this.isCSRILesson) {
        this.lockedForNext = true;
        this.lastGridAnswer = null;
      } else {
        this.loadNonCSRIQuestion();
      }
    },
    
    loadNonCSRIQuestion() {
      const questionObj = this.currentQuestion;
      
      // Find question, option, and answer arrays
      const questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'));
      const optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'));
      const answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'));
      
      const QuestionValue = questionObj[questionKey] || [];
      const OptionValue = questionObj[optionKey] || [];
      let AnswerValue = questionObj[answerKey] || [];
      
      if (!Array.isArray(AnswerValue)) AnswerValue = [];
      
      if (!QuestionValue.length || !OptionValue.length) {
        console.warn('Invalid question skipped:', questionObj);
        this.counter++;
        this.loadCurrentQuestion();
        return;
      }
      
      // Set image names
      this.ImageNames = questionObj.ImageName || '';
      this.ImageNames1 = questionObj.QuestionImage || 'NA';
      this.ImageNames2 = questionObj.ImageName2 || 'NA';
      this.ImageNames3 = questionObj.ImageName3 || 'NA';
      this.ImageNames4 = questionObj.ImageName4 || 'NA';
      
      // Create options array
      this.commonNumArray = OptionValue.map((opt, i) => {
        const existingAnswer = this.practiceList.find(q => q.id === this.counter + 1);
        const isSelected = existingAnswer && existingAnswer.userAnswer === (i + 1).toString();
        const isCorrect = existingAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes';
        
        return {
          index: i,
          state: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'base',
          Answer: AnswerValue[i],
          Option: opt,
          Question: QuestionValue,
        };
      });
      
      this.PrevQuestion = this.counter > 0;
    },
    
    // ========== CSR-I METHODS ==========
    getQuestionWord(question) {
      const key = Object.keys(question).find(k => k.startsWith('QuestionArr_'));
      return key && question[key]?.[0] || '';
    },
    
    getGridLetters(question) {
      const key = Object.keys(question).find(k => k.startsWith('OptionArr_'));
      return key ? question[key] : [];
    },
    
    handleWordGridAnswered({ word, response }) {
      this.lastGridAnswer = { word, response };
      this.lockedForNext = false;
    },
    
    // ========== NON-CSR-I METHODS ==========
    WordsAnswer(Answer, index) {
      const questionId = this.counter + 1;
      if (this.viewingPrevious) {
        alert("You have already answered this question. This cannot be changed now.");
        return;
      }
      
      const currentQuestionObj = this.items[this.counter];
      const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
      let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : [];
      if (!Array.isArray(correctAnswerArr)) correctAnswerArr = [];
      
      const timeTaken = this.lessonBase.getQuestionTime();
      const existingIndex = this.practiceList.findIndex(q => q.id === questionId);
      
      if (existingIndex !== -1) {
        const old = this.practiceList[existingIndex];
        const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes';
        if (wasCorrect) this.lessonBase.correct_Answers--;
        else this.lessonBase.incorrect_Answers--;
        this.practiceList.splice(existingIndex, 1);
        this.lessonBase.Questions_attempted--;
      }
      
      this.practiceList.push({
        id: questionId,
        originalQuestionNo: currentQuestionObj.__index,
        level: currentQuestionObj.__level,
        userAnswer: (index + 1).toString(),
        fullCorrectAnswer: correctAnswerArr,
        timeTaken,
      });
      
      const isCorrect = correctAnswerArr[index] === 'Yes';
      this.lessonBase.updateProgress(isCorrect);
      
      if (isCorrect) {
        this.ContinuesWrong = 0;
        this.ProgressBar[this.counter].state = 'correct';
      } else {
        this.ContinuesWrong++;
        this.ProgressBar[this.counter].state = 'incorrect';
      }
      
      this.commonNumArray.forEach((opt, i) => {
        opt.state = i === index ? (isCorrect ? 'correct' : 'incorrect') : 'base';
      });
      this.countcorrect = 1;
      
      if (this.counter + 1 > this.TestProgressBar) {
        this.TestProgressBar = this.counter + 1;
      }
    },
    
    // ========== ANSWER CHECKING ==========
    AnswerCheck() {
      if (this.isCSRILesson) {
        this.handleCSRIAnswer();
      } else {
        this.handleNonCSRIAnswer();
      }
    },
    
    handleCSRIAnswer() {
      if (!this.lastGridAnswer) {
        alert('Please select your answer first.');
        return;
      }
      
      const questionId = this.counter + 1;
      const currentQuestionObj = this.currentQuestion;
      const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
      let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : [];
      if (!Array.isArray(correctAnswerArr)) correctAnswerArr = [];
      
      const userWord = this.lastGridAnswer.word;
      const userResponse = this.lastGridAnswer.response;
      
      let isOppositeValid = currentQuestionObj.IsOppositeValid;
      let isCorrect = (
        (isOppositeValid && userResponse === 'yes') ||
        (!isOppositeValid && userResponse === 'no')
      );
      
      this.practiceList.push({
        id: questionId,
        originalQuestionNo: currentQuestionObj.__index,
        level: currentQuestionObj.__level,
        userAnswer: userWord,
        userClicked: userResponse,
        fullCorrectAnswer: correctAnswerArr,
        timeTaken: this.lessonBase.getQuestionTime(),
      });
      
      this.lessonBase.updateProgress(isCorrect);
      
      if (isCorrect) {
        this.ContinuesWrong = 0;
        this.ProgressBar[this.counter].state = 'correct';
      } else {
        this.ContinuesWrong++;
        this.ProgressBar[this.counter].state = 'incorrect';
      }
      
      this.countcorrect = 1;
      this.lockedForNext = true;
      this.lastGridAnswer = null;
      
      if (this.counter < this.lessonBase.Total_Questions - 1) {
        this.counter++;
        this.loadCurrentQuestion();
      } else {
        this.showResults();
      }
    },
    
    handleNonCSRIAnswer() {
      const questionId = this.counter + 1;
      const hasAnswered = this.practiceList.some(q => q.id === questionId);
      
      if (!hasAnswered) {
        alert('Please answer the question before moving on.');
        return;
      }
      
      if (this.counter < this.lessonBase.Total_Questions - 1) {
        this.counter++;
        const nextAnswered = this.practiceList.some(q => q.id === this.counter + 1);
        this.countcorrect = nextAnswered ? 1 : 0;
        this.viewingPrevious = nextAnswered;
        this.loadCurrentQuestion();
      } else {
        this.showResults();
      }
    },
    
    // ========== NAVIGATION ==========
    goToPreviousQuestion() {
      if (this.counter <= 0) return;
      this.counter--;
      this.countcorrect = 1;
      this.viewingPrevious = true;
      this.loadCurrentQuestion();
      this.highlightPreviousAnswer();
    },
    
    highlightPreviousAnswer() {
      if (this.isCSRILesson) return;
      
      const questionId = this.counter + 1;
      const previousAnswer = this.practiceList.find(q => q.id === questionId);
      
      if (previousAnswer) {
        const userAnswerIndex = parseInt(previousAnswer.userAnswer) - 1;
        const isCorrect = previousAnswer.fullCorrectAnswer[userAnswerIndex] === 'Yes';
        
        this.commonNumArray.forEach((opt, i) => {
          if (i === userAnswerIndex) {
            opt.state = isCorrect ? 'correct' : 'incorrect';
          } else {
            opt.state = 'base';
          }
        });
      }
    },
    
    NextQuestion() {
      this.AnswerCheck();
    },
    
    NumberValue(val) {
      // Handle number input if needed
    },
    
    // ========== RESULTS ==========
    showResults() {
      const detailedResults = this.practiceList.map((entry, idx) => {
        const levelKey = entry.level;
        const origIdx = entry.originalQuestionNo;
        const sourceQ = this.lessonBase.activityQuestions[levelKey]?.[origIdx] || {};
        const ansKey = Object.keys(sourceQ).find(k => k.startsWith('AnswerArr_'));
        const correctArr = Array.isArray(sourceQ[ansKey]) ? sourceQ[ansKey] : [];
        
        return {
          questionNo: idx + 1,
          originalQuestionNo: origIdx,
          level: levelKey,
          userResponse: entry.userAnswer,
          fullCorrectAnswer: correctArr,
          timeTaken: entry.timeTaken,
        };
      });
      
      this.lessonBase.finalizeResults({
        summary: {
          ActivityName: 'Sem3',
          testDate: new Date().toISOString(),
        },
        detailedResults,
      });
      
      this.resultShow = true;
      this.PracticeOne = false;
    },
    
    downloadResultsJson() {
      this.lessonBase.downloadResultsJson('sem3_results.json');
    },
    
    FinalResult() {
      this.downloadResultsJson();
    },
    
    // ========== RESPONSIVE ==========
    updateScreenSize() {
      const width = window.innerWidth;
      if (width < 640) {
        this.screenSize = 'sm';
      } else if (width < 1024) {
        this.screenSize = 'md';
      } else {
        this.screenSize = 'lg';
      }
    },
    
    getResponsiveImageHeight() {
      switch (this.screenSize) {
        case 'sm': return '120px';
        case 'md': return '150px';
        default: return '180px';
      }
    },
    
    getResponsiveImageWidth() {
      switch (this.screenSize) {
        case 'sm': return '200px';
        case 'md': return '250px';
        default: return '300px';
      }
    },
  }
}
</script>

<style scoped>
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

.main-bg {
  background-image: url('../../assets/images/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}

.correct {
  background-color: #d4edda;
  border: 2px solid #28a745;
  transition: all 0.2s ease;
}

.incorrect {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
  transition: all 0.2s ease;
}

.previously-selected {
  background-color: #e2e3e5;
  border: 2px solid #6c757d;
  transition: all 0.2s ease;
}

@media (max-width: 767px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
  
  .main-bg {
    -webkit-overflow-scrolling: touch;
  }
}

button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-contrast: high) {
  .correct, .incorrect, .previously-selected {
    border-width: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
