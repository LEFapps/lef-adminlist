Package.describe({
  summary: 'Display and sort data in admin list view',
  version: '1.1.3',
  name: 'lef:adminlist',
  git: 'https://github.com/LEFapps/lef-adminlist'
})

Package.onUse(api => {
  api.use(['ecmascript'])
  api.mainModule('List.js', 'client')
})

Npm.depends({
  react: '16.5.0',
  reactstrap: '6.4.0',
  'prop-types': '15.6.1'
})
