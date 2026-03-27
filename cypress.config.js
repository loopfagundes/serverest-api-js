const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      allureWriter(on, config)
      return config
    },
  },
  env: {
    token: '',
    allure: true,
  },
  screenshotOnRunFailure: true,
  reporter: 'spec',
  video: false,
})