import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table, InputGroup, Input, Button, InputGroupAddon } from 'reactstrap'
import { withTracker } from 'meteor/react-meteor-data'
import {
  defaults,
  forEach,
  get,
  isArray,
  isDate,
  isFunction,
  isString,
  last,
  merge,
  size,
  upperFirst
} from 'lodash'

import Pagination from './Pagination'

import './layout.css'

const xColConvert = xcols =>
  (xcols || []).map(xcol => {
    return defaults(xcol, { name: '', label: '', value: () => '', fields: [] })
  })

const AdminList = props => {
  const {
    loading,
    data,
    sort,
    fields,
    fieldsCompact,
    titles,
    changeQuery,
    changeSort,
    remove,
    extraColumns
  } = props
  const columns = xColConvert(extraColumns)
  const columnCount =
    size(fields) + size(extraColumns) + (props.edit ? 1 : 0) + (remove ? 1 : 0)
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
  const edit = props.edit
    ? defaults(props.edit, { action: () => null, link: false })
    : props.edit
  const compactClass = match => {
    if (!fieldsCompact) return ''
    const index = fieldsCompact.indexOf(match)
    return index >= 0
      ? `order-${index} adminlist-compact`
      : 'd-none d-sm-table-cell adminlist-expand'
  }
  return (
    <div
      className={`adminlist table-responsive-md${
        fieldsCompact && fieldsCompact.length
          ? ' adminlist-compact'
          : ' adminlist-expand'
      }`}
    >
      <Table hover>
        <thead>
          <tr className={'adminlist-labels'}>
            {fields.map((field, i) => (
              <th key={i} className={compactClass(field)}>
                <div className={'adminlist-th'}>
                  {titles ? titles[i] : upperFirst(last(field.split('.')))}{' '}
                  <Button
                    onClick={() => changeSort(field)}
                    outline
                    size='sm'
                    className={'float-right'}
                  >
                    <FontAwesomeIcon icon={sortIcon(field)} />
                  </Button>
                </div>
              </th>
            ))}
            {columns
              ? columns.map((column, i) => (
                <th key={`${i}-column`} className={compactClass(column.name)}>
                  {column.label}
                </th>
              ))
              : null}
            {edit ? <th /> : null}
            {remove ? <th /> : null}
          </tr>
          <tr className={'adminlist-filters'}>
            {fields.map((field, i) => {
              return (
                <td key={`search-${field}`} className={compactClass(field)}>
                  <InputGroup size={'sm'} style={{ flexWrap: 'nowrap' }}>
                    <Input
                      onKeyUp={e => changeQuery(field, e.target.value)}
                      placeholder={
                        titles
                          ? titles[i] && isString(titles[i])
                            ? titles[i] || field
                            : field
                          : field
                      }
                    />
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
                  <td
                    key={`${i}-column-search`}
                    className={compactClass(column.name)}
                  >
                    <InputGroup size={'sm'} style={{ flexWrap: 'nowrap' }}>
                      {typeof column.search === 'function' ? (
                        <Input
                          onKeyUp={e =>
                            column.search({
                              value: e.target.value,
                              changeQuery
                            })
                          }
                          placeholder={column.label || column.name}
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
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount}>
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
                      <td
                        key={`${item._id}-${field}`}
                        className={
                          compactClass(field) +
                          (typeof value === 'boolean'
                            ? `text-${value ? 'success' : 'danger'}`
                            : '')
                        }
                      >
                        {typeof value === 'boolean' ? (
                          value ? (
                            <FontAwesomeIcon icon='check' />
                          ) : (
                            <FontAwesomeIcon icon='times' />
                          )
                        ) : isDate(value) ? (
                          value.toDateString()
                        ) : isArray(value) ? (
                          value.join(', ')
                        ) : (
                          value
                        )}
                      </td>
                    )
                  })}
                  {columns
                    ? columns.map((column, i) => (
                      <td
                        key={`${i}c-${item._id}`}
                        className={compactClass(column.name)}
                      >
                        {column.value(item)}
                      </td>
                    ))
                    : null}
                  {edit ? (
                    <td className='adminlist-action edit'>
                      {edit.link ? (
                        <NavLink
                          to={edit.action(item)}
                          className={'btn btn-outline-dark btn-sm'}
                        >
                          <FontAwesomeIcon icon={'edit'} />
                        </NavLink>
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
                    <td className='adminlist-action remove'>
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
    const query = { _id: { $in: ids || [] } }
    const handle = Meteor.subscribe(subscription, query, { fields: fieldObj })
    const loading = !handle.ready()
    const data = collection.find(query, { sort }).fetch()
    return { loading, data }
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
      if (r) {
        this.setState({ total: r }, () =>
          this.props.onStateChange
            ? this.props.onStateChange(this.state)
            : null
        )
      }
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
  removeItem = item => {
    this.props.remove(item)
    this.getIds()
  }
  componentDidMount () {
    this.getIds()
    window.addEventListener('popstate', this.getIds)
  }
  componentWillUnmount () {
    window.removeEventListener('popstate', this.getIds)
  }
  render () {
    return (
      <ListData
        {...this.props}
        {...this.state}
        remove={this.props.remove ? this.removeItem : false}
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
  defaultQuery: PropTypes.object,
  onStateChange: PropTypes.func
}

export default ListContainer
