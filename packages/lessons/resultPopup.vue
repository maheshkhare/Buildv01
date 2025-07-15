<template>
<div class="flex-auto">
 <div class="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white mt-10 " 
 style="width: 300px; height: 380px;" >
	<div class="mt-3 text-center" v-show="ResultHide">
		<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
			<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg" >
				<path  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
				></path>
			</svg>
		</div>
		<h3 class="text-lg leading-6 font-medium text-gray-900">Successful!</h3>
		<div class="mt-2 px-7 py-3">
			
		<center><table class="table-auto">
        <thead>
            <tr>
            <td>Activity Status :</td>
            <th>{{activity_Status}}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Time Elapsed :</td>
            <th>{{Time_elapsed}}</th>
            </tr>
            <tr>
            <td>Questions Attempted :</td>
            <th>{{Questions_attempted}}</th>
            </tr>
             <tr>
            <td>Correct Answers :</td>
            <th>{{correct_Answers}}</th>
            </tr>
             <tr>
            <td>Incorrect Answers :</td>
            <th>{{incorrect_Answers}}</th>
            </tr>
        </tbody>
        </table></center><br>
        <input type="submit" value="SUBMIT" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border
         border-blue-500 hover:border-transparent rounded" v-on:click="FinalResult()">
        </div>
        
	</div>
   <div class="grid grid-rows-0 " v-show="ResultArrow">
        <h1 style="font-weight:bold;color:red; text-align:center;">Click On The Yellow Arrow For Next Practice </h1><br><br>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -50 181 90" height="50" width="150" filter="drop-shadow(0 0 4px gray)">
              <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="yellow"
              class="submit-selections" v-on:click="NextPracticeFun()"/>
          </svg>
    </div> 
  
</div>
</div>

</template>
<script>
export default ({
     name: 'resultPopup',
     props: {
      activity_Status: {
        type: String,
        required: true
      },
      Time_elapsed: {
        type: Number,
        required: true
      },
       Questions_attempted: {
        type: Number,
        required: true
      },
      correct_Answers: {
        type: Number,
        required: true
      },
       incorrect_Answers: {
        type: Number,
        required: true
      },
      ResultHide:{
        type:Boolean,
        required: true
      },
        ResultArrow:{
        type:Boolean,
        required: true
      }


      },
        data() {
      return {}
    },
    methods: {
      FinalResult() {
       this.$emit('FinalResult')
      },
      NextPracticeFun() {
       this.$emit('NextPracticeFun')
      },
    }
})
</script>
