<template>
  <div class="player-frame">
    <div class="w-screen row-span-1">
      <PlayerTopBar></PlayerTopBar>
    </div>
    <div class="row-span-1">
      <component
        :is="lessonFile"
        :mode="lessonData.mode"
        :exercise="lessonData.exercise"
        :set="lessonData.set"
        :options="lessonData.options"
        :language="language"
        :lesson-progress="lessonProgress"
      ></component>
    </div>
    <!--<div></div>-->
  </div>
</template>

<script>

  import 'CSS/tailwind.css'
  // import 'CSS/axios.min.js'
  import SVGIconHome from 'Components/icons-svg/SVGIconHome'
  import SVGIconHamburger from 'Components/icons-svg/SVGIconHamburger'
  import PlayerTopBar from './Player/components/PlayerTopBar'
  export default {
    name: 'Player',
    components: { SVGIconHamburger, SVGIconHome, PlayerTopBar },
    props: {
      lessonData: {
        type: Object,
        required: true
      },
      playerData: {
        type: Object,
        required: true
      },
      lessonProgress: {
        type: Array,
        default: () => []
      },
      language: {
        type: String,
        default: 'en'
      }
    },
    created()
    {
      // const params = new URLSearchParams(location.search);
      // alert(params);
      // alert(params.get('StdFile'))

      // axios.post('http://localhost:8080/mayur.txt', {
      // action:''
      // }).then(function(response){
      //   application.allData = response.data;
      //   alert(application.allData)
      // });

    //const fileUrl = 'http://localhost:8080/mayur.txt' // provide file location
    //   const fileUrl = 'https://www.energiasoi.com/Documents/test.txt' // provide file location
    //   fetch(fileUrl)//, { mode: 'no-cors' }
    // .then( r => r.text() )
    // .then( t => console.log(t))

``

    },
    computed: {
      lessonFile() {
        if (this.lessonData.lessonName) {
          return () =>
            import(
              `../lessons/${this.lessonData.lessonName}/${this.lessonData.lessonName}.vue`
            )
        } else {
          // TODO: if/else seems to be needed to get reactivity on changes to componentName, but should probably throw an error or display a default component rather than return undefined
          return undefined
        }
      }
    }
  }
</script>

<style>
  .player-frame {
    grid-template-rows: 3rem minmax(0, 1fr);
    @apply h-screen grid;
  }
</style>
