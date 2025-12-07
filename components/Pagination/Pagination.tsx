import css from './Pagination.module.css';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pages: number;
  handleChangePage: (page: number) => void;
  currentPage: number;
}

function Pagination({ pages, handleChangePage, currentPage }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={(e) => handleChangePage(e.selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}

export default Pagination;
