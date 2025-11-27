
<template>
<div class="flex-container">
    <div class="grid grid-cols-1 -ml-10" style="border:0px; width: 100%; ">

        <ImageHeader 
            v-if="shouldShowImageHeader" 
            :imageName="ImageNames" 
            :fileName="file_Name" />

        <InstructionText :text="computedInstructionText" />

        <!-- ✅ Render all other components only after 5 sec -->
    <template  v-if="file_Name !== 'MFU-P' && file_Name !== 'MFU-I' && file_Name !== 'MFR-II' || !showImageHeader">

        <!-- ✅ IF file_Name == 'EFU-I' use multi-cols -->
        <AnswerOptionsGrid :items="file_Name === 'EFU-I' ? commonNumArray : internalArray" :mode="file_Name" :onAnswer="WordsAnswer" :disableSelection="disableSelection" />

        <AnswerCheckButton :visible="AnswerCheckShow" @click="AnswerCheck" />

        <NextQuestionButton :visible="NextQuestionShow" @click="NextQuestion" />

        <!-- FINAL REPLACEMENT for your PREVIOUS ARROW -->
        <QuestionControls :counter="counter" :totalQuestions="Total_Questions" @previous="PreviousQuestion" />

        <SaveExitButton @save-and-exit="handleSaveAndExit" />
 </template >
    </div>
</div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'
import ImageHeader from '../../../common-generic-templates/ImageHeader.vue';
import InstructionText from '../../../common-generic-templates/InstructionText.vue';
import AnswerOptionsGrid from '../../../common-generic-templates/AnswerOptionsGrid.vue';
import AnswerCheckButton from '../../../common-generic-templates/AnswerCheckButton.vue';
import NextQuestionButton from '../../../common-generic-templates/NextQuestionButton.vue';
import QuestionControls from '../../../common-generic-templates/QuestionControls.vue';
import SaveExitButton from '../../../common-generic-templates/SaveExitButton.vue';
// import { InstructionConstants } from '../../../common-js/constants.js';

export default {
    name: 'SectionSem2Top',
    components: {
        InstructionText,
        ImageHeader,
        AnswerOptionsGrid,
        AnswerCheckButton,
        NextQuestionButton,
        QuestionControls,
        SaveExitButton,
        SVGImageButton,
        SVGShape
    },
    props: {
        commonNumArray: Array,
        AnswerCheckShow: Boolean,
        NextQuestionShow: Boolean,
        Total_Questions: String,
        Questions_attempted: String,
        ImageNames: String,
        instructionText: String,
        counter: Number,
        imageSet: Array // new prop for matching set
    },
    data() {
        return {
            selected: [],
            matched: [],
            file_Name: sessionStorage.getItem('jsonFile') || 'lessonCFS-I',
            internalArray: [],
            disableSelection: false,
            showImageHeader: true // initially show header only
        };
    },

    watch: {
        commonNumArray: {
            handler(newVal) {
                this.internalArray = newVal.map(obj => ({
                    ...obj
                }));
                console.log("Updated internalArray from prop: ", this.internalArray);
                this.internalArray.slice(0, 10).forEach((word, index) => {
                    console.log(`Index ${index}:`, word.state);
                });
            },
            deep: true,
            immediate: true,
        },
        counter() {
        this.startImageHeaderTimer();
        }
    },

   computed: {
        computedInstructionText() {
            // MFU-P: show its header text when header visible
                if (this.file_Name === 'MFU-P' || this.file_Name === 'MFU-I' && this.showImageHeader) {
                    return InstructionConstants.MFUP_HEADER;
            }

                // MFR-II: show its header text when header visible
                if (this.file_Name === 'MFR-II' && this.showImageHeader) {
                    return InstructionConstants.MFRII_HEADER;
            }
        // otherwise normal incoming instruction
        return this.instructionText;
        },
        shouldShowImageHeader() {
            // ✅ MFU-P: show only while timer is active
            if (this.file_Name === 'MFU-P' || this.file_Name === 'MFU-I' || this.file_Name === 'MFR-II') {
            return this.showImageHeader;
            }
            // ✅ All other activities: always show
            return true;
        }
  },

    mounted() {
        this.startImageHeaderTimer();
    },

    methods: {
        startImageHeaderTimer() {
            // show the ImageHeader first
            this.showImageHeader = true;
            // hide it after 10 seconds
            setTimeout(() => {
                this.showImageHeader = false;
            }, 30000);
         },

        handleSaveAndExit() {
            this.$emit('save-and-exit');
        },
        WordsAnswer(Answer, index) {
            this.$emit('WordsAnswer', Answer, index);
        },

        AnswerCheck() {
            this.$emit('AnswerCheck');
        },
        NextQuestion(index) {
            this.disableSelection = false; // 🔹 enable clicks again when going forward
            this.$emit('NextQuestion', index);
             this.startImageHeaderTimer();
        },
        PreviousQuestion() {
             this.disableSelection = true; // 🔹 disable clicks
            this.$emit('PreviousQuestion');

            console.log("in section part: " + JSON.stringify(this.commonNumArray, null, 2));
        },
        WordsValue(index) {
            this.$emit('WordsValue', index);
        },
        // getImgUrl(ImgName) {
        //     const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I';
        //     const images = require.context('../assets/graphics/', true, /\.png$/);
        //     const path = `./${fileName}/${ImgName}.png`;
        //     try {
        //         return images(path);
        //     } catch (e) {
        //         console.warn(`Image not found: ${path}`, e);
        //         return require('../assets/graphics/not_found.png');
        //     }
        // }

    }
};
</script>

<style>
.flex-container {
    display: flex;
    justify-content: center;
    margin: auto;
}
</style>
