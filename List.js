import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, InputGroup, Input, Button, InputGroupAddon } from "reactstrap";
import { withTracker } from "meteor/react-meteor-data";
import { get, last, upperFirst } from "lodash";

import Pagination from "./Pagination";

const AdminList = props => {
  const { loading, data, fields, changeQuery, edit, remove } = props;
  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            {fields.map((field, i) => {
              return <th key={i}>{upperFirst(last(field.split(".")))}</th>;
            })}
            {edit ? <th /> : null}
            {remove ? <th /> : null}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fields.map(field => {
              return (
                <td key={`search-${field}`}>
                  <InputGroup>
                    <Input onChange={e => changeQuery(field, e.target.value)} />
                    <InputGroupAddon addonType="append">
                      <Button>
                        <FontAwesomeIcon icon={"search"} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </td>
              );
            })}
            {edit ? <td /> : null}
            {remove ? <td /> : null}
          </tr>
          {loading ? (
            <tr>
              <td>
                <FontAwesomeIcon
                  icon={"spinner"}
                  className="faa-spin animated"
                />
              </td>
            </tr>
          ) : (
            data.map(item => {
              return (
                <tr key={item._id}>
                  {fields.map(field => {
                    return (
                      <td key={`${item._id}-${field}`}>
                        {get(item, field, "")}
                      </td>
                    );
                  })}
                  {edit ? (
                    <td>
                      <Button
                        onClick={() => edit(item)}
                        outline
                        size="sm"
                        color="dark"
                      >
                        <FontAwesomeIcon icon={"edit"} />
                      </Button>
                    </td>
                  ) : null}
                  {remove ? (
                    <td>
                      <Button
                        onClick={() => remove(item)}
                        outline
                        size="sm"
                        color="danger"
                      >
                        <FontAwesomeIcon icon={"times"} />
                      </Button>
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
      <Pagination {...props} />
    </div>
  );
};

AdminList.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  changeQuery: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
};

const ListData = withTracker(
  ({ collection, subscription, page, query, fields }) => {
    const fieldObj = {};
    fields.map(field => (fieldObj[field] = 1));
    const params = {
      sort: {},
      limit: 20,
      skip: (page - 1) * 20,
      fields: fieldObj
    };
    const handle = Meteor.subscribe(subscription, query, params);
    return {
      loading: !handle.ready(),
      data: collection.find(query).fetch()
    };
  }
)(AdminList);

let searchTimer = undefined;

class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      total: 0,
      query: {},
      refreshQuery: false
    };
  }
  setPage = n => {
    this.setState({ page: n });
  };
  changeQuery = (key, value) => {
    Meteor.clearTimeout(searchTimer);
    searchTimer = Meteor.setTimeout(() => {
      const { query } = this.state;
      query[key] = value;
      if (value == "") delete query[key];
      this.setState({ query });
      this.setState({ refreshQuery: !this.state.refreshQuery });
    }, 500);
  };
  componentDidMount() {
    Meteor.call(this.props.getTotalCall, this.state.query, (e, r) =>
      this.setState({ total: r })
    );
  }
  render() {
    return (
      <ListData
        {...this.state}
        {...this.props}
        setPage={this.setPage}
        changeQuery={this.changeQuery}
      />
    );
  }
}

ListContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  subscription: PropTypes.string.isRequired,
  getTotalCall: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  edit: PropTypes.func,
  remove: PropTypes.func
};

export default ListContainer;
