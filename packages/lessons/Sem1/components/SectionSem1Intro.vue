
<template>
    <div class="flex-container">
       <div class="grid grid-cols-1 justify-center" >
      
                <p style="font-weight:bold;text-align:center;" class="w-64">
                   <center class="text-red-600"><h1 style="font-size:25px">Instruction </h1></center> <br>
            <span style="width:500px"> In this mastery lesson - Listed below are words and, two column headings. Your job is to put each word
into the correct column. A word might fit in one, or both columns, you decide. </span> 
          </p>
            <div class="ml-auto mr-auto mt-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="80" filter="drop-shadow(0 0 4px gray)">
                <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1"
                c class="submit-selections" v-on:click="PracticeNext()"/>
              </svg> 
            </div>
                
        </div>   
          
    </div>
  </template>
  <script>
    import 'CSS/tailwind.css'
    import SVGShape from 'Components/SVGShape'
    import SVGImageButton from 'Components/SVGImageButton'
    export default {
      name: ' SectionSem1Intro',
      components: { SVGImageButton, SVGShape },
      props: {
        acceptInput: {
          type: Boolean,
          required: true
        },
       
       },
      data() {
        return { }
      },
      methods: {
        PracticeNext() {
          this.$emit('PracticeNext')
        },
      
        
      }
    }
  </script>
  <style>
  
    .flex-container {
    display: flex;
    justify-content: center;
    margin: auto;
  }
  </style>
  
  