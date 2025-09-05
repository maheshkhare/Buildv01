// Helper Functions of Category 2

export function parseLevelRangeHelper(context, raw) {
    if (typeof raw === 'number') return [raw]
    if (typeof raw === 'string') {
        raw = raw.trim()
        if (/^\d+$/.test(raw)) return [parseInt(raw)]
        const rangeMatch = raw.match(/^(\d+)-(\d+)$/)
        if (rangeMatch) {
            const [min, max] = rangeMatch.slice(1).map(Number)
            return Array.from({
                length: max - min + 1
            }, (_, i) => min + i)
        }
    }
    return [0]
}

export function TimerFunHelper(context) {
    setInterval(() => {
        if (context.timestart < 9999999999) context.timestart++;
    }, 1000);
}

export function secondsToTimeHelper(s, context) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

export function practice0Helper(context) {
    console.log("Called...............");
    context.TimerFun();
    context.resultShow = false;
    context.PracticeOne = true;

    context.questionStartTime = context.timestart;
    const current = context.questionSet[context.counter];

    context.ImageNames = current.image;
    // const current = context.questionSet[context.counter];

const isAnswered = context.answeredState[context.counter] || current.selectedIndex !== undefined

    // const isAnswered = context.answeredState[context.counter];
    context.countcorrect = isAnswered ? 1 : 0;

    context.AnswerCheckShow = !isAnswered;
    context.NextQuestionShow = isAnswered;

    context.matchedImageMode = !!current.imageSet;

    if (current.imageSet) {
        // If it's an imageSet question (like matching)
        const userAnswer = context.CollectionResult.find(
            r => r.originalQuestionNo === context.counter + 1
        );

        const selectedIndices = userAnswer?.userResponse || [];

    //      context.commonNumArray = current.options.map((opt, i) => {
    //     let state = opt.state || 'unselected';

    //     if (userAnswer && i === selectedIndex) {
    //         state = 'selected';
    //     }

    //     return {
    //         index: i,
    //         state,
    //         Question: opt.label,
    //         Answer: opt.isCorrect ? 'Yes' : ''
    //     };
    // });

        context.commonNumArray = current.imageSet.map((item, i) => {
            let state = 'unselected';

            if (selectedIndices.includes(i)) {
                state = item.isCorrect ? 'correct' : 'incorrect';
            }

            return {
                index: i,
                state,
                Question: item.label,
                Answer: item.isCorrect ? 'Yes' : ''
            };
        });
   } else if (current.options) {
    // If it's a regular options question
    const userAnswer = context.CollectionResult.find(
        r => r.originalQuestionNo === context.counter + 1
    );

    const selectedIndex = Number(userAnswer?.userResponse) - 1; 

    context.commonNumArray = current.options.map((opt, i) => {
        let state = opt.state || 'unselected';

        if (userAnswer && i === selectedIndex) {
            state = 'selected';
        }

        return {
            index: i,
            state,
            Question: opt.label,
            Answer: opt.isCorrect ? 'Yes' : ''
        };
    });

    // 👇 Important: mark as attempted if we had saved data
    if (userAnswer) {
        context.answeredState[context.counter] = true;   // mark this Q as answered
        context.isAnswered = true;                       // update current flag
    } else {
        context.answeredState[context.counter] = false;
        context.isAnswered = false;
    }

    console.log("context.commonNumArray in practice 0 helper " + JSON.stringify(context.commonNumArray, null, 2));
}
 else {
        context.commonNumArray = [];
    }
}

export function WordsAnswerHelper(context, Answer, index) {
    if (!context.matchedImageMode) {
        // ✅ Regular word-based option → auto check on select
        context.commonNumArray.forEach(opt => {
            opt.state = 'unselected';
        });

        context.commonNumArray[index].state = 'selected';
        context.lastSelectedIndex = index;

        context.AnswerCheckShow = false;
        context.NextQuestionShow = true;
    } else {
        // ✅ IMAGE MATCH MODE unchanged
        const selectedIndex = context.selectedIndices.findIndex(i => Number(i) === Number(index));

        if (selectedIndex > -1) {
            // If clicked again → deselect
            context.selectedIndices.splice(selectedIndex, 1);
            context.commonNumArray[index].state = 'unselected';
        } else {
            // If already 2 selected → drop the oldest one
            if (context.selectedIndices.length >= 2) {
                const removed = context.selectedIndices.shift(); // remove first
                context.commonNumArray[removed].state = 'unselected';
            }

            // Add new selection
            context.selectedIndices.push(index);
            context.commonNumArray[index].state = 'selected';
        }

        // Only check when 2 images selected
        if (context.selectedIndices.length === 2) {
            const [i1, i2] = context.selectedIndices;
            const img1 = context.commonNumArray[i1];
            const img2 = context.commonNumArray[i2];

            const isMatch = img1.Question === img2.Question && img1.Answer === 'Yes' && img2.Answer === 'Yes';

            if (isMatch) {
                context.commonNumArray[i1].state = 'correct';
                context.commonNumArray[i2].state = 'correct';
                context.ProgressBar[context.TestProgressBar].state = 'correct';
            } else {
                context.commonNumArray[i1].state = 'incorrect';
                context.commonNumArray[i2].state = 'incorrect';
                context.ProgressBar[context.TestProgressBar].state = 'incorrect';
            }

            context.countcorrect = 1;
            context.answeredState[context.counter] = true;
            context.AnswerCheckShow = false;
            context.NextQuestionShow = true;

            const questionNo = context.questionNoMap[context.counter] || context.counter + 1;

            // Build current attempt entry
            const entry = {
                QuestionIndex: questionNo,
                TimeTaken: (context.timestart - context.questionStartTime) ?? 0.0,
                Level: `Level${context.instructionGroups[context.counter]?.level || 1}`,
                UserResponse: isMatch ? `${i1 + 1},${i2 + 1}` : 'Mismatch',
                FinalAnswer: context.commonNumArray.map(opt => opt.Answer),
                IsCorrect: isMatch
            };

            // ✅ Check if previous attempt exists for this question
            const existingIndex = context.CollectionResult.findIndex(q => q.QuestionIndex === questionNo);
            if (existingIndex > -1) {
                const prevEntry = context.CollectionResult[existingIndex];

                // Subtract previous counts
                context.Questions_attempted--;
                if (prevEntry.IsCorrect) {
                    context.correct_Answers--;
                } else {
                    context.incorrect_Answers--;
                }

                // Replace with latest attempt
                context.CollectionResult.splice(existingIndex, 1, entry);
            } else {
                // New attempt → push to CollectionResult
                context.CollectionResult.push(entry);
            }

            // ✅ Increment counters for current attempt
            context.Questions_attempted++;
            if (isMatch) {
                context.correct_Answers++;
            } else {
                context.incorrect_Answers++;
            }

            context.TestProgressBar++;
        }

    }
}

export function AnswerCheckHelper(context) {
    if (!context.matchedImageMode) {
        if (context.countcorrect === 0) {
            const index = context.lastSelectedIndex;

            if (index === undefined) {
                alert('Please select an option first!');
                return;
            }

            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            context.countcorrect = 1; // ✅ mark context question as checked
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) {
                context.correct_Answers++;
            } else {
                context.incorrect_Answers++;
            }

            context.answeredState[context.counter] = true;

            context.Questions_attempted++;

            context.CollectionResult.push({
                QuestionIndex: context.questionNoMap[context.counter] || context.Questions_attempted + 1,
                Level: `Level${context.instructionGroups[context.counter]?.level || 1}`,
                UserResponse: (index + 1).toString(),
                FinalAnswer: context.commonNumArray.map(opt => opt.Answer),
                TimeTaken: (context.timestart - context.questionStartTime) ?? 0.0,
                IsCorrect: true
            });

            context.AnswerCheckShow = false;
            context.NextQuestionShow = true;
        }
    }
    // Matching mode is handled inline already
}

export function NextQuestionHelper(context) {
    if (!context.answeredState[context.counter]) {
        // Finalize answer for word-based
        const index = context.lastSelectedIndex;
        if (index !== undefined) {
            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            context.countcorrect = 1;
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) context.correct_Answers++;
            else context.incorrect_Answers++;

            context.answeredState[context.counter] = true;
            context.Questions_attempted++;

            const currentQuestionNo = context.questionNoMap[context.counter]; 
let currentLevel = 1;

for (const group of context.instructionGroups) {
  const found = group.questions.find(q => q.questionNo === currentQuestionNo);
  if (found) {
    currentLevel = group.level;
    break;
  }
}
             console.log("currentLevel:", JSON.stringify(currentLevel, null, 2));
            

            context.CollectionResult.push({
                QuestionIndex: context.questionNoMap[context.counter] || context.Questions_attempted,
                Level: `Level${currentLevel}`,
                UserResponse: (index + 1).toString(),
                FinalAnswer: context.commonNumArray.map(opt => opt.Answer),
                TimeTaken: (context.timestart - context.questionStartTime) ?? 0.0,
                IsCorrect: true
            });            
        }
    }

    // ✅ Then move next as normal
   // ✅ Move counter to next unanswered question
let nextCounter = context.counter + 1;
while (nextCounter < context.Total_Questions && context.answeredState[nextCounter]) {
    nextCounter++; // skip already answered questions
}

if (nextCounter < context.Total_Questions) {
    context.counter = nextCounter;
    context.countcorrect = 0;
    context.lastSelectedIndex = undefined;
    context.practice0(); // show next question
} else {
    // All questions done
    context.counter = nextCounter;
    context.activity_Status = 'Completed';
    context.Time_elapsed = secondsToTimeHelper(context.timestart);
    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    context.JsonArrData = JSON.stringify({
        ActivityStatus: context.activity_Status,
        TimeElapsed: secondsToTimeHelper(context.timestart), // <-- convert to HH:MM:SS
        QuestionsAttempted: context.Questions_attempted,
        CorrectAnswers: context.correct_Answers,
        IncorrectAnswers: context.incorrect_Answers,
        ExerciseNumber: context.exercise
    });
}

}

export function SaveAndExitNowHelper(context) {
  //   const key = `QuestionArr_${context.counter + 1}`;
  // current = context.lessonData.questions[key];

  //   // 1. First check if current question is already answered
  //   const alreadyAnswered = context.CollectionResult.find(
  //       r => r.originalQuestionNo === context.counter + 1
  //   );

  //   // 2. If not answered, then add the current question
  //   if (!alreadyAnswered) {
  //       if (context.lastSelectedIndex !== undefined) {
  //           const selectedOption = context.commonNumArray[context.lastSelectedIndex];

  //           context.CollectionResult.push({
  //               originalQuestionNo: context.counter + 1,
  //               Question: current.Question,
  //               userResponse: selectedOption.index + 1,
  //               isCorrect: selectedOption.Answer === 'Yes' ? 1 : 0
  //           });
  //       }
  //   }

    if (!context.answeredState[context.counter]) {
        const index = context.lastSelectedIndex;

        if (index !== undefined) {
            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            // Update counters and progress
            context.countcorrect = 1;
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) {
                context.correct_Answers++;
            } else {
                context.incorrect_Answers++;
            }

            // Mark question as answered
            context.answeredState[context.counter] = true;
            context.Questions_attempted++;

                        const currentQuestionNo = context.questionNoMap[context.counter]; 
let currentLevel = 1;

for (const group of context.instructionGroups) {
  const found = group.questions.find(q => q.questionNo === currentQuestionNo);
  if (found) {
    currentLevel = group.level;
    break;
  }
}
             console.log("currentLevel:", JSON.stringify(currentLevel, null, 2));

            // Record result
            context.CollectionResult.push({
                QuestionIndex: context.questionNoMap[context.counter] || context.Questions_attempted,
                Level: `Level${currentLevel}`,
                UserResponse: (index + 1).toString(),
                FinalAnswer: context.commonNumArray.map(opt => opt.Answer),
                TimeTaken: (context.timestart - context.questionStartTime) ?? 0.0,
                IsCorrect:true
            });
        }
    }


    
    console.log('context.CollectionResult in final', JSON.stringify(context.CollectionResult, null, 2));
    // Mark activity status
    context.activity_Status = 'Paused';
    context.Time_elapsed = secondsToTimeHelper(context.timestart);
    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    // Save JSON data
    context.JsonArrData = JSON.stringify({
        ActivityStatus: context.activity_Status,
        TimeElapsed: secondsToTimeHelper(context.timestart),
        QuestionsAttempted: context.Questions_attempted,
        CorrectAnswers: context.correct_Answers,
        IncorrectAnswers: context.incorrect_Answers,
        ExerciseNumber: context.exercise
    });

