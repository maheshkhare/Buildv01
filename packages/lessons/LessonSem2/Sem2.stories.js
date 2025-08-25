import Sem2 from './Sem2.vue';
import { withKnobs, select } from '@storybook/addon-knobs';
import axios from 'axios'; // make sure this is imported
import 'CSS/tailwind.css';

export default {
  title: './Lessons/LessonSem2',
  component: Sem2,
  decorators: [],
  parameters: {
    componentSubtitle: `Finding Sequences`
  }
};

export const Practice = () => ({
  components: { Sem2 },
  props: {
    exercise: {
      default: select('Exercise #', { 0: 0, 1: 1 }, 0)
    }
  },
  data() {
    return {
      lessonData: null,
      timestart: 0,
      Questions_attempted: 0,
      correct_Answers: 0,
      incorrect_Answers: 0,

      // 👇 make sure these exist before you push
      practiceList: [],
      detailedResults: []
    };
  },
async created() {
  const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I-1';
  const questionCount = parseInt(sessionStorage.getItem('questionCount')) || 0;
  const levelRange = sessionStorage.getItem('Exe_Number'); // e.g. '1-5'

  let levelStart = 0, levelEnd = 0;
  if (levelRange) {
    const parts = levelRange.split('-').map(Number);
    levelStart = parts[0];
    levelEnd = parts[1] || parts[0];
  }

    // ✅ Retrieve attempted question numbers from localStorage
        const storedResultRaw = localStorage.getItem('attemptedQuestionData');
        let attemptedQuestionNumbers = [];
        let attemptedDetails = [];

        const attemptedData = JSON.parse(storedResultRaw || '{}'); // default to object

        if (
            attemptedData &&
            Array.isArray(attemptedData.detailedResults) &&
            attemptedData.detailedResults.length > 0
        ) {

            // ✅ Update summary counts from attemptedData
            this.timestart = attemptedData.summary.totalTimeElapsed || 0;
            this.Questions_attempted = attemptedData.summary.questionsAttempted || 0;
            this.correct_Answers = attemptedData.summary.correctAnswers || 0;
            this.incorrect_Answers = attemptedData.summary.incorrectAnswers || 0;

            attemptedData.detailedResults.forEach(q => {
                this.practiceList.push({
                    id: q.questionNo,
                    fullCorrectAnswer: q.fullCorrectAnswer ? JSON.parse(JSON.stringify(q.fullCorrectAnswer)) : [],
                    isCorrect: q.isCorrect || false,
                    originalQuestionNo: q.originalQuestionNo ?? null,
                    level: q.level ?? null,
                    timeTaken: q.timeTaken ?? 0
                });
            });

            console.log("Practive List" + JSON.stringify(this.practiceList, null, 2));
            // console.log(`✅ Loaded ${this.practiceList} attempted questions into practiceList at start`);

            this.detailedResults = this.practiceList.map((entry, idx) => {
                return {
                    questionNo: entry.id || 0,
                    originalQuestionNo: entry.originalQuestionNo,
                    level: entry.level,
                    rectanglesAnswer: entry.rectanglesAnswer || [],
                    fullCorrectAnswer: entry.fullCorrectAnswer || [],
                    isCorrect: entry.isCorrect,
                    timeTaken: entry.timeTaken
                };
            });

            console.log("Detailed Results: " + JSON.stringify(this.detailedResults, null, 2));
        }

        if (storedResultRaw) {
            try {
                const parsed = JSON.parse(storedResultRaw);
                attemptedQuestionNumbers = parsed.summary?.attemptedQuestionNumbers || [];
                attemptedDetails = parsed.detailedResults || [];
                console.log("🟢 Attempted Question Numbers:", attemptedQuestionNumbers);
            } catch (e) {
                console.warn("⚠️ Failed to parse attemptedQuestionData:", e);
            }
        }

  try {
    // const response = await axios.get(`/${fileName}.json`);
    const response = await require(`./Data/lesson${fileName}.json`);
    const data = response;
    console.log("Loaded JSON data:", data);
    let sets = data.instructionSets || [];
    let filteredSets = sets;

    // ✅ Filter by level range if given
    if (levelRange) {
      filteredSets = sets.filter(set => {
        const lvl = Number(set.level);
        return lvl >= levelStart && lvl <= levelEnd;
      });
    }

    // ✅ If none matched, fallback to all
    if (filteredSets.length === 0) {
        alert(`No questions found for levels ${levelRange} in ${fileName}.json`);
        filteredSets = sets;
    }

    let finalSets = [];

    if (questionCount > 0 && filteredSets.length > 0) {
      // ✅ Get unique levels present
      const levels = [...new Set(filteredSets.map(set => set.level))];
      const perLevelCount = Math.max(1, Math.floor(questionCount / levels.length));
      let remaining = questionCount;

      for (const lvl of levels) {
        const setsForLevel = filteredSets.filter(set => set.level === lvl);
        let pickedCount = 0;

        for (const group of setsForLevel) {
          if (remaining <= 0) break;

          // const groupQuestions = group.questions || [];
          const groupQuestions = (group.questions || []).slice().sort(() => Math.random() - 0.5);

          const needed = Math.min(groupQuestions.length, perLevelCount - pickedCount, remaining);

          if (needed > 0) {
            finalSets.push({
              // instructionText: group.instructionText,
              level: group.level,
              questions: groupQuestions.slice(0, needed)
            });
            pickedCount += needed;
            remaining -= needed;
          }
        }
      }

      // ✅ If leftover remaining, fill from any leftover questions
      if (remaining > 0) {
        for (const group of filteredSets) {
          if (remaining <= 0) break;

          const currentTotal = finalSets.reduce((acc, s) => acc + s.questions.length, 0);
          const flatPicked = finalSets.flatMap(s => s.questions);
          const available = group.questions.filter(q => !flatPicked.includes(q));

          if (available.length > 0) {
            const toTake = Math.min(available.length, remaining);
            finalSets.push({
              // instructionText: group.instructionText,
              level: group.level,
              questions: available.slice(0, toTake)
            });
            remaining -= toTake;
          }
        }
      }

    } else if (filteredSets.length > 0) {
      // ✅ No questionCount, take all sets
      finalSets = filteredSets;
    } else if (data.questions) {
      // ✅ fallback if only root questions
      finalSets = [{
        // instructionText: "",
        level: "",
        questions: questionCount > 0 ? data.questions.slice(0, questionCount) : data.questions
      }];
    } else {
      throw new Error("❌ JSON has no valid sets or questions");
    }

    this.lessonData = {
      ...data,
      instructionSets: finalSets
    };

            console.log("✅ Final sets-------: " + JSON.stringify(finalSets, null, 2));

  } catch (error) {
    alert(`Failed to load JSON: ${fileName}.json`);
    console.error(error);
  }
},


  template: `
    <div style="height: 100vh">
      <Sem2 v-if="lessonData" :exercise="exercise" :lessonData="lessonData" :accept-input="true" />
      <div v-else>Loading lesson data...</div>
    </div>
  `
});
