# Admin list

## Usage

Use the `<List />` component to create a list of data with filter, pagination and sorting functions.

```JSX
import List from 'meteor/lef:adminlist'
import Collection from './somewhere'

const fields = ['name', 'emails.0.address']
const titles = ['naam', 'emailadres']
const remove = doc => Meteor.call('removeDoc', doc._id)

// edit link (recommended)
const edit = {
  action: doc => `${this.props.match.url}/edit/${doc._id}`,
  link: true
}
// or create a custom action (e.g. popup, do not us this for routing – UX)
const edit = {
  action: doc => this.props.history.push(`${this.props.match.url}/edit/${doc._id}`),
  link: false
}

const extraColumns = [
  {
    value: ({ firstname, lastname }) => firstname + ' ' + lastname,
    label: 'Full Name', // title of custom column
    fields: ['firstname','lastname'] // list of fields needed for this column
  },
  {
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

const stateHasChanged = ({ page, total, sort, ...childState }) => this.setState({ showList: !!total })

<List
  collection={Collection}
  getIdsCall='getIds'
  // or: getIdsCall={{call:'methodName',arguments:'methodArguments'}}
  subscription='subscription'
  fields={fields}
  getTotalCall='totalDocs'
  // or: getTotalCall={{call:'methodName',arguments:'methodArguments'}}
  defaultQuery={{ type: 'only_show_this_type' }}
  remove={remove}
  edit={edit}
  extraColumns={extraColumns}
  onStateChange={stateHasChanged}
/>
```

## Server side

### Getting the id's

```JS
Meteor.methods({
  getIds: (query, params) => {
    return Collection.find(query, params).map(({ _id }) => _id)
  }
})
```

### Publish function

The publish function server side should look like this.

```JS
Meteor.publish("subscription", (query, params = {}) => {
  return Collection.find(query, params);
});
```

### Meteor method

Provide a Meteor method to get a total document count.

```JS
Meteor.methods({
  totalDocs: (query) => {
    return Modules.find(query).count();
  }
});
```

### onStateChange

This function is called only
1. when the state of the list has changed (query, sorting, …)
2. when the total amount of visible items is known (getTotalCall has got a result)

This function receives the latest state of the list `({ page, total, sort, query, ids, ...childState })`.

**Example usage:**
* use the property total to show/hide the list and adjacent components (set state of parent component)
* show the total amount outside the list `<h1>Users ({total})</h1>`
