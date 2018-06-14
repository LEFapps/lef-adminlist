# Admin list

## Usage

Use the `<List />` component to create a list of data with filter and pagination functions.

```JSX
import List from "meteor/lef:adminlist"

import Collection from "./somewhere"

const fields = ["name", "email"]

const remove = doc => Meteor.call("removeDoc", doc._id)

const editModule = doc => {
  this.props.history.push(`${this.props.match.url}/edit/${doc._id}`);
};

<List collection={Collection} subscription="subscription" fields={fields} getTotalCall="totalDocs" remove={remove} edit={edit} />
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

## Todo

- Add sorting methods
