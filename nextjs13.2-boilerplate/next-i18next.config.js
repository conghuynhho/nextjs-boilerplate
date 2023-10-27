module.exports = {
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
    localeDetection: false,
  },
  defaultNS: 'common@default',
  localePath: './lang',
  reloadOnPrerender: !['production', 'staging'].includes(process.env.ENV),
}
