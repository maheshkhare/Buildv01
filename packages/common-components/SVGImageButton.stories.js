import SVGImageButton from './SVGImageButton'

// Component Level Decorators and Parameters
// noinspection JSUnusedLocalSymbols
export default {
  title: './Components/SVG Image Button',
  component: SVGImageButton,
  decorators: [
    (storyFn) => {
      return { template: `<div style="margin: 1rem"><story/></div>` }
    }
  ],
  parameters: {
    componentSubtitle: `Component to Use SVG Images as Answer Selection Buttons`
  }
}

export const DefaultBox = () => ({
  components: { SVGImageButton },
  props: {
    identifier: 'default'
  },
  template: `<div style="height:30%; width:30%"><SVGImageButton :identifier="'default'"><svg
          id="difference-shape"
          xmlns="http://www.w3.org/2000/svg"
          y="0px"
          x="0px"
          viewBox="0 0 225 180"
          width="100%"
          height="100%"
          filter="drop-shadow(0 0 7px gray)"
  >
      <g id="g4880">
          <rect
                  id="rect4038"
                  x="5.0159001"
                  y="14.5144"
                  width="76.853401"
                  height="76.581398"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <rect
                  id="rect4040"
                  x="110.5"
                  y="1"
                  width="108.5051"
                  height="108.1161"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;box-shadow: 0 0 2px gray;"
          />
          <path
                  id="Ellipse"
                  d="M 63.7862,40.0415 C 63.7862,18.4792 81.3275,1 102.9664,1 c 21.6389,0 39.1801,17.4792 39.1801,39.0415 0,21.5623 -17.5412,39.0416 -39.1801,39.0416 -21.6389,0 -39.1802,-17.4793 -39.1802,-39.0416 z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;"
          />
          <path
                  id="Polygon"
                  d="M 142.1465,109.115 57.9748,109.4885 99.7361,36.6649 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon2"
                  d="M 99.4614,117.3515 76.6629,159.2463 28.9322,160.0194 4,118.8976 26.7985,77.0029 74.5293,76.2298 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon3"
                  d="M 180.7595,173.2665 142.96,147.6929 106.5013,176 l 13.0985,-44.1115 -37.7957,-25.5709 45.8282,-1.4802 12.8966,-43.4318 15.2927,42.5213 45.3961,-1.4662 -35.8991,27.8726 z"
                  style="opacity:1;fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
      </g>
  </svg></SVGImageButton></div>`
})

export const SelectedButton = () => ({
  components: { SVGImageButton },
  props: {
    identifier: 'default',
    selected: true,
    showCorrect: false
  },
  template: `<div style="height:30%; width:30%"><SVGImageButton :identifier="'default'" :selected="true" :show-correct="false" :disable-correct="true"><svg
          id="difference-shape"
          xmlns="http://www.w3.org/2000/svg"
          y="0px"
          x="0px"
          viewBox="0 0 225 180"
          width="100%"
          height="100%"
          filter="drop-shadow(0 0 7px gray)"
  >
      <g id="g4880">
          <rect
                  id="rect4038"
                  x="5.0159001"
                  y="14.5144"
                  width="76.853401"
                  height="76.581398"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <rect
                  id="rect4040"
                  x="110.5"
                  y="1"
                  width="108.5051"
                  height="108.1161"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;box-shadow: 0 0 2px gray;"
          />
          <path
                  id="Ellipse"
                  d="M 63.7862,40.0415 C 63.7862,18.4792 81.3275,1 102.9664,1 c 21.6389,0 39.1801,17.4792 39.1801,39.0415 0,21.5623 -17.5412,39.0416 -39.1801,39.0416 -21.6389,0 -39.1802,-17.4793 -39.1802,-39.0416 z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;"
          />
          <path
                  id="Polygon"
                  d="M 142.1465,109.115 57.9748,109.4885 99.7361,36.6649 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon2"
                  d="M 99.4614,117.3515 76.6629,159.2463 28.9322,160.0194 4,118.8976 26.7985,77.0029 74.5293,76.2298 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon3"
                  d="M 180.7595,173.2665 142.96,147.6929 106.5013,176 l 13.0985,-44.1115 -37.7957,-25.5709 45.8282,-1.4802 12.8966,-43.4318 15.2927,42.5213 45.3961,-1.4662 -35.8991,27.8726 z"
                  style="opacity:1;fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
      </g>
  </svg></SVGImageButton></div>`
})

export const IncorrectSelection = () => ({
  components: { SVGImageButton },
  props: {
    identifier: 'default',
    selected: true
  },
  template: `<div style="height:30%; width:30%"><SVGImageButton :identifier="'default'" :selected="true"><svg
          id="difference-shape"
          xmlns="http://www.w3.org/2000/svg"
          y="0px"
          x="0px"
          viewBox="0 0 225 180"
          width="100%"
          height="100%"
          filter="drop-shadow(0 0 7px gray)"
  >
      <g id="g4880">
          <rect
                  id="rect4038"
                  x="5.0159001"
                  y="14.5144"
                  width="76.853401"
                  height="76.581398"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <rect
                  id="rect4040"
                  x="110.5"
                  y="1"
                  width="108.5051"
                  height="108.1161"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;box-shadow: 0 0 2px gray;"
          />
          <path
                  id="Ellipse"
                  d="M 63.7862,40.0415 C 63.7862,18.4792 81.3275,1 102.9664,1 c 21.6389,0 39.1801,17.4792 39.1801,39.0415 0,21.5623 -17.5412,39.0416 -39.1801,39.0416 -21.6389,0 -39.1802,-17.4793 -39.1802,-39.0416 z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;"
          />
          <path
                  id="Polygon"
                  d="M 142.1465,109.115 57.9748,109.4885 99.7361,36.6649 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon2"
                  d="M 99.4614,117.3515 76.6629,159.2463 28.9322,160.0194 4,118.8976 26.7985,77.0029 74.5293,76.2298 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon3"
                  d="M 180.7595,173.2665 142.96,147.6929 106.5013,176 l 13.0985,-44.1115 -37.7957,-25.5709 45.8282,-1.4802 12.8966,-43.4318 15.2927,42.5213 45.3961,-1.4662 -35.8991,27.8726 z"
                  style="opacity:1;fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
      </g>
  </svg></SVGImageButton></div>`
})

