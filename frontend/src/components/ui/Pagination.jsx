import { getPageNumbers } from '../../utils/getPageNumbers'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
}) {
  if (total <= 0 && !loading) return null

  const safeTotalPages = Math.max(totalPages, 1)
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pageNumbers = getPageNumbers(page, safeTotalPages)

  return (
    <nav className="pagination" aria-label="Table pagination">
      <div className="pagination__meta">
        <p className="pagination__summary">
          {total === 0 ? 'No records' : `Showing ${start}–${end} of ${total}`}
        </p>
        {onPageSizeChange && (
          <label className="pagination__size">
            <span>Rows per page</span>
            <select
              value={pageSize}
              disabled={loading}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          «
        </button>
        <button
          type="button"
          className="pagination__btn"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>

        <div className="pagination__pages" role="group" aria-label="Page numbers">
          {pageNumbers.map((item, index) =>
            item === '…' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={
                  item === page ? 'pagination__page pagination__page--active' : 'pagination__page'
                }
                disabled={loading || item === page}
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="pagination__btn"
          disabled={loading || page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          type="button"
          className="pagination__btn"
          disabled={loading || page >= safeTotalPages}
          onClick={() => onPageChange(safeTotalPages)}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </nav>
  )
}
