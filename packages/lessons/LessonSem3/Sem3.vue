<template>
  <OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
      <div class="w-full main-bg min-h-screen">
        <div class="w-full">
          <topHeader :HeaderTop="HeaderTop" :componentSubtitle="componentSubtitle" ></topHeader>
        </div>
        <div class="w-full px-2 sm:px-4 lg:px-8">
          <div class="container mx-auto max-w-7xl bg-white shadow-lg border-2 border-black rounded-none p-4 sm:p-6 lg:p-10 my-4 sm:my-6 lg:my-8">
            <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed" :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult" :ResultHide="ResultHide" :ResultArrow="ResultArrow" ></resultPopup>
             <WordGridActivity
              v-if="jsonFileName === 'CSR-I' && currentQuestion && !resultShow"
              :questionWord="getQuestionWord(currentQuestion)"
              :gridLetters="getGridLetters(currentQuestion)"
              :wordLength="3"
              @answered="handleWordGridAnswered"
              class="w-full"
            />

            <div v-if="jsonFileName === 'CSR-I' && ! resultShow" class="font-bold mt-3 text-center text-sm sm:text-base">
              Question <span class="text-indigo-700">{{ counter + 1 }}</span>
              of <span class="text-indigo-700">{{ Total_Questions }}</span>
            </div>
            <div v-if="jsonFileName === 'CSR-I' && !resultShow" class="flex flex-col sm:flex-row justify-center items-center mt-5 gap-3 px-4">
                <button :disabled="counter === 0" @click="goToPreviousQuestion" class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" :class="{ 'opacity-50 cursor-not-allowed': counter === 0 }">
                  Previous
                </button>
                <button :disabled="lockedForNext" @click="AnswerCheck" class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" :class="{ 'opacity-50 cursor-not-allowed': lockedForNext }" >
                  Next
                </button>
            </div>
            <SectionSem3Intro v-show="InstructionShow && jsonFileName !== 'CSR-I'" @PracticeNext="PracticeNext" class="w-full"></SectionSem3Intro>
            <div v-if="showStoryButton && !resultShow && jsonFileName !== 'CSR-I'" class="mt-6 text-center px-4">
                <button @click="showStory = !showStory" class="w-full sm:w-auto px-6 sm:px-10 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  {{ showStory ? 'Hide' : 'Show' }} Story Section
                </button>
            </div>
            <div v-if="showStory && jsonFileName !== 'CSR-I'" class="mt-6 px-2 sm:px-4">
              <SectionStory :currentStory="computedCurrentStory"  :paraData="currentPara"  class="w-full"/>
            </div>
            <div class="mt-4 sm:mt-6"></div>
            <SectionSem3Top v-show="PracticeOne && jsonFileName !== 'CSR-I'" :accept-input="acceptInput" :commonNumArray="commonNumArray" :ImageNames="ImageNames" :ImageNames1="ImageNames1" :ImageNames2="ImageNames2" :ImageNames3="ImageNames3" :ImageNames4="ImageNames4" :isCMS2="jsonFileName === 'CMS-II'" @NumberValue="NumberValue" @AnswerCheck="AnswerCheck" @NextQuestion="NextQuestion" @WordsAnswer="WordsAnswer" :PrevQuestion="PrevQuestion" @PreviousQuestion="goToPreviousQuestion" :counter="counter" :viewingPrevious="viewingPrevious" :AnswerCheckShow="AnswerCheckShow" :NextQuestionShow="NextQuestionShow" :ProgressBar="ProgressBar" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions" :imageHeight="getResponsiveImageHeight()" :imageWidth="getResponsiveImageWidth()" class="w-full" />
          </div>
        </div>
      </div>
    </template>
  </OneToThreeVertical>
</template>

