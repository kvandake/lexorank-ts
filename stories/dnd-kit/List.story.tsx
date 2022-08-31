// YourComponent.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import List from './List';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Dnd Kit',
  component: List,
} as ComponentMeta<typeof List>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const DndKitListStory = Template.bind({});

DndKitListStory.storyName = 'Vertical List'
DndKitListStory.args = {
  /*👇 The args you need here will depend on your component */
};