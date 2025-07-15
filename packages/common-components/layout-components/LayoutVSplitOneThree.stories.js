import LayoutVSplitOneThree from 'Components/layout-components/LayoutVSplitOneThree'

export default {
  title: './Layouts/Vertical 1:3',
  component: LayoutVSplitOneThree,
  decorators: [],
  parameters: {
    componentSubtitle: `Layout with 1/4 Vertical area at top, 3/4 at bottom`
  }
}

export const DefaultLayout = () => ({
  components: { LayoutVSplitOneThree },
  template: `    
      <LayoutVSplitOneThree>
          <template v-slot:topContent><div class="border-blue-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
          <template v-slot:bottomContent><div class="border-orange-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
      </LayoutVSplitOneThree>
  `
})

DefaultLayout.story = {
  name: 'Layout Vertical "OneThreeSplit"',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
