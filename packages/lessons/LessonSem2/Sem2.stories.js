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
      DetailedResults: []
    };
  },
async created() {
  const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I-2';
  const questionCount = parseInt(sessionStorage.getItem('questionCount')) || 0;
  const levelRange = sessionStorage.getItem('Exe_Number'); // e.g. '1-5'

  let levelStart = 0, levelEnd = 0;
  if (levelRange) {
    const parts = levelRange.split('-').map(Number);
    levelStart = parts[0];
    levelEnd = parts[1] || parts[0];
  }

    // ✅ Retrieve attempted question numbers from localStorage
    const storedResultRaw = sessionStorage.getItem('attemptedQuestionData');
        // const storedResultRaw = localStorage.getItem('attemptedQuestionData');
        let attemptedQuestionNumbers = [];
        let attemptedDetails = [];
let attemptedData = {};
try {
  if (storedResultRaw) {
    let firstParse = JSON.parse(storedResultRaw);

    // If firstParse is still a string (double encoded), parse again
    attemptedData = typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
  }
} catch (err) {
  console.error("Error parsing attemptedData:", err);
}

// console.log("attemptedData...in stories .js:", attemptedData);
// console.log("DetailedResults:", attemptedData.DetailedResults);


        if (
            attemptedData &&
            Array.isArray(attemptedData.DetailedResults) &&
            attemptedData.DetailedResults.length > 0
        ) {

            // ✅ Update summary counts from attemptedData
            this.timestart = attemptedData.TimeElapsed || 0;
            this.Questions_attempted = attemptedData.QuestionsAttempted || 0;
            this.correct_Answers = attemptedData.CorrectAnswers || 0;
            this.incorrect_Answers = attemptedData.IncorrectAnswers || 0;

            attemptedData.DetailedResults.forEach(q => {
                this.practiceList.push({
                    id: q.QuestionIndex,
                    UserResponse: q.UserResponse ?? q.userResponse ?? null,
                    fullCorrectAnswer: q.FinalAnswer ? JSON.parse(JSON.stringify(q.FinalAnswer)) : [],
                    isCorrect: q.IsCorrect || false,
                    level: q.Level ?? null,
                    timeTaken: q.TimeTaken ?? 0
                });
            });

            // alert("dfghbj");
            // console.log(`✅ Loaded ${this.practiceList} attempted questions into practiceList at start`);

            this.DetailedResults = this.practiceList.map((entry, idx) => {
                return {
                    questionNo: entry.id || 0,
                    level: entry.level,
                    userResponse:entry.UserResponse,
                    rectanglesAnswer: entry.fullCorrectAnswer || [],
                    fullCorrectAnswer: entry.fullCorrectAnswer || [],
                    isCorrect: entry.isCorrect,
                    timeTaken: entry.timeTaken
                };
            });

        }

        // console.log("🟢 storedResultRaw:", storedResultRaw);

       if (storedResultRaw) {
    try {
        let parsed = JSON.parse(storedResultRaw); // first parse

        // console.log("typeof parsed:", typeof parsed);
        if (typeof parsed === "string") {
            parsed = JSON.parse(parsed); // second parse if still string
        }

        attemptedQuestionNumbers = parsed.AttemptedQuestionNumbers || [];
        attemptedDetails = parsed.DetailedResults || [];
        // console.log("🟢 Attempted Question Numbers:", attemptedQuestionNumbers);

    } catch (e) {
        console.warn("⚠️ Failed to parse attemptedQuestionData:", e);
    }
}


  try {
    // const response = await axios.get(`/${fileName}.json`);
    const response = await require(`./Data/lesson${fileName}.json`);
    const data = response;
    // console.log("Loaded JSON data:", data);
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

      // console.log("levels " + JSON.stringify(levels, null, 2));

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

            // ✅ Reorder JSON: Move attempted questions to start (with updated values)
        for (const level of levels) {
            const key = `Level${level}`;

             // ✅ Find the set where level matches
           const levelSet = filteredSets.find(s => s.level === level);
             if (levelSet && Array.isArray(levelSet.questions)) {
                 let levelQuestions = levelSet.questions;

                 
            // console.log("attemptedDetails: " + JSON.stringify(attemptedDetails, null, 2));
                // Step 1: Get attempted questions for this level (with restored answers)
                const attemptedForLevel = attemptedDetails
                    .filter(dr => attemptedQuestionNumbers.includes(String(dr.QuestionIndex)) && dr.Level === key)
                    .map(dr => {
                        const questionIndex = parseInt(dr.QuestionIndex, 10) - 1;
                        const originalQ = levelQuestions[questionIndex];
                        if (originalQ) {
                             // ✅ Convert userResponse to index
                           const selectedIndex = dr.UserResponse ? Number(dr.UserResponse) - 1 : -1;
                            // ✅ Handle both "Blanks" (Level 1) and "rectangles" (Level 5)
                            if (Array.isArray(originalQ.options)) {
                                
                                

                                  originalQ.options = originalQ.options.map((opt, i) => {
                                return {
                                  ...opt,
                                  state: i === selectedIndex ? "selected" : "unselected"
                                };
                              });
                               }
                            

                             return {
                                ...originalQ,
                                selectedIndex   // keep this as metadata
                              };
                        }
                        return null;
                    })
                    .filter(Boolean);
                    
                    
            // console.log("attemptedForLevel: " + JSON.stringify(attemptedForLevel, null, 2));
                // Step 2: Get remaining (non-attempted) questions
                let remainingQuestions = levelQuestions.filter((_, idx) =>
                    !attemptedQuestionNumbers.includes(String(idx + 1).padStart(2, '0'))
                );

                
            // console.log("remainingQuestions: " + JSON.stringify(remainingQuestions, null, 2));

                // Step 3: Shuffle only remaining questions
                for (let i = remainingQuestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [remainingQuestions[i], remainingQuestions[j]] = [remainingQuestions[j], remainingQuestions[i]];
                }

                // console.log("remainingQuestions after shuffle: " + JSON.stringify(remainingQuestions, null, 2));

                // Step 4: Merge attempted first, shuffled remaining after
let reorderedQuestions = [...attemptedForLevel, ...remainingQuestions];

//  console.log("reorderedQuestions: " + JSON.stringify(reorderedQuestions, null, 2));
levelSet.questions = reorderedQuestions;


// ✅ Update the levelSet.questions for consistency
levelSet.questions = reorderedQuestions;

// ✅ Also update finalSets in same structure
const finalIndex = finalSets.findIndex(s => s.level === level);
if (finalIndex !== -1) {
  finalSets[finalIndex] = {
    level: level,
    questions: reorderedQuestions
  };
} else {
  // If this level wasn't added before, push it new
  finalSets.push({
    level: level,
    questions: reorderedQuestions
  });
}

// console.log(`✅ Final ${key} order merged into finalSets:`, finalSets.find(s => s.level === level));

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

    // If questionCount is set, slice finalSets to take only needed questions
if (questionCount > 0) {
    let taken = 0;
    const limitedSets = [];

    for (const set of finalSets) {
        if (taken >= questionCount) break;

        const remaining = questionCount - taken;
        const questionsToTake = set.questions.slice(0, remaining);

        limitedSets.push({
            level: set.level,
            questions: questionsToTake
        });

        taken += questionsToTake.length;
    }

    finalSets = limitedSets;
}

this.lessonData = {
    ...data,
    instructionSets: finalSets
};


    // this.lessonData = {
    //   ...data,
    //   instructionSets: finalSets
    // };

            // console.log("✅ Final sets-------: " + JSON.stringify(finalSets, null, 2));

  } catch (error) {
    alert(`Failed to load JSON: ${fileName}.json`);
    console.error(error);
  }
},


  template: `
    <div style="height: 100vh">
      <Sem2 v-if="lessonData" :exercise="exercise" 
      :lessonData="lessonData" 
      :accept-input="true"
      :Questions_attempted="Questions_attempted"
      :correct_Answers="correct_Answers"
      :incorrect_Answers="incorrect_Answers" />
      <div v-else>Loading lesson data...</div>
    </div>
  `
});
