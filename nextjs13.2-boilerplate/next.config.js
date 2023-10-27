/* eslint-disable @typescript-eslint/no-var-requires */

// TODO: enable PWA
// const withPWA = require('next-pwa')
// const cacheConfig = require('./modules/cache')

// TODO: fetch env from config server
// const cp = require('child_process')
// const fs = require('fs')
// let scr = 'node'
// if (process.env.ENV === 'local') {
//   // window env
//   if (process.platform === 'win32') {
//     scr = '%NVM_HOME%/v%npm_package_engines_node%/node'
//   } else {
//     scr = '$NVM_DIR/versions/node/v$npm_package_engines_node/bin/node'
//   }
// }
//
// cp.execSync(`${scr} ./modules/config.js`)
// const jsYaml = require('js-yaml')
// const env = jsYaml.load(fs.readFileSync('.env.yaml'))
const env = {}


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = withBundleAnalyzer({
  serverRuntimeConfig: {
    ...env,
  },
  // assetPrefix: '/ja',
  // basePath:'/ja',
  publicRuntimeConfig: {
  },
  reactStrictMode: true,
  // https://nextjs.org/docs/api-reference/next/image#loader-configuration
  images: {
    deviceSizes: [768, 1024], // 768: md, 1024: lg
    path: '/img/assets',
  },
  rewrites() {
    return [
      {
        source: '/img/assets/:path*',
        destination: '/_next/image/:path*',
      },
    ]
  },
  // Add cache headers to static resources
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          }
        ]
      }
    ]
  },
  experimental: {
    scrollRestoration: false,
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },

    // TODO: HUYNH optimize this to has less bundle size on dev environment.
    // "@mui/material": {
    //   // if member is useTheme or useMediaQuery, transform to @mui/material/styles
    //   transform: (member) => {
    //     if (member === 'useTheme') {
    //       return '@mui/material/styles/{{member}}'
    //     }
    //     return "@mui/material/{{member}}"
    //   }
    // },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // pwa: {
  //   dest: 'public/static/pwa/js',
  //   register: true,
  //   skipWaiting: true,
  //   disable: true,
  //   dynamicStartUrl: false,
  //   cacheStartUrl: false,
  //   // cacheOnFrontEndNav: true,
  //   runtimeCaching: cacheConfig,
  //   publicExcludes: ['!images/splash_screens/*']
  // },
})
