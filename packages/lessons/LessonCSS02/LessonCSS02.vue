<template>
  <div>
    <div class="w-full main-bg">
    <div class="rows-12 relative ">
    <topHeader :HeaderTop="HeaderTop" :componentSubtitle="componentSubtitle"
      :instructionNo="instructionNo" :practiceno="practiceno"></topHeader>
      </div>
      <div class="rows-12">
        <div style="margin-left: 5%; margin-right: 5%; margin-top: 0%; margin-bottom: 5%;" class="content-center justify-center border bg-white shadow-lg border-black p-10 ... ">
          <div class="flex-container " >
              <div class="grid grid-cols-1" style="border:0px; width: 100%; ">
              
          <div class="ml-auto mr-auto  mt-12" v-show="BackToPrev">
          <div class="flex">
            <div class="flex-1 border">
            <p> To play instruction again
              <button onclick="location.reload();" class="inline-flex items-baseline bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded-full p-2"><img src="./assets/img/Repeat.png" style="height:15px; width:20px; margin-right: 5px;" ><span >Repeat Instruction</span></button>
            </p>
            </div>
            <div class="flex-1 border">
              <p class="ml-3"> Go to Home Screen to <br />
              <!-- <button onclick="alert(window.location.origin); window.location.href=window.location.origin+'/solutions/AppFiles/playComputerActivity.aspx'; return false;" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Start Practice</button> -->
              <button onclick="window.location.href=window.location.origin+'/solutions/AppFiles/playComputerActivity.aspx'; return false;" class="inline-flex items-baseline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full p-2"><img src="./assets/img/Practice.png" style="height:15px; width:20px; margin-right: 5px;" ><span>Start Practice</span></button>
            </p>
            </div>
          </div>
           
        </div>
              </div>
            </div>
      <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed"
        :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" 
        :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult"
        :ResultHide="ResultHide" :ResultArrow="ResultArrow"
      ></resultPopup>
       <SectionCSS02Top :accept-input="acceptInput" :highlight="highlightBottom"
        :ProgressBar="ProgressBar" :BuildingShape="BuildingShape" :DoorShape="DoorShape"
        :RedCircles="RedCircles" :Arrow="Arrow" @CollectAns="CollectAns" :ArrowDny="ArrowDny"
        :ArrawShowHide="ArrawShowHide" @NewQuestion="NewQuestion" v-show="FirstPractice" :introductionTitle="introductionTitle"
        :UpDownAns="UpDownAns" :DoorColor="DoorColor" :ProgressBarHide="ProgressBarHide" :ProressCounter="ProressCounter"
        :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions"
        >
       </SectionCSS02Top>
       <SectionCSS02Top :accept-input="acceptInput" :highlight="highlightBottom"
        :ProgressBar="ProgressBar" :BuildingShape="BuildingShape" :DoorShape="DoorShape"
        :RedCircles="RedCircles" :Arrow="Arrow" :ArrowDny="ArrowDny" :introductionTitle="introductionTitle"
        :ArrawShowHide="ArrawShowHide" v-show="FirstInstruction" :UpDownAns="UpDownAns"
        :ProgressBarHide="ProgressBarHide" :activeColor="activeColor" :DoorColor="DoorColor"
        :ProressCounter="ProressCounter" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions">
       </SectionCSS02Top>

       <SectionCSS02SecondPractice :accept-input="acceptInput" :highlight="highlightBottom"
        :ProgressBar="ProgressBar" :BuildingShape="BuildingShape" :DoorShape="DoorShape"
        :RedCircles="RedCircles" :Arrow="Arrow" :ArrowDny="ArrowDny" :DoorColor="DoorColor"
        :ArrawShowHide="ArrawShowHide" @NewQuestion="NewQuestion" v-show="SecondPractice" 
        @ClickFloorValue="ClickFloorValue" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions" :ProressCounter="ProressCounter">
       </SectionCSS02SecondPractice>

       <SectionCSS02SecondPractice :accept-input="acceptInput" :highlight="highlightBottom"
        :ProgressBar="ProgressBar" :BuildingShape="BuildingShape" :DoorShape="DoorShape"
        :RedCircles="RedCircles" :Arrow="Arrow" :ArrowDny="ArrowDny" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions"
        :ArrawShowHide="ArrawShowHide"  v-show="SecondInstruction" :DoorColor="DoorColor">
       </SectionCSS02SecondPractice>
      </div>
       </div>
       </div>
      </div>
</template>
<script>
  import 'CSS/tailwind.css'
  import baseMixin from 'Scripts/mixinBaseLesson'
  import SectionCSS02Top from 'Lessons/LessonCSS02/components/SectionCSS02Top'
   import SectionCSS02SecondPractice from 'Lessons/LessonCSS02/components/SectionCSS02SecondPractice'
  import { generateLessonHowls } from '../../common-js/utility'
  import SVGShape from 'Components/SVGShape'
  import { Howler } from 'howler'
   import resultPopup from '../resultPopup.vue'
   import topHeader from '../topHeader.vue'

   
