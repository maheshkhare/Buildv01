// packages/lessons/LessonBase.js
export class LessonBase {
  constructor() {
    // Common state
    this.activityQuestions = {}
    this.selectedLevels = []
    this.counter = 0
    this.timestart = 0
    this.timerInterval = null
    this.Questions_attempted = 0
    this.correct_Answers = 0
    this.incorrect_Answers = 0
    this.Time_elapsed = '00:00:00'
    this.activity_Status = 'Inprogress'
    this.ResultHide = false
    this.ResultArrow = false
    this.JsonArrData = []
    this.Total_Questions = 15
    this.Exercise_Number = ''
    this.jsonFileName = ''
    this.language = 'en'
    this.practiceList = []
    this.questionStartTime = 0
  }

  /** ------------------
   * Session Init + Loading
   * ------------------ */
  initializeFromSession() {
    this.jsonFileName = sessionStorage.getItem('jsonFile') || 'DMU-I'
    this.Exercise_Number = sessionStorage.getItem('Exe_Number') || '1'
    this.language = sessionStorage.getItem('lang') || 'en'

    const questionCount = parseInt(sessionStorage.getItem('questionCount'))
    if (questionCount) {
      this.Total_Questions = questionCount
    }

    this.selectedLevels = this.parseLevelRange(this.Exercise_Number)
  }

  async loadLessonJson(fileName, lessonType = 'LessonSem1') {
    try {
      const fileToLoad = fileName || this.jsonFileName || 'DMU-I'
      const jsonFileName = `Lesson${fileToLoad.toUpperCase()}.json`
      
      console.log('Loading JSON:', jsonFileName, 'from:', lessonType)
      
      
      const response = await import(
        /* @vite-ignore */ `./${lessonType}/data/${jsonFileName}`
      )
      
      this.activityQuestions = response.default || response
      return this.activityQuestions
    } catch (error) {
      console.error('Error loading lesson JSON:', error)
      console.error('Attempted to load:', `./${lessonType}/data/Lesson${(fileName || this.jsonFileName || 'DMU-I').toUpperCase()}.json`)
      throw error
    }
  }

  /** ------------------
   * Utility Helpers
   * ------------------ */
  parseLevelRange(raw) {
    if (typeof raw === 'number') return [raw]
    if (typeof raw === 'string') {
      raw = raw.trim()
      if (/^\d+$/.test(raw)) return [parseInt(raw)]
      const rangeMatch = raw.match(/^(\d+)-(\d+)$/)
      if (rangeMatch) {
        const [min, max] = rangeMatch.slice(1).map(Number)
        return Array.from({ length: max - min + 1 }, (_, i) => min + i)
      }
    }
    return [1]
  }

  shuffleArray(array) {
    let counter = array.length
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter)
      counter--
      ;[array[counter], array[index]] = [array[index], array[counter]]
    }
    return array
  }

  validateLevels(maxLevel = 3) {
    return this.selectedLevels.every(level => level >= 1 && level <= maxLevel)
  }

  getTotalAvailableQuestions() {
    return this.selectedLevels.reduce((sum, level) => {
      const levelKey = `level${level}` // Changed to lowercase to match your original Sem1 structure
      const levelData = this.activityQuestions.sets && this.activityQuestions.sets[levelKey]
      return sum + (Array.isArray(levelData) ? levelData.length : 0)
    }, 0)
  }

  /** ------------------
   * Timer Control
   * ------------------ */
  startTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.timestart++
      }, 1000)
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  secondsToTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const s = String(totalSeconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  startQuestionTimer() {
    this.questionStartTime = Date.now()
  }

  getQuestionTime() {
    return this.questionStartTime ? (Date.now() - this.questionStartTime) / 1000 : 0
  }

  /** ------------------
   * Progress + Results
   * ------------------ */
  updateProgress(isCorrect) {
    this.Questions_attempted++
    if (isCorrect) this.correct_Answers++
    else this.incorrect_Answers++
  }

  finalizeResults(extraData = {}) {
    this.activity_Status = 'Completed'
    this.Time_elapsed = this.secondsToTime(this.timestart)
    this.stopTimer()

    const baseResultData = {
      activityStatus: this.activity_Status,
      totalTime: this.timestart,
      timeElapsed: this.Time_elapsed,
      questionsAttempted: this.Questions_attempted,
      correctAnswers: this.correct_Answers,
      incorrectAnswers: this.incorrect_Answers,
      exerciseNumber: this.Exercise_Number,
      jsonFileName: this.jsonFileName,
      totalQuestions: this.Total_Questions,
      testDate: new Date().toISOString(),
      ...extraData
    }

    this.JsonArrData = JSON.stringify(baseResultData, null, 2)
    return baseResultData
  }

  downloadResultsJson(filename) {
    const name = filename || `lesson_results_${new Date().toISOString().split('T')[0]}.json`
    const blob = new Blob([this.JsonArrData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
