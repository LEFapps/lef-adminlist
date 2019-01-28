Package.describe({
  summary: 'Display and sort data in admin list view',
  version: '2.1.5',
  name: 'lef:adminlist',
  git: 'https://github.com/LEFapps/lef-adminlist'
})

Package.onUse(api => {
  api.use(['ecmascript'])
  api.mainModule('List.js', 'client')
})

Npm.depends({
  react: '16.5.0',
  reactstrap: '6.5.0',
  'prop-types': '15.6.2',
  '@fortawesome/fontawesome': '1.1.8',
  '@fortawesome/fontawesome-svg-core': '1.2.0',
  '@fortawesome/free-solid-svg-icons': '5.2.0',
  '@fortawesome/react-fontawesome': '0.1.0'
})
