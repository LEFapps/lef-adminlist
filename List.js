import React from 'react'
import { Link } from 'react-router-dom'
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
import {
  get,
  merge,
  last,
  upperFirst,
  forEach,
  isArray,
  isString,
  isFunction,
  defaults
} from 'lodash'

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

const xColConvert = xcols =>
  (xcols || []).map(xcol => {
    if (isArray(xcol)) {
      console.warn(
        '[Deprecated] Adminlist: ExtraColumns: column definition should be an object. \nDefinitons as array can lead to unexpected behaviour in future versions. See documentation for more information.'
      )
      return {
        value: xcol[0],
        label: xcol[1] || '',
        fields: xcol[2] || [],
        search: xcol[3]
      }
    } else return defaults(xcol, { value: () => '', label: '', fields: [] })
  })

const AdminList = props => {
  const {
    loading,
    data,
    sort,
    fields,
    titles,
    changeQuery,
    changeSort,
    remove,
    extraColumns
  } = props
  const columns = xColConvert(extraColumns)
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
  if (isFunction(props.edit)) {
    console.warn(
      '[Deprecated] Adminlist: edit: column definition should be an object. \nDefinitons as function can lead to unexpected behaviour in future versions. See documentation for more information.'
    )
  }
  const edit = isFunction(props.edit)
    ? { action: props.edit, link: false }
    : props.edit
  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            {fields.map((field, i) => {
              return (
                <th key={i}>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {titles ? titles[i] : upperFirst(last(field.split('.')))}{' '}
                    <Button
                      onClick={() => changeSort(field)}
                      outline
                      size='sm'
                      className={'float-right'}
                    >
                      <FontAwesomeIcon icon={sortIcon(field)} />
                    </Button>
                  </span>
                </th>
              )
            })}
            {columns
              ? columns.map((column, i) => (
                <th key={`${i}-column`}>{column.label}</th>
              ))
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
                  <InputGroup size={'sm'} style={{ flexWrap: 'nowrap' }}>
                    <Input onKeyUp={e => changeQuery(field, e.target.value)} />
                    <InputGroupAddon addonType='append'>
                      <Button>
                        <FontAwesomeIcon icon={'search'} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </td>
              )
            })}
            {columns
              ? columns.map((column, i) =>
                column.search ? (
                  <td key={`${i}-column-search`}>
                    <InputGroup size={'sm'} style={{ flexWrap: 'nowrap' }}>
                      {typeof column.search === 'function' ? (
                        <Input
                          onKeyUp={e =>
                            column.search({
                              value: e.target.value,
                              changeQuery
                            })
                          }
                        />
                      ) : (
                        <Input
                          onKeyUp={e =>
                            changeQuery(
                              column.search.fields,
                              column.search.value(e.target.value)
                            )
                          }
                        />
                      )}

                      <InputGroupAddon addonType='append'>
                        <Button>
                          <FontAwesomeIcon icon={'search'} />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </td>
                ) : (
                  <td key={`${i}-column-search`} />
                )
              )
              : null}
            {edit ? <td /> : null}
            {remove ? <td /> : null}
          </tr>
          {loading ? (
            <tr>
              <td>
                <FontAwesomeIcon
                  icon={'spinner'}
                  className='faa-spin animated'
                />
              </td>
            </tr>
          ) : (
            data.map(item => {
              return (
                <tr key={item._id}>
                  {fields.map(field => {
                    const value = get(item, field, '')
                    return (
                      <td key={`${item._id}-${field}`}>
                        {typeof value === 'boolean' ? (
                          value ? (
                            <FontAwesomeIcon icon='check' />
                          ) : (
                            <FontAwesomeIcon icon='times' />
                          )
                        ) : (
                          value
                        )}
                      </td>
                    )
                  })}
                  {columns
                    ? columns.map((column, i) => (
                      <td key={`${i}c-${item._id}`}>{column.value(item)}</td>
                    ))
                    : null}
                  {edit ? (
                    <td>
                      {edit.link ? (
                        <Link
                          to={edit.action(item)}
                          className={'btn btn-outline-dark btn-sm'}
                        >
                          <FontAwesomeIcon icon={'edit'} />
                        </Link>
                      ) : (
                        <Button
                          onClick={() => edit.action(item)}
                          outline
                          size='sm'
                          color='dark'
                        >
                          <FontAwesomeIcon icon={'edit'} />
                        </Button>
                      )}
                    </td>
                  ) : null}
                  {remove ? (
                    <td>
                      <Button
                        onClick={() => remove(item)}
                        outline
                        size='sm'
                        color='danger'
                      >
                        <FontAwesomeIcon icon={'times'} />
                      </Button>
                    </td>
                  ) : null}
                </tr>
              )
            })
          )}
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
  ({ collection, subscription, sort, fields, extraColumns, ids }) => {
    const columns = xColConvert(extraColumns)
    const fieldObj = {}
    fields.map(field => (fieldObj[field] = 1))
    if (columns) {
      ;(columns || []).map(col => col.fields.map(f => (fieldObj[f] = 1)))
    }
    const handle = Meteor.subscribe(
      subscription,
      { _id: { $in: ids || [] } },
      { fields: fieldObj }
    )
    return {
      loading: !handle.ready(),
      data: collection.find({ _id: { $in: ids || [] } }, { sort }).fetch()
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
      ids: null,
      sort: {},
      refreshQuery: false
    }
  }
  getIds = () => {
    const { page, query, sort } = this.state
    const { defaultQuery = {} } = this.props
    const params = {
      sort,
      limit: 20,
      skip: (page - 1) * 20
    }
    forEach(defaultQuery, (v, k) => {
      if (v) {
        query[k] = v
      }
    })
    const call = isString(this.props.getIdsCall)
      ? this.props.getIdsCall
      : this.props.getIdsCall.call
    const arg = isString(this.props.getIdsCall)
      ? query
      : merge(query, this.props.getIdsCall.arguments)
    Meteor.call(call, arg, params, (e, r) => {
      if (r) this.setState({ ids: r })
    })
    this.getTotal()
  }
  getTotal = () => {
    const call = isString(this.props.getTotalCall)
      ? this.props.getTotalCall
      : this.props.getTotalCall.call
    const arg = isString(this.props.getTotalCall)
      ? this.state.query
      : merge(this.state.query, this.props.getTotalCall.arguments)
    Meteor.call(call, arg, (e, r) => {
      if (r) this.setState({ total: r })
    })
  }
  setPage = n => {
    this.setState({ page: n }, () => this.getIds())
  }
  setQuery = (key, value) => {
    const { query } = this.state
    if (key[0] == '$') query[key] = value
    else if (isArray(value)) query[key] = { $in: value }
    else query[key] = { $regex: value, $options: 'i' }
    if (!value) delete query[key]
    this.setState(
      prevState => ({
        page: 1,
        query,
        refreshQuery: !prevState.refreshQuery
      }),
      () => this.getIds()
    )
  }
  changeQuery = (keys, value) => {
    Meteor.clearTimeout(searchTimer)
    searchTimer = Meteor.setTimeout(() => {
      if (isArray(keys)) {
        if (isArray(value)) {
          this.setQuery(
            '$and',
            value.map(val => ({
              $or: keys.map(key => ({ [key]: { $regex: val, $options: 'i' } }))
            }))
          )
        } else if (value) {
          this.setQuery(
            '$or',
            keys.map(key => ({ [key]: { $regex: value, $options: 'i' } }))
          )
        } else this.setQuery('$or', false)
      } else this.setQuery(keys, value)
    }, 500)
  }
  changeSort = key => {
    const sort = {}
    if (this.state.sort[key]) {
      sort[key] = this.state.sort[key] * -1
    } else {
      sort[key] = 1
    }
    this.setState(
      prevState => ({
        page: 1,
        sort,
        refreshQuery: !prevState.refreshQuery
      }),
      () => this.getIds()
    )
  }
  componentDidMount () {
    this.getIds()
  }
  render () {
    return (
      <ListData
        {...this.props}
        {...this.state}
        setPage={this.setPage}
        changeQuery={this.changeQuery}
        changeSort={this.changeSort}
      />
    )
  }
}

ListContainer.propTypes = {
  collection: PropTypes.object.isRequired,
  subscription: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  getIdsCall: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  getTotalCall: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  edit: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  remove: PropTypes.func,
  extraColumns: PropTypes.array,
  defaultQuery: PropTypes.object
}

export default ListContainer
