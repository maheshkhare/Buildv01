<template>
  <OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
      <div class="w-full main-bg min-h-screen">
        <div class="w-full">
          <topHeader
            :HeaderTop="HeaderTop"
            :componentSubtitle="componentSubtitle"
          ></topHeader>
        </div>
        <div class="w-full px-2 sm:px-4 lg:px-8">
          <!-- <div
            class="container mx-auto max-w-7xl bg-white shadow-lg border border-gray-300 rounded-lg p-4 sm:p-6 lg:p-10 my-4 sm:my-6 lg:my-8"
          > -->
          <div
  class="container mx-auto max-w-7xl bg-white shadow-lg border-2 border-black rounded-none p-4 sm:p-6 lg:p-10 my-4 sm:my-6 lg:my-8"
>

            <resultPopup
              v-show="resultShow"
              :activity_Status="activity_Status"
              :Time_elapsed="Time_elapsed"
              :Questions_attempted="Questions_attempted"
              :correct_Answers="correct_Answers"
              :incorrect_Answers="incorrect_Answers"
              @FinalResult="FinalResult"
              :ResultHide="ResultHide"
              :ResultArrow="ResultArrow"
            ></resultPopup>

            <!-- CSR-I Word Grid Activity -->
            <WordGridActivity
              v-if="jsonFileName === 'CSR-I' && currentQuestion && !resultShow"
              :questionWord="getQuestionWord(currentQuestion)"
              :gridLetters="getGridLetters(currentQuestion)"
              :wordLength="3"
              @answered="handleWordGridAnswered"
              class="w-full"
            />

            <!-- Question Counter for CSR-I -->
            <div v-if="jsonFileName === 'CSR-I'" class="font-bold mt-3 text-center text-sm sm:text-base">
              Question <span class="text-indigo-700">{{ counter + 1 }}</span>
              of <span class="text-indigo-700">{{ Total_Questions }}</span>
            </div>

            <!-- Navigation Buttons for CSR-I -->
            <div v-if="jsonFileName === 'CSR-I'" class="flex flex-col sm:flex-row justify-center items-center mt-5 gap-3 px-4">
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

            <!-- Other lesson components hidden for CSR-I -->
            <SectionSem3Intro
              v-show="InstructionShow && jsonFileName !== 'CSR-I'"
              @PracticeNext="PracticeNext"
              class="w-full"
            ></SectionSem3Intro>

            <!-- Story Button -->
            <div v-if="showStoryButton && !resultShow && jsonFileName !== 'CSR-I'" class="mt-6 text-center px-4">
              <button
                @click="showStory = !showStory"
                class="w-full sm:w-auto px-6 sm:px-10 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {{ showStory ? 'Hide' : 'Show' }} Story Section
              </button>
            </div>

            <!-- Story Section -->
            <div v-if="showStory && jsonFileName !== 'CSR-I'" class="mt-6 px-2 sm:px-4">
              <SectionStory 
                :currentStory="computedCurrentStory" 
                :paraData="currentPara" 
                class="w-full"
              />
            </div>

            <div class="mt-4 sm:mt-6"></div>

            <!-- Main Section -->
            <SectionSem3Top
              v-show="PracticeOne && jsonFileName !== 'CSR-I'"
              :accept-input="acceptInput"
              :commonNumArray="commonNumArray"
              :ImageNames="ImageNames"
              :ImageNames1="ImageNames1"
              :ImageNames2="ImageNames2"
              :ImageNames3="ImageNames3"
              :ImageNames4="ImageNames4"
              :isCMS2="jsonFileName === 'CMS-II'"
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
              :Questions_attempted="Questions_attempted"
              :Total_Questions="Total_Questions"
              :imageHeight="getResponsiveImageHeight()"
              :imageWidth="getResponsiveImageWidth()"
              class="w-full"
            />
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
      // ... (keeping all your existing data properties unchanged)
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
      // Add responsive state
      screenSize: 'lg',
    }
  },

  async mounted() {
    // ... (keeping all your existing mounted logic unchanged)
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
    // ... (keeping all your existing computed properties unchanged)
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
    // Add responsive methods
    updateScreenSize() {
      const width = window.innerWidth
      if (width < 640) {
        this.screenSize = 'sm'
      } else if (width < 1024) {
        this.screenSize = 'md'
      } else {
        this.screenSize = 'lg'
      }
    },

    getResponsiveImageHeight() {
      switch (this.screenSize) {
        case 'sm': return '120px'
        case 'md': return '150px'
        default: return '180px'
      }
    },

    getResponsiveImageWidth() {
      switch (this.screenSize) {
        case 'sm': return '200px'
        case 'md': return '250px'
        default: return '300px'
      }
    },

    // ... (keeping all your existing methods unchanged)
    parseLevelRange(raw) {
      if (typeof raw === 'number') return [raw]
      if (typeof raw === 'string') {
        raw = raw.trim()
        if (/^\d+$/.test(raw)) return [parseInt(raw)]
        const rangeMatch = raw.match(/^(\d+)-(\d+)$/)
        if (rangeMatch) {
          const [min, max] = rangeMatch.slice(1).map(Number)
          return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(
            (n) => n >= 1 && n <= 3
          )
        }
      }
      return [0]
    },

    getQuestionWord(question) {
      const key = Object.keys(question).find(k => k.startsWith('QuestionArr_'))
      return key && question[key]?.[0] || ''
    },

    getGridLetters(question) {
      const key = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      return key ? question[key] : []
    },

    getAnswerWord(question) {
      const optionKey = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      const answerKey = Object.keys(question).find(k => k.startsWith('AnswerArr_'))
      const options = optionKey ? question[optionKey] : []
      const answers = answerKey ? question[answerKey] : []
      if (!Array.isArray(answers) || !Array.isArray(options)) return ''
      return options.filter((_, i) => answers[i] === 'Yes').join('')
    },

    handleWordGridAnswered({ word, response }) {
      this.lastGridAnswer = { word, response }
      this.lockedForNext = false
      this.AnswerCheck()
    },

    WordsAnswer(Answer, index) {
      const questionId = this.counter + 1
      if (this.viewingPrevious) {
        alert("You have already answered this question. This cannot be changed now.")
        return
      }
      const currentQuestionObj = this.items[this.counter]
      const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'))
      let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : []
      if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

      const timeTaken = (Date.now() - this.questionStartTime) / 1000
      const existingIndex = this.practiceList.findIndex(q => q.id === questionId)
      if (existingIndex !== -1) {
        const old = this.practiceList[existingIndex]
        const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
        if (wasCorrect) this.correct_Answers--
        else this.incorrect_Answers--
        this.practiceList.splice(existingIndex, 1)
      } else {
        this.Questions_attempted++
      }

      this.practiceList.push({
        id: questionId,
        originalQuestionNo: currentQuestionObj.__index,
        level: currentQuestionObj.__level,
        userAnswer: (index + 1).toString(),
        fullCorrectAnswer: correctAnswerArr,
        timeTaken,
      })

      const isCorrect = correctAnswerArr[index] === 'Yes'

      if (isCorrect) {
        this.correct_Answers++
        this.ContinuesWrong = 0
        this.ProgressBar[this.counter].state = 'correct'
      } else {
        this.incorrect_Answers++
        this.ContinuesWrong++
        this.ProgressBar[this.counter].state = 'incorrect'
      }
      this.commonNumArray.forEach((opt, i) => {
        opt.state = i === index ? (isCorrect ? 'correct' : 'incorrect') : 'base'
      })
      this.countcorrect = 1

      if (this.counter + 1 > this.TestProgressBar) {
        this.TestProgressBar = this.counter + 1
      }
    },

    AnswerCheck() {
      if (this.jsonFileName === 'CSR-I') {
        if (!this.lastGridAnswer) {
          this.$toast?.warning('Please select your answer first.');
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
          timeTaken: (Date.now() - this.questionStartTime) / 1000,
        });

        if (isCorrect) {
          this.correct_Answers++;
          this.ContinuesWrong = 0;
          this.ProgressBar[this.counter].state = 'correct';
        } else {
          this.incorrect_Answers++;
          this.ContinuesWrong++;
          this.ProgressBar[this.counter].state = 'incorrect';
        }
        this.Questions_attempted++;
        this.countcorrect = 1;
        this.lockedForNext = true;
        this.lastGridAnswer = null;

        if (this.counter < this.Total_Questions - 1) {
          this.counter++;
          this.practice0();
        } else {
          this.activity_Status = 'Completed';
          this.Time_elapsed = this.secondsToTime(this.timestart);
          this.resultShow = true;
          this.PracticeOne = false;
          this.ResultHide = true;
        }

        return;
      }

      const questionId = this.counter + 1;
      const hasAnswered = this.practiceList.some(q => q.id === questionId);

      if (!hasAnswered) {
        this.$toast?.warning('Please answer the question before moving on.');
        return;
      }

      if (this.counter < this.Total_Questions - 1) {
        this.counter++;
        const nextAnswered = this.practiceList.some(q => q.id === this.counter + 1);
        this.countcorrect = nextAnswered ? 1 : 0;
        this.viewingPrevious = nextAnswered;
        this.practice0();
      } else {
        this.activity_Status = 'Completed';
        this.Time_elapsed = this.secondsToTime(this.timestart);
        this.resultShow = true;
        this.PracticeOne = false;
        this.ResultHide = true;

        const detailedResults = this.practiceList.map((entry, idx) => {
          const levelKey = entry.level;
          const origIdx = entry.originalQuestionNo;
          const sourceQ = this.activityQuestions[levelKey]?.[origIdx] || {};
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

        this.resultData = {
          summary: {
            ActivityName: 'Sem3',
            activityStatus: this.activity_Status,
            totalTimeElapsed: this.timestart,
            questionsAttempted: this.Questions_attempted,
            correctAnswers: this.correct_Answers,
            incorrectAnswers: this.incorrect_Answers,
            testDate: new Date().toISOString(),
          },
          detailedResults,
        };

        this.JsonArrData = JSON.stringify(this.resultData, null, 2);
      }
    },

    FinalResult() {
      const now = new Date()
      const testDate = now.toISOString()
      const fullResult = this.resultData || {}

      const blob = new Blob([JSON.stringify(fullResult, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Test_Result_${testDate}.json`
      a.click()
      URL.revokeObjectURL(url)
    },

    PracticeNext() {
      this.InstructionShow = false
      this.practice0()
    },

    getVisualArrow(option) {
      if (!option) return ''
      const arrowMatch = option.match(/➚/g)
      return arrowMatch ? '➚' : ''
    },
    
    getArrowStyle(option) {
      const count = (option.match(/➚/g) || []).length
      const baseSize = this.screenSize === 'sm' ? 1 : this.screenSize === 'md' ? 1.2 : 1.5
      if (count >= 3) return { fontSize: `${2.5 * baseSize}rem`, fontWeight: 700, verticalAlign: 'middle' }
      if (count === 2) return { fontSize: `${1.8 * baseSize}rem`, fontWeight: 600, verticalAlign: 'middle' }
      if (count === 1) return { fontSize: `${1.2 * baseSize}rem`, fontWeight: 500, verticalAlign: 'middle' }
      return {}
    },
    
    getVisualRectangle(option) {
      if (!option) return ''
      if (option.includes('█')) return '█'
      if (option.includes('▌')) return '▌'
      if (option.includes('▏')) return '▏'
      return ''
    },
    
    getRectangleStyle(option) {
      const baseSize = this.screenSize === 'sm' ? 0.8 : this.screenSize === 'md' ? 1 : 1.2
      if (option.includes('█')) {
        return { fontSize: `${2.2 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      if (option.includes('▌')) {
        return { fontSize: `${1.6 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      if (option.includes('▏')) {
        return { fontSize: `${1.1 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      return {}
    },

    alreadyAnswered(id) {
      return this.practiceList.some((q) => q.id === id)
    },

    TimerFun() {
      setInterval(() => {
        this.timestart++
      }, 1000)
    },

    secondsToTime(s) {
      const h = String(Math.floor(s / 3600)).padStart(2, '0')
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
      const sec = String(s % 60).padStart(2, '0')
      return `${h}:${m}:${sec}`
    },

    run() {
      this.InstructionShow = this.mode === 'instruction'
      this.resultShow = false
      this.PlayBtnshow = false
      if (!this.InstructionShow) this.practice0()
    },

    getPaddedIndex(index) {
      return index.toString().padStart(2, '0')
    },

    goToPreviousQuestion() {
      if (this.counter <= 0) return
      this.counter--
      this.countcorrect = 1
      this.viewingPrevious = true
      this.practice0()
      this.highlightPreviousAnswer()
    },

    highlightPreviousAnswer() {
      const questionId = this.counter + 1
      const previousAnswer = this.practiceList.find((q) => q.id === questionId)

      if (previousAnswer) {
        const userAnswerIndex = parseInt(previousAnswer.userAnswer) - 1
        const isCorrect = previousAnswer.fullCorrectAnswer[userAnswerIndex] === 'Yes'

        this.commonNumArray.forEach((opt, i) => {
          if (i === userAnswerIndex) {
            opt.state = isCorrect ? 'correct' : 'incorrect'
          } else {
            opt.state = 'base'
          }
        })
      }
    },

    practice0() {
      if (this.items.length === 0) {
        this.TimerFun()
        this.AnswerCheckShow = true
        this.PracticeOne = true

        const selectedItems = []
        const levels = this.selectedLevels
        const questionsPerLevel = Math.floor(this.Total_Questions / levels.length)
        let remaining = this.Total_Questions % levels.length

        for (const level of levels) {
          const levelKey = `Level${level}`
          const levelItems = this.activityQuestions[levelKey] || []
          let count = questionsPerLevel + (remaining > 0 ? 1 : 0)
          if (remaining > 0) remaining--
          const shuffled = levelItems.slice().sort(() => Math.random() - 0.5)
          const subset = shuffled.slice(0, count).map((item) => ({
            ...item,
            __index: levelItems.indexOf(item),
            __level: levelKey,
          }))
          selectedItems.push(...subset)
        }

        this.items = selectedItems
      }

      if (this.counter >= this.items.length) return

      const questionObj = this.items[this.counter]
      const questionKey = Object.keys(questionObj).find((k) =>
        k.startsWith('QuestionArr_')
      )
      const optionKey = Object.keys(questionObj).find((k) =>
        k.startsWith('OptionArr_')
      )
      const answerKey = Object.keys(questionObj).find((k) =>
        k.startsWith('AnswerArr_')
      )

      this.questionStartTime = Date.now()

      const QuestionValue = questionObj[questionKey] || []
      const OptionValue = questionObj[optionKey] || []
      let AnswerValue = questionObj[answerKey] || []

      if (!Array.isArray(AnswerValue)) AnswerValue = []

      if (!QuestionValue.length || !OptionValue.length) {
        console.warn('Invalid question skipped:', questionObj)
        this.counter++
        this.practice0()
        return
      }

      this.ImageNames = questionObj.ImageName || ''
      this.ImageNames1 = questionObj.QuestionImage || 'NA'
      this.ImageNames2 = questionObj.ImageName2 || 'NA'
      this.ImageNames3 = questionObj.ImageName3 || 'NA'
      this.ImageNames4 = questionObj.ImageName4 || 'NA'

      this.commonNumArray = OptionValue.map((opt, i) => {
        const existingAnswer = this.practiceList.find(
          (q) => q.id === this.counter + 1
        )
        const isSelected =
          existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
        const isCorrect =
          existingAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes'

        return {
          index: i,
          state: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'base',
          Answer: AnswerValue[i],
          Option: opt,
          Question: QuestionValue,
        }
      })

      this.PrevQuestionShow = this.counter > 0
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
