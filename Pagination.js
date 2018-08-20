import React from "react";
import {
  Pagination as PaginationStyle,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import PropTypes from "prop-types";

const Pagination = ({ total, page, setPage }) => {
  if (!total) return null;
  if (0 <= total && total <= 20) return null;
  else {
    const numberOfPages = Math.ceil(total / 20);
    let startRange = Math.ceil(page / 10) * 10 - 9;
    const startPage = startRange;
    if (startRange < 1) startPage = 1;
    let endRange = startRange + 9;
    if (endRange > numberOfPages) endRange = numberOfPages;
    const pagesArr = [...Array(endRange - startRange + 1).keys()].map(
      x => startPage + x
    );
    return (
      <PaginationStyle className="justify-content-center">
        {/* Previous 1 */}
        {page > 1 ? (
          <PaginationItem>
            <PaginationLink
              previous
              href="#"
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
        ) : null}
        {/* First page */}
        {page > 10 ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => setPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Previous 10 */}
        {page > 10 ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => setPage(startRange - 10)}>
              ...
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Visible pages */}
        {pagesArr.map(p => {
          return (
            <PaginationItem active={page == p ? true : false} key={`page-${p}`}>
              <PaginationLink href="#" onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* Next 10 */}
        {endRange < numberOfPages ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => setPage(endRange + 1)}>
              ...
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Last page */}
        {endRange < numberOfPages ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => setPage(numberOfPages)}>
              {numberOfPages}
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {/* Next 1 */}
        {page < numberOfPages ? (
          <PaginationItem>
            <PaginationLink next href="#" onClick={() => setPage(page + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationStyle>
    );
  }
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Pagination;
