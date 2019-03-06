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

/**
 * Make sure following npm packages are available
 *
 * react: '16.5.0'
 * reactstrap: '6.5.0'
 * @fortawesome/react-fontawesome: '0.1.0'
 * @fortawesome/fontawesome: '1.1.8'
 * @fortawesome/fontawesome-svg-core: '1.2.0'
 * @fortawesome/free-solid-svg-icons: '5.2.0'
 *
 *
 * Add following icons to your fontawesome library:
 *
 * faCheck, faEdit, faSearch, faSort, faSortAlphaDown, faSortAlphaUp, faSpinner, faTimes
 */