<script>
import 'CSS/tailwind.css'
import baseMixin from 'Scripts/mixinBaseLesson'
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne'
import SectionSem3Top from 'Lessons/LessonSem3/components/SectionSem3Top'
import SectionSem3Intro from 'Lessons/LessonSem3/components/SectionSem3Intro'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import SectionStory from './components/SectionStory.vue'
import WordGridActivity from 'Lessons/LessonSem3/components/WordGridActivity.vue'
import{ updateScreenSizehelper,getResponsiveImageHeighthelper3,getResponsiveImageWidthhelper3 ,parseLevelRangeHelper, getQuestionWordhelper3,getGridLettershelper3 ,getAnswerWordhelper ,handleWordGridAnsweredhelper, WordsAnswerhelper3, AnswerCheckhelper3, FinalResulthelper3, PracticeNexthelper3, getVisualArrowhelper, getArrowStylehelper, getVisualRectanglehelper, getRectangleStylehelper, secondsToTimehelper, TimerFunhelper3, goToPreviousQuestionhelper3, runhelper3,  highlightPreviousAnswerhelper, practice0helper3
} from '../../common-generic-components/activityHelpers.js';
import ResultPopup from '../resultPopup.vue'

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
      paraData: '',
      counter: 0,
      viewingPrevious: false,
      activityQuestions: {},
      items: [],
      currentIndex: 0,
      targets: '',
      showStory: false,
      ProgressBar: [],
      practiceList: [],
      commonNumArray: [],
      timestart: 0,
      questionStartTime: 0,
      Questions_attempted: 0,
      correct_Answers: 0,
      incorrect_Answers: 0,
      Time_elapsed: 0,
      activity_Status: 'Inprogress',
      Exercise_Number: '',
      Total_Questions: 15,
      resultShow: false,
      JsonArrData: [],
      AnswerCheckShow: false,
      PrevQuestionShow: false,
      NextQuestionShow: false,
      PracticeOne: false,
      TestProgressBar: 0,
      countcorrect: 0,
      ImageNames: 'L1-1',
      ImageNames1: 'NA',
      ResultHide: false,
      ResultArrow: false,
      ContinuesWrong: 0,
      PracticeTwo: false,
      OptionImg: 'a0',
      InstructionShow: false,
      CollectionResult: [],
      PlayBtnshow: false,
      ShuffleShapes: '',
      selectedLevels: [],
      jsonFileName: sessionStorage.getItem('jsonFile') || 'lesson1',
      lastGridAnswer: null,
      lockedForNext: true,
      screenSize: 'lg',
    }
  },
  async mounted() {
    this.updateScreenSize()
    window.addEventListener('resize', this.updateScreenSize)
    const fileName = sessionStorage.getItem('jsonFile') || 'lesson1'
    const jsonFileName = `Lesson${fileName.toUpperCase()}.json`
    const totalQsRaw = parseInt(sessionStorage.getItem('questionCount')) || 15
    if (!jsonFileName) {
      alert('Invalid file name.')
      return
    }
    try {
      const response = await require(`./data/${jsonFileName}`)
      this.activityQuestions = response
    } catch (error) {
      alert(`Failed to load JSON: ${jsonFileName}`)
      console.error(error)
    }
    const activityName = sessionStorage.getItem('ActivityName')
    this.language = sessionStorage.getItem('lang') || 'en'

    const exeNumRaw = sessionStorage.getItem('Exe_Number') || this.exercise || '1'
    this.selectedLevels = this.parseLevelRange(exeNumRaw)
    if (this.selectedLevels.includes(0)) {
      alert('Invalid level: Exe_Number cannot be 0 or out of allowed range.')
      return
    }
    this.Total_Questions = parseInt(totalQsRaw)
    this.ProgressBar = Array(this.Total_Questions)
      .fill(null)
      .map((_, i) => ({ index: i }))
    const totalAvailable = this.selectedLevels.reduce((sum, lvl) => {
      const key = `Level${lvl}`
      return (
        sum +
        (Array.isArray(this.activityQuestions[key])
          ? this.activityQuestions[key].length
          : 0)
      )
    }, 0)
    if (totalAvailable < this.Total_Questions) {
      this.Total_Questions = totalAvailable
    }
    const paraData = this.activityQuestions.Level1?.[0]?.Para || ''
    this.paraData = paraData
    this.componentSubtitle = 'Aiming Your Eyes'
    this.run()
    this.ProgressBar = Array(this.Total_Questions)
      .fill(null)
      .map((_, i) => ({ index: i, state: null }))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScreenSize)
  },
  computed: {
    currentPara() {
      if (!this.showStoryButton || !this.currentQuestion) return ''
      return this.currentQuestion.Para || ''
    },
    currentQuestion() {
      if (this.counter >= this.items.length) return null
      return this.items[this.counter]
    },
    showStoryButton() {
      const allowedFiles = ['CMUCMS-I', 'CMUCMS-II']
      const jsonFile = sessionStorage.getItem('jsonFile')
      return allowedFiles.includes(jsonFile)
    },
    computedCurrentStory() {
      return this.currentPara
    },
  },
  methods: {
  updateScreenSize() {
      return updateScreenSizehelper(this);
    },
  getResponsiveImageHeight() {
      return getResponsiveImageHeighthelper3(this);
    },
  getResponsiveImageWidth() {
     return  getResponsiveImageWidthhelper3(this);
    },
  parseLevelRange(raw) {
            return parseLevelRangeHelper(this, raw);
    },
  getQuestionWord(question) {
    return getQuestionWordhelper3(question);
    },
  getGridLetters(question) {
   return getGridLettershelper3(question)
    },
  getAnswerWord(question) {
     return getAnswerWordhelper(question)
    },
  handleWordGridAnswered({ word, response }) {
      return handleWordGridAnsweredhelper( this,{ word, response })
    },
  WordsAnswer(Answer, index) {
    return WordsAnswerhelper3(this,Answer,index)
    },
  AnswerCheck() {
      return AnswerCheckhelper3(this);
    },
  FinalResult() {
     return FinalResulthelper3(this);
    },
  PracticeNext() {
     return PracticeNexthelper3(this);
    },
  getVisualArrow(option) {
     return getVisualArrowhelper(option);
    }, 
  getArrowStyle(option) {
      return getArrowStylehelper(this, option)
    }, 
  getVisualRectangle(option) {
     return getVisualRectanglehelper(option)
    },    
  getRectangleStyle(option) {
    return getRectangleStylehelper( context ,option);
    },
  alreadyAnswered(id) {
      return this.practiceList.some((q) => q.id === id)
    },
  TimerFun() {
     return TimerFunhelper3(this);
    },
  secondsToTime(s) {
      return secondsToTimehelper(s);
    },
  run() {
   return runhelper3(this);
    },
  getPaddedIndex(index) {
      return index.toString().padStart(2, '0')
    },
  goToPreviousQuestion() {
    return goToPreviousQuestionhelper3(this);
    },
  highlightPreviousAnswer() {
      return highlightPreviousAnswerhelper(this);
    },
  practice0() {
      return practice0helper3(this);
    },
  },
}
</script>
<style>
html,
body {
  @apply h-full;
}

.main-bg {
  background-image: url('../../assets/images/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
}

/* Responsive container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

/* Existing styles with responsive improvements */
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

/* Touch-friendly button styles */
@media (max-width: 767px) {
  button {
    min-height: 44px; /* Apple's recommended minimum touch target */
    min-width: 44px;
  }
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .text-responsive {
    font-size: 0.875rem; /* 14px */
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .text-responsive {
    font-size: 1rem; /* 16px */
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: 1.125rem; /* 18px */
  }
}

/* Improve scrolling on mobile */
@media (max-width: 767px) {
  .main-bg {
    -webkit-overflow-scrolling: touch;
  }
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .correct {
    border-width: 3px;
  }
  
  .incorrect {
    border-width: 3px;
  }
  
  .previously-selected {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>



