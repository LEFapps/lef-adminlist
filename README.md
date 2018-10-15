# Admin list

## Usage

Use the `<List />` component to create a list of data with filter, pagination and sorting functions.

```JSX
import List from "meteor/lef:adminlist"

import Collection from "./somewhere"

const fields = ["name", "emails.0.address"]

const titles = ["naam", "emailadres"]

const remove = doc => Meteor.call("removeDoc", doc._id)

const edit = doc => {
  this.props.history.push(`${this.props.match.url}/edit/${doc._id}`);
};

const extraColumns = [
  [
    ({ firstname, lastname }) => firstname + ' ' + lastname,
    "Full Name", // title of custom column
    ['firstname','lastname'] // list of fields needed for this column
  ],
  [
    doc => Math.round(doc.percentage * 100),
    "Score",
    ['percentage']
  ],
]

<List
  collection={Collection}
  subscription="subscription"
  fields={fields}
  getTotalCall="totalDocs"
  remove={remove}
  edit={edit}
  extraColumns={extraColumns}
/>
```

## Server side

### Publish function

The publish function server side should look like this.

```JSX
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
