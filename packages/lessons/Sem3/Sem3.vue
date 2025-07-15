
<template>
  <OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
      <div class="w-full main-bg">
        <div class="rows-12">
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
              margin-top: 0%;
              margin-bottom: 5%;
            "
            class="content-center justify-center border bg-white shadow-lg border-black p-10 ..."
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

            <SectionSem3Intro
              v-show="InstructionShow"
              @PracticeNext="PracticeNext"
            ></SectionSem3Intro>

            <SectionSem3Top
              :accept-input="acceptInput"
              :commonNumArray="commonNumArray"
              :ImageNames="ImageNames"
              @NumberValue="NumberValue"
              @AnswerCheck="AnswerCheck"
              @NextQuestion="NextQuestion"
              @WordsAnswer="WordsAnswer"
              :PrevQuestion="PrevQuestion"
             @PreviousQuestion="goToPreviousQuestion"
              :counter="counter"
              :viewingPrevious="viewingPrevious"
               v-show="PracticeOne"
              :AnswerCheckShow="AnswerCheckShow"
              :NextQuestionShow="NextQuestionShow"
              :ProgressBar="ProgressBar"
              :ImageNames1="ImageNames1"
              :Questions_attempted="Questions_attempted"
              :Total_Questions="Total_Questions"
            >
            </SectionSem3Top>
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
import SectionSem3Top from 'Lessons/Sem3/components/SectionSem3Top'
import SectionSem3Intro from 'Lessons/Sem3/components/SectionSem3Intro'
import { generateLessonHowls } from '../../common-js/utility'
import SVGShape from 'Components/SVGShape'
import { Howler } from 'howler'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import axios from 'axios'

export default {
  name: 'Sem3',
  components: {
    OneToThreeVertical,
    resultPopup,
   SectionSem3Top,
   SectionSem3Intro,
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
    },
    lessonData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      counter: 0,
      viewingPrevious: false,
      activityQuestions: {},
      items: [],
      currentIndex: 0,
      targets: '',
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
      selectedLevels: []
    }
  },
  async mounted () {
    // const urlParams = new URLSearchParams(window.location.search)
    // const jsonParam = urlParams.get('Json') || 'CMRPWB'
    // const jsonFileName = `Lesson${jsonParam.toUpperCase()}.json`


    const fileName = sessionStorage.getItem('jsonFile') || 'lesson1';
    const jsonFileName = `Lesson${fileName.toUpperCase()}.json`
    const totalQsRaw = parseInt(sessionStorage.getItem('questionCount')) || 15;
    // const lessonData = require(`./Data/${fileName}.json`);

    if (!jsonFileName) {
  alert("Invalid file name.");
  return;
}

try {

  console.log('Loading JSON file:', jsonFileName);

  
  const response = await axios.get(`/${jsonFileName}`);
  this.activityQuestions = response.data;
  console.log('Loaded levels:', response.data);
} catch (error) {
  alert(`Failed to load JSON: ${jsonFileName}`);
  console.error(error);
}


    const activityName = sessionStorage.getItem('ActivityName')
    this.language = sessionStorage.getItem('lang') || 'en'

    const exeNumRaw = sessionStorage.getItem('Exe_Number') || urlParams.get('Exe_Number') || this.exercise || '1'
    // const totalQsRaw = sessionStorage.getItem('No_Questions') || urlParams.get('No_Questions') || 15

    this.selectedLevels = this.parseLevelRange(exeNumRaw)

    if (this.selectedLevels.includes(0)) {
      alert('Invalid level: Exe_Number cannot be 0 or out of allowed range.')
      return
    }

    this.Total_Questions = parseInt(totalQsRaw)
    this.ProgressBar = Array(this.Total_Questions).fill(null).map((_, i) => ({ index: i }))

    const totalAvailable = this.selectedLevels.reduce((sum, lvl) => {
      const key = `Level${lvl}`
      return sum + (Array.isArray(this.activityQuestions[key]) ? this.activityQuestions[key].length : 0)
    }, 0)

    if (totalAvailable < this.Total_Questions) {
      alert(`Not enough total questions in selected levels. Required: ${this.Total_Questions}, Available: ${totalAvailable}`)
      return
    }

    const perLevel = Math.floor(this.Total_Questions / this.selectedLevels.length)
    let extra = this.Total_Questions % this.selectedLevels.length

    for (const level of this.selectedLevels) {
      const key = `Level${level}`
      const levelQuestions = this.activityQuestions[key] || []
      const required = perLevel + (extra > 0 ? 1 : 0)
      if (extra > 0) extra--

      if (levelQuestions.length < required) {
        alert(`Level ${level} has only ${levelQuestions.length} questions. Required: ${required}`)
        return
      }
    }

    if (activityName && activityName.includes('instruction')) {
      this.instruction = 1
    }

    this.componentSubtitle = 'Aiming Your Eyes'
    this.run()
    this.ProgressBar = Array(this.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
  },
  methods: {
    parseLevelRange(raw) {
      if (typeof raw === 'number') return [raw]
      if (typeof raw === 'string') {
        raw = raw.trim()
        if (/^\d+$/.test(raw)) return [parseInt(raw)]
        const rangeMatch = raw.match(/^(\d+)-(\d+)$/)
        if (rangeMatch) {
          const [min, max] = rangeMatch.slice(1).map(Number)
          return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(n => n >= 1 && n <= 3)
        }
      }
      return [0]
    },

    
    alreadyAnswered(id) {
      return this.practiceList.some(q => q.id === id)
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
      this.counter--
      this.countcorrect = 1
      this.viewingPrevious = true
      this.practice0()
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
          const subset = shuffled.slice(0, count).map(item => ({
            ...item,
            __index: levelItems.indexOf(item),
            __level: levelKey
          }))
          selectedItems.push(...subset)
        }

        this.items = selectedItems
      }

      if (this.counter >= this.items.length) return

      const questionObj = this.items[this.counter]
      const questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'))
      const optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'))
      const answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'))

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
      this.ImageNames1 = questionObj.QuestionImage || ''

      this.commonNumArray = OptionValue.map((opt, i) => {
  const existingAnswer = this.practiceList.find(q => q.id === this.counter + 1)
  const isSelected = existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
  return {
    index: i,
    state: isSelected ? 'previously-selected' : 'base',
    Answer: AnswerValue[i],
    Option: opt,
    Question: QuestionValue
  }
})


      this.PrevQuestionShow = this.counter > 0
    },
