Package.describe({
  summary: 'Display and sort data in admin list view',
  version: '3.0.0',
  name: 'lef:adminlist',
  git: 'https://github.com/LEFapps/lef-adminlist'
})

Package.onUse(api => {
  api.use(['ecmascript'])
  api.mainModule('List.js', 'client')
})

Npm.depends({
  'prop-types': '15.6.2'
})
