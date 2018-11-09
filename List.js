import React from 'react'
import PropTypes from 'prop-types'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faSpinner,
  faTimes,
  faEdit,
  faSort,
  faSortAlphaUp,
  faSortAlphaDown,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import { Table, InputGroup, Input, Button, InputGroupAddon } from 'reactstrap'
import { withTracker } from 'meteor/react-meteor-data'
import { get, last, upperFirst, forEach } from 'lodash'

import Pagination from './Pagination'

fontawesome.library.add(
  faSearch,
  faSpinner,
  faTimes,
  faEdit,
  faSort,
  faSortAlphaUp,
  faSortAlphaDown,
  faCheck
)

const AdminList = props => {
  const {
    loading,
    data,
    sort,
    fields,
    titles,
    changeQuery,
    changeSort,
    edit,
    remove,
    extraColumns
  } = props
  const sortIcon = field => {
    switch (sort[field]) {
      case -1:
        return 'sort-alpha-up'
      case 1:
        return 'sort-alpha-down'
      default:
        return 'sort'
    }
  }
  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            {fields.map((field, i) => {
              return (
                <th key={i}>
                  <>
                    {titles ? titles[i] : upperFirst(last(field.split('.')))}
                    {' '}
                    <Button onClick={() => changeSort(field)} outline size='sm'>
                      <FontAwesomeIcon icon={sortIcon(field)} />
                    </Button>
                  </>
                </th>
              )
            })}
            {extraColumns
              ? extraColumns.map((column, i) => <th key={`${i}-column`}>{column[1]}</th>)
              : null}
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
                    <InputGroupAddon addonType='append'>
                      <Button>
                        <FontAwesomeIcon icon={'search'} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </td>
              )
            })}
            {extraColumns
              ? extraColumns.map((column, i) => (
                <td key={`${i}-column-search`} />
              ))
              : null}
            {edit ? <td /> : null}
            {remove ? <td /> : null}
          </tr>
          {loading
            ? <tr>
              <td>
                <FontAwesomeIcon
                  icon={'spinner'}
                  className='faa-spin animated'
                  />
              </td>
            </tr>
            : data.map(item => {
              return (
                <tr key={item._id}>
                  {fields.map(field => {
                    const value = get(item, field, '')
                    return (
                      <td key={`${item._id}-${field}`}>
                        {typeof value === 'boolean'
                            ? value
                                ? <FontAwesomeIcon icon='check' />
                                : <FontAwesomeIcon icon='times' />
                            : value}
                      </td>
                    )
                  })}
                  {extraColumns
                      ? extraColumns.map((column, i) => <td key={`${i}c-${item._id}`}>{column[0](item)}</td>)
                      : null}
                  {edit
                      ? <td>
                        <Button
                          onClick={() => edit(item)}
                          outline
                          size='sm'
                          color='dark'
                          >
                          <FontAwesomeIcon icon={'edit'} />
                        </Button>
                      </td>
                      : null}
                  {remove
                      ? <td>
                        <Button
                          onClick={() => remove(item)}
                          outline
                          size='sm'
                          color='danger'
                          >
                          <FontAwesomeIcon icon={'times'} />
                        </Button>
                      </td>
                      : null}
                </tr>
              )
            })}
        </tbody>
      </Table>
      <Pagination {...props} />
    </div>
  )
}

AdminList.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  titels: PropTypes.array,
  query: PropTypes.object.isRequired,
  changeQuery: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
}

const ListData = withTracker(
  ({ collection, subscription, page, defaultQuery = {}, query, sort, fields, extraColumns }) => {
    const fieldObj = {}
    fields.map(field => (fieldObj[field] = 1))
    if (extraColumns) (extraColumns || []).map(col => ((col[2] || []).map(f => fieldObj[f] = 1)))
    const params = {
      sort,
      limit: 20,
      skip: (page - 1) * 20,
      fields: fieldObj
    }
    forEach(defaultQuery, (v, k) => {
      if (!!v) { query[k] = v }
    })
    const handle = Meteor.subscribe(subscription, query, params)
    return {
      loading: !handle.ready(),
      data: collection.find(query, { sort }).fetch()
    }
  }
)(AdminList)

let searchTimer

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      total: 0,
      query: {},
      sort: {},
      refreshQuery: false
    }
  }
  setPage = n => {
    this.setState({ page: n })
  }
  changeQuery = (key, value) => {
    Meteor.clearTimeout(searchTimer)
    searchTimer = Meteor.setTimeout(() => {
      const { query } = this.state
      query[key] = value
      if (value == '') delete query[key]
      this.setState({ query })
      this.setState({ refreshQuery: !this.state.refreshQuery })
    }, 500)
  }
  changeSort = key => {
    const sort = {}
    if (this.state.sort[key]) {
      sort[key] = this.state.sort[key] * -1
    } else {
      sort[key] = 1
    }
    this.setState({ sort })
    this.setState({ refreshQuery: !this.state.refreshQuery })
  }
  componentDidMount () {
    Meteor.call(this.props.getTotalCall, this.state.query, (e, r) =>
      this.setState({ total: r })
    )
  }
  render () {
    return (
      <ListData
        {...this.state}
        {...this.props}
        setPage={this.setPage}
        changeQuery={this.changeQuery}
        changeSort={this.changeSort}
      />
    )
  }
}

ListContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  subscription: PropTypes.string.isRequired,
  getTotalCall: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  edit: PropTypes.func,
  remove: PropTypes.func,
  extraColumns: PropTypes.array,
  defaultQuery: PropTypes.object
}

export default ListContainer