export const CorrectSelection = () => ({
  components: { SVGImageButton },
  props: {
    identifier: 'default',
    selected: true,
    comparison: 'default',
    showCorrect: true
  },
  template: `<div style="height:30%; width:30%"><SVGImageButton :identifier="'default'" :selected="true" :comparison="'default'" :showCorrect="true"><svg
          id="difference-shape"
          xmlns="http://www.w3.org/2000/svg"
          y="0px"
          x="0px"
          viewBox="0 0 225 180"
          width="100%"
          height="100%"
          filter="drop-shadow(0 0 7px gray)"
  >
      <g id="g4880">
          <rect
                  id="rect4038"
                  x="5.0159001"
                  y="14.5144"
                  width="76.853401"
                  height="76.581398"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <rect
                  id="rect4040"
                  x="110.5"
                  y="1"
                  width="108.5051"
                  height="108.1161"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;box-shadow: 0 0 2px gray;"
          />
          <path
                  id="Ellipse"
                  d="M 63.7862,40.0415 C 63.7862,18.4792 81.3275,1 102.9664,1 c 21.6389,0 39.1801,17.4792 39.1801,39.0415 0,21.5623 -17.5412,39.0416 -39.1801,39.0416 -21.6389,0 -39.1802,-17.4793 -39.1802,-39.0416 z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;"
          />
          <path
                  id="Polygon"
                  d="M 142.1465,109.115 57.9748,109.4885 99.7361,36.6649 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon2"
                  d="M 99.4614,117.3515 76.6629,159.2463 28.9322,160.0194 4,118.8976 26.7985,77.0029 74.5293,76.2298 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon3"
                  d="M 180.7595,173.2665 142.96,147.6929 106.5013,176 l 13.0985,-44.1115 -37.7957,-25.5709 45.8282,-1.4802 12.8966,-43.4318 15.2927,42.5213 45.3961,-1.4662 -35.8991,27.8726 z"
                  style="opacity:1;fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
      </g>
  </svg></SVGImageButton></div>`
})

export const CorrectBox = () => ({
  components: { SVGImageButton },
  props: {
    identifier: 'default',
    selected: false,
    comparison: 'default',
    showCorrect: true
  },
  template: `<div style="height:30%; width:30%"><SVGImageButton :identifier="'default'" :selected="false" :comparison="'default'" :showCorrect="true"><svg
          id="difference-shape"
          xmlns="http://www.w3.org/2000/svg"
          y="0px"
          x="0px"
          viewBox="0 0 225 180"
          width="100%"
          height="100%"
          filter="drop-shadow(0 0 7px gray)"
  >
      <g id="g4880">
          <rect
                  id="rect4038"
                  x="5.0159001"
                  y="14.5144"
                  width="76.853401"
                  height="76.581398"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <rect
                  id="rect4040"
                  x="110.5"
                  y="1"
                  width="108.5051"
                  height="108.1161"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;box-shadow: 0 0 2px gray;"
          />
          <path
                  id="Ellipse"
                  d="M 63.7862,40.0415 C 63.7862,18.4792 81.3275,1 102.9664,1 c 21.6389,0 39.1801,17.4792 39.1801,39.0415 0,21.5623 -17.5412,39.0416 -39.1801,39.0416 -21.6389,0 -39.1802,-17.4793 -39.1802,-39.0416 z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3;"
          />
          <path
                  id="Polygon"
                  d="M 142.1465,109.115 57.9748,109.4885 99.7361,36.6649 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon2"
                  d="M 99.4614,117.3515 76.6629,159.2463 28.9322,160.0194 4,118.8976 26.7985,77.0029 74.5293,76.2298 Z"
                  style="fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
          <path
                  id="Polygon3"
                  d="M 180.7595,173.2665 142.96,147.6929 106.5013,176 l 13.0985,-44.1115 -37.7957,-25.5709 45.8282,-1.4802 12.8966,-43.4318 15.2927,42.5213 45.3961,-1.4662 -35.8991,27.8726 z"
                  style="opacity:1;fill:#F4EBD9;fill-opacity:1;stroke:#000000;stroke-width:3"
          />
      </g>
  </svg></SVGImageButton></div>`
})

// Story Level Decorators and Parameters (though withKnobs still seems to end up component wide)

DefaultBox.story = {
  name: 'Default Wrapper',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: `Possible to have story specific description/notes here. Neat.`
    }
  }
}

SelectedButton.story = {
  name: 'Selected Button',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: `Default Selected without Correct/Incorrect.`
    }
  }
}

IncorrectSelection.story = {
  name: 'Incorrect Selection',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: `The Selected image is an Incorrect answer`
    }
  }
}

CorrectSelection.story = {
  name: 'Correct Selection',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: `The Selected image is the Correct answer.`
    }
  }
}

CorrectBox.story = {
  name: 'Not Selected Correct',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: `A different image was selected, but this image is the correct choice.`
    }
  }
}
