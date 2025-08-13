// Helper Functions of Category 2

//for Cat 4
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

    const isAnswered = context.answeredState[context.counter];
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

        const selectedIndex = Number(userAnswer?.userResponse);

        context.commonNumArray = current.options.map((opt, i) => {
            let state = 'unselected';

            if (isAnswered && i === selectedIndex) {
                state = 'selected';
            }

            return {
                index: i,
                state,
                Question: opt.label,
                Answer: opt.isCorrect ? 'Yes' : ''
            };
        });
    } else {
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
        const selectedIndex = context.selectedIndices.indexOf(index);

        if (selectedIndex > -1) {
            context.selectedIndices.splice(selectedIndex, 1);
            context.commonNumArray[index].state = 'unselected';
        } else {
            context.selectedIndices.push(index);
            context.commonNumArray[index].state = 'selected';
        }

        if (context.selectedIndices.length === 2) {
            const [i1, i2] = context.selectedIndices;
            const img1 = context.commonNumArray[i1];
            const img2 = context.commonNumArray[i2];

            const isMatch = img1.Question === img2.Question && img1.Answer === 'Yes' && img2.Answer === 'Yes';

            if (isMatch) {
                context.commonNumArray[i1].state = 'correct';
                context.commonNumArray[i2].state = 'correct';
                context.ProgressBar[context.TestProgressBar].state = 'correct';
                context.correct_Answers++;
            } else {
                context.commonNumArray[i1].state = 'incorrect';
                context.commonNumArray[i2].state = 'incorrect';
                context.ProgressBar[context.TestProgressBar].state = 'incorrect';
                context.incorrect_Answers++;
            }

            context.countcorrect = 1;
            context.answeredState[context.counter] = true;
            context.Questions_attempted++;
            context.TestProgressBar++;
            context.AnswerCheckShow = false;
            context.NextQuestionShow = true;


            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.counter + 1,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: isMatch ? `${i1 + 1},${i2 + 1}` : 'Mismatch',
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });

            context.selectedIndices = [];
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
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted + 1,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
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

            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });
        }
    }

    // ✅ Then move next as normal
    if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        context.countcorrect = 0;
        context.lastSelectedIndex = undefined;
        context.practice0();
    } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        context.JsonArrData = JSON.stringify({
            ActivityStatus: context.activity_Status,
            TimeElapsed: context.Time_elapsed,
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            IncorrectAnswers: context.incorrect_Answers,
            ExerciseNumber: context.exercise
        });
    }
}

export function SaveAndExitNowHelper(context) {
    if (!context.answeredState[context.counter]) {
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

            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });
        }
    }

    // Mark status
    context.activity_Status = 'PartiallyCompleted';
    context.Time_elapsed = context.secondsToTime(context.timestart);

    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    context.JsonArrData = JSON.stringify({
        ActivityStatus: context.activity_Status,
        TimeElapsed: context.Time_elapsed,
        QuestionsAttempted: context.Questions_attempted,
        CorrectAnswers: context.correct_Answers,
        IncorrectAnswers: context.incorrect_Answers,
        ExerciseNumber: context.exercise
    });
}

export function FinalResultHelper(context) {
    const resultData = {
        summary: {
            ActivityName: "Sem2",
            activityStatus: context.activity_Status,
            totalTimeElapsed: context.timestart,
            questionsAttempted: context.Questions_attempted,
            correctAnswers: context.correct_Answers,
            attemptedQuestionNumbers: context.CollectionResult.map(q => q.questionNo),
            incorrectAnswers: context.incorrect_Answers,
            testDate: new Date().toISOString()
        },
        detailedResults: context.CollectionResult
    };

    // Download JSON
    const filename = `Lesson_${context.exercise}_Result.json`;
    const jsonStr = JSON.stringify(resultData, null, 2);
    const blob = new Blob([jsonStr], {
        type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

    // Redirect (optional)
    const curSite = `${window.location.protocol}//${window.location.host}`;
    const url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${context.CollectionResult}&Activityresult=${context.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
    window.location.href = url;
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
    const questionId = context.counter + 1
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
    const questionId = context.counter + 1;

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
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
            return {
                questionNo: context.questionNoMap[idx] || idx + 1,
                originalQuestionNo: entry.originalQuestionNo,
                level: entry.level,
                rectanglesAnswer: entry.rectanglesAnswer || [],
                blanksAnswer: entry.blanksAnswer || [],
                isCorrect: entry.isCorrect,
                timeTaken: entry.timeTaken
            };
        });

        context.resultData = {
            summary: {
                ActivityName: 'Sem4',
                activityStatus: context.activity_Status,
                totalTimeElapsed: context.timestart,
                questionsAttempted: context.Questions_attempted,
                correctAnswers: context.correct_Answers,
                incorrectAnswers: context.incorrect_Answers,
                attemptedQuestionNumbers: context.detailedResults.map(q => q.questionNo),
                testDate: new Date().toISOString()
            },
            detailedResults
        };

        context.JsonArrData = JSON.stringify(context.resultData, null, 2);
    }
}

export function SaveAndExitNowHelper4(context) {
    const questionId = context.counter + 1;

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

    context.activity_Status = 'Partially Completed';
    context.Time_elapsed = context.secondsToTime(context.timestart);
    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    let detailedResults = context.detailedResults;

    console.log("Practice Lst dsfg" + JSON.stringify(context.practiceList, null, 2));
    context.practiceList.forEach(entry => {
        // Convert both to strings with leading zeros (2-digit format)
        const entryQNo = String(entry.id).padStart(2, '0');

        const alreadyExists = detailedResults.some(
            item => String(item.questionNo).padStart(2, '0') === entryQNo
        );

        if (!alreadyExists) {
            detailedResults.push({
                questionNo: entryQNo,
                originalQuestionNo: entry.originalQuestionNo,
                level: entry.level,
                rectanglesAnswer: entry.rectanglesAnswer || [],
                blanksAnswer: entry.blanksAnswer || [],
                isCorrect: entry.isCorrect,
                timeTaken: entry.timeTaken
            });
        }
    });

    context.resultData = {
        summary: {
            ActivityName: 'Sem4',
            activityStatus: context.activity_Status,
            totalTimeElapsed: context.timestart,
            questionsAttempted: context.Questions_attempted,
            correctAnswers: context.correct_Answers,
            incorrectAnswers: context.incorrect_Answers,
            attemptedQuestionNumbers: detailedResults.map(q => q.questionNo),
            testDate: new Date().toISOString()
        },
        detailedResults
    };

    console.log("context.resultData " + JSON.stringify(context.resultData, null, 2));

    context.JsonArrData = JSON.stringify(context.resultData, null, 2);
}

export function FinalResultHelper4(context) {
    const now = new Date()
    const testDate = now.toISOString()
    const fullResult = context.resultData || {}

    // ✅ Clear old attemptedQuestionData before saving new one
    localStorage.removeItem('attemptedQuestionData')

    // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(fullResult, null, 2));

    const blob = new Blob([JSON.stringify(fullResult, null, 2)], {
        type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Test_Result_${testDate}.json`
    a.click()
    URL.revokeObjectURL(url)
}






///////////////////////////////cat 1 /////////////////////////////




 



