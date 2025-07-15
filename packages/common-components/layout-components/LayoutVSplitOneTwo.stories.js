import LayoutVSplitOneTwo from 'Components/layout-components/LayoutVSplitOneTwo'

export default {
  title: './Layouts/Vertical 1:2',
  component: LayoutVSplitOneTwo,
  decorators: [],
  parameters: {
    componentSubtitle: `Layout with 1/3 Vertical area at top, 2/3 at bottom`
  }
}

export const DefaultLayout = () => ({
  components: { LayoutVSplitOneTwo },
  template: `    
      <LayoutVSplitOneTwo>
          <template v-slot:topContent><div class="border-blue-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
          <template v-slot:bottomContent><div class="border-orange-500 border-8 h-full w-full flex"><div class="flex-1 h-full"></div></div></template>
      </LayoutVSplitOneTwo>
  `
})

DefaultLayout.story = {
  name: 'Layout Vertical Split 1:2',
  decorators: [],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
