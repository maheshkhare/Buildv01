<template>
  <div class="flex p-2 justify-between items-center border-none flex-wrap " style="border:none">
      <div class="flex items-center">
          <img src="../assets/images/Logo.png" class="w-32 h-32">
      </div>
      <div class="relative flex items-center ">
       
      </div>
      <div class="flex items-center gap-2">
          <button class="border-none px-2 py-1 rounded-md font-bold text-red-800 text-lg text-left"> 
            {{instructionNo ?instructionNo:practiceno}}
            <br />
            Activity: <span class="text-blue-500">{{componentSubtitle}}</span>
        </button>
          
      </div>
  </div>
  </template>
  <script>
  import 'CSS/tailwind.css'
  export default {
    name: 'topHeader',
    components: { },
    props: {
      HeaderTop: {
        type: Boolean,
        default: true
      },
      componentSubtitle:{
          type: String,
          required: true
      },
      instructionNo:{
          type: String,
          required: true  
      },
      lang:{
          type: String,
          required: true  
      },
      practiceno:{
          type: String,
          required: true  
      }
    },
    data() {
      return {}
    },
    methods: {
      
    }
  }
  </script>
     <style>
  
  </style>