//     context.JsonArrData = JSON.stringify({
//         summary: {
//             ActivityName: "Sem2",
//             ActivityStatus: context.activity_Status,
//             TimeElapsed: secondsToTimeHelper(context.timestart),
//             QuestionsAttempted: context.Questions_attempted,
//             CorrectAnswers: context.correct_Answers,
//             attemptedQuestionNumbers: context.CollectionResult.map(q => q.questionNo),
//             IncorrectAnswers: context.incorrect_Answers,
//             testDate: new Date().toISOString()
//         },
//         detailedResults: context.CollectionResult
// });

}



export function FinalResultHelper(context) {
    const resultData = JSON.stringify({
            ActivityStatus: context.activity_Status,
            TimeElapsed: secondsToTimeHelper(context.timestart),
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            AttemptedQuestionNumbers: context.CollectionResult.map(q => String(q.QuestionIndex)),
            IncorrectAnswers: context.incorrect_Answers,
            DetailedResults: context.CollectionResult
    });

    

    // Download JSON
    const filename = `Lesson_${context.exercise}_Result.json`;
    // const jsonStr = JSON.stringify(resultData, null, 2);
    
        // ✅ Clear old attemptedQuestionData before saving new one
    localStorage.removeItem('attemptedQuestionData')

    // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(resultData, null, 2));
    // const blob = new Blob([jsonStr], {
    //     type: "application/json"
    // });
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = filename;
    // link.click();
    // URL.revokeObjectURL(link.href);
      const fullResult = resultData || {}

const finalFullResult = JSON.stringify(fullResult)
  .replace(/"(\w+)"\s*:/g, '$1:'); 

    //  const finalFullResult = JSON.stringify(fullResult).replace(/"/g, "");

    // Redirect (optional)
    // const curSite = `${window.location.protocol}//${window.location.host}`;
    // const url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${context.CollectionResult}&Activityresult=${finalFullResult}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
    // window.location.href = url;

const curSite = window.location.protocol + "//" + window.location.host;

const  Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx`


const form = document.createElement("form");

  form.method = "POST";

  form.action = Url;

 

  // Add hidden input with serialized JSON

  const inputToken = document.createElement("input");

  inputToken.type = "hidden";

  inputToken.name = "TokenID"; // You'll read this on the server

  inputToken.value = sessionStorage.getItem('sesTokenID');

 

  form.appendChild(inputToken);

 

  const inputJData = document.createElement("input");

  inputJData.type = "hidden";

  inputJData.name = "JsonData"; // You'll read this on the server

  // inputJData.value = this.CollectionResult;
inputJData.value = "";
 

  form.appendChild(inputJData);

 

  const inputActRes = document.createElement("input");

  inputActRes.type = "hidden";

  inputActRes.name = "Activityresult"; // You'll read this on the server

  inputActRes.value = finalFullResult;

 

  form.appendChild(inputActRes);

 

  const inputExeId = document.createElement("input");

  inputExeId.type = "hidden";

  inputExeId.name = "ExeID"; // You'll read this on the server

  inputExeId.value = sessionStorage.getItem('ExeID');

 

  form.appendChild(inputExeId);

 

  const inputExeNum = document.createElement("input");

  inputExeNum.type = "hidden";

  inputExeNum.name = "exNum"; // You'll read this on the server

  inputExeNum.value = sessionStorage.getItem('Exe_Number');

 

  form.appendChild(inputExeNum);

 

  const inputstudID = document.createElement("input");

  inputstudID.type = "hidden";

  inputstudID.name = "studentID"; // You'll read this on the server

  inputstudID.value = sessionStorage.getItem('studentID');

 

  form.appendChild(inputstudID);

 

 

  document.body.appendChild(form);

  form.submit();

  }

// Helper Functions of Category 4

export function practice0Helper4(context) {
    if (context.items.length === 0) {
        context.TimerFun();
        context.AnswerCheckShow = true;
        context.PracticeOne = true;
        context.questionNoMap = [];

        const selectedItems = [];
        const levels = context.selectedLevels;
        const questionsPerLevel = Math.floor(context.Total_Questions / levels.length);
        let remaining = context.Total_Questions % levels.length;

        for (const level of levels) {
            const levelKey = `Level${level}`;
            const levelItems = context.activityQuestions[levelKey] || [];
            let count = questionsPerLevel + (remaining > 0 ? 1 : 0);
            if (remaining > 0) remaining--;

            const shuffled = levelItems.slice().sort(() => Math.random() - 0.5);
            const subset = levelItems.slice(0, count).map(item => ({
                ...item,
                __index: levelItems.indexOf(item),
                __level: levelKey
            }));
            selectedItems.push(...subset);
        }

        context.items = selectedItems;
    }

    if (context.counter >= context.items.length) return;

    const questionObj = context.items[context.counter];

    // If you stored the whole level key
    const levelKey = context.items[context.counter].__level;
    context.instructionText = context.activityQuestions[levelKey][0].Instruction || '';

    const questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'));

    if (questionKey) {
        const questionNum = questionKey.replace('QuestionArr_', '');
        context.questionNoMap.push(questionNum);
        console.log("Stored Question No: ", context.questionNoMap);
    }
    const optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'));
    const answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'));

    context.questionStartTime = Date.now();

    if (
        questionObj.rectangles &&
        questionObj.options &&
        questionObj.rectangles.length > 0 &&
        questionObj.options.length > 0
    ) {
        context.rectangles = questionObj.rectangles;
        context.options = questionObj.options;
        context.isRectangleMode = true;

        context.paragraphText = questionObj[questionKey] || '';
        context.selectedRectangleIndex = 0;

        context.symbolsFromJson = [];
        context.iconBlanksFromJson = [];
        context.commonNumArray = [];

        return;
    } else {
        context.isRectangleMode = false;
    }

    // ✅ Normal paragraph text
    context.paragraphText = questionObj[questionKey] || '';

    const symbols = questionObj.Symbols || [];
    const blanks = questionObj.Blanks || [];

    context.symbolsFromJson = symbols;
    context.iconBlanksFromJson = blanks;

    if (blanks.length > 0) {
        context.selectedIconBox = blanks[0].id;
        context.selectedIconBoxIndex = 0;
    } else {
        context.selectedIconBox = null;
        context.selectedIconBoxIndex = 0;
    }

    // 🟢 Is it blanks question?
    const isBlanksQuestion = symbols.length > 0 && blanks.length > 0;

    if (isBlanksQuestion) {
        context.commonNumArray = [{
            Question: questionObj[questionKey] || '',
            Option: [],
            Answer: []
        }];
    } else {
        const QuestionValue = questionObj[questionKey] || '';
        const OptionValue = questionObj[optionKey] || [];
        let AnswerValue = questionObj[answerKey] || [];

        if (!Array.isArray(AnswerValue)) AnswerValue = [];

        context.commonNumArray = OptionValue.map((opt, i) => {
            return {
                index: i,
                state: 'base',
                Answer: AnswerValue[i],
                Option: opt,
                Question: QuestionValue
            };
        });
    }

    context.PrevQuestionShow = context.counter > 0;
}

export function WordsAnswerHelper4(context, Answer, index) {
    // const questionId = context.counter + 1

    const currentItem = context.items[context.counter];

// Find the key that starts with "QuestionArr_"
const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

// Extract the numeric part
const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

// Ensure 2-digit format
const questionId = String(originalQuestionNo).padStart(2, '0');
    if (context.viewingPrevious) {
        alert("You have already answered context question. context cannot be changed now.")
        return
    }

    const currentQuestionObj = context.items[context.counter]
    const paddedIndex = context.getPaddedIndex(currentQuestionObj.__index)

    let correctAnswerArr = currentQuestionObj[`AnswerArr_${paddedIndex}`] || []
    if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

    const timeTaken = (Date.now() - context.questionStartTime) / 1000

    const existingIndex = context.practiceList.findIndex(q => q.id === questionId)
    if (existingIndex !== -1) {
        const old = context.practiceList[existingIndex]
        const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
        if (wasCorrect) context.correct_Answers--
        else context.incorrect_Answers--

        context.practiceList.splice(existingIndex, 1)
    } else {
        context.Questions_attempted++
    }

    context.practiceList.push({
        id: questionId,
        originalQuestionNo: currentQuestionObj.__index,
        level: currentQuestionObj.__level,
        userAnswer: (index + 1).toString(),
        fullCorrectAnswer: correctAnswerArr,
        timeTaken
    })

    const isCorrect = correctAnswerArr[index] === 'Yes'

    if (isCorrect) {
        context.correct_Answers++
        context.ContinuesWrong = 0
        context.ProgressBar[context.counter].state = 'correct'
    } else {
        context.incorrect_Answers++
        context.ContinuesWrong++
        context.ProgressBar[context.counter].state = 'incorrect'
    }

    context.commonNumArray.forEach((opt, i) => {
        opt.state = i === index ?
            isCorrect ? 'correct' : 'incorrect' :
            'base'
    })

    context.countcorrect = 1

    if (context.counter + 1 > context.TestProgressBar) {
        context.TestProgressBar = context.counter + 1
    }
}

export function AnswerCheckHelper4(context) {
    // const questionNo = context.counter + 1;
    // const questionId = String(questionNo).padStart(2, '0');
    const currentItem = context.items[context.counter];

// Find the key that starts with "QuestionArr_"
const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

// Extract the numeric part
const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

// Ensure 2-digit format
const questionId = String(originalQuestionNo).padStart(2, '0');

    const isBlanksQuestion = context.symbolsFromJson.length > 0 && context.iconBlanksFromJson.length > 0;
    const isRectangleQuestion = context.isRectangleMode && context.rectangles.length > 0 && context.options.length > 0;

    // ✅ Letter Fill Mode (Seaside)
    if (context.isLetterFillMode) {

        if (!context.currentQuestion || !context.currentQuestion.Blanks) {
            return;
        }

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.currentQuestion.Blanks) {
            let userAnswer = blank.firstSymbol || '';

            if (blank["1stBlankValue"]) userAnswer += blank["1stBlankValue"];
            if (blank["2ndBlankValue"]) userAnswer += blank["2ndBlankValue"];
            if (blank["3rdBlankValue"]) userAnswer += blank["3rdBlankValue"];
            if (blank["4thBlankValue"]) userAnswer += blank["4thBlankValue"];
            if (blank["5thBlankValue"]) userAnswer += blank["5thBlankValue"];
            if (blank["6thBlankValue"]) userAnswer += blank["6thBlankValue"];
            if (blank["7thBlankValue"]) userAnswer += blank["7thBlankValue"];

            if (blank.lastSymbol) userAnswer += blank.lastSymbol;

            console.log(`Blank ${blank.id} → User: ${userAnswer} | Correct: ${blank.CorrectValue}`);

            if (userAnswer.length < 2) {
                allFilled = false;
                break;
            }

            if (userAnswer !== blank.CorrectValue) {
                allCorrect = false;
            }
        }

        if (!allFilled) {
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.currentQuestion.Blanks)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isRectangleQuestion) {
        let allFilled = true;
        let allCorrect = true;

        for (const rect of context.rectangles) {
            if (!rect.chosenOption) {
                allFilled = false;
                break;
            }

            if (typeof rect.chosenOption === 'string') {
                if (rect.chosenOption !== rect.correctLetter) {
                    allCorrect = false;
                }
            } else {
                if (rect.chosenOption.letter !== rect.correctLetter) {
                    allCorrect = false;
                }
            }
        }

        if (!allFilled) {
            context.$toast?.warning('Please match all rectangles before moving on.');
            console.log("context is the print statement" + allFilled);
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                rectanglesAnswer: JSON.parse(JSON.stringify(context.rectangles)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isBlanksQuestion) {

        const correctMap = context.iconBlanksFromJson.reduce((acc, b) => {
            acc[b.id] = b.CorrectValue;
            return acc;
        }, {});

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.iconBlanksFromJson) {
            if (!blank.value) {
                allFilled = false;
                break;
            }
            const correctValue = correctMap[blank.id];
            if (blank.value !== correctValue) {
                allCorrect = false;
            }
        }

        if (!allFilled) {
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.iconBlanksFromJson)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else {
        const hasAnswered = context.practiceList.some(q => q.id === questionId);

        if (!hasAnswered) {
            context.$toast?.warning('Please answer the question before moving on.');
            return;
        }
    }

    // ✅ ✅ ✅ Next or Complete
    if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        const nextAnswered = context.practiceList.some(q => q.id === context.counter + 1);
        context.countcorrect = nextAnswered ? 1 : 0;
        context.viewingPrevious = nextAnswered;
        context.practice0();
    } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = secondsToTimeHelper(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
            return {
                QuestionIndex: context.questionNoMap[idx] || idx + 1,
                Level: entry.level,
                UserResponse: "",
                FinalAnswer: isBlanksQuestion ? (entry.blanksAnswer || []) : (entry.rectanglesAnswer || []),
                IsCorrect: entry.isCorrect,
                TimeTaken: entry.timeTaken
            };
        });

        context.resultData = {
                ActivityStatus: context.activity_Status,
                TimeElapsed: secondsToTimeHelper(context.timestart),
                QuestionsAttempted: context.Questions_attempted,
                CorrectAnswers: context.correct_Answers,
                IncorrectAnswers: context.incorrect_Answers,
                AttemptedQuestionNumbers: detailedResults.map(q => String(q.QuestionIndex)),
                DetailedResults: detailedResults
            // detailedResults
        };

        console.log("secondsToTimeHelper(context.timestart)"+secondsToTimeHelper(context.timestart));
        context.JsonArrData = JSON.stringify(context.resultData);
    }
}

export function SaveAndExitNowHelper4(context) {
    
    // const questionNo = context.counter + 1;
    
    // console.log("Practice Lst dsfg" + JSON.stringify(context, null, 2));
    // const questionId = String(questionNo).padStart(2, '0');

    // Do this:
const currentItem = context.items[context.counter];

// Find the key that starts with "QuestionArr_"
const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

// Extract the numeric part
const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

// Ensure 2-digit format
const questionId = String(originalQuestionNo).padStart(2, '0');


    const isBlanksQuestion = context.symbolsFromJson.length > 0 && context.iconBlanksFromJson.length > 0;
    const isRectangleQuestion = context.isRectangleMode && context.rectangles.length > 0 && context.options.length > 0;
    
    const isAnswered =
        (context.isLetterFillMode && context.currentQuestion?.Blanks?.some(b =>
            b["1stBlankValue"] || b["2ndBlankValue"] || b["3rdBlankValue"] || b["4thBlankValue"] ||
            b["5thBlankValue"] || b["6thBlankValue"] || b["7thBlankValue"])) ||
        (isRectangleQuestion && context.rectangles.some(r => r.chosenOption)) ||
        (isBlanksQuestion && context.iconBlanksFromJson.some(b => b.value));

    if (isAnswered) {

    // ✅ Letter Fill Mode (Seaside)
    if (context.isLetterFillMode) {

        if (!context.currentQuestion || !context.currentQuestion.Blanks) {
            return;
        }

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.currentQuestion.Blanks) {
            let userAnswer = blank.firstSymbol || '';

            if (blank["1stBlankValue"]) userAnswer += blank["1stBlankValue"];
            if (blank["2ndBlankValue"]) userAnswer += blank["2ndBlankValue"];
            if (blank["3rdBlankValue"]) userAnswer += blank["3rdBlankValue"];
            if (blank["4thBlankValue"]) userAnswer += blank["4thBlankValue"];
            if (blank["5thBlankValue"]) userAnswer += blank["5thBlankValue"];
            if (blank["6thBlankValue"]) userAnswer += blank["6thBlankValue"];
            if (blank["7thBlankValue"]) userAnswer += blank["7thBlankValue"];

            if (blank.lastSymbol) userAnswer += blank.lastSymbol;

            console.log(`Blank ${blank.id} → User: ${userAnswer} | Correct: ${blank.CorrectValue}`);

            if (userAnswer.length < 2) {
                allFilled = false;
                break;
            }

            if (userAnswer !== blank.CorrectValue) {
                allCorrect = false;
            }
        }

        if (!allFilled) {
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.currentQuestion.Blanks)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isRectangleQuestion) {
        let allFilled = true;
        let allCorrect = true;

        for (const rect of context.rectangles) {
            if (!rect.chosenOption) {
                allFilled = false;
                break;
            }

            if (typeof rect.chosenOption === 'string') {
                if (rect.chosenOption !== rect.correctLetter) {
                    allCorrect = false;
                }
            } else {
                if (rect.chosenOption.letter !== rect.correctLetter) {
                    allCorrect = false;
                }
            }
        }

        if (!allFilled) {
            context.$toast?.warning('Please match all rectangles before moving on.');
            console.log("context is the print statement" + allFilled);
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                rectanglesAnswer: JSON.parse(JSON.stringify(context.rectangles)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isBlanksQuestion) {

        const correctMap = context.iconBlanksFromJson.reduce((acc, b) => {
            acc[b.id] = b.CorrectValue;
            return acc;
        }, {});

        
        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.iconBlanksFromJson) {
            if (!blank.value) {
                allFilled = false;
                break;
            }
            const correctValue = correctMap[blank.id];
            if (blank.value !== correctValue) {
                allCorrect = false;
            }
        }

        // if (!allFilled) {
        //     context.$toast?.warning('Please fill all blanks before moving on.');
        //     return;
        // }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
                
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.iconBlanksFromJson)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;
            
            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else {
        const hasAnswered = context.practiceList.some(q => q.id === questionId);

        if (!hasAnswered) {
            context.$toast?.warning('Please answer the question before moving on.');
            return;
        }
    }
    
    }

    context.activity_Status = 'Paused';
    context.Time_elapsed = secondsToTimeHelper(context.timestart);
    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    let detailedResults = context.detailedResults;

    context.practiceList.forEach(entry => {
        // Convert both to strings with leading zeros (2-digit format)
        const entryQNo = String(entry.id).padStart(2, '0');

        const alreadyExists = detailedResults.some(
            item => String(item.questionNo).padStart(2, '0') === entryQNo
        );

        

        if (!alreadyExists) {
            detailedResults.push({
                QuestionIndex: entryQNo,
                Level: entry.level,
                UserResponse: "",
                FinalAnswer: isBlanksQuestion ? (entry.blanksAnswer || []) : (entry.rectanglesAnswer || []),
                IsCorrect: entry.isCorrect,
                TimeTaken: entry.timeTaken
            });
        }
    });

    context.resultData = {
            ActivityStatus: context.activity_Status,
            TimeElapsed: secondsToTimeHelper(context.timestart),
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            IncorrectAnswers: context.incorrect_Answers,
            AttemptedQuestionNumbers: detailedResults.map(q => String(q.QuestionIndex)),
            DetailedResults:detailedResults
        // detailedResults
    };


    context.JsonArrData = JSON.stringify(context.resultData);
}

export function FinalResultHelper4(context) {
    const now = new Date()
    const testDate = now.toISOString()
    const fullResult = context.resultData || {}

    // ✅ Clear old attemptedQuestionData before saving new one
    localStorage.removeItem('attemptedQuestionData')

    // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(fullResult));

     const finalFullResult = JSON.stringify(fullResult)
  .replace(/"(\w+)"\s*:/g, '$1:'); 

      // const curSite = window.location.protocol + "//" + window.location.host;
      // const Url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${context.CollectionResult}&Activityresult=${finalFullResult}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
      // console.log("URl jhgfdfghj"+Url);
      // window.location.href = Url;

      
const curSite = window.location.protocol + "//" + window.location.host;

const  Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx`


const form = document.createElement("form");

  form.method = "POST";

  form.action = Url;

 

  // Add hidden input with serialized JSON

  const inputToken = document.createElement("input");

  inputToken.type = "hidden";

  inputToken.name = "TokenID"; // You'll read this on the server

  inputToken.value = sessionStorage.getItem('sesTokenID');

 

  form.appendChild(inputToken);

 

  const inputJData = document.createElement("input");

  inputJData.type = "hidden";

  inputJData.name = "JsonData"; // You'll read this on the server

  // inputJData.value = this.CollectionResult;
inputJData.value = "";
 

  form.appendChild(inputJData);

 

  const inputActRes = document.createElement("input");

  inputActRes.type = "hidden";

  inputActRes.name = "Activityresult"; // You'll read this on the server

  inputActRes.value = finalFullResult;

 

  form.appendChild(inputActRes);

 

  const inputExeId = document.createElement("input");

  inputExeId.type = "hidden";

  inputExeId.name = "ExeID"; // You'll read this on the server

  inputExeId.value = sessionStorage.getItem('ExeID');

 

  form.appendChild(inputExeId);

 

  const inputExeNum = document.createElement("input");

  inputExeNum.type = "hidden";

  inputExeNum.name = "exNum"; // You'll read this on the server

  inputExeNum.value = sessionStorage.getItem('Exe_Number');

 

  form.appendChild(inputExeNum);

 

  const inputstudID = document.createElement("input");

  inputstudID.type = "hidden";

  inputstudID.name = "studentID"; // You'll read this on the server

  inputstudID.value = sessionStorage.getItem('studentID');

 

  form.appendChild(inputstudID);

 

 

  document.body.appendChild(form);

  form.submit();
}

