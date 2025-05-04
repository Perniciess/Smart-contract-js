import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  stylistic: {
    indent: 'tab', // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  formatters: {
    css: true,
    html: true
  }
})