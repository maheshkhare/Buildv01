<template>
  <div class="cfu-p-container text-center">
    <h4 class="question-text">{{ questionText }}</h4>

    <div class="cfu-content">
      <div class="main-image" @click="handleImageClick">
        <img v-if="mainImageSrc" :src="mainImageSrc" alt="Main Scene" class="grid-image" />
        <p v-else class="error-text">⚠️ SVG image not found</p>

        <!-- Click markers -->
        <div
          v-for="(click, idx) in storedClicks[currentIndex] || []"
          :key="idx"
          class="click-marker"
          :class="{ correct: click.isCorrect, incorrect: !click.isCorrect }"
          :style="{ left: click.x + 'px', top: click.y + 'px' }"
        ></div>
      </div>

      <div class="object-image">
        <img v-if="objectImageSrc" :src="objectImageSrc" alt="Object" class="question-image" />
        <p v-else class="error-text">⚠️ Object image not found</p>
      </div>
    </div>

    <div class="navigation">
      <button @click="goPrev" class="nav-btn">⬅️</button>
      <button @click="handleNextClick" class="nav-btn">➡️</button>
      <button @click="resetCurrentQuestion" class="nav-btn">🗑️ Reset</button>
    </div>

    <p class="question-count">
      Question <span class="text-indigo-700">{{ currentIndex + 1 }}</span> of
      <span class="text-indigo-700">{{ total }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "CFUPHandler",
  props: {
    questionData: { type: Array, required: true },
    currentIndex: { type: Number, required: true },
    total: { type: Number, required: true },
    jsonFileName: { type: String, default: "CFU-P" },
  },
  data() {
    return {
      storedClicks: {}, // track all clicks keyed by question index
      isTransitioning: false,
      resultShow: false,
      resultData: null,
      practiceList: [],
      correct_Answers: 0,
      incorrect_Answers: 0,
      Questions_attempted: 0,
      questionStartTime: Date.now(),
    };
  },
  computed: {
    currentQuestion() {
      return this.questionData?.[this.currentIndex] || {};
    },
    suffix() {
    const index = this.currentQuestion?.index;
    if (!index) return "01";

    // 🔍 Auto-detect: if 3-digit keys exist in the current question
    const hasThreeDigit = Object.keys(this.currentQuestion || {}).some((key) =>
      key.includes(`QuestionArr_${index.toString().padStart(3, "0")}`)
    );

    return hasThreeDigit
      ? index.toString().padStart(3, "0") // e.g. "010"
      : index.toString().padStart(2, "0"); // e.g. "10" or "01"
  },

    questionText() {
      return this.currentQuestion?.[`QuestionArr_${this.suffix}`] || "❓ Question not available.";
    },
    mainImageSrc() {
      return this.getImagePath(this.currentQuestion?.ImageName, "svg");
    },
    objectImageSrc() {
      return this.getImagePath(this.currentQuestion?.QuestionImage, "png");
    },
  },
  methods: {
    getImagePath(name, type = "png") {
      if (!name || !this.jsonFileName) return "";
      try {
        const folder = `./graphics${this.jsonFileName}/`;
        const context = require.context("../assets/", true, /\.(svg|png)$/);
        return context(`${folder}${name}.${type}`);
      } catch (err) {
        console.warn(`Image not found: graphics${this.jsonFileName}/${name}.${type}`, err);
        return "";
      }
    },

 handleImageClick(event) {
  if (this.isTransitioning || this.currentIndex == null) return;

  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(`Clicked at: (${x}, ${y})`);

  const result = this.checkCFUAnswer(this.currentQuestion, x, y);

  // ensure array exists
  if (!Array.isArray(this.storedClicks[this.currentIndex])) {
    this.storedClicks = { ...this.storedClicks, [this.currentIndex]: [] };
  }

  this.storedClicks[this.currentIndex].push({
    x,
    y,
    isCorrect: result.isCorrect,
  });

  // ✅ use computed suffix here
  const questionId = this.currentIndex + 1;
  const suf = this.suffix;
  const correctAnswerArr = this.currentQuestion[`AnswerArr_${suf}`] || [];

  this.practiceList.push({
    id: questionId,
    originalQuestionNo: this.currentQuestion.__index,
    level: this.currentQuestion.__level,
    userClicks: { x, y },
    isCorrect: result.isCorrect,
    fullCorrectAnswer: correctAnswerArr,
    timeTaken: (Date.now() - this.questionStartTime) / 1000,
  });

  if (result.isCorrect) this.correct_Answers++;
  else this.incorrect_Answers++;
  this.Questions_attempted++;

  // Emit per-click result popup
  this.$emit("show-result-popup", result.isCorrect);

  // Auto-next after 1s
  this.isTransitioning = true;
  setTimeout(() => {
    this.goNext();
    this.isTransitioning = false;
  }, 1000);
},


checkCFUAnswer(question, clickX, clickY) {
  if (!question || !question.ranges)
    return { isCorrect: false, correctRange: null, clickedRange: null };

  let clickedRange = null;
  for (const [name, range] of Object.entries(question.ranges)) {
    if (
      clickX >= range.x1 &&
      clickX <= range.x2 &&
      clickY >= range.y1 &&
      clickY <= range.y2
    ) {
      clickedRange = name;
      break;
    }
  }

  // ✅ use computed suffix instead of fixed 2-digit
  const suf = this.suffix;
  const optionArr = question[`OptionArr_${suf}`] || [];
  const answerArr = question[`AnswerArr_${suf}`] || [];
  const correctIndex = answerArr.findIndex((a) => a === "Yes");
  const correctRange = optionArr[correctIndex] || null;
  const isCorrect = clickedRange === correctRange;

  return { isCorrect, correctRange, clickedRange };
},


    // goNext() {
    //   if (this.currentIndex < this.total - 1) {
    //     this.$emit("next");
    //     this.questionStartTime = Date.now();
    //     return;
    //   }

    //   // last question -> show final result
    //   this.resultData = {
    //     summary: {
    //       TotalQuestions: this.total,
    //       CorrectAnswers: this.correct_Answers,
    //       WrongAnswers: this.incorrect_Answers,
    //     },
    //     detailedResults: this.practiceList,
    //   };
    //   this.$emit("quiz-finished", JSON.parse(JSON.stringify(this.resultData)));
    //   this.$emit("show-final-result-popup", this.resultData);
    // },
goNext() {
  if (this.currentIndex < this.total - 1) {
    this.$emit("next");
    this.questionStartTime = Date.now();
    return;
  }

  // Last question -> prepare final result
  this.resultData = {
    summary: {
      TotalQuestions: this.total,
      CorrectAnswers: this.correct_Answers,
      WrongAnswers: this.incorrect_Answers,
    },
    detailedResults: this.practiceList,
  };

  // Emit the result to parent
  this.$emit("quiz-finished", JSON.parse(JSON.stringify(this.resultData)));
},

    goPrev() {
      if (this.currentIndex > 0) {
        this.$emit("prev");
        this.questionStartTime = Date.now();
      }
    },

    handleNextClick() {
      this.goNext();
    },

    resetCurrentQuestion() {
      const confirmReset = window.confirm(
        `Are you sure you want to erase all clicks for Question ${this.currentIndex + 1}?`
      );
      if (!confirmReset) return;

      this.storedClicks = { ...this.storedClicks, [this.currentIndex]: [] };
      console.log(`[CFUPHandler] Cleared clicks for question ${this.currentIndex + 1}`);
    },
  },
};
</script>

<style scoped>
.cfu-p-container {
  max-width: 1100px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  position: relative;
}
.question-text {
  color: #4f6af3;
  font-weight: 600;
  margin-bottom: 20px;
}
.cfu-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}
.main-image {
  position: relative;
}
.grid-image {
  width: 600px;
  border: 2px solid #e4b2ff;
  cursor: pointer; /* 👈 changes crosshair to hand */
  border-radius: 10px;
}
.click-marker {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.click-marker.correct {
  background-color: rgba(76, 175, 80, 0.7);
  border: 2px solid #2e7d32;
}
.click-marker.incorrect {
  background-color: rgba(244, 67, 54, 0.7);
  border: 2px solid #c62828;
}
.object-image img {
  width: 200px;
  border: 2px dashed #f36;
  padding: 10px;
  border-radius: 10px;
}
.navigation {
  margin-top: 20px;
}
.nav-btn {
  margin: 5px 15px;
  padding: 6px 10px;
  font-size: 40px;
  cursor: pointer;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: 0.2s;
}
.nav-btn:hover {
  background: #f0f0ff;
}
.question-count {
  margin-top: 10px;
  font-weight: 500;
}
.error-text {
  color: #e63946;
  font-size: 14px;
  margin-top: 10px;
}
</style>