// Templates generic methods
export function handleDropInParagraphHelper(context,blankId, event) {
  const raw = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain');
  if (!raw) return;

  let dropped;
  try { dropped = JSON.parse(raw); } catch (e) { dropped = { symbol: raw }; }
  
  const valueToSet = dropped.value ?? dropped.symbol ?? String(raw);

  const idx = context.iconBlanks.findIndex(b => b.id === blankId);
  if (idx !== -1) {
    context.$set(context.iconBlanks, idx, { ...context.iconBlanks[idx], value: valueToSet });
  }
}

 export function assignOptionToRectangleHelper(context,opt) {
  if (context.selectedRectangleIndex === null) {
    alert('Please select a rectangle first.');
    return;
  }
  const currentRect = context.rectangles[context.selectedRectangleIndex];

  // ✅ DO NOT overwrite if already filled
  if (currentRect.chosenOption) {
    alert('context rectangle already has a letter.');
    return;
  }

  // ✅ Assign the option
  context.$set(context.rectangles, context.selectedRectangleIndex, {
    ...currentRect,
    chosenOption: opt
  });

  // ✅ Find next empty rectangle
  const nextIdx = context.rectangles.findIndex(
    (r, i) => !r.chosenOption && i > context.selectedRectangleIndex
  );

  if (nextIdx !== -1) {
    context.selectedRectangleIndex = nextIdx;
  } else {
    context.selectedRectangleIndex = null; // all filled
  }
}