// Use relative imports from current directory
import arrowSetData from './data/arrowset.json'
import doorSetData from './data/doorset.json'
import doorLocationData from './data/doorlocation.json'
import redCirclesData from './data/redcircles.json'
  //const _sum = require('lodash/sum')
  export default {
    name: 'LessonCSS02',
    components: {
      SectionCSS02Top,SectionCSS02SecondPractice,resultPopup,topHeader
    },
    mixins: [baseMixin],
    props: {
      exercise: {
        type: Number,
        default: 1,
        validator: (value) => {
          return [1, 2, 3].includes(value)
        },
         acceptInput: {
         type: Boolean,
         required: true
        }
      },
      instruction: {
        type: Number,
        default: 1,
        validator: (value) => {
          return [1].includes(value)
        }
      },
      set: {
        type: Number,
        default: 0,
        validator: (value) => {
          return [0, 1, 2].includes(value)
        }
      },
      lessonData: {
        type: Object,
        default: () => {}
      },
      options: {
        type: Object,
        default: () => {
          return { usePlaceImages: false }
        }
      }
    },
    data: () => {
      return {
   targets: '',
   ProgressBar:[
        {shape: 'square','index':0,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':1,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':2,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':3,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':4,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':5,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':6,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':7,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':8,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':9,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':10,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':11,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':12,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':13,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':14,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        {shape: 'square','index':15,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        // {shape: 'square','index':16,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        // {shape: 'square','index':17,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        // {shape: 'square','index':18,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        // {shape: 'square','index':19,state:'base',width:'narrow',height:'short',color:'white',size:'xl'},
        ],
    // BuildingShape:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg id="futuristic-tower" viewBox="60 4 163 625" style="background-color:#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="95px" y="4px" width="163px" height="525px"><defs><linearGradient id="chromeVertical" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f8f8f8"/><stop offset="20%" stop-color="#e8e8e8"/><stop offset="50%" stop-color="#d0d0d0"/><stop offset="80%" stop-color="#e8e8e8"/><stop offset="100%" stop-color="#f8f8f8"/></linearGradient><linearGradient id="chromeHorizontal" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c0c0c0"/><stop offset="30%" stop-color="#f0f0f0"/><stop offset="70%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#c0c0c0"/></linearGradient><linearGradient id="darkChrome" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#404040"/><stop offset="50%" stop-color="#606060"/><stop offset="100%" stop-color="#404040"/></linearGradient><linearGradient id="glassWindow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#aaccff" stop-opacity="0.3"/><stop offset="40%" stop-color="#cceeff" stop-opacity="0.6"/><stop offset="60%" stop-color="#cceeff" stop-opacity="0.6"/><stop offset="100%" stop-color="#aaccff" stop-opacity="0.3"/></linearGradient><linearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0"/><stop offset="30%" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="70%" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient><filter id="minimalGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M 117.7885 66.9211 L 117.7885 628.698 L 257.2115 628.698 L 257.2115 66.9211 L 117.7885 66.9211 Z" fill="url(#chromeVertical)"/><path d="M 201.3221 66.9211 L 201.3221 627.4976 " stroke="#a0a0a0" stroke-width="0.5" fill="none"/><path d="M 212.7404 599.8889 L 241.5865 599.8889 L 241.5865 623.8965 L 212.7404 623.8965 L 212.7404 599.8889 Z" fill="url(#glassWindow)"/><path d="M 212.7404 573.4807 L 241.5865 573.4807 L 241.5865 597.4882 L 212.7404 597.4882 L 212.7404 573.4807 Z" fill="url(#glassWindow)"/><path d="M 212.7404 547.0723 L 241.5865 547.0723 L 241.5865 571.0799 L 212.7404 571.0799 L 212.7404 547.0723 Z" fill="url(#glassWindow)"/><path d="M 212.7404 520.664 L 241.5865 520.664 L 241.5865 544.6716 L 212.7404 544.6716 L 212.7404 520.664 Z" fill="url(#glassWindow)"/><path d="M 212.7404 494.2557 L 241.5865 494.2557 L 241.5865 518.2632 L 212.7404 518.2632 L 212.7404 494.2557 Z" fill="url(#glassWindow)"/><path d="M 212.7404 467.8474 L 241.5865 467.8474 L 241.5865 491.8549 L 212.7404 491.8549 L 212.7404 467.8474 Z" fill="url(#glassWindow)"/><path d="M 212.7404 441.439 L 241.5865 441.439 L 241.5865 465.4466 L 212.7404 465.4466 L 212.7404 441.439 Z" fill="url(#glassWindow)"/><path d="M 212.7404 415.0307 L 241.5865 415.0307 L 241.5865 439.0383 L 212.7404 439.0383 L 212.7404 415.0307 Z" fill="url(#glassWindow)"/><path d="M 212.7404 388.6224 L 241.5865 388.6224 L 241.5865 412.63 L 212.7404 412.63 L 212.7404 388.6224 Z" fill="url(#glassWindow)"/><path d="M 212.7404 362.2141 L 241.5865 362.2141 L 241.5865 386.2216 L 212.7404 386.2216 L 212.7404 362.2141 Z" fill="url(#glassWindow)"/><path d="M 212.7404 124.5392 L 241.5865 124.5392 L 241.5865 148.5468 L 212.7404 148.5468 L 212.7404 124.5392 Z" fill="url(#glassWindow)"/><path d="M 212.7404 150.9475 L 241.5865 150.9475 L 241.5865 174.9551 L 212.7404 174.9551 L 212.7404 150.9475 Z" fill="url(#glassWindow)"/><path d="M 212.7404 177.3559 L 241.5865 177.3559 L 241.5865 201.3634 L 212.7404 201.3634 L 212.7404 177.3559 Z" fill="url(#glassWindow)"/><path d="M 212.7404 203.7642 L 241.5865 203.7642 L 241.5865 227.7717 L 212.7404 227.7717 L 212.7404 203.7642 Z" fill="url(#glassWindow)"/><path d="M 212.7404 230.1725 L 241.5865 230.1725 L 241.5865 254.1801 L 212.7404 254.1801 L 212.7404 230.1725 Z" fill="url(#glassWindow)"/><path d="M 212.7404 256.5808 L 241.5865 256.5808 L 241.5865 280.5884 L 212.7404 280.5884 L 212.7404 256.5808 Z" fill="url(#glassWindow)"/><path d="M 212.7404 282.9891 L 241.5865 282.9891 L 241.5865 306.9967 L 212.7404 306.9967 L 212.7404 282.9891 Z" fill="url(#glassWindow)"/><path d="M 212.7404 309.3975 L 241.5865 309.3975 L 241.5865 333.405 L 212.7404 333.405 L 212.7404 309.3975 Z" fill="url(#glassWindow)"/><path d="M 212.7404 98.1309 L 241.5865 98.1309 L 241.5865 122.1385 L 212.7404 122.1385 L 212.7404 98.1309 Z" fill="url(#glassWindow)"/><path d="M 212.7404 71.7226 L 241.5865 71.7226 L 241.5865 95.7301 L 212.7404 95.7301 L 212.7404 71.7226 Z" fill="url(#glassWindow)"/><path d="M 212.7404 335.8058 L 241.5865 335.8058 L 241.5865 359.8133 L 212.7404 359.8133 L 212.7404 335.8058 Z" fill="url(#glassWindow)"/><path d="M 131.0096 71.7226 L 191.1058 71.7226 L 191.1058 95.7301 L 131.0096 95.7301 L 131.0096 71.7226 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 98.1309 L 191.1058 98.1309 L 191.1058 122.1385 L 131.0096 122.1385 L 131.0096 98.1309 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 124.5392 L 191.1058 124.5392 L 191.1058 148.5468 L 131.0096 148.5468 L 131.0096 124.5392 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 150.9475 L 191.1058 150.9475 L 191.1058 174.9551 L 131.0096 174.9551 L 131.0096 150.9475 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 177.3559 L 191.1058 177.3559 L 191.1058 201.3634 L 131.0096 201.3634 L 131.0096 177.3559 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 203.7642 L 191.1058 203.7642 L 191.1058 227.7717 L 131.0096 227.7717 L 131.0096 203.7642 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 230.1725 L 191.1058 230.1725 L 191.1058 254.1801 L 131.0096 254.1801 L 131.0096 230.1725 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 256.5808 L 191.1058 256.5808 L 191.1058 280.5884 L 131.0096 280.5884 L 131.0096 256.5808 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 282.9891 L 191.1058 282.9891 L 191.1058 306.9967 L 131.0096 306.9967 L 131.0096 282.9891 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 309.3975 L 191.1058 309.3975 L 191.1058 333.405 L 131.0096 333.405 L 131.0096 309.3975 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 362.2141 L 191.1058 362.2141 L 191.1058 386.2216 L 131.0096 386.2216 L 131.0096 362.2141 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 388.6224 L 191.1058 388.6224 L 191.1058 412.63 L 131.0096 412.63 L 131.0096 388.6224 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 415.0307 L 191.1058 415.0307 L 191.1058 439.0383 L 131.0096 439.0383 L 131.0096 415.0307 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 441.439 L 191.1058 441.439 L 191.1058 465.4466 L 131.0096 465.4466 L 131.0096 441.439 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 467.8474 L 191.1058 467.8474 L 191.1058 491.8549 L 131.0096 491.8549 L 131.0096 467.8474 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 494.2557 L 191.1058 494.2557 L 191.1058 518.2632 L 131.0096 518.2632 L 131.0096 494.2557 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 520.664 L 191.1058 520.664 L 191.1058 544.6716 L 131.0096 544.6716 L 131.0096 520.664 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 547.0723 L 191.1058 547.0723 L 191.1058 571.0799 L 131.0096 571.0799 L 131.0096 547.0723 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 573.4807 L 191.1058 573.4807 L 191.1058 597.4882 L 131.0096 597.4882 L 131.0096 573.4807 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 599.8889 L 191.1058 599.8889 L 191.1058 623.8965 L 131.0096 623.8965 L 131.0096 599.8889 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 335.8058 L 191.1058 335.8058 L 191.1058 359.8133 L 131.0096 359.8133 L 131.0096 335.8058 Z" fill="url(#chromeHorizontal)"/><path d="M 212.7404 599.8889 L 241.5865 599.8889 L 241.5865 623.8965 L 212.7404 623.8965 L 212.7404 599.8889 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 573.4807 L 241.5865 573.4807 L 241.5865 597.4882 L 212.7404 597.4882 L 212.7404 573.4807 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 547.0723 L 241.5865 547.0723 L 241.5865 571.0799 L 212.7404 571.0799 L 212.7404 547.0723 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 520.664 L 241.5865 520.664 L 241.5865 544.6716 L 212.7404 544.6716 L 212.7404 520.664 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 494.2557 L 241.5865 494.2557 L 241.5865 518.2632 L 212.7404 518.2632 L 212.7404 494.2557 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 467.8474 L 241.5865 467.8474 L 241.5865 491.8549 L 212.7404 491.8549 L 212.7404 467.8474 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 441.439 L 241.5865 441.439 L 241.5865 465.4466 L 212.7404 465.4466 L 212.7404 441.439 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 415.0307 L 241.5865 415.0307 L 241.5865 439.0383 L 212.7404 439.0383 L 212.7404 415.0307 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 388.6224 L 241.5865 388.6224 L 241.5865 412.63 L 212.7404 412.63 L 212.7404 388.6224 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 362.2141 L 241.5865 362.2141 L 241.5865 386.2216 L 212.7404 386.2216 L 212.7404 362.2141 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 335.8058 L 241.5865 335.8058 L 241.5865 359.8133 L 212.7404 359.8133 L 212.7404 335.8058 Z" fill="url(#glassHighlight)"/><text x="144.2308" y="566.1815" width="30.0481" fill="#404040" style="font-size: 16px; font-family:Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B8]]></tspan></text><text x="144.2308" y="539.7731" width="30.0481" fill="#404040" style="font-size: 16px; font-family:Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B7]]></tspan></text><text x="144.2308" y="513.3648" width="30.0481" fill="#404040" style="font-size: 16px; font-family:Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B6]]></tspan></text><text x="144.2308" y="486.9565" width="30.0481" fill="#404040" style="font-size: 16px; font-family:Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B5]]></tspan></text><text x="144.2308" y="460.3478" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B4]]></tspan></text><text x="144.2308" y="433.9395" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B3]]></tspan></text><text x="144.2308" y="407.5312" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B2]]></tspan></text><text x="144.2308" y="382.3232" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B1]]></tspan></text><text x="138.2211" y="90.8318" width="42.0673" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A10]]></tspan></text><text x="144.2308" y="117.2401" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A9]]></tspan></text><text x="144.2308" y="143.6484" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A8]]></tspan></text><text x="144.2308" y="170.0567" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A7]]></tspan></text><text x="144.2308" y="196.465" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A6]]></tspan></text><text x="144.2308" y="222.8733" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A5]]></tspan></text><text x="144.2308" y="250.2816" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A4]]></tspan></text><text x="144.2308" y="276.6899" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A3]]></tspan></text><text x="144.2308" y="302.0983" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A2]]></tspan></text><text x="144.2308" y="327.5066" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A1]]></tspan></text><text x="150.2404" y="354.9149" width="20.4327" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[G]]></tspan></text><text x="138.2211" y="619.9981" width="40.8654" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B10]]></tspan></text><text x="144.2308" y="592.5898" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B9]]></tspan></text><path d="M 96.1538 43.2136 L 117.7885 67.2212 L 117.7885 628.9981 L 96.1538 604.9905 L 96.1538 43.2136 Z" fill="url(#darkChrome)"/><path d="M 94.9519 43.2136 L 116.5865 67.2212 L 256.0096 67.2212 L 234.375 43.2136 L 94.9519 43.2136 Z" fill="url(#chromeHorizontal)"/><path d="M 142.4279 55.5947 C 142.4279 57.3752 138.1682 58.8185 132.9134 58.8185 C 127.6587 58.8185 123.3989 57.3752 123.3989 55.5947 C 123.3989 55.4415 123.4296 55.2908 123.4906 55.1433 L 126.9228 45.5648 L 138.904 45.5648 L 142.3363 55.1433 C 142.3972 55.2908 142.4279 55.4415 142.4279 55.5947 Z" fill="url(#chromeHorizontal)"/><path d="M 138.904 45.5648 C 138.904 44.3778 136.222 43.4156 132.9134 43.4156 C 129.6049 43.4156 126.9228 44.3778 126.9228 45.5648 C 126.9228 46.7519 129.6049 47.7141 132.9134 47.7141 C 136.222 47.7141 138.904 46.7519 138.904 45.5648 Z" fill="url(#darkChrome)"/><path d="M 134.6753 30.5201 L 131.1515 30.5201 L 131.1515 44.8484 L 134.6753 44.8484 L 134.6753 30.5201 Z" fill="url(#chromeVertical)"/><path d="M 138.1992 32.3112 C 138.1992 29.3436 135.8327 26.9381 132.9134 26.9381 C 129.9941 26.9381 127.6276 29.3436 127.6276 32.3112 C 127.6276 35.2787 129.9941 37.6843 132.9134 37.6843 C 135.8327 37.6843 138.1992 35.2787 138.1992 32.3112 Z" fill="url(#darkChrome)"/><path d="M 134.6753 45.2066 C 134.6753 44.6131 133.8865 44.132 132.9134 44.132 C 131.9403 44.132 131.1515 44.6131 131.1515 45.2066 C 131.1515 45.8001 131.9403 46.2813 132.9134 46.2813 C 133.8865 46.2813 134.6753 45.8001 134.6753 45.2066 Z" fill="#606060"/></svg>',
 BuildingShape:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg id="futuristic-tower" viewBox="60 4 163 625" style="background-color:#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="95px" y="4px" width="163px" height="525px"><defs><linearGradient id="chromeVertical" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f8f8f8"/><stop offset="20%" stop-color="#e8e8e8"/><stop offset="50%" stop-color="#d0d0d0"/><stop offset="80%" stop-color="#e8e8e8"/><stop offset="100%" stop-color="#f8f8f8"/></linearGradient><linearGradient id="chromeHorizontal" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c0c0c0"/><stop offset="30%" stop-color="#f0f0f0"/><stop offset="70%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#c0c0c0"/></linearGradient><linearGradient id="darkChrome" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#404040"/><stop offset="50%" stop-color="#606060"/><stop offset="100%" stop-color="#404040"/></linearGradient><linearGradient id="glassWindow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#aaccff" stop-opacity="0.3"/><stop offset="40%" stop-color="#cceeff" stop-opacity="0.6"/><stop offset="60%" stop-color="#cceeff" stop-opacity="0.6"/><stop offset="100%" stop-color="#aaccff" stop-opacity="0.3"/></linearGradient><linearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0"/><stop offset="30%" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="70%" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient><filter id="minimalGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M 117.7885 66.9211 L 117.7885 628.698 L 257.2115 628.698 L 257.2115 66.9211 L 117.7885 66.9211 Z" fill="url(#chromeVertical)"/><path d="M 201.3221 66.9211 L 201.3221 627.4976 " stroke="#a0a0a0" stroke-width="0.5" fill="none"/><path d="M 212.7404 599.8889 L 241.5865 599.8889 L 241.5865 623.8965 L 212.7404 623.8965 L 212.7404 599.8889 Z" fill="url(#glassWindow)"/><path d="M 212.7404 573.4807 L 241.5865 573.4807 L 241.5865 597.4882 L 212.7404 597.4882 L 212.7404 573.4807 Z" fill="url(#glassWindow)"/><path d="M 212.7404 547.0723 L 241.5865 547.0723 L 241.5865 571.0799 L 212.7404 571.0799 L 212.7404 547.0723 Z" fill="url(#glassWindow)"/><path d="M 212.7404 520.664 L 241.5865 520.664 L 241.5865 544.6716 L 212.7404 544.6716 L 212.7404 520.664 Z" fill="url(#glassWindow)"/><path d="M 212.7404 494.2557 L 241.5865 494.2557 L 241.5865 518.2632 L 212.7404 518.2632 L 212.7404 494.2557 Z" fill="url(#glassWindow)"/><path d="M 212.7404 467.8474 L 241.5865 467.8474 L 241.5865 491.8549 L 212.7404 491.8549 L 212.7404 467.8474 Z" fill="url(#glassWindow)"/><path d="M 212.7404 441.439 L 241.5865 441.439 L 241.5865 465.4466 L 212.7404 465.4466 L 212.7404 441.439 Z" fill="url(#glassWindow)"/><path d="M 212.7404 415.0307 L 241.5865 415.0307 L 241.5865 439.0383 L 212.7404 439.0383 L 212.7404 415.0307 Z" fill="url(#glassWindow)"/><path d="M 212.7404 388.6224 L 241.5865 388.6224 L 241.5865 412.63 L 212.7404 412.63 L 212.7404 388.6224 Z" fill="url(#glassWindow)"/><path d="M 212.7404 362.2141 L 241.5865 362.2141 L 241.5865 386.2216 L 212.7404 386.2216 L 212.7404 362.2141 Z" fill="url(#glassWindow)"/><path d="M 212.7404 124.5392 L 241.5865 124.5392 L 241.5865 148.5468 L 212.7404 148.5468 L 212.7404 124.5392 Z" fill="url(#glassWindow)"/><path d="M 212.7404 150.9475 L 241.5865 150.9475 L 241.5865 174.9551 L 212.7404 174.9551 L 212.7404 150.9475 Z" fill="url(#glassWindow)"/><path d="M 212.7404 177.3559 L 241.5865 177.3559 L 241.5865 201.3634 L 212.7404 201.3634 L 212.7404 177.3559 Z" fill="url(#glassWindow)"/><path d="M 212.7404 203.7642 L 241.5865 203.7642 L 241.5865 227.7717 L 212.7404 227.7717 L 212.7404 203.7642 Z" fill="url(#glassWindow)"/><path d="M 212.7404 230.1725 L 241.5865 230.1725 L 241.5865 254.1801 L 212.7404 254.1801 L 212.7404 230.1725 Z" fill="url(#glassWindow)"/><path d="M 212.7404 256.5808 L 241.5865 256.5808 L 241.5865 280.5884 L 212.7404 280.5884 L 212.7404 256.5808 Z" fill="url(#glassWindow)"/><path d="M 212.7404 282.9891 L 241.5865 282.9891 L 241.5865 306.9967 L 212.7404 306.9967 L 212.7404 282.9891 Z" fill="url(#glassWindow)"/><path d="M 212.7404 309.3975 L 241.5865 309.3975 L 241.5865 333.405 L 212.7404 333.405 L 212.7404 309.3975 Z" fill="url(#glassWindow)"/><path d="M 212.7404 98.1309 L 241.5865 98.1309 L 241.5865 122.1385 L 212.7404 122.1385 L 212.7404 98.1309 Z" fill="url(#glassWindow)"/><path d="M 212.7404 71.7226 L 241.5865 71.7226 L 241.5865 95.7301 L 212.7404 95.7301 L 212.7404 71.7226 Z" fill="url(#glassWindow)"/><path d="M 212.7404 335.8058 L 241.5865 335.8058 L 241.5865 359.8133 L 212.7404 359.8133 L 212.7404 335.8058 Z" fill="url(#glassWindow)"/><path d="M 131.0096 71.7226 L 191.1058 71.7226 L 191.1058 95.7301 L 131.0096 95.7301 L 131.0096 71.7226 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 98.1309 L 191.1058 98.1309 L 191.1058 122.1385 L 131.0096 122.1385 L 131.0096 98.1309 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 124.5392 L 191.1058 124.5392 L 191.1058 148.5468 L 131.0096 148.5468 L 131.0096 124.5392 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 150.9475 L 191.1058 150.9475 L 191.1058 174.9551 L 131.0096 174.9551 L 131.0096 150.9475 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 177.3559 L 191.1058 177.3559 L 191.1058 201.3634 L 131.0096 201.3634 L 131.0096 177.3559 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 203.7642 L 191.1058 203.7642 L 191.1058 227.7717 L 131.0096 227.7717 L 131.0096 203.7642 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 230.1725 L 191.1058 230.1725 L 191.1058 254.1801 L 131.0096 254.1801 L 131.0096 230.1725 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 256.5808 L 191.1058 256.5808 L 191.1058 280.5884 L 131.0096 280.5884 L 131.0096 256.5808 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 282.9891 L 191.1058 282.9891 L 191.1058 306.9967 L 131.0096 306.9967 L 131.0096 282.9891 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 309.3975 L 191.1058 309.3975 L 191.1058 333.405 L 131.0096 333.405 L 131.0096 309.3975 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 362.2141 L 191.1058 362.2141 L 191.1058 386.2216 L 131.0096 386.2216 L 131.0096 362.2141 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 388.6224 L 191.1058 388.6224 L 191.1058 412.63 L 131.0096 412.63 L 131.0096 388.6224 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 415.0307 L 191.1058 415.0307 L 191.1058 439.0383 L 131.0096 439.0383 L 131.0096 415.0307 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 441.439 L 191.1058 441.439 L 191.1058 465.4466 L 131.0096 465.4466 L 131.0096 441.439 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 467.8474 L 191.1058 467.8474 L 191.1058 491.8549 L 131.0096 491.8549 L 131.0096 467.8474 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 494.2557 L 191.1058 494.2557 L 191.1058 518.2632 L 131.0096 518.2632 L 131.0096 494.2557 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 520.664 L 191.1058 520.664 L 191.1058 544.6716 L 131.0096 544.6716 L 131.0096 520.664 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 547.0723 L 191.1058 547.0723 L 191.1058 571.0799 L 131.0096 571.0799 L 131.0096 547.0723 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 573.4807 L 191.1058 573.4807 L 191.1058 597.4882 L 131.0096 597.4882 L 131.0096 573.4807 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 599.8889 L 191.1058 599.8889 L 191.1058 623.8965 L 131.0096 623.8965 L 131.0096 599.8889 Z" fill="url(#chromeHorizontal)"/><path d="M 131.0096 335.8058 L 191.1058 335.8058 L 191.1058 359.8133 L 131.0096 359.8133 L 131.0096 335.8058 Z" fill="url(#chromeHorizontal)"/><path d="M 212.7404 599.8889 L 241.5865 599.8889 L 241.5865 623.8965 L 212.7404 623.8965 L 212.7404 599.8889 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 573.4807 L 241.5865 573.4807 L 241.5865 597.4882 L 212.7404 597.4882 L 212.7404 573.4807 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 547.0723 L 241.5865 547.0723 L 241.5865 571.0799 L 212.7404 571.0799 L 212.7404 547.0723 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 520.664 L 241.5865 520.664 L 241.5865 544.6716 L 212.7404 544.6716 L 212.7404 520.664 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 494.2557 L 241.5865 494.2557 L 241.5865 518.2632 L 212.7404 518.2632 L 212.7404 494.2557 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 467.8474 L 241.5865 467.8474 L 241.5865 491.8549 L 212.7404 491.8549 L 212.7404 467.8474 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 441.439 L 241.5865 441.439 L 241.5865 465.4466 L 212.7404 465.4466 L 212.7404 441.439 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 415.0307 L 241.5865 415.0307 L 241.5865 439.0383 L 212.7404 439.0383 L 212.7404 415.0307 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 388.6224 L 241.5865 388.6224 L 241.5865 412.63 L 212.7404 412.63 L 212.7404 388.6224 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 362.2141 L 241.5865 362.2141 L 241.5865 386.2216 L 212.7404 386.2216 L 212.7404 362.2141 Z" fill="url(#glassHighlight)"/><path d="M 212.7404 335.8058 L 241.5865 335.8058 L 241.5865 359.8133 L 212.7404 359.8133 L 212.7404 335.8058 Z" fill="url(#glassHighlight)"/><text x="144.2308" y="566.1815" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B8]]></tspan></text><text x="144.2308" y="539.7731" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B7]]></tspan></text><text x="144.2308" y="513.3648" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B6]]></tspan></text><text x="144.2308" y="486.9565" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B5]]></tspan></text><text x="144.2308" y="460.3478" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B4]]></tspan></text><text x="144.2308" y="433.9395" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B3]]></tspan></text><text x="144.2308" y="407.5312" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B2]]></tspan></text><text x="144.2308" y="382.3232" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B1]]></tspan></text><text x="138.2211" y="90.8318" width="42.0673" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A10]]></tspan></text><text x="144.2308" y="117.2401" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A9]]></tspan></text><text x="144.2308" y="143.6484" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A8]]></tspan></text><text x="144.2308" y="170.0567" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A7]]></tspan></text><text x="144.2308" y="196.465" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A6]]></tspan></text><text x="144.2308" y="222.8733" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A5]]></tspan></text><text x="144.2308" y="250.2816" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A4]]></tspan></text><text x="144.2308" y="276.6899" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A3]]></tspan></text><text x="144.2308" y="302.0983" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A2]]></tspan></text><text x="144.2308" y="327.5066" width="31.25" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[A1]]></tspan></text><text x="150.2404" y="354.9149" width="20.4327" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[G]]></tspan></text><text x="138.2211" y="619.9981" width="40.8654" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B10]]></tspan></text><text x="144.2308" y="592.5898" width="30.0481" fill="#404040" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; text-align: center;" filter="url(#minimalGlow)"><tspan><![CDATA[B9]]></tspan></text><path d="M 96.1538 43.2136 L 117.7885 67.2212 L 117.7885 628.9981 L 96.1538 604.9905 L 96.1538 43.2136 Z" fill="url(#darkChrome)"/><path d="M 94.9519 43.2136 L 116.5865 67.2212 L 256.0096 67.2212 L 234.375 43.2136 L 94.9519 43.2136 Z" fill="url(#chromeHorizontal)"/><path d="M 142.4279 55.5947 C 142.4279 57.3752 138.1682 58.8185 132.9134 58.8185 C 127.6587 58.8185 123.3989 57.3752 123.3989 55.5947 C 123.3989 55.4415 123.4296 55.2908 123.4906 55.1433 L 126.9228 45.5648 L 138.904 45.5648 L 142.3363 55.1433 C 142.3972 55.2908 142.4279 55.4415 142.4279 55.5947 Z" fill="url(#chromeHorizontal)"/><path d="M 138.904 45.5648 C 138.904 44.3778 136.222 43.4156 132.9134 43.4156 C 129.6049 43.4156 126.9228 44.3778 126.9228 45.5648 C 126.9228 46.7519 129.6049 47.7141 132.9134 47.7141 C 136.222 47.7141 138.904 46.7519 138.904 45.5648 Z" fill="url(#darkChrome)"/><path d="M 134.6753 30.5201 L 131.1515 30.5201 L 131.1515 44.8484 L 134.6753 44.8484 L 134.6753 30.5201 Z" fill="url(#chromeVertical)"/><path d="M 138.1992 32.3112 C 138.1992 29.3436 135.8327 26.9381 132.9134 26.9381 C 129.9941 26.9381 127.6276 29.3436 127.6276 32.3112 C 127.6276 35.2787 129.9941 37.6843 132.9134 37.6843 C 135.8327 37.6843 138.1992 35.2787 138.1992 32.3112 Z" fill="url(#darkChrome)"/><path d="M 134.6753 45.2066 C 134.6753 44.6131 133.8865 44.132 132.9134 44.132 C 131.9403 44.132 131.1515 44.6131 131.1515 45.2066 C 131.1515 45.8001 131.9403 46.2813 132.9134 46.2813 C 133.8865 46.2813 134.6753 45.8001 134.6753 45.2066 Z" fill="#606060"/></svg>',
    RedCircles:[],  
      ArrowSet:[], 
      DoorLocation:[],
      DoorSets:[],

        highlightTop: false, highlightBottom: false, targetOverride: false,TestProgressBar: 0,
        DoorShape:'', ArrowDny:'', ArrawShowHide:false, counter:0, ClickAnswer:'',SecondPractice:false,
        FirstPractice:false, FirstInstruction:false,UpDownAns:false, ProgressBarHide:false,
        activeColor:'', SecondInstruction:false, DoorColor:'#999999',ProressCounter:false,
        ResultHide: false,
        ResultArrow: false,
        timestart: 0,
        Questions_attempted:0,
        correct_Answers:0,
        incorrect_Answers:0,
        Time_elapsed:0,
        introductionTitle:'',
        activity_Status:"Inprogress",
        Exercise_Number:'',
        Total_Questions:16,
        resultShow:false,
        BackToPrev:false,
        JsonArrData:[],
      }
    },
    
    computed: {},
    watch: {
      instruction() {
        if(this.instruction == 1){
          this.FirstInstruction = true
          this.SecondInstruction = false
          this.ProressCounter=false
          Howler.unload()
          this.instructionfirst()
        }
        if(this.instruction == 2){
          this.FirstInstruction = false
          this.SecondInstruction = true
          this.ProressCounter=false
          Howler.unload()
          this.instructionSecond()
        }
      },
      exercise() {
      if(this.exercise == 1)
        {
          this.ArrawShowHide = false
          this.ProressCounter=true
          this.TestProgressBar = 0
          this.FirstPractice = true
          this.SecondPractice = false
          this.FirstInstruction = false
          this.SecondInstruction = false
        //   for( let i=0; i<17; i++ ){
        //   this.$data.ProgressBar[i].state = 'unselected'
        // }
        }
        if(this.exercise == 2){
          this.ProressCounter=true
          this.TestProgressBar = 0
          // for( let i=0; i<17; i++ )
          // {
          //   this.$data.ProgressBar[i].state = 'unselected'
          // }
          this.FirstPractice = false
          this.SecondPractice = true
          this.FirstInstruction = false
          this.SecondInstruction = false
          this. practice0()
        }
      }
    },
   mounted() {
  var activityName = sessionStorage.getItem("ActivityName")
  this.language = sessionStorage.getItem("lang") === "" ? 'en' : sessionStorage.getItem("lang");
  
  // Ensure JSON data is loaded before running the activity
  if (this.RedCircles.length > 0 && this.ArrowSet.length > 0) {
    this.run()
  } else {
    // Fallback: load data and then run
    this.RedCircles = redCirclesData
    this.ArrowSet = arrowSetData
    this.DoorLocation = doorLocationData
    this.DoorSets = doorSetData
    this.$nextTick(() => {
      this.run()
    })
  }
  
  if(activityName.includes('instruction')){
    this.instruction = sessionStorage.getItem("Exe_Number")
    this.componentSubtitle= `Moving the elevator one`;
    this.instructionNo= `Instruction`;
  } else {
    this.exercise = sessionStorage.getItem("Exe_Number")
    this.componentSubtitle= `Moving the elevator one`;
    this.practiceno= `Practice: `+this.exercise;
  }
},
    beforeDestroy() {
      Howler.unload()
    },
    methods: {
      reset() {
        this.acceptInput = false
      },
      run() {
        if (this.mode == 'instruction') {
            this.instructionfirst()
            this.ArrowDny = "320 1194 181 90"
            this.FirstInstruction = true
            this.SecondInstruction = false
        } else {
            this.practice0()
        }
      },
   practice0() {
         this.ArrawShowHide = false
         this.TimerFun();
        if(this.exercise == 1){
          this.ProgressBarHide = true
          this.UpDownAns = true
          this.FirstPractice = true
          this.DoorShape = '-174 307 30 30'
          this.ArrowDny = this.ArrowSet[this.counter]
          this.ArrowDny = this.ArrowDny["Location"]
           //alert(this.ArrowDny)
          }
        if(this.exercise == 2){
          this.DoorShape = this.DoorSets[this.counter]["Location"]
          this.ArrowDny = this.ArrowSet[this.counter]
          this.ArrowDny = this.ArrowDny["Location"]
          this.FirstPractice = false
          this.SecondPractice = true
          this.FirstInstruction = false
          this.SecondInstruction = false

        if(this.Total_Questions == this.Questions_attempted){
            this.activity_Status= "Completed";
            this.Time_elapsed = this.secondsToTime(this.timestart);
            this.resultShow= true;
            this.FirstPractice = false
            this.FirstInstruction = false
            this.SecondPractice = false
            this.SecondInstruction = false

            this.ResultHide = true
            this.ResultArrow = false
            this.JsonArrData = {ActivityStatus: this.activity_Status,TimeElapsed:this.Time_elapsed,
            QuestionsAttempted:this.Questions_attempted,CorrectAnswers:this.correct_Answers,
            IncorrectAnswers:this.incorrect_Answers,ExerciseNumber:this.exercise}
            this.JsonArrData=JSON.stringify( this.JsonArrData);
         }
         
         else  {
  // Reset all red circles opacity first
  for (let i = 0; i < this.RedCircles.length; i++) {
    this.RedCircles[i]["opacity"] = "0.5"
  }
  
  // Get the current question from DoorSets
  if (this.DoorSets && this.DoorSets.length > this.counter) {
    const currentQuestion = this.DoorSets[this.counter]
    
    // Use targetIndex from JSON
    if (currentQuestion.targetIndex !== undefined && 
        this.RedCircles[currentQuestion.targetIndex]) {
      this.RedCircles[currentQuestion.targetIndex]["opacity"] = "1"
    }
  }
}
          }

       },
       FinalResult(){
          const curSite = window.location.protocol + "//" + window.location.host;
          const  Url = curSite + `/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${this.CollectionResult}&Activityresult=${this.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`
          window.location.href = Url;
        }, 
      TimerFun(){
        setInterval(() => {
        if(this.timestart > 9999999999) {
        }else
        {
          this.timestart+=1;
        }
        },1000)
      }, 
      secondsToTime(s){
        var h = Math.floor(s / 3600).toString().padStart(2,'0'),
        m = Math.floor(s % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(s % 60).toString().padStart(2,'0');
        
        return h + ':' + m + ':' + s;
      },

       CollectAns(index){
         if (!this.ArrowSet || this.ArrowSet.length === 0 || this.counter >= this.ArrowSet.length) {
    console.error('ArrowSet data not loaded properly')
    return
  }
        this.ArrawShowHide = true
        this.ClickAnswer = this.ArrowSet[this.counter]["Direction"]        
        if(index == this.ClickAnswer)
        {
          for (let i=0; i < this.DoorLocation.length; i++) 
          {
           if(this.ClickAnswer == this.DoorLocation[i]["AnsSetUp"])
            {
               this.TestProgressBar = this.TestProgressBar + 1;
                if(this.TestProgressBar<=17)
                {
                  this.$data.ProgressBar[this.TestProgressBar - 1].state = 'correct'
                  	this.Questions_attempted+=1
		                this.correct_Answers +=1;
                     setTimeout(() => {
                        this.DoorColor = "green"
                      }, 500)
                }
              this.DoorShape = this.DoorLocation[i]["DoorLocationUp"]
              break;  
            }else if(this.ClickAnswer == this.DoorLocation[i]["AnsSetDown"])
            {
               this.TestProgressBar = this.TestProgressBar + 1;
                if(this.TestProgressBar<=17)
                {
                  this.$data.ProgressBar[this.TestProgressBar - 1].state = 'correct'
                  this.Questions_attempted+=1
		               this.correct_Answers +=1;
                    setTimeout(() => {
                        this.DoorColor = "green"
                      }, 500)
                }
              this.DoorShape = this.DoorLocation[i]["DoorLocationDown"]
              break;  
            }            
          }
        }
        else
        {
          for (let i = 0; i < this.DoorLocation.length; i++) 
          {
            if(index == this.DoorLocation[i]["AnsSetUp"])
            {
               this.TestProgressBar = this.TestProgressBar + 1;
                if(this.TestProgressBar<=17)
                {
                  this.$data.ProgressBar[this.TestProgressBar - 1].state = 'incorrect'
                  this.Questions_attempted+=1
		              this.incorrect_Answers += 1;
                   setTimeout(() => {
                        this.DoorColor = "red"
                      }, 500)
                }
              this.DoorShape = this.DoorLocation[i]["DoorLocationUp"]
              break;  
            }else 
            if(index == this.DoorLocation[i]["AnsSetDown"])
            {
               this.TestProgressBar = this.TestProgressBar + 1;
                if(this.TestProgressBar<=17)
                {
                  this.$data.ProgressBar[this.TestProgressBar - 1].state = 'incorrect'
                  this.Questions_attempted+=1
		              this.incorrect_Answers += 1;
                   setTimeout(() => {
                        this.DoorColor = "red"
                      }, 500)
                }
              this.DoorShape = this.DoorLocation[i]["DoorLocationDown"]
              break;  
            } 
          }
        }
        // alert(this.Total_Questions +" --------- "+ this.Questions_attempted)
        if(this.Total_Questions == this.Questions_attempted){
            this.activity_Status= "Completed";
            this.Time_elapsed = this.secondsToTime(this.timestart);
            this.resultShow= true;
            this.FirstPractice = false
            this.FirstInstruction = false
            this.SecondPractice = false
            this.SecondInstruction = false

            this.ResultHide = true
            this.ResultArrow = false
            this.JsonArrData = {ActivityStatus: this.activity_Status,TimeElapsed:this.Time_elapsed,
            QuestionsAttempted:this.Questions_attempted,CorrectAnswers:this.correct_Answers,
            IncorrectAnswers:this.incorrect_Answers,ExerciseNumber:this.exercise}
            this.JsonArrData=JSON.stringify( this.JsonArrData);
            }
       },

       NewQuestion(){
         if(this.exercise == 1){
         this.counter = this.counter + 1
         this.DoorShape = '-174 307 30 30'
         this.practice0()
         }
         if(this.exercise == 2){
         this.counter = this.counter + 1
         this.Questions_attempted++
         //this.DoorShape = '-174 307 30 30'
         for (let i = 0; i < 10; i++) {
           this.RedCircles[i]["opacity"]="0.5"
         }
         this.DoorColor = "#999999"
         this.practice0()
         }
       },

      ClickFloorValue(FloorNum){


         // Add safety check
  if (!this.RedCircles || this.RedCircles.length === 0) {
    console.error('RedCircles data not loaded properly')
    return
  }
      this.ArrawShowHide = true
      for (let i = 0; i < this.RedCircles.length; i++) {

        if(FloorNum == this.RedCircles[i]['AnsSetUp'])
        {
         this.DoorShape = this.RedCircles[i]['DoorLocationUp']

          if(FloorNum == this.DoorSets[this.counter]["Ans"]){
            this.DoorShape = this.RedCircles[i]['DoorLocationUp']
              setTimeout(() => {
                this.DoorColor = "green"
              }, 800)
            this.TestProgressBar = this.TestProgressBar + 1;
            if(this.TestProgressBar<=19)
            {
              this.$data.ProgressBar[this.TestProgressBar - 1].state = 'correct'
              this.correct_Answers++
            }
          }
          if(FloorNum != this.DoorSets[this.counter]["Ans"]){
            this.DoorShape = this.RedCircles[i]['DoorLocationUp']
              setTimeout(() => {
                this.DoorColor = "red"
              }, 800)
            this.TestProgressBar = this.TestProgressBar + 1;
            if(this.TestProgressBar<=19)
            {
              this.$data.ProgressBar[this.TestProgressBar - 1].state = 'incorrect'
              this.incorrect_Answers++
            }
          }
        }
       
        if(FloorNum == this.RedCircles[i]['AnsSetDown'])
        {
          this.DoorShape = this.RedCircles[i]['DoorLocationDown']
           if(FloorNum == this.DoorSets[this.counter]["Ans"]){
            this.DoorShape = this.RedCircles[i]['DoorLocationDown']
              setTimeout(() => {
                this.DoorColor = "green"
              }, 800)
            this.TestProgressBar = this.TestProgressBar + 1;
            if(this.TestProgressBar<=19)
            {
              this.$data.ProgressBar[this.TestProgressBar - 1].state = 'correct'
              this.correct_Answers++
            }
          }

          if(FloorNum != this.DoorSets[this.counter]["Ans"]){
            this.DoorShape = this.RedCircles[i]['DoorLocationDown']
            setTimeout(() => {
              this.DoorColor = "red"
            }, 800)
            this.TestProgressBar = this.TestProgressBar + 1;
            if(this.TestProgressBar<=19)
            {
              this.$data.ProgressBar[this.TestProgressBar - 1].state = 'incorrect'
              this.incorrect_Answers++
            }
          }
        } 
      }
        },

      instructionfirst() {
        this.introductionTitle='Instruction'
        const audioFiles = [
          'CSS-01', 'CSS-02', 'CSS-03','CSS-04','CSS-05', 'CSS-06', 'CSS-07', 'CSS-08','CSS-09']
        const Howls = generateLessonHowls(
          audioFiles,
          'LessonCSS02',
          this.language
        )
        Howls['CSS-01'].on('end', () => {
          setTimeout(() => {
            Howls['CSS-02'].play()
//            this.DoorShape = '374 307 30 30'
          }, 500)
        })
        Howls['CSS-02'].on('end', () => {
          setTimeout(() => {
            Howls['CSS-03'].play()
            
          }, 500)
        })
        Howls['CSS-03'].on('end', () => {
          setTimeout(() => {
            Howls['CSS-04'].play()
            
          }, 500)
        })
        Howls['CSS-04'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-05'].play()
           this.UpDownAns = true
           this.activeColor = "2px solid yellow"
          }, 500)
        })
        Howls['CSS-05'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-06'].play()
           this.activeColor = ""
           this.DoorShape = '-174 307 30 30'
           this.ArrowDny = "-70 1270 181 90"
          }, 500)
        })
        Howls['CSS-06'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-07'].play()
            this.DoorShape = '-174 391 30 30'
          }, 500)
        })
        Howls['CSS-07'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-08'].play()
            this.DoorColor = "green"
          }, 500)
        })
        Howls['CSS-08'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-09'].play()
           this.DoorShape = '-174 419 30 30'
           this.DoorColor = "#999999"
          }, 500)
        })
        Howls['CSS-09'].on('end', () => {
        setTimeout(() => {
       // Howls['CSS-10'].play()
            this.DoorColor = "red"
          this.FirstInstruction = false
          this.SecondInstruction = false
          this.ProressCounter=false
          this.BackToPrev=true
          }, 500)
        })
        // Howls['CSS-10'].on('end', () => {
        //   setTimeout(() => {
        //    //Howls['sound11'].play()
        //    //this.ArrawShowHide=true
        //   }, 500)
        // })
        Howls['CSS-01'].play()
        this.DoorShape = '-174 307 30 30'
      },

      instructionSecond() {
        const audioFiles = [
          'CSS-11', 'CSS-12','CSS-13','CSS-14', 'CSS-15', 'CSS-16', 'CSS-08','CSS-09']
        const Howls = generateLessonHowls(
          audioFiles,
          'LessonCSS02',
          this.language
        )
        Howls['CSS-11'].on('end', () => {
          setTimeout(() => {
            Howls['CSS-12'].play()
            this.RedCircles[6]['opacity'] = 1
            this.DoorShape = '-174 447 30 30'
          }, 500)
        })
        Howls['CSS-12'].on('end', () => {
          setTimeout(() => {
            Howls['CSS-13'].play()
            this.DoorColor = ""
            this.DoorColor = "green"
            this.DoorShape = '-174 391 30 30'            
          }, 500)
        })
        Howls['CSS-13'].on('end', () => {
          setTimeout(() => {
           Howls['CSS-14'].play()
            this.DoorShape = '-174 391 30 30'
          }, 500)
        })
        Howls['CSS-14'].on('end', () => {
          setTimeout(() => {
           this.DoorColor = "red"
           this.ArrawShowHide=false
           this.DoorShape = '-174 335 30 30'
           this.ArrowDny = "-70 1270 181 90"
           this.SecondInstruction = false
           this.BackToPrev=true

          }, 500)
        })
       Howls['CSS-11'].play()
        this.DoorShape = '-174 307 30 30'
      },
    }
  }
</script>
<style>
  html,
  body {
    @apply h-full;
  }
  .main-bg{
    background-image: url('../../assets/images/bg.png');
    width: 100%;  
  }
</style>