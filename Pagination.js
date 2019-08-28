import React from 'react'
import {
  Pagination as PaginationStyle,
  PaginationItem,
  PaginationLink
} from 'reactstrap'
import PropTypes from 'prop-types'

const range = 5

const Pagination = ({ limit = 20, total, page, setPage }) => {
  if (!total) return null
  if (total >= 0 && total <= limit) return null
  else {
    const numberOfPages = Math.ceil(total / limit)
    let startRange = Math.ceil(page / range) * range - (range - 1)
    const startPage = startRange
    if (startRange < 1) startPage = 1
    let endRange = startRange + range - 1
    if (endRange > numberOfPages) endRange = numberOfPages
    const pagesArr = [...Array(endRange - startRange + 1).keys()].map(
      x => startPage + x
    )
    return (
      <PaginationStyle className='justify-content-center'>
        {/* Previous 1 */}
        {page > 1 ? (
          <PaginationItem>
            <PaginationLink
              previous
              href='#'
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
        ) : null}
        {/* First page */}
        {page > range ? (
          <PaginationItem>
            <PaginationLink href='#' onClick={() => setPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Previous 10 */}
        {page > range ? (
          <PaginationItem>
            <PaginationLink
              href='#'
              onClick={() => setPage(startRange - range)}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Visible pages */}
        {pagesArr.map(p => {
          return (
            <PaginationItem active={page == p} key={`page-${p}`}>
              <PaginationLink href='#' onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        {/* Next 10 */}
        {endRange < numberOfPages ? (
          <PaginationItem>
            <PaginationLink href='#' onClick={() => setPage(endRange + 1)}>
              ...
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Last page */}
        {endRange < numberOfPages ? (
          <PaginationItem>
            <PaginationLink href='#' onClick={() => setPage(numberOfPages)}>
              {numberOfPages}
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Next 1 */}
        {page < numberOfPages ? (
          <PaginationItem>
            <PaginationLink next href='#' onClick={() => setPage(page + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationStyle>
    )
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired
}

export default Pagination