export function getImgUrlHelper(context,ImgName) {
            if (!ImgName) return "";
            var images = require.context('../assets/graphicsCat4/', false, /\.png$/);
            return images('./' + ImgName + ".png");
        }

export function getImgUrlByFileNameHelper(context,ImgName) {
  try {
    const fileName = sessionStorage.getItem('jsonFile');
    const images = require.context('../assets/graphicsCat4/', true, /\.png$/);
    const path = `./${fileName}/${ImgName}.png`;
    return images(path); // If it succeeds, return image path
  } catch (error) {
    return null; // If not an image, return null
  }
}

export function getBlankKeyHelper(context,n) {
  const suffix = (n) => {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  };
  return `${suffix(n)}BlankValue`;
}

export function assignLetterHelper(context,letter) {
  if (!context.selectedBlankId) {
    alert('Please select a blank first.');
    return;
  }

  const blankIdx = context.blanks.findIndex(b => b.id === context.selectedBlankId);
  const key = context.getBlankKey(context.selectedBlankIndex);
  context.$set(context.blanks[blankIdx], key, letter);

  // 🔁 Auto-select next blank in the same group (same ID)
  const nextIndex = context.selectedBlankIndex + 1;
  const nextKey = context.getBlankKey(nextIndex);
  if (context.blanks[blankIdx][nextKey] !== undefined) {
    context.selectedBlankId = context.selectedBlankId;
    context.selectedBlankIndex = nextIndex;
  } else {
    // ❌ No more blanks in current group: clear selection
    context.selectedBlankId = null;
    context.selectedBlankIndex = null;
  }
}






///////////////////////////////cat 1 /////////////////////////////


export function  processWordSetshelper(context ) {
  context.wordSets = {};
  context.levelNames = {};


  //counter
  context.Total_Questions = questionLimit;
context.counter = 0;  // start from first question

  const selectedLevels = context.parseLevelRange(context.Exercise_Number);
  let questionLimit = context.questionLimit || 1;

  // 🔹 fetch attempted IDs from localStorage if present
  let attemptedIds = [];
  // const saved = localStorage.getItem("attemptedQuestionData");
   const saved = sessionStorage.getItem("attemptedQuestionData");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.DetailedResults && Array.isArray(parsed.DetailedResults)) {
        attemptedIds = parsed.DetailedResults.map(r => r.setId);
      }
    } catch (e) {
      console.error("Error parsing attemptedQuestionData:", e);
    }
  }

  // 🔹 calculate availability excluding attempted
  let totalAvailable = 0;
  selectedLevels.forEach(level => {
    const levelKey = `level${level}`;
    const sets = (context.activityQuestions.sets?.[levelKey]) || [];
    const freshSets = sets.filter(set => !attemptedIds.includes(set.setId));
    totalAvailable += freshSets.length;
  });

  // 🔹 clamp questionLimit to available questions
  if (totalAvailable < questionLimit) {
    questionLimit = totalAvailable;
  }

  // 🔹 collect fresh sets
  let combinedSets = [];
  selectedLevels.forEach(level => {
    const levelKey = `level${level}`;
    const sets = (context.activityQuestions.sets?.[levelKey]) || [];
    const freshSets = sets.filter(set => !attemptedIds.includes(set.id));
    combinedSets.push(...freshSets.map(set => ({ ...set, __level: levelKey })));
  });

  // 🔹 shuffle (Fisher-Yates would be better, but context is fine for now)
  // combinedSets = combinedSets.sort(() => Math.random() - 0.5);

  // 🔹 pick the required number
  const selectedSets = combinedSets.slice(0, questionLimit);

  context.allSelectedSets = selectedSets;

  // 🔹 group sets by level
  context.wordSets = selectedSets.reduce((acc, set) => {
    const key = set.__level || 'level1';
    if (!acc[key]) acc[key] = [];
    acc[key].push(set);
    return acc;
  }, {});

  // 🔹 name mapping
  selectedLevels.forEach(level => {
    const levelKey = `level${level}`;
    context.levelNames[level] =
      context.wordSets[levelKey]?.[0]?.levelName || `Level ${level}`;
  });

  context.Total_Questions = questionLimit;


  console.log("Processed updated array:", context.combinedSets);
}

export async function mountedHelper(context,level,response) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
      // context.componentSubtitle = context.;

    context.questionLimit = parseInt(urlParams.get('questionCount')) || null;
    context.Exercise_Number = urlParams.get('Exe_Number') || sessionStorage.getItem("Exe_Number") || '1';

    context.activityQuestions = response.default || response;

    // Step 1: process questions
    context.processWordSets();
    context.initializeComponent();

    // Step 2: restore saved attempts
    // const saved = localStorage.getItem('attemptedQuestionData');
     const saved = sessionStorage.getItem('attemptedQuestionData');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("Restoring saved results:"+ JSON.stringify(parsed,null,2));

      if (parsed.DetailedResults && parsed.DetailedResults.length > 0) {
        // Build completedSets from ALL saved results
        context.completedSets = parsed.DetailedResults.map((result, idx) => {
          const restoredColumns = result.FinalAnswer.map((col, colIndex) =>
            col.map((word, wIdx) => ({
             
              index: wIdx,
             
              name: word,
              state: word ? 'readonly' : 'base'
            }))
          );

            context.questionDetails[idx] = {
            questionIndex: idx,
            timeTaken: result.TimeTaken || 0,
            // isCompleted: result.isCompleted || false,
            wasCorrect: result.IsCorrect || false,
            wasDisplayed: true,
            questionTitles: result.QuestionTitles || (context.currentExerciseSets?.[idx]?.categories?.map(cat => cat.displayName || cat.name) || []),
            userResponse: result.FinalAnswer || []
         };

          // 🔹 Immediately save restored question into questionStates
          // context.questionStates[idx] = {
          //   columns: restoredColumns,
          //   columnTitles: result.QuestionTitles || (context.currentExerciseSets?.[idx]?.categories?.map(cat => cat.displayName || cat.name) || []),
          //   columnVisibility: [],
          //   placedWords: restoredColumns.flat().map(c => c.name).filter(n => n !== ""),
          //   availableWords: [],
          //   selectedWord: null,
          //   Arrow_isShowing: true,
          //   wordsarr: [],
          //   counts: [],
          //   isCompleted: true,
          //   wasModified: false
          // };

          return {
            setId: result.setId,
            questionIndex: idx,
            questionTitles: result.QuestionTitles || (context.currentExerciseSets?.[idx]?.categories?.map(cat => cat.displayName || cat.name) || []),
            columns: restoredColumns
          };
        });

          // 🔹 Loop over all completedSets and inject them into tracking
  if (context.completedSets?.length) {
    context.completedSets.forEach((set, index) => {
      // Restore columns
      context.columns = JSON.parse(JSON.stringify(set.columns || []));
      context.columnTitles = [...(set.questionTitles || [])];
      context.placedWords = set.columns?.flat().map(c => c.name).filter(n => n !== "") || [];

      // ⬇️  Do the same as goToNextQuestion before moving on
      const isCorrect = context.checkCompletion(false);
      context.currentQuestionIndex = index;
      context.updateQuestionTracking(isCorrect);
      context.saveQuestionState();

      // Keep it readonly since it's restored
      context.canModifyAnswers = false;
      context.Arrow_isShowing = true;
    });
  }

        // ✅ Load the FIRST saved question into view
        context.$nextTick(() => {
          // const first = context.completedSets[0];
          // if (first) {
          //   context.currentQuestionIndex = 0;
          //   context.columnTitles = first.questionTitles || [];
          //   context.columns = JSON.parse(JSON.stringify(first.columns));
          //   context.availableWords = [];
          //   context.placedWords = first.columns.flat().map(c => c.name).filter(n => n !== "");
          //   context.canModifyAnswers = false;
          //   context.Arrow_isShowing = true;
          // }

          const nextIndex = context.completedSets.length; // ✅ Resume from after completed
          // const targetSet = context.currentExerciseSets[0]; 

            context.currentQuestionIndex = nextIndex;
            context.setcount = nextIndex;
            context.reset();
            const currentSet = context.currentExerciseSets[nextIndex];
            context.loadQuestionData(currentSet);
            context.canModifyAnswers = true;
            context.Arrow_isShowing = true;

            context.truenextgame = false;
            context.counter = context.currentQuestionIndex;

            context.startQuestionTimer();
        });
      }
    }
  } catch (error) {
    console.error('Error loading JSON:', error);
    context.loadError = true;
    context.isLoading = false;
  }
}

    export function initializeComponenthelper(context) {
      const activityName = sessionStorage.getItem("ActivityName");
      context.language = sessionStorage.getItem("lang") || 'en';

      const firstLevel = context.parseLevelRange(context.Exercise_Number)[0];
      context.exercise = parseInt(firstLevel) || 1;
      const levelKey = context.getLevelKey(firstLevel);
      const currentSets = context.wordSets[levelKey];
      const levelName = currentSets?.[0]?.levelName || context.levelNames[firstLevel] || `Level ${firstLevel}`;

      context.run();
      context.TimerFun();
      context.isLoading = false;
    }

   export function  initializeExercisehelper1(context,exerciseNum) {
      context.Questions_attempted = 0;
      context.correct_Answers = 0;
      context.incorrect_Answers = 0;
      context.questionTimings = [];
      context.questionDetails = [];
      context.reset();
      context.questionStates = [];
      context.currentQuestionIndex = 0;
      // console.log('current index ' .context.currentQuestionIndex);
      context.setcount = 0;
      context.Exercise_Number = exerciseNum;
      context.Total_Questions = context.currentExerciseSets.length;
      if (context.currentExerciseSets.length > 0) {
        context.displayWords();
      }
    }

     export function  loadQuestionDatahelper(context,currentSet) {
      context.reset();
      context.Arrow_isShowing = false;
      context.truenextgame = false;
     context.ids = currentSet.id || '';
    //  console.log('Current Set ID:', context.ids);
      context.columnTitles = currentSet.categories.map(cat => 
        cat.displayName || cat.name || ''
      );
      context.columnVisibility = currentSet.categories.map(() => !context.isSingleColumnMode);
      context.wordsarr = [];
      currentSet.categories.forEach(category => {
        if (category?.words) {
          context.wordsarr = [...context.wordsarr, ...category.words];
        }
      });
      context.wordsarr = context.shuffleArray(context.wordsarr);
      context.availableWords = [...context.wordsarr];
      context.placedWords = [];
      context.selectedWord = null;
      const maxWords = context.isSingleColumnMode
        ? currentSet.categories[0].words.length 
        : Math.max(...currentSet.categories.map(cat => cat.words.length));
      const columnLength = Math.max(8, Math.ceil(maxWords * 1.2));
      context.columns = currentSet.categories.map(() => 
        context.createEmptyColumn(columnLength)
      );
      context.counts = currentSet.categories.map(() => 0);
      if (context.isSingleColumnMode) {
        context.columnTitles = [context.columnTitles[0]];
        context.columnVisibility = [true];
        context.columns = [context.columns[0]];
        context.Arrow_isShowing = true;
      }
    }

    export function createEmptyColumnhelper(count) {
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
    }

    export function resethelper(context) {
      context.wordsarr = [];
      context.count = 0;
      context.placedWords = [];
      context.selectedWord = null;
      context.Arrow_isShowing = false;
      context.columns.forEach(column => {
        column.forEach(item => {
          item.name = '';
          item.state = 'base';
        });
      });
    }

     export function shuffleArrayhelper1(array) {
      let counter = array.length, temp, index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    }

     export function TimerFunhelper1(context) {
      context.timerInterval = setInterval(() => {
        if (context.timestart <= 9999999999) {
          context.timestart += 1;
        }
      }, 1000);
    }

     export function secondsToTimehelper1(totalSeconds) {
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor(totalSeconds % 3600 / 60).toString().padStart(2, '0');
      const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    export function  runhelper1(context) {
      if (Object.keys(context.wordSets).length > 0) {
        if (context.mode === 'instruction') {
          context.InstructionShow = true;
        } else {
          context.practice0();
        }
      } else {
        console.log('Waiting for data to load...');
      }
    }

   export function practice0helper1( context) {
      context.InstructionShow = false;
      context.showtop = true;
      context.displayWords();
    }
 export function PracticeNexthelper1(context) {
      context.InstructionShow = false;
      context.practice0();
    }

    export function displayWordshelper1(context) {
      context.showtop = true;
      context.showBottom = true;
      context.startQuestionTracking();
      if (!context.currentExerciseSets || context.currentExerciseSets.length === 0) {
        console.error('No exercise sets available');
        return;
      }
   
      const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) {
        console.error('Current set not found or has no categories');
        return;
      }
      if (!context.questionStates[context.currentQuestionIndex]) {
        context.loadQuestionData(currentSet);
        context.canModifyAnswers = true;
      } else {
        context.loadQuestionState(context.currentQuestionIndex);
        context.canModifyAnswers = context.currentQuestionIndex >= context.setcount;
        if (!context.canModifyAnswers) {
          context.markAllAnswersAsReadonly();
        }
      }
      context.SetTotal = context.wordsarr.length;
      context.resultShow = false;
    }

