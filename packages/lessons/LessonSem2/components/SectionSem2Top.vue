<template>
<div class="flex-container">
    <div class="grid grid-cols-1 -ml-10" style="border:0px; width: 100%; ">

        <ImageHeader :imageName="ImageNames" :fileName="file_Name" />

        <InstructionText :text="instructionText" />

        <!-- ✅ IF file_Name == 'EFU-I' use multi-cols -->
        <AnswerOptionsGrid :items="file_Name === 'EFU-I' ? commonNumArray : internalArray" :mode="file_Name" :onAnswer="WordsAnswer" :disableSelection="disableSelection" />

        <AnswerCheckButton :visible="AnswerCheckShow" @click="AnswerCheck" />

        <NextQuestionButton :visible="NextQuestionShow" @click="NextQuestion" />

        <!-- FINAL REPLACEMENT for your PREVIOUS ARROW -->
        <QuestionControls :counter="counter" :totalQuestions="Total_Questions" @previous="PreviousQuestion" />

        <SaveExitButton @save-and-exit="handleSaveAndExit" />

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
            disableSelection: false
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
    },

    mounted() {},

    methods: {
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