WordsAnswer(Answer, index) {
  const questionId = this.counter + 1

  // If user is viewing a previous question, block the answer change
  if (this.viewingPrevious) {
    alert("You have already answered this question. This cannot be changed now.")
    return
  }

  const currentQuestionObj = this.items[this.counter]
  const paddedIndex = this.getPaddedIndex(currentQuestionObj.__index)

  let correctAnswerArr = currentQuestionObj[`AnswerArr_${paddedIndex}`] || []
  if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

  const timeTaken = (Date.now() - this.questionStartTime) / 1000

  // Check if already answered (from forward flow, not backtracking)
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
    timeTaken
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
    opt.state = i === index
      ? isCorrect ? 'correct' : 'incorrect'
      : 'base'
  })

  this.countcorrect = 1

  if (this.counter + 1 > this.TestProgressBar) {
    this.TestProgressBar = this.counter + 1
  }
}

,


   AnswerCheck() {
  const questionId = this.counter + 1
  const hasAnswered = this.practiceList.some(q => q.id === questionId)

  if (!hasAnswered) {
    this.$toast?.warning('Please answer the question before moving on.')
    return
  }

  if (this.counter < this.Total_Questions - 1) {
    this.counter++

    const nextAnswered = this.practiceList.some(q => q.id === this.counter + 1)
    this.countcorrect = nextAnswered ? 1 : 0
    this.viewingPrevious = nextAnswered
    this.practice0()
  } else {
    this.activity_Status = 'Completed'
    this.Time_elapsed = this.secondsToTime(this.timestart)
    this.resultShow = true
    this.PracticeOne = false
    this.ResultHide = true

    const detailedResults = this.practiceList.map((entry, idx) => {
      const levelKey = entry.level
      const origIdx = entry.originalQuestionNo
      const sourceQ = this.activityQuestions[levelKey]?.[origIdx] || {}
      const ansKey = Object.keys(sourceQ).find(k => k.startsWith('AnswerArr_'))
      const correctArr = Array.isArray(sourceQ[ansKey]) ? sourceQ[ansKey] : []

      return {
        questionNo: idx + 1,
        originalQuestionNo: origIdx,
        level: levelKey,
        userResponse: entry.userAnswer,
        fullCorrectAnswer: correctArr,
        timeTaken: entry.timeTaken
      }
    })

    this.resultData = {
      summary: {
        ActivityName: 'Sem3',
        activityStatus: this.activity_Status,
        totalTimeElapsed: this.timestart,
        questionsAttempted: this.Questions_attempted,
        correctAnswers: this.correct_Answers,
        incorrectAnswers: this.incorrect_Answers,
        testDate: new Date().toISOString()
      },
      detailedResults
    }

    this.JsonArrData = JSON.stringify(this.resultData, null, 2)
  }
}
,
    FinalResult() {
      const now = new Date()
      const testDate = now.toISOString()
      const fullResult = this.resultData || {}

      const blob = new Blob([JSON.stringify(fullResult, null, 2)], { type: 'application/json' })
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
    }
  }
}
</script>

<style>
html,
body {
  @apply h-full;
}
.main-bg {
  background-image: url('../../assets/images/bg.png');
  width: 100%;
}
</style> 