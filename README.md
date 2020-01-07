# Admin list

## Install

1. Add this repo as a git submodule in the `/packages` repository
1. `$ meteor add lef:adminlist`
1. Make sure the following icons are in your **fontawesome library**:
  `faCheck, faEdit, faSearch, faSort, faSortAlphaDown, faSortAlphaUp, faSpinner, faTimes`<br>
  (Using an [icons helper file*](#icons-helper-file) is recommended.)

## Usage

Use the `<List />` component to create a list of data with filter, pagination and sorting functions.

```JSX
import List from 'meteor/lef:adminlist'
import Collection from './somewhere'

// fields directly shown as columns
const fields = ['name', 'emails.0.address', 'imageField']
// subset of columns shown below sm (or folded panel in @lefapps/admin-dashboard)
const fieldsCompact = ['name', 'score']
const titles = ['Name', 'Email Address', 'Profile image']

// link (recommended)
const edit = {
  action: doc => `${this.props.match.url}/edit/${doc._id}`,
  type: 'link'
}
// component (listProps exposes default children (icon), className)
const edit = {
  action: ({°id, listProps }) => <Link to={_id} {...listProps} />,
  type: 'component'
}
// or create a custom action (e.g. popup, do not use this for routing – UX)
const edit = {
  action: doc => this.props.history.push(`${this.props.match.url}/edit/${doc._id}`)
}

// remove action (default)
// or use the same structure as edit
const remove = doc => Meteor.call('removeDoc', doc._id)

const extraColumns = [
  {
    name: 'fullname', // used to match compact
    value: ({ firstname, lastname }) => firstname + ' ' + lastname,
    label: 'Full Name', // title of custom column
    fields: ['firstname','lastname'] // list of fields needed for this column
  },
  {
    name: 'score',
    value: doc => Math.round(doc.percentage * 100),
    label: 'Score',
    fields: ['percentage'],
    search: { // search definition for custom columns
      fields: 'percentage', // field(s) on which to search (string or array)
      value: value => value / 100 // basically the reverse logic of value (value or array)
    },
    // OR search can be a function for async stuff:
    search: ({ value, changeQuery }) => {
      Meteor.call('percentageSearch', value, (e, r) => {
        changeQuery('percentage', r) // call should return an array
      })
    }
  },
]

// set prefix for displaying of images
// ! no trailing forward slash: '/'
const prefix = {
  imageField: 'https://s3-eu-west-1.amazonaws.com/your-bucket'
}

const stateHasChanged = ({ page, total, sort, ...childState }) => this.setState({ showList: !!total })

<List
  collection={Collection}
  getIdsCall='getIds'
  // or: getIdsCall={{call:'methodName',arguments:'methodArguments'}}
  subscription='subscription'
  fields={fields}
  fieldsCompact={fieldsCompact}
  getTotalCall='totalDocs'
  // or: getTotalCall={{call:'methodName',arguments:'methodArguments'}}
  defaultQuery={{ type: 'only_show_this_type' }}
  remove={remove}
  edit={edit}
  extraColumns={extraColumns}
  onStateChange={stateHasChanged}
  urlPrefix={prefix}
/>
```

## Server side

### Publish function

```JS
// inject your logic before returning (security, filtering deleted, …)
// this function is reusable for required methods
const getItems = (query = {}, params = {}) => Collection.find(query, params)

Meteor.publish("subscription", getItems)
```

### Getting the ids

Provide a Meteor method to get the ids for the current query.

```JS
Meteor.methods({ getIds: (query, params) => getItems(query, params).map(({ _id }) => _id) })
```


### Get the amount

Provide a Meteor method to get a total document count.

```JS
Meteor.methods({ getTotals: (query, params) => getItems(query, params).count() })
```

### onStateChange

This function is called only
1. when the state of the list has changed (query, sorting, …)
2. when the total amount of visible items is known (getTotalCall has got a result)

This function receives the latest state of the list `({ page, total, sort, query, ids, ...childState })`.

**Example usage:**
* use the property total to show/hide the list and adjacent components (set state of parent component)
* show the total amount outside the list `<h1>Users ({total})</h1>`

## Icons helper file

Import a file with this structure on startup:

```JS
import { library } from '@fortawesome/fontawesome-svg-core'
import { ...icons } from '@fortawesome/free-solid-svg-icons'

library.add(...icons)
```
