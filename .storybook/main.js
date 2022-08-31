module.exports = {
  "stories": [
    "../stories/**/*.story.mdx",
    "../stories/**/*.story.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5",
  },
}