export function goToPreviousQuestionhelper1(context) {
  context.recordQuestionTime();
  if (context.currentQuestionIndex > 0) {
    context.saveQuestionState();
    context.currentQuestionIndex--;
    console.log('Go to previous question to index:', context.currentQuestionIndex);

    // 🔹 Case 1: question exists in completedSets → restore readonly
    const completed = context.completedSets?.[context.currentQuestionIndex];
    if (completed) {
      context.columnTitles = completed.questionTitles || [];
      context.columns = JSON.parse(JSON.stringify(completed.columns));
      context.availableWords = [];
      context.placedWords = completed.columns.flat().map(c => c.name).filter(n => n !== "");
      context.canModifyAnswers = false;
      context.Arrow_isShowing = true;
    }
    // 🔹 Case 2: fallback (old un-restored answered state)
    else if (context.currentQuestionIndex < context.setcount) {
      context.canModifyAnswers = false;
      context.loadQuestionState(context.currentQuestionIndex);
      context.markAllAnswersAsReadonly();
    }
    // 🔹 Case 3: editable new question
    else {
      context.canModifyAnswers = true;
      context.loadQuestionState(context.currentQuestionIndex);
    }

    if (context.isReviewMode) {
      context.currentReviewIndex = context.currentQuestionIndex;
    }

    context.truenextgame = true;
    context.startQuestionTimer();
    context.isShowing_info = false;
    context.resultShow = false;
  }
}

export function Click_NextButtonhelper1(context) {
  // 🔹 Check if all columns are filled with valid values
  const allColumnsFilled = context.columns.every(col =>
    col.some(item => item && item.name && item.name.trim() !== "")
  );

  if (!allColumnsFilled) {
    alert("Please fill all columns with valid answers before moving to the next question.");
    return; // ❌ Stop navigation
  }

  // ✅ If valid values are present, proceed as before
  context.Arrow_isShowing = false;
  context.isShowing_info = true;
  context.truenextgame = false;
  const isCorrect = context.checkCompletion();
  context.updateQuestionTracking(isCorrect);
  context.saveQuestionState();

  if (context.currentQuestionIndex < context.currentExerciseSets.length - 1) {
    context.goToNextQuestion();
  } else {
    context.showResults();
  }
}

    export function updateQuestionTrackinghelper1(context, isCorrect) {
  if (context.currentQuestionStartTime) {
    const timeTaken = Date.now() - context.currentQuestionStartTime;

    // 🔹 Prevent overwriting and double-counting
    if (!context.questionDetails[context.currentQuestionIndex]?.isCompleted) {
      context.questionTimings[context.currentQuestionIndex] = timeTaken;
      context.questionDetails[context.currentQuestionIndex] = {
        ...context.questionDetails[context.currentQuestionIndex],
        timeTaken: timeTaken,
        isCompleted: true,
        wasCorrect: isCorrect
      };
    }

    context.currentQuestionStartTime = 0;
  }
}   

     export function saveQuestionStatehelper1(context) {
      context.questionStates[context.currentQuestionIndex] = {
        columns: JSON.parse(JSON.stringify(context.columns)),
        columnTitles: [...context.columnTitles],
        columnVisibility: [...context.columnVisibility],
        placedWords: [...context.placedWords],
        availableWords: [...context.availableWords],
        selectedWord: context.selectedWord,
        Arrow_isShowing: context.Arrow_isShowing,
        wordsarr: [...context.wordsarr],
        counts: [...context.counts],
        isCompleted: context.placedWords.length === context.wordsarr.length,
        wasModified: context.canModifyAnswers
      };
    }

    
export function goToNextQuestionhelper1(context) {
  const isCorrect = context.checkCompletion(false);
  context.updateQuestionTracking(isCorrect);
  context.saveQuestionState();
  console.log('Go to next question from index:', context.currentQuestionIndex);

  let nextIndex = context.currentQuestionIndex + 1;

  // 🔹 Skip any sets that are already completed
  while (
    nextIndex < context.currentExerciseSets.length &&
    context.completedSets?.some(c => c.setId === context.currentExerciseSets[nextIndex].setId)
  ) {
    nextIndex++;
  }

      let nextSet;
      let nextSetId;

      const completedLength = context.completedSets?.length || 0;

      if (nextIndex < completedLength) {
        // Load from completedSets
        nextSet = context.completedSets[nextIndex];
        nextSetId = nextSet?.setId;
      } else {
        // Load fresh question from currentExerciseSets
        const offset = nextIndex - completedLength;
        nextSet = context.currentExerciseSets[offset];
        nextSetId = nextSet?.id;
      }


  const completedMatch = !!context.completedSets?.find(c => c.setId === nextSetId);

  // 🔹 Case 1: move into next restored completed question
  if (context.completedSets && completedMatch) {
    context.currentQuestionIndex = nextIndex;
    const next = context.completedSets[nextIndex];
    context.columnTitles = next.questionTitles || [];
    context.columns = JSON.parse(JSON.stringify(next.columns));
    context.availableWords = [];
    context.placedWords = next.columns.flat().map(c => c.name).filter(n => n !== "");
    context.canModifyAnswers = false; // readonly
    context.Arrow_isShowing = true;
  }
  // 🔹 Case 2: new fresh question
  else if (!completedMatch) {
    context.currentQuestionIndex = nextIndex;
    context.setcount = nextIndex;
    context.reset();
    const currentSet = context.currentExerciseSets[nextIndex];
    context.loadQuestionData(currentSet);
    context.canModifyAnswers = true;
    context.Arrow_isShowing = true;
  }
  // 🔹 Case 3: end → show results
  else {
    context.showResults();
    return;
  }

  context.truenextgame = false;
  context.counter = context.currentQuestionIndex;

  context.startQuestionTimer();
}


export function  showResultshelper1(context) {

  
      context.activity_Status = "Completed";
      context.Time_elapsed = context.secondsToTime(context.timestart);
      context.timeInSeconds = context.timestart;
      context.resultShow = true;
      context.InstructionShow = false;
      context.isShowing_info = false;
      context.truenextgame = false;
      context.showtop = false;
      context.showBottom = false;
      context.ResultHide = true;
      context.ResultArrow = false;
      context.JsonArrData = JSON.stringify(context.generateResultsJson());
    }

    

 export function generateResultsJsonhelper1(context) {
  const DetailedResults = context.questionDetails?.map((q, index) => {
    const currentSet = context.currentExerciseSets?.[index] || {};
    const state = context.questionStates?.[index] || {};
    return {
      setId: currentSet.id || null,
      QuestionIndex: index,
      Level: "Level1",
      TimeTaken: q.timeTaken || 0,
      // isCompleted: q.isCompleted || false,
      IsCorrect: q.wasCorrect || false,
      QuestionTitles: q.questionTitles || (currentSet.categories?.map(cat => cat.displayName || cat.name) || []),
      FinalAnswer: state.columns
        ? state.columns.map(col => col.map(item => item.name || ""))
        : []
    };
  }) || [];

  return {
      ActivityStatus: context.activity_Status || "Completed",
      TimeElapsed: context.secondsToTime(context.timestart),
      QuestionsAttempted: context.Questions_attempted || 0,
      CorrectAnswers: context.correct_Answers || 0,
      IncorrectAnswers: context.incorrect_Answers || 0,
      AttemptedQuestionNumbers: DetailedResults.map(r => r.setId)
    },
    DetailedResults
}

    export function markAllAnswersAsReadonlyhelper1( context) {
      context.columns.forEach(column => {
        column.forEach(item => {
          if (item.name) item.state = 'readonly';
        });
      });
    }

export function checkCompletionhelper1(context, updateCounters = true) {
  const currentIndex = context.currentQuestionIndex;

  // 🔹 First, try pulling correctness from DetailedResults
  const detailedResult = context.resultData?.DetailedResults?.[currentIndex];
  if (detailedResult?.isCompleted) {
    return detailedResult.wasCorrect; // ✅ Trust saved data
  }

  // 🔹 Next, fallback to questionDetails
  let questionDetail = context.questionDetails[currentIndex];
  if (questionDetail?.isCompleted) {
    return questionDetail.wasCorrect; // ✅ Trust saved data
  }

  // 🔹 If no saved correctness, calculate now
  const currentSet = context.currentExerciseSets[currentIndex];
  if (!currentSet || !currentSet.categories) return false;

  let isCorrect = false;

  if (context.isSingleColumnMode) {
    const firstCategory = currentSet.categories[0];
    if (!firstCategory) return false;
    const correctWords = context.columns[0].filter(item =>
      item.name && firstCategory.words.includes(item.name)
    ).length;
    isCorrect = correctWords === firstCategory.words.length;
  } else {
    isCorrect = currentSet.categories.every((category, index) => {
      if (index >= context.columns.length) return false;
      return context.columns[index].filter(item =>
        item.name && category.words.includes(item.name)
      ).length === category.words.length;
    });
  }

  // 🔹 Save correctness ONLY if this is first calculation
  if (!questionDetail) {
    questionDetail = {};
    context.questionDetails[currentIndex] = questionDetail;
  }

  // ✅ Make sure questionTitles and userResponse exist
questionDetail.questionTitles =  questionDetail.questionTitles ||
 (context.currentExerciseSets?.[currentIndex]?.categories?.map(c => c.displayName || c.name) || []);

  questionDetail.userResponse = questionDetail.userResponse || context.columns.map(col => col.map(item => item?.name || ""));

  questionDetail.wasCorrect = isCorrect;
  questionDetail.isCompleted = true;

  // 🔹 Update counters only the first time
  if (updateCounters) {
    context.Questions_attempted++;
    if (isCorrect) context.correct_Answers++;
    else context.incorrect_Answers++;
  }

  return isCorrect;
}

  export function  OnNewGame_Clickhelper1(context) {
      if (context.isReviewMode) {
        context.isReviewMode = false;
        context.currentReviewIndex = -1;
      }
      if (context.truenextgame === true) {
        context.truenextgame = false;
        context.goToNextQuestion();
      }
    }

