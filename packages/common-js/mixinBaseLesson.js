export default {
  props: {
    lessonProgress: {
      type: Array,
      default: () => []
    },
    exercise: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'practice',
      validator: (value) => {
        return ['practice', 'instruction'].includes(value)
      }
    },
    set: {
      type: Number,
      default: 0
    },
    skipFeedback: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      acceptInput: false
    }
  },
  methods: {
    run() {
      const callString = `${this.mode}${this.exercise}`
      this[callString]()
    }
  }
}
