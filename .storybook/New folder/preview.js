import { configure, addParameters } from '@storybook/vue'
import React from 'react';
import toReact from '@egoist/vue-to-react';
import LessonsData from '../packages/data/moduleData.json';
// import axios from "axios";
// import Vue from "vue";
// import VueSession from "vue-session";
// Vue.use(VueSession);


addParameters({
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

function getParameter(){
   //let URL = "http://localhost:6006/?path=/story/&studentID=7&LessonName=LessonMFU04&mode=practice&ActivityTitle=Rememberings-Animals-Two&Exe_Number=1&Inst_Number=1";
  const urlParams = new URLSearchParams(window.location.search);
  // sessionStorage.setItem("Studexercise", urlParams.get('Studexercise'));
  // return urlParams.get('Studexercise')
  
  //const urlParams = new URLSearchParams(URL);

        studentID = urlParams.get('studentID')
        ActivityName = urlParams.get('LessonName')
//        modesession = urlParams.get('mode')
//        ActivityTitle = urlParams.get('ActivityTitle')
        Exe_Number = urlParams.get('Exe_Number')
//        Inst_Number = urlParams.get('Inst_Number')
        lessonID = urlParams.get('id')
        //id=lessons-mfr-l01--instruction&viewMode=story&studentID=7
        sessionStorage.setItem("studentID", urlParams.get('studentID'));
        sessionStorage.setItem("ActivityName", urlParams.get('id'));
//        sessionStorage.setItem("mode", urlParams.get('mode'));
//        sessionStorage.setItem("ActivityTitle", urlParams.get('ActivityTitle'));
        sessionStorage.setItem("Exe_Number", urlParams.get('Exe_Number'));
//        sessionStorage.setItem("Inst_Number", urlParams.get('Inst_Number'));
        // lessons-mfr-l01--practice
        // alert(urlParams.get('id'))
        // alert(ActivityName)
        // http://localhost:6006/?path=/story/lessons-mfr-l01--instruction&studentID=7
       // alert(urlParams.get('id') +"------------------"+ urlParams.get('LessonName'))
        return urlParams.get('LessonName')

}       
    getParameter();

      // alert(ActivityName)
      // alert(studentID);
      // alert(LessonName);

      // var ActivityName = LessonsData['student']['activity'];
      // var LessonNumber = LessonsData['student']["lessonNo"];
      // alert(JSON.stringify(ActivityName +"-----"+ LessonNumber));
      // http://localhost:6006/?path=/story/lessons-nsi-l02--practice&Studexercise=1
      // var LessonName= "Lesson" + ActivityName + LessonNumber;

      // var mode
      // var exerciseNo
      // alert(ActivityName)
      // alert(studentID);
      // alert(LessonName);
      // axios.get("https://jsonplaceholder.typicode.com/posts/2").then((result) => {
      // console.log(result.data);
      // var studentData = result.data;
      // studentData.userId = null;
      // var lessonName = studentData.title;
      //  lessonName = ActivityName;

      //  alert(LessonName )

      // alert(ActivityName);
  // if(ActivityName !== null || ActivityName !== undefined || ActivityName === '' )
  //   {
  //     switch (ActivityName) {
  //        case 'LessonMFU04': 
  //         configure(
  //             require.context('../packages', true, /LessonMFU04.stories.js$/),
  //             module
  //           )
  //        break;
      
  //        case 'LessonVISION03': 
  //        configure(
  //            require.context('../packages', true, /LessonVISION03.stories.js$/),
  //            module
  //          )
  //        break;
      
  //        case 'LessonNSI02': 
  //        configure(
  //            require.context('../packages', true, /LessonNSI02.stories.js$/),
  //            module
  //          )
  //        break;
      
  //        case 'LessonMSUa02V': 
  //        configure(
  //            require.context('../packages', true, /LessonMSUa02V.stories.js$/),
  //            module
  //          )
  //        break;
      
  //        case 'LessonMSUa02A': 
  //         configure(
  //             require.context('../packages', true, /LessonMSUa02A.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMSSv02': 
  //         configure(
  //             require.context('../packages', true, /LessonMSSv02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMSSa02': 
  //         configure(
  //             require.context('../packages', true, /LessonMSSa02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMUv02': 
  //         configure(
  //             require.context('../packages', true, /LessonMMUv02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMUa02': 
  //         configure(
  //             require.context('../packages', true, /LessonMMUa02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMUa01': 
  //         configure(
  //             require.context('../packages', true, /LessonMMUa01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMI01': 
  //         configure(
  //             require.context('../packages', true, /LessonMMI01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMFU02': 
  //         configure(
  //             require.context('../packages', true, /LessonMFU02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMFU03': 
  //        configure(
  //            require.context('../packages', true, /LessonMFU03.stories.js$/),
  //            module
  //          )
  //       break;
  //        case 'LessonMFU01': 
  //         configure(
  //             require.context('../packages', true, /LessonMFU01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMFSa01': 
  //         configure(
  //             require.context('../packages', true, /LessonMFSa01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonESS01': 
  //         configure(
  //             require.context('../packages', true, /LessonESS01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonEFC02': 
  //         configure(
  //             require.context('../packages', true, /LessonEFC02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonEFC01': 
  //         configure(
  //             require.context('../packages', true, /LessonEFC01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS07': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS07.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS04': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS04.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS02': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSR04': 
  //         configure(
  //             require.context('../packages', true, /LessonCSR04.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSR03': 
  //         configure(
  //             require.context('../packages', true, /LessonCSR03.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSR02': 
  //         configure(
  //             require.context('../packages', true, /LessonCSR02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSR01': 
  //         configure(
  //             require.context('../packages', true, /LessonCSR01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMU05': 
  //         configure(
  //             require.context('../packages', true, /LessonCMU05.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMU04': 
  //         configure(
  //             require.context('../packages', true, /LessonCMU04.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMU03': 
  //         configure(
  //             require.context('../packages', true, /LessonCMU03.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS09': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS09.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMR02': 
  //         configure(
  //             require.context('../packages', true, /LessonCMR02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMR01': 
  //         configure(
  //             require.context('../packages', true, /LessonCMR01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFU01': 
  //         configure(
  //             require.context('../packages', true, /LessonCFU01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFS03': 
  //         configure(
  //             require.context('../packages', true, /LessonCFS03.stories.js$/),
  //             module
  //           )
  //        break;

  //        case 'LessonCFS02': 
  //         configure(
  //             require.context('../packages', true, /LessonCFS02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFS01': 
  //         configure(
  //             require.context('../packages', true, /LessonCFS01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFC02': 
  //         configure(
  //             require.context('../packages', true, /LessonCFC02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFC01': 
  //         configure(
  //             require.context('../packages', true, /LessonCFC01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMFU04': 
  //         configure(
  //             require.context('../packages', true, /LessonMFU04.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFS05': 
  //         configure(
  //             require.context('../packages', true, /LessonCFS05.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMU01': 
  //         configure(
  //             require.context('../packages', true, /LessonCMU01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMFR01': 
  //         configure(
  //             require.context('../packages', true, /LessonMFR01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMR01': 
  //         configure(
  //             require.context('../packages', true, /LessonMMR01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMSS02': 
  //         configure(
  //             require.context('../packages', true, /LessonMSS02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMC01': 
  //         configure(
  //             require.context('../packages', true, /LessonCMC01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS01': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS01.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS02': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS03': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS03.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS05': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS05.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS06': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS06.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS07': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS07.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS10': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS10.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMS11': 
  //         configure(
  //             require.context('../packages', true, /LessonCMS11.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCMU02': 
  //         configure(
  //             require.context('../packages', true, /LessonCMU02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS03': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS03.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS06': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS06.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCSS08': 
  //         configure(
  //             require.context('../packages', true, /LessonCSS08.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMMI02': 
  //         configure(
  //             require.context('../packages', true, /LessonMMI02.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonCFS04': 
  //         configure(
  //             require.context('../packages', true, /LessonCFS04.stories.js$/),
  //             module
  //           )
  //        break;
  //        case 'LessonMSSa01': 
  //        configure(
  //            require.context('../packages', true, /LessonMSSa01.stories.js$/),
  //            module
  //          )
  //       break;
  //       case 'LessonMSSv05': 
  //       configure(
  //           require.context('../packages', true, /LessonMSSv05.stories.js$/),
  //           module
  //         )
  //      break;
  //      case 'LessonMSUa01A': 
  //      configure(
  //          require.context('../packages', true, /LessonMSUa01A.stories.js$/),
  //          module
  //        )
  //     break;
  //     case 'LessonNSS01': 
  //     configure(
  //         require.context('../packages', true, /LessonNSS01.stories.js$/),
  //         module
  //       )
  //    break;
  //    case 'LessonVISIONL01': 
  //     configure(
  //         require.context('../packages', true, /LessonVISIONL01.stories.js$/),
  //         module
  //       )
  //    break;
  //    case 'LessonVISIONL02': 
  //     configure(
  //         require.context('../packages', true, /LessonVISIONL02.stories.js$/),
  //         module
  //       )
  //    break;
     

      
  //        default:  
  //           alert("Lesson data not found.")
  //     }
  //   }
    // automatically import all files ending in *.stories.js
      function loadStories() {
        req.keys().forEach(filename => req(filename))
      }
    // );
    // }
    // unsure if loadStories is necessary, builds with or without it.

    configure(
      require.context('../packages', true, /\.stories\.js$/),
      loadStories,
      module
    )