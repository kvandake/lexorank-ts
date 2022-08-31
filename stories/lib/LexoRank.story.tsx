// LexoRank.story.ts|tsx

import React from 'react';

import {ComponentStory, ComponentMeta} from '@storybook/react';

import LexoRank from './LexoRank';
import {ELexoRankVariant} from "./LexoRank.types";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'LexoRank',
  component: LexoRank,
  args: {
    variant: ELexoRankVariant.Middle
  },
  argTypes: {
    variant: {
      options: [ELexoRankVariant.Min, ELexoRankVariant.Middle, ELexoRankVariant.Max],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof LexoRank>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof LexoRank> = (args) => <LexoRank {...args} />;

export const Default = Template.bind({});

Default.args = {
  variant: ELexoRankVariant.Middle
};