export function updateAvailableWordshelper1(context) {
      const allWordsPlaced = context.wordsarr.length === context.placedWords.length;
      context.Arrow_isShowing = allWordsPlaced;
      context.canModifyAnswers = !allWordsPlaced;
      context.saveQuestionState();
    }

    export function  handleColumnClickhelper1( context,colIndex, itemIndex) {
      if (!context.canModifyAnswers) return;
      const column = context.columns[colIndex];
      const item = column[itemIndex];
      if (!item.name && context.selectedWord) {
        item.name = context.selectedWord;
        context.placedWords.push(context.selectedWord);
        const wordIndex = context.availableWords.indexOf(context.selectedWord);
        if (wordIndex > -1) context.availableWords.splice(wordIndex, 1);
        context.selectedWord = null;
        context.updateAvailableWords();
      } else if (item.name && !context.selectedWord) {
        const returnedWord = item.name;
        item.name = '';
        const placedIndex = context.placedWords.indexOf(returnedWord);
        if (placedIndex > -1) context.placedWords.splice(placedIndex, 1);
        context.availableWords.push(returnedWord);
        context.updateAvailableWords();
      }
    }

     export function loadQuestionStatehelper1( context,index) {
      const state = context.questionStates[index];
      if (state) {
        context.columns = JSON.parse(JSON.stringify(state.columns));
        context.columnTitles = [...state.columnTitles];
        context.columnVisibility = [...state.columnVisibility];
        context.placedWords = [...state.placedWords];
        context.availableWords = [...state.availableWords];
        context.selectedWord = state.selectedWord;
        context.Arrow_isShowing = state.Arrow_isShowing;
        context.wordsarr = [...state.wordsarr];
        context.counts = [...state.counts];
        context.canModifyAnswers = state.wasModified;
        if (!context.canModifyAnswers) {
          context.markAllAnswersAsReadonly();
        }
      }
    }

       export function recordQuestionTimehelper1(context) {
      if (context.currentQuestionStartTime) {
        const timeTaken = Date.now() - context.currentQuestionStartTime;
        context.questionTimings[context.currentQuestionIndex] = timeTaken;
        context.currentQuestionStartTime = 0;
      }
    } 

     export function startQuestionTrackinghelper1(context) {
      context.currentQuestionStartTime = Date.now();
      if (!context.questionDetails[context.currentQuestionIndex]) {
        const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
        context.questionDetails[context.currentQuestionIndex] = {
          questionIndex: context.currentQuestionIndex,
          timeTaken: 0,
          isCompleted: false,
          wasCorrect: false,
          wasDisplayed: false,
          questionTitles: currentSet?.categories?.map(cat => cat.displayName || cat.name) || []
        };
      }
    }

     export function downloadResultsJsonhelper1(context) {
      const data = context.generateResultsJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
       const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Test_Result_${testDate}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

export function SaveAndExitNowhelper1(context, updateCounters = true) {
 const allColumnsFilled = context.columns.every(col =>
    col.some(item => item && item.name && item.name.trim() !== "")
  );

  if (!allColumnsFilled) {
    alert("Please fill all columns with valid answers before Save and Exit.");
    return; // ❌ Stop navigation
  }

   // 🔹 Step 1: Save current question state first
  const isCorrect = context.checkCompletion(false);
  context.updateQuestionTracking(isCorrect);
  context.saveQuestionState();

  // 🔹 Step 2: Loop over completed sets and refresh tracking
  if (context.completedSets?.length) {
  context.completedSets.forEach((set, index) => {
    if (index === context.currentQuestionIndex) return; // 🔹 skip current live question

    context.columns = JSON.parse(JSON.stringify(set.columns || []));
    context.columnTitles = [...(set.questionTitles || [])];
    context.placedWords = set.columns?.flat().map(c => c.name).filter(n => n !== "") || [];

    const isCorrect = context.checkCompletion(false);
    context.currentQuestionIndex = index;
    context.updateQuestionTracking(isCorrect);
    context.saveQuestionState();

    context.canModifyAnswers = false;
    context.Arrow_isShowing = true;
  });
}

  context.activity_Status = "Partially Completed";
  context.Time_elapsed = context.secondsToTime(context.timestart);
  context.timeInSeconds = context.timestart;
  context.resultShow = true;
  context.InstructionShow = false;
  context.isShowing_info = false;
  context.truenextgame = false;
  context.showtop = false;
  context.showBottom = false;
  context.ResultHide = true;
  context.ResultArrow = false;

  // ✅ Safely map question details
  const DetailedResults = (context.questionDetails || []).map((q, index) => {
  const currentSet = context.currentExerciseSets?.[index] || {};
  const columnsToSave = index === context.currentQuestionIndex
    ? context.columns  // current live state
    : (context.questionStates?.[index]?.columns || []); // previously saved states

  return {
    QuestionIndex: currentSet.id || context.ids || null,
    TimeTaken: q?.timeTaken || 0,
    Level:"Level1",
    // isCompleted: q?.isCompleted || false,
    IsCorrect: q?.wasCorrect || false,
    wasDisplayed: q?.wasDisplayed || false,
    QuestionTitles: q?.questionTitles?.length > 0
      ? q.questionTitles
      : currentSet.titles || currentSet.questionTitles || [],
    FinalAnswer: (columnsToSave || []).map(col =>
      (col || []).map(item => item?.name || "")
    )
  };
});


  context.resultData = {
      ActivityStatus: context.activity_Status,
      TimeElapsed: context.secondsToTime(context.timestart),
      QuestionsAttempted: context.Questions_attempted,
      CorrectAnswers: context.correct_Answers,
      IncorrectAnswers: context.incorrect_Answers,
      AttemptedQuestionNumbers: DetailedResults.map(r => r.questionIndex),
      DetailedResults:DetailedResults
  };

  context.JsonArrData = JSON.stringify(context.resultData, null, 2);
}

export function restoreProgressHelper(context) {
  // const savedData = localStorage.getItem('attemptedQuestionData');
   const savedData = sessionStorage.getItem('attemptedQuestionData');
  if (!savedData) return false;

  try {
    const parsed = JSON.parse(savedData);

    // Restore summary
    context.activity_Status = parsed.ActivityStatus;
    context.timestart = parsed.TimeElapsed || 0;
    context.Questions_attempted = parsed.QuestionsAttempted || 0;
    context.correct_Answers = parsed.CorrectAnswers || 0;
    context.incorrect_Answers = parsed.IncorrectAnswers || 0;

    // Restore detailed question info
    context.questionDetails = parsed.DetailedResults || [];

    // ✅ Restore full UI states
    if (parsed.questionStates) {
      context.questionStates = parsed.questionStates;
    }

    // Resume from next unanswered
    const answeredCount = parsed.QuestionsAttempted || 0;
    context.currentQuestionIndex = answeredCount;

    // Restore UI for answered ones
    for (let i = 0; i < answeredCount; i++) {
      context.loadQuestionState(i);
      context.markAllAnswersAsReadonly();
    }

    // Load UI for the current question
    if (context.currentQuestionIndex < context.currentExerciseSets.length) {
      context.loadQuestionState(context.currentQuestionIndex);
    }

    return true;
  } catch (err) {
    console.error("Failed to restore progress", err);
    return false;
  }
}

export function FinalResulthelper1(context) {

  const now = new Date();
  const testDate = now.toISOString();

  // ✅ Always build unified result format
  const DetailedResults = (context.questionDetails || []).map((q, index) => {
    const currentSet = context.currentExerciseSets?.[index] || {};
    const columnsToSave = index === context.currentQuestionIndex
    ? context.columns  // current live state
    : (context.questionStates?.[index]?.columns || []); // previously saved states
    const state = context.questionStates?.[index] || {};
    return {
      setId: currentSet.id || null,
      QuestionIndex: currentSet.id || context.ids || null,
      TimeTaken: q.timeTaken || 0,
      // isCompleted: q.isCompleted || false,
      IsCorrect: q.wasCorrect || false,
      QuestionTitles: q.questionTitles || (currentSet.categories?.map(cat => cat.displayName || cat.name) || []),
      FinalAnswer: (columnsToSave || []).map(col =>
      (col || []).map(item => item?.name || "")
    )
    };
  });

  const fullResult = {
      ActivityStatus: context.activity_Status || "Completed",
      TimeElapsed: context.secondsToTime(context.timestart),
      QuestionsAttempted: context.Questions_attempted || 0,
      CorrectAnswers: context.correct_Answers || 0,
      IncorrectAnswers: context.incorrect_Answers || 0,
      AttemptedQuestionNumbers: DetailedResults.map(r => r.setId),
      DetailedResults:DetailedResults
  };

   // ✅ Clear old attemptedQuestionData before saving new one
    localStorage.removeItem('attemptedQuestionData')

    // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(fullResult));

     const finalFullResult = JSON.stringify(fullResult)
  .replace(/"(\w+)"\s*:/g, '$1:'); 

      
const curSite = window.location.protocol + "//" + window.location.host;

const  Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx`


const form = document.createElement("form");

  form.method = "POST";

  form.action = Url;

 

  // Add hidden input with serialized JSON

  const inputToken = document.createElement("input");

  inputToken.type = "hidden";

  inputToken.name = "TokenID"; // You'll read this on the server

  inputToken.value = sessionStorage.getItem('sesTokenID');

 

  form.appendChild(inputToken);

 

  const inputJData = document.createElement("input");

  inputJData.type = "hidden";

  inputJData.name = "JsonData"; // You'll read this on the server

  // inputJData.value = this.CollectionResult;
inputJData.value = "";
 

  form.appendChild(inputJData);

 

  const inputActRes = document.createElement("input");

  inputActRes.type = "hidden";

  inputActRes.name = "Activityresult"; // You'll read this on the server

  inputActRes.value = finalFullResult;

 

  form.appendChild(inputActRes);

 

  const inputExeId = document.createElement("input");

  inputExeId.type = "hidden";

  inputExeId.name = "ExeID"; // You'll read this on the server

  inputExeId.value = sessionStorage.getItem('ExeID');

 

  form.appendChild(inputExeId);

 

  const inputExeNum = document.createElement("input");

  inputExeNum.type = "hidden";

  inputExeNum.name = "exNum"; // You'll read this on the server

  inputExeNum.value = sessionStorage.getItem('Exe_Number');

 

  form.appendChild(inputExeNum);

 

  const inputstudID = document.createElement("input");

  inputstudID.type = "hidden";

  inputstudID.name = "studentID"; // You'll read this on the server

  inputstudID.value = sessionStorage.getItem('studentID');

 

  form.appendChild(inputstudID);

 

 

  document.body.appendChild(form);

  form.submit();

  // 
}

 






  ///////////////////////////////cat 3 /////////////////////////////


 
 export function  updateScreenSizehelper(context) {
      const width = window.innerWidth
      if (width < 640) {
        context.screenSize = 'sm'
      } else if (width < 1024) {
        context.screenSize = 'md'
      } else {
        context.screenSize = 'lg'
      }
    }

    export function getResponsiveImageHeighthelper3(context) {
      switch (context.screenSize) {
        case 'sm': return '120px'
        case 'md': return '150px'
        default: return '180px'
      }
    }

      export function getResponsiveImageWidthhelper3(context) {
      switch (context.screenSize) {
        case 'sm': return '200px'
        case 'md': return '250px'
        default: return '300px'
      }
    }

      export function getQuestionWordhelper3(question) {
      const key = Object.keys(question).find(k => k.startsWith('QuestionArr_'))
      // console.log('questions,',question)
      return key && question[key]?.[0] || ''
      
    }

     export function getGridLettershelper3(question) {
      const key = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      return key ? question[key] : []
    }

    export function  getAnswerWordhelper(question) {
      const optionKey = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      const answerKey = Object.keys(question).find(k => k.startsWith('AnswerArr_'))
      const options = optionKey ? question[optionKey] : []
      const answers = answerKey ? question[answerKey] : []
      if (!Array.isArray(answers) || !Array.isArray(options)) return ''
      return options.filter((_, i) => answers[i] === 'Yes').join('')
    }

     export function handleWordGridAnsweredhelper( context ,{ word, response }) {
      context.lastGridAnswer = { word, response }
      context.lockedForNext = false
      context.AnswerCheck()
    }

export function WordsAnswerhelper3(context, Answer, index) {
  if (!context || typeof context !== 'object') {
    console.error('Invalid context in WordsAnswerhelper3:', context);
    return;
  }

  if (typeof index !== 'number' || isNaN(index) || index < 0) {
    console.error('Invalid index in WordsAnswerhelper3:', index);
    return;
  }

  
       const currentItem = context.items[context.counter];

          // Find the key that starts with "QuestionArr_"
          const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

          // Extract the numeric part
          const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

          // Ensure 2-digit format
          const questionId = String(originalQuestionNo).padStart(2, '0');
  // const questionId = context.counter + 1;

  if (context.viewingPrevious) {
    alert("You have already answered this question. This cannot be changed now.");
    return;
  }

  const currentQuestionObj = context.items?.[context.counter];
  if (!currentQuestionObj || typeof currentQuestionObj !== 'object') {
    console.error('Invalid question object in WordsAnswerhelper3:', currentQuestionObj);
    return;
  }

  let answerKey;
  try {
    answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
  } catch (e) {
    console.error('Error finding answer key:', e);
    return;
  }

  let correctAnswerArr = Array.isArray(currentQuestionObj[answerKey])
    ? currentQuestionObj[answerKey]
    : [];

  const timeTaken = (Date.now() - (context.questionStartTime || Date.now())) / 1000;

  const existingIndex = context.practiceList.findIndex(q => q.id === questionId);
  if (existingIndex !== -1) {
    const old = context.practiceList[existingIndex];
    const wasCorrect = old.fullCorrectAnswer?.[old.userAnswer - 1] === 'Yes';
    if (wasCorrect) {
      context.correct_Answers = Math.max(0, context.correct_Answers - 1);
    } else {
      context.incorrect_Answers = Math.max(0, context.incorrect_Answers - 1);
    }
    context.practiceList.splice(existingIndex, 1);
  } else {
    context.Questions_attempted++;
  }

   context.practiceList.push({
    id: questionId,
    originalQuestionNo: currentQuestionObj.__index ?? '',
    level: currentQuestionObj.__level ?? '',
    userAnswer: (index + 1).toString(),
    fullCorrectAnswer: correctAnswerArr,
    timeTaken
  });

  const isCorrect = correctAnswerArr[index] === 'Yes';

  if (isCorrect) {
    context.correct_Answers++;
    context.ContinuesWrong = 0;
    if (context.ProgressBar?.[context.counter]) {
      context.ProgressBar[context.counter].state = 'correct';
    }
  } else {
    context.incorrect_Answers++;
    context.ContinuesWrong++;
    if (context.ProgressBar?.[context.counter]) {
      context.ProgressBar[context.counter].state = 'incorrect';
    }
  }

  if (Array.isArray(context.commonNumArray)) {
    context.commonNumArray.forEach((opt, i) => {
      if (opt && typeof opt === 'object') {
        opt.state = i === index ? (isCorrect ? 'correct' : 'incorrect') : 'base';
      }
    });
  }

  context.countcorrect = 1;

  if (context.counter + 1 > (context.TestProgressBar || 0)) {
    context.TestProgressBar = context.counter + 1;
  }
}


     export function  AnswerCheckhelper3( context) {
      if (context.jsonFileName === 'CSR-I') {
        if (!context.lastGridAnswer) {
          context.$toast?.warning('Please select your answer first.');
          return;
        }
        const questionId = context.counter + 1;
        const currentQuestionObj = context.currentQuestion;

        const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
        let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : [];
        if (!Array.isArray(correctAnswerArr)) correctAnswerArr = [];

        const userWord = context.lastGridAnswer.word;
        const userResponse = context.lastGridAnswer.response;

        let isOppositeValid = currentQuestionObj.IsOppositeValid;
        let isCorrect = (
          (isOppositeValid && userResponse === 'yes') ||
          (!isOppositeValid && userResponse === 'no')
        );

        context.practiceList.push({
          id: questionId,
          originalQuestionNo: currentQuestionObj.__index,
          level: currentQuestionObj.__level,
          userAnswer: userWord,
          userClicked: userResponse,
          fullCorrectAnswer: correctAnswerArr,
          timeTaken: (Date.now() - context.questionStartTime) / 1000,
        });

        if (isCorrect) {
          context.correct_Answers++;
          context.ContinuesWrong = 0;
          context.ProgressBar[context.counter].state = 'correct';
        } else {
          context.incorrect_Answers++;
          context.ContinuesWrong++;
          context.ProgressBar[context.counter].state = 'incorrect';
        }
        context.Questions_attempted++;
        context.countcorrect = 1;
        context.lockedForNext = true;
        context.lastGridAnswer = null;

        if (context.counter < context.Total_Questions - 1) {
          context.counter++;
          context.practice0();
        } else {
          context.activity_Status = 'Completed';
          context.Time_elapsed = context.secondsToTime(context.timestart);
          context.resultShow = true;
          context.PracticeOne = false;
          context.ResultHide = true;
        }

        return;
      }

      
       const currentItem = context.items[context.counter];

          // Find the key that starts with "QuestionArr_"
          const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

          // Extract the numeric part
          const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

          // Ensure 2-digit format
          const questionId = String(originalQuestionNo).padStart(2, '0');

           console.log("context.practiceList" + JSON.stringify(context.practiceList, null, 2));

      // const questionId = context.counter + 1;
      const hasAnswered = context.practiceList.some(q => q.id === questionId);

      if (!hasAnswered) {
        context.$toast?.warning('Please answer the question before moving on.');
        return;
      }

      if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        const nextAnswered = context.practiceList.some(q => q.id === context.counter + 1);
        console.log("nextAnswered " + JSON.stringify(nextAnswered, null, 2));
        context.countcorrect = nextAnswered ? 1 : 0;
        context.viewingPrevious = nextAnswered;
        context.practice0();
      } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
          const levelKey = entry.level;
          const origIdx = entry.originalQuestionNo ?? entry.id;
          const sourceQ = context.activityQuestions[levelKey]?.[origIdx] || {};
          const ansKey = Object.keys(sourceQ).find(k => k.startsWith('AnswerArr_'));
          const correctArr = Array.isArray(sourceQ[ansKey])
    ? sourceQ[ansKey]
    : entry.fullCorrectAnswer ?? entry.correctAnswers ?? [];

          return {
            QuestionIndex: entry.id,
            Level: levelKey,
            UserResponse: entry.userAnswer ?? entry.UserResponse,
            FinalAnswer: correctArr,
            TimeTaken: entry.timeTaken,
            IsCorrect: true
          };
        });

        context.resultData = {
            ActivityStatus: context.activity_Status,
            TimeElapsed: context.timestart,
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            IncorrectAnswers: context.incorrect_Answers,
            AttemptedQuestionNumbers:detailedResults.map(q => String(q.QuestionIndex)),
            DetailedResults: detailedResults
          // detailedResults,
        };

        context.JsonArrData = JSON.stringify(context.resultData, null, 2);
      }
    }

///////////////✅ SaveAndExitNowhelper/////////////////////
export function SaveAndExitNowhelper3(context) {

  if (context.jsonFileName === 'CSR-I') {
        if (!context.lastGridAnswer) {
          context.$toast?.warning('Please select your answer first.');
          return;
        }
        

          // const qId = context.counter + 1;
        const questionId = context.counter + 1;
        const currentQuestionObj = context.currentQuestion;

        const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
        let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : [];
        if (!Array.isArray(correctAnswerArr)) correctAnswerArr = [];

        const userWord = context.lastGridAnswer.word;
        const userResponse = context.lastGridAnswer.response;

        let isOppositeValid = currentQuestionObj.IsOppositeValid;
        let isCorrect = (
          (isOppositeValid && userResponse === 'yes') ||
          (!isOppositeValid && userResponse === 'no')
        );

        context.practiceList.push({
          id: questionId,
          originalQuestionNo: currentQuestionObj.__index,
          level: currentQuestionObj.__level,
          userAnswer: userWord,
          userClicked: userResponse,
          fullCorrectAnswer: correctAnswerArr,
          timeTaken: (Date.now() - context.questionStartTime) / 1000,
        });

        if (isCorrect) {
          context.correct_Answers++;
          context.ContinuesWrong = 0;
          context.ProgressBar[context.counter].state = 'correct';
        } else {
          context.incorrect_Answers++;
          context.ContinuesWrong++;
          context.ProgressBar[context.counter].state = 'incorrect';
        }
        context.Questions_attempted++;
        context.countcorrect = 1;
        context.lockedForNext = true;
        context.lastGridAnswer = null;

        if (context.counter < context.Total_Questions - 1) {
          context.counter++;
          context.practice0();
        } else {
          context.activity_Status = 'Completed';
          context.Time_elapsed = context.secondsToTime(context.timestart);
          context.resultShow = true;
          context.PracticeOne = false;
          context.ResultHide = true;
        }

        return;
      }


       const currentItem = context.items[context.counter];

          // Find the key that starts with "QuestionArr_"
          const questionKey = Object.keys(currentItem).find(k => k.startsWith("QuestionArr_"));

          // Extract the numeric part
          const originalQuestionNo = questionKey ? questionKey.split("_")[1] : context.counter + 1;

          // Ensure 2-digit format
          const questionId = String(originalQuestionNo).padStart(2, '0');

          console.log("questionId"+questionId);
          console.log("context.practiceList" + JSON.stringify(context.practiceList, null, 2));

      // const questionId = context.counter + 1;
      const hasAnswered = context.practiceList.some(q => q.id === questionId);

      if (!hasAnswered) {
        context.$toast?.warning('Please answer the question before moving on.');
        return;
      }

        context.activity_Status = 'Paused';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
          const levelKey = entry.level;
          const origIdx = entry.originalQuestionNo ?? entry.id;
          const sourceQ = context.activityQuestions[levelKey]?.[origIdx] || {};
          const ansKey = Object.keys(sourceQ).find(k => k.startsWith('AnswerArr_'));
          const correctArr = Array.isArray(sourceQ[ansKey])
    ? sourceQ[ansKey]
    : entry.fullCorrectAnswer ?? entry.correctAnswers ?? [];

          return {
            QuestionIndex: entry.id,
            Level: levelKey,
            UserResponse: entry.userAnswer ?? entry.UserResponse,
            FinalAnswer: correctArr,
            TimeTaken: entry.timeTaken,
            IsCorrect: true
          };
        });

        context.resultData = {
            ActivityStatus: context.activity_Status,
            TimeElapsed: context.timestart,
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            IncorrectAnswers: context.incorrect_Answers,
            AttemptedQuestionNumbers:detailedResults.map(q => String(q.QuestionIndex)),
            DetailedResults: detailedResults
          // detailedResults,
        };

        context.JsonArrData = JSON.stringify(context.resultData, null, 2);
} 

       export function FinalResulthelper3(context) {
      const now = new Date()
      const testDate = now.toISOString()
      const fullResult = context.resultData || {}

      // ✅ Clear old attemptedQuestionData before saving new one
    localStorage.removeItem('attemptedQuestionData')

    // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(fullResult, null, 2));


const finalFullResult = JSON.stringify(fullResult)
  .replace(/"(\w+)"\s*:/g, '$1:'); 

    
const curSite = window.location.protocol + "//" + window.location.host;

const  Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx`


const form = document.createElement("form");

  form.method = "POST";

  form.action = Url;

 

  // Add hidden input with serialized JSON

  const inputToken = document.createElement("input");

  inputToken.type = "hidden";

  inputToken.name = "TokenID"; // You'll read this on the server

  inputToken.value = sessionStorage.getItem('sesTokenID');

 

  form.appendChild(inputToken);

 

  const inputJData = document.createElement("input");

  inputJData.type = "hidden";

  inputJData.name = "JsonData"; // You'll read this on the server

  // inputJData.value = this.CollectionResult;
inputJData.value = "";
 

  form.appendChild(inputJData);

 

  const inputActRes = document.createElement("input");

  inputActRes.type = "hidden";

  inputActRes.name = "Activityresult"; // You'll read this on the server

  inputActRes.value = finalFullResult;

 

  form.appendChild(inputActRes);

 

  const inputExeId = document.createElement("input");

  inputExeId.type = "hidden";

  inputExeId.name = "ExeID"; // You'll read this on the server

  inputExeId.value = sessionStorage.getItem('ExeID');

 

  form.appendChild(inputExeId);

 

  const inputExeNum = document.createElement("input");

  inputExeNum.type = "hidden";

  inputExeNum.name = "exNum"; // You'll read this on the server

  inputExeNum.value = sessionStorage.getItem('Exe_Number');

 

  form.appendChild(inputExeNum);

 

  const inputstudID = document.createElement("input");

  inputstudID.type = "hidden";

  inputstudID.name = "studentID"; // You'll read this on the server

  inputstudID.value = sessionStorage.getItem('studentID');

 

  form.appendChild(inputstudID);

 

 

  document.body.appendChild(form);

  form.submit();


    }

      export function PracticeNexthelper3(context) {
      context.InstructionShow = false
      context.practice0()
    }

   export function getVisualArrowhelper(option) {
      if (!option) return ''
      const arrowMatch = option.match(/➚/g)
      return arrowMatch ? '➚' : ''
    }

    export function getArrowStylehelper( context ,option) {
      const count = (option.match(/➚/g) || []).length
      const baseSize = context.screenSize === 'sm' ? 1 : context.screenSize === 'md' ? 1.2 : 1.5
      if (count >= 3) return { fontSize: `${2.5 * baseSize}rem`, fontWeight: 700, verticalAlign: 'middle' }
      if (count === 2) return { fontSize: `${1.8 * baseSize}rem`, fontWeight: 600, verticalAlign: 'middle' }
      if (count === 1) return { fontSize: `${1.2 * baseSize}rem`, fontWeight: 500, verticalAlign: 'middle' }
      return {}
    }
    
      export function getVisualRectanglehelper(option) {
      if (!option) return ''
      if (option.includes('█')) return '█'
      if (option.includes('▌')) return '▌'
      if (option.includes('▏')) return '▏'
      return ''
    }

      export function getRectangleStylehelper( context ,option) {
      const baseSize = context.screenSize === 'sm' ? 0.8 : context.screenSize === 'md' ? 1 : 1.2
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
    }
      export function TimerFunhelper3( context) {
      setInterval(() => {
        context.timestart++
      }, 1000)
    }
   export function secondsToTimehelper(s) {
      const h = String(Math.floor(s / 3600)).padStart(2, '0')
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
      const sec = String(s % 60).padStart(2, '0')
      return `${h}:${m}:${sec}`
    }
    export function runhelper3(context) {
      context.InstructionShow = context.mode === 'instruction'
      context.resultShow = false
      context.PlayBtnshow = false
      if (!context.InstructionShow) context.practice0()
    }


export function goToPreviousQuestionhelper3(context) {
  if (!context || typeof context !== 'object') {
    console.error('Invalid context in goToPreviousQuestionhelper3:', context);
    return;
  }

  if (context.counter <= 0) return;

  context.counter--;
  context.countcorrect = 1;
  context.viewingPrevious = true;

  if (typeof context.practice0 === 'function') {
    context.practice0();
  } else {
    console.warn('practice0 function missing in context');
  }

  if (typeof context.highlightPreviousAnswer === 'function') {
    context.highlightPreviousAnswer();
  } else {
    console.warn('highlightPreviousAnswer function missing in context');
  }
}

    export function highlightPreviousAnswerhelper(context) {
  if (!context || typeof context !== 'object') {
    console.error('Invalid context in highlightPreviousAnswerhelper:', context);
    return;
  }

  const questionId = context.counter + 1;
  const previousAnswer = context.practiceList?.find(q => q.id === questionId);

  if (!previousAnswer) {
    console.warn('No previous answer found for question:', questionId);
    return;
  }

  const userAnswerIndex = parseInt(previousAnswer.userAnswer, 10) - 1;

  if (isNaN(userAnswerIndex) || userAnswerIndex < 0) {
    console.error('Invalid userAnswerIndex in highlightPreviousAnswerhelper:', userAnswerIndex);
    return;
  }

  if (!Array.isArray(previousAnswer.fullCorrectAnswer) || !previousAnswer.fullCorrectAnswer[userAnswerIndex]) {
    console.error('Invalid fullCorrectAnswer array in previousAnswer:', previousAnswer);
    return;
  }

  const isCorrect = previousAnswer.fullCorrectAnswer[userAnswerIndex] === 'Yes';

  if (!Array.isArray(context.commonNumArray)) {
    console.error('commonNumArray missing or not an array:', context.commonNumArray);
    return;
  }

  // Reset all options to base
  context.commonNumArray.forEach(opt => {
    if (opt && typeof opt === 'object') opt.state = 'base';
  });

  // Highlight the previous answer
  if (context.commonNumArray[userAnswerIndex]) {
    context.commonNumArray[userAnswerIndex].state = isCorrect ? 'correct' : 'incorrect';
  } else {
    console.warn('Index out of bounds in commonNumArray:', userAnswerIndex);
  }
}

export function practice0helper3(context) {
  // Add comprehensive safety checks
  if (!context.activityQuestions || typeof context.activityQuestions !== 'object') {
    console.error('activityQuestions is not available')
    return
  }

  if (!context.selectedLevels || !Array.isArray(context.selectedLevels)) {
    console.error('selectedLevels is not available')
    return
  }

  if (context.jsonFileName === 'CSR-I') {
    // CSR-I logic: pool all valid questions across levels
    if (context.items.length === 0) {
      context.TimerFun()
      context.AnswerCheckShow = true
      context.PracticeOne = true

      const allValidQuestions = []
      for (const level of context.selectedLevels) {
        const levelKey = `Level${level}`
        const levelItems = context.activityQuestions[levelKey]
        
        if (!levelItems || !Array.isArray(levelItems)) continue

        const validItems = levelItems.filter(item => {
          if (!item || typeof item !== 'object') return false
          
          try {
            const questionKey = Object.keys(item).find(k => k.startsWith('QuestionArr_'))
            const optionKey = Object.keys(item).find(k => k.startsWith('OptionArr_'))
            const questionValue = questionKey ? item[questionKey] : []
            const optionValue = optionKey ? item[optionKey] : []
            return Array.isArray(questionValue) && questionValue.length > 0
              && Array.isArray(optionValue) && optionValue.length > 0
          } catch (e) {
            return false
          }
        })

        allValidQuestions.push(
          ...validItems.map((item, index) => ({
            ...item,
            __index: index,
            __level: levelKey,
          }))
        )
      }

      const shuffled = allValidQuestions.sort(() => Math.random() - 0.5)
      const questionsToUse = Math.min(context.Total_Questions, shuffled.length)
      context.items = shuffled.slice(0, questionsToUse)
      context.Total_Questions = context.items.length
      context.ProgressBar = Array(context.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
    }
  } else {
    // Other activities: FIX THE INDEXING ISSUE
    if (context.items.length === 0) {
      context.TimerFun()
      context.AnswerCheckShow = true
      context.PracticeOne = true

      const allValidItems = []

      // COLLECT ALL VALID ITEMS FROM ALL LEVELS FIRST
      for (const level of context.selectedLevels) {
        const levelKey = `Level${level}`
        const levelItems = context.activityQuestions[levelKey]
        
        if (!levelItems || !Array.isArray(levelItems)) continue

        const validItems = levelItems.filter(item => {
          return item && typeof item === 'object' && item !== null
        })

        // Example inside practice0helper3
// questions.forEach((q, index) => {
//   q.uniqueId = `${levelKey}_${String(index).padStart(2, "0")}`;
// });

//         console.log("uniqueId: "+uniqueId);

        // Add level metadata to each valid item
        allValidItems.push(...validItems.map((item, index) => ({
          ...item,
          __index: index,
          __level: levelKey,
          // id: uniqueId 
          __originalIndex: levelItems.indexOf(item) // Keep track of original index too
        })))
      }

      // SHUFFLE ALL ITEMS TOGETHER
      // const shuffledItems = allValidItems.sort(() => Math.random() - 0.5)
      
      // TAKE ONLY THE NUMBER REQUESTED
      context.items = allValidItems.slice(0, context.Total_Questions)
       console.log("allValidItems" + JSON.stringify(allValidItems, null, 2));
        console.log("context.items" + JSON.stringify(context.items, null, 2));
      
      // UPDATE TOTAL_QUESTIONS TO MATCH ACTUAL AVAILABLE
      if (context.items.length < context.Total_Questions) {
        context.Total_Questions = context.items.length
        context.ProgressBar = Array(context.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
      }

      console.log(`Loaded ${context.items.length} items for ${context.jsonFileName}`)
    }
  }

  // BOUNDS CHECK
  if (context.counter >= context.items.length) {
    console.warn(`Counter ${context.counter} exceeds items length ${context.items.length}`)
    return
  }

  const questionObj = context.items[context.counter]
  
  // COMPREHENSIVE VALIDATION
  if (!questionObj || typeof questionObj !== 'object' || questionObj === null) {
    console.error('Invalid question object at counter:', context.counter, 'Items length:', context.items.length)
    console.log('Available items:', context.items)
    return
  }

  // SAFE Object.keys() CALLS
  let questionKey, optionKey, answerKey
  try {
    questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'))
    optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'))
    answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'))
  } catch (e) {
    console.error('Error accessing question object keys:', e)
    return
  }

  context.questionStartTime = Date.now()

  const QuestionValue = questionKey ? questionObj[questionKey] || [] : []
  const OptionValue = optionKey ? questionObj[optionKey] || [] : []
  let AnswerValue = answerKey ? questionObj[answerKey] || [] : []

  if (!Array.isArray(AnswerValue)) AnswerValue = []

  // Set image properties
  context.ImageNames = questionObj.ImageName || ''
  context.ImageNames1 = questionObj.QuestionImage || 'NA'
  context.ImageNames2 = questionObj.ImageName2 || 'NA'  
  context.ImageNames3 = questionObj.ImageName3 || 'NA'
  context.ImageNames4 = questionObj.ImageName4 || 'NA'

 console.log("commonNumArray in practice0helper3 before:", JSON.stringify(OptionValue, null, 2));

// Build options array (flatten Option)
context.commonNumArray = OptionValue.map((opt, i) => {
  const existingAnswer = context.practiceList.find(q => q.id === context.counter + 1)
  const isSelected = existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
  const isCorrect = existingAnswer && existingAnswer.fullCorrectAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes'

  if (typeof opt === "object") {
    // Keep existing state from OptionValue if exists, otherwise use practiceList
    return {
      index: i,
      state: isSelected ? (isCorrect ? "correct" : "incorrect") : (opt.state || "base"),
      Answer: AnswerValue[i],
      Option: opt.label,
      Question: QuestionValue
    }
  } else {
    return {
      index: i,
      state: isSelected ? (isCorrect ? "correct" : "incorrect") : "base",
      Answer: AnswerValue[i],
      Option: opt,
      Question: QuestionValue
    }
  }
})


console.log("commonNumArray in practice0helper3:", JSON.stringify(context.commonNumArray, null, 2));


  context.PrevQuestionShow = context.counter > 0

  // FORCE REACTIVITY UPDATE
  context.$nextTick(() => {
    console.log(`Updated to question ${context.counter + 1}:`, {
      questionObj: questionObj,
      QuestionValue: QuestionValue,
      OptionValue: OptionValue,
      ImageNames: context.ImageNames,
      commonNumArray: context.commonNumArray.length
    })
  })
}

