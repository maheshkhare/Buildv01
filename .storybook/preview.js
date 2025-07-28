import { configure, addParameters } from '@storybook/vue'
import React from 'react';
import toReact from '@egoist/vue-to-react';
// import usersData from "../packages/data/LessonsData.json";
// import usernewdata from "../packages/data/users.json";
// import Vue from "vue";
// import VueSessionStorage from "vue-sessionstorage";
//   Vue.use(VueSessionStorage);
//   Vue.config.productionTip = false;
 import axios from "axios";

addParameters({
  //options: { docs: false}
   docs: {
       inlineStories: true,
    prepareForInline: storyFn => {
      const Story = toReact(storyFn());
      return React.createElement(Story)
    }
   },
});

var studentID = '';
var ActivityName = '';
var Exe_Number = '';
var lessonID = '';
var sesTokenID = '';

function getParameter(){
  //let URL = "http://localhost:6006/?path=/story/&studentID=7&LessonName=LessonMFU04&mode=practice&ActivityTitle=Rememberings-Animals-Two&Exe_Number=1&Inst_Number=1";
 const urlParams = new URLSearchParams(window.location.search);
 
       studentID = urlParams.get('studentID')
      ActivityName = urlParams.get('LessonName')
       Exe_Number = urlParams.get('Exe_Number')
       lessonID = urlParams.get('id')
       sesTokenID = urlParams.get('TokenID')

 const jsonFile = urlParams.get('lessonJSON');        
         const questionCount = parseInt(urlParams.get('questionCount')); 
         sessionStorage.setItem('jsonFile', jsonFile);
       sessionStorage.setItem('questionCount', questionCount);

       sessionStorage.setItem("studentID", urlParams.get('studentID'));
       sessionStorage.setItem("ActivityName", urlParams.get('id'));
       sessionStorage.setItem("Exe_Number", urlParams.get('Exe_Number'));
       sessionStorage.setItem("ExeID", urlParams.get('ExeID'));
       sessionStorage.setItem("sesTokenID", urlParams.get('TokenID'));

       if(urlParams.get('lang')==null || urlParams.get('lang')=="")
       {
        sessionStorage.setItem("lang", "en");
       }
       else
       {
        sessionStorage.setItem("lang", urlParams.get('lang'));
       }

       return urlParams.get('LessonName')

}       
   getParameter();

  function loadStories() {
    req.keys().forEach(filename => req(filename))
  }
  // unsure if loadStories is necessary, builds with or without it.
  configure(
    require.context('../packages', true, /\.stories\.js$/),
    loadStories,
    module
    
  )



