/* eslint-disable @typescript-eslint/no-var-requires */
try {
  const i18n = require('../lib/build-i18n')
  const configs = require('../i18n.config')
  i18n(configs)
} catch(e) {
  console.log('Error: ', e)
  process.exit(1)
}