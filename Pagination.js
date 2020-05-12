import React from 'react'
import {
  Pagination as PaginationWrapper,
  PaginationItem,
  PaginationLink
} from 'reactstrap'
import PropTypes from 'prop-types'

const Pagination = ({ page, pages, setPage }) => {
  let hellip
  const pagesIt = []
  for (let i = 0; i < pages; i++) pagesIt.push(i)
  const group = 5 // odd number!!!
  const diff = Math.floor(group / 2) // amount before and after current page, based on group

  const mini = diff + 2
  const maxi = pages - diff - 3

  return (
    pages > 1 && (
      <PaginationWrapper>
        {page > 0 && (
          <PaginationItem key={-1}>
            <PaginationLink previous onClick={() => setPage(page - 1)} />
          </PaginationItem>
        )}
        {pagesIt.map(p => {
          if (p === page) {
            hellip = false
            return (
              <PaginationItem active key={p}>
                <PaginationLink>{p + 1}</PaginationLink>
              </PaginationItem>
            )
          } else if (
            p === 0 ||
            p === pages - 1 || // Always display first and last
            (p >= page - diff && p < page) ||
            (p <= page + diff && p > page) || // show "group" around current page
            (p === 1 && p <= mini && page <= mini) ||
            (p === pages - 2 && p >= maxi && page >= maxi) // no hellip when only one page is omitted
          ) {
            hellip = false
            return (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => setPage(p)}>
                  {p + 1}
                  {(hellip = false)}
                </PaginationLink>
              </PaginationItem>
            )
          } else {
            return hellip ? null : (
              <PaginationItem disabled key={p}>
                <PaginationLink>&hellip;{(hellip = true)}</PaginationLink>
              </PaginationItem>
            )
          }
        })}
        {page < pages - 1 && (
          <PaginationItem key={pages}>
            <PaginationLink next onClick={() => setPage(page + 1)} />
          </PaginationItem>
        )}
      </PaginationWrapper>
    )
  )
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired, // current page number, zero-based
  pages: PropTypes.number.isRequired, // amount of pages
  setPage: PropTypes.func.isRequired // method to set page
}

export default Pagination
