import LayoutVSplitTwoOne from 'Components/layout-components/LayoutVSplitTwoOne.stories'

export default {
  title: './Layouts/Vertical 2:1',
  component: LayoutVSplitTwoOne,
  decorators: [],
  parameters: {
    componentSubtitle: `Layout with 2/3 Vertical area at top, 1/3 at bottom`
  }
}

export const DefaultLayout = () => ({
  components: { LayoutVSplitTwoOne },
  template: `    
      <LayoutVSplitTwoOne>
          <template v-slot:topContent><div class="border-blue-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
          <template v-slot:bottomContent><div class="border-orange-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
      </LayoutVSplitTwoOne>
  `
})

DefaultLayout.story = {
  name: 'Layout Vertical Split 2:1',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
