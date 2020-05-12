Package.describe({
  summary: 'Display and sort data in admin list view',
  version: '3.1.3',
  name: 'lef:adminlist',
  git: 'https://github.com/LEFapps/lef-adminlist'
})

Package.onUse(api => {
  api.use(['ecmascript'])
  api.mainModule('List.js', 'client')
})

Npm.depends({
  '@fortawesome/react-fontawesome': '0.1.0',
  'prop-types': '15.6.2